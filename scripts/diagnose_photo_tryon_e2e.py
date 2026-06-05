from __future__ import annotations

import argparse
import asyncio
import json
import subprocess
import sys
import time
import uuid
from pathlib import Path
from urllib import parse, request

from PIL import Image, ImageChops, ImageStat


ROOT = Path(__file__).resolve().parents[1]
RUNS = ROOT / "runs" / "photo-tryon"
SERVICE_PYTHON = Path(r"D:\nail-tryon-seg-venv\Scripts\python.exe")

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass


def latest_hand() -> Path:
    candidates = sorted(
        [path / "hand.png" for path in RUNS.iterdir() if (path / "hand.png").exists()],
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )
    if not candidates:
        raise SystemExit("No prior hand.png found; pass --hand explicitly.")
    return candidates[0]


def multipart_post(url: str, fields: dict[str, str], files: dict[str, Path]) -> dict:
    boundary = f"----nailtryon-{uuid.uuid4().hex}"
    chunks: list[bytes] = []
    for name, value in fields.items():
        chunks.extend(
            [
                f"--{boundary}\r\n".encode(),
                f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode(),
                str(value).encode("utf-8"),
                b"\r\n",
            ]
        )
    for name, path in files.items():
        chunks.extend(
            [
                f"--{boundary}\r\n".encode(),
                f'Content-Disposition: form-data; name="{name}"; filename="{path.name}"\r\n'.encode(),
                b"Content-Type: image/png\r\n\r\n",
                path.read_bytes(),
                b"\r\n",
            ]
        )
    chunks.append(f"--{boundary}--\r\n".encode())
    data = b"".join(chunks)
    req = request.Request(
        url,
        data=data,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )
    with request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def json_get(url: str) -> dict:
    with request.urlopen(url, timeout=10) as response:
        return json.loads(response.read().decode("utf-8"))


def json_post(url: str) -> dict:
    req = request.Request(url, data=b"", method="POST")
    with request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def image_rms(a: Path, b: Path) -> float:
    with Image.open(a) as raw_a, Image.open(b) as raw_b:
        img_a = raw_a.convert("RGB")
        img_b = raw_b.convert("RGB").resize(img_a.size)
        diff = ImageChops.difference(img_a, img_b)
        stat = ImageStat.Stat(diff)
        return sum(value * value for value in stat.rms) ** 0.5 / max(1, len(stat.rms))


def probe_browser_driver(service_url: str) -> None:
    started = time.time()
    python_exe = SERVICE_PYTHON if SERVICE_PYTHON.exists() else Path(sys.executable)
    probe_code = """
import asyncio, json, time
started = time.time()
async def main():
    from playwright.async_api import async_playwright
    playwright = await async_playwright().start()
    await playwright.stop()
try:
    asyncio.run(asyncio.wait_for(main(), timeout=8))
    payload = {"ok": True, "elapsedMs": round((time.time() - started) * 1000)}
except Exception as exc:
    payload = {"ok": False, "elapsedMs": round((time.time() - started) * 1000), "type": type(exc).__name__, "message": str(exc)}
print(json.dumps(payload, ensure_ascii=False))
"""
    completed = subprocess.run(
        [str(python_exe), "-c", probe_code],
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=12,
    )
    try:
        payload = json.loads(completed.stdout.strip() or "{}")
    except json.JSONDecodeError:
        payload = {
            "ok": False,
            "elapsedMs": round((time.time() - started) * 1000),
            "type": "ProbeOutputError",
            "message": completed.stdout.strip() or completed.stderr.strip(),
        }
    payload["python"] = str(python_exe)
    payload["returnCode"] = completed.returncode
    if completed.stderr.strip():
        payload["stderr"] = completed.stderr.strip()
    service_payload = None
    try:
        health = json_get(f"{service_url}/api/photo-tryon/health")
        service_payload = {
            "ok": bool(health.get("playwrightDriverReady")),
            "browserAutomationReady": health.get("browserAutomationReady"),
            "playwrightDriverReady": health.get("playwrightDriverReady"),
            "playwrightDriverError": health.get("playwrightDriverError"),
            "serviceProcessPid": health.get("serviceProcessPid"),
            "recommendedAction": health.get("recommendedAction"),
        }
    except Exception as exc:  # noqa: BLE001
        service_payload = {"ok": False, "type": type(exc).__name__, "message": str(exc)}
    print(json.dumps({"probe": "playwright_driver", "direct": payload, "service": service_payload}, ensure_ascii=False, indent=2))


def cleanup_automation_browsers(dry_run: bool) -> None:
    script = rf"""
$ErrorActionPreference = 'SilentlyContinue'
$Root = '{ROOT}'
$profileNeedles = @((Join-Path $Root 'runs\browser-profiles'), 'chatgpt-profile')
$items = @()
foreach ($name in @('chrome.exe', 'msedge.exe')) {{
  $items += Get-CimInstance Win32_Process -Filter "name='$name'"
}}
$targets = $items | Where-Object {{
  $cmd = $_.CommandLine
  if (-not $cmd) {{ return $false }}
  foreach ($needle in $profileNeedles) {{
    if ($cmd -like "*$needle*") {{ return $true }}
  }}
  return $false
}} | Select-Object ProcessId, Name, CommandLine
if ({'$true' if dry_run else '$false'}) {{
  $targets | ConvertTo-Json -Depth 3
}} else {{
  $targets | ForEach-Object {{ Stop-Process -Id $_.ProcessId -Force }}
  $targets | ConvertTo-Json -Depth 3
}}
"""
    completed = subprocess.run(
        ["powershell", "-NoProfile", "-Command", script],
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    payload = {
        "dryRun": dry_run,
        "returnCode": completed.returncode,
        "stdout": completed.stdout.strip(),
        "stderr": completed.stderr.strip(),
    }
    print(json.dumps({"action": "cleanup_automation_browsers", **payload}, ensure_ascii=False, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser(description="Run and diagnose the local photo try-on workflow.")
    parser.add_argument("--service", default="http://127.0.0.1:8765")
    parser.add_argument("--job-id", default=None, help="Diagnose an existing photo try-on job instead of creating a new one.")
    parser.add_argument("--style-id", type=int, default=7)
    parser.add_argument("--hand", type=Path, default=None)
    parser.add_argument("--quality-preset", default="browser_chatgpt_image2")
    parser.add_argument("--timeout", type=int, default=360)
    parser.add_argument("--wait-login", action="store_true")
    parser.add_argument("--login-retry-interval", type=int, default=30)
    parser.add_argument("--probe-browser-driver", action="store_true")
    parser.add_argument("--cleanup-automation-browsers", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if args.probe_browser_driver:
        probe_browser_driver(args.service)
        return
    if args.cleanup_automation_browsers:
        cleanup_automation_browsers(dry_run=args.dry_run)
        return

    if args.job_id:
        job_id = args.job_id
        job_dir = RUNS / job_id
        hand = args.hand or job_dir / "hand.png"
        if not hand.exists():
            raise SystemExit(f"Existing job has no hand.png: {hand}")
        job = json_get(f"{args.service}/api/photo-tryon/jobs/{job_id}")
    else:
        hand = args.hand or latest_hand()
        job = multipart_post(
            f"{args.service}/api/photo-tryon/jobs",
            {
                "styleId": str(args.style_id),
                "anchorsJson": "[]",
                "masksJson": "[]",
                "qualityPreset": args.quality_preset,
            },
            {"handImage": hand},
        )
        job_id = job["jobId"]

    deadline = time.time() + args.timeout
    last_state = None
    next_login_retry = 0.0
    while time.time() < deadline:
        job = json_get(f"{args.service}/api/photo-tryon/jobs/{job_id}")
        if job.get("state") != last_state:
            print(json.dumps({"state": job.get("state"), "progress": job.get("progress"), "message": job.get("message")}, ensure_ascii=False))
            last_state = job.get("state")
        if job.get("state") == "login_required":
            if not args.wait_login:
                break
            if time.time() >= next_login_retry:
                print(json.dumps({"action": "waiting_for_login", "retryAfterSeconds": args.login_retry_interval}, ensure_ascii=False))
                next_login_retry = time.time() + max(5, args.login_retry_interval)
                time.sleep(max(5, args.login_retry_interval))
                job = json_post(f"{args.service}/api/photo-tryon/jobs/{job_id}/run-browser")
            else:
                time.sleep(2)
            continue
        if job.get("state") in {"done", "failed"}:
            break
        time.sleep(2)

    job_dir = RUNS / job_id
    result = job_dir / "chatgpt-result.png"
    style = job_dir / "style_reference.png"
    summary = {
        "jobId": job_id,
        "state": job.get("state"),
        "message": job.get("message"),
        "error": job.get("error"),
        "resultTier": job.get("resultTier"),
        "jobDir": str(job_dir),
        "debugDir": str(job_dir / "debug"),
        "hasResult": result.exists(),
        "resultUrl": job.get("resultUrl"),
    }
    if result.exists():
        summary["rmsVsHand"] = round(image_rms(result, hand), 3)
        if style.exists():
            summary["rmsVsStyle"] = round(image_rms(result, style), 3)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
