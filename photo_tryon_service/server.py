from __future__ import annotations

import json
import math
import os
import time
import uuid
import zipfile
import importlib.util
import traceback
from concurrent.futures import Future, ThreadPoolExecutor
from dataclasses import dataclass, field
from io import BytesIO
from pathlib import Path
from typing import Any
from urllib import error as urllib_error
from urllib import request as urllib_request

import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

from .chatgpt_runner import LoginRequired, RunnerError, browser_automation_diagnostics, probe_playwright_driver, run_chatgpt_image2

APP_ROOT = Path(__file__).resolve().parents[1]
ASSET_MANIFEST = APP_ROOT / "assets" / "nail-assets" / "styles.json"
RESULT_ROOT = APP_ROOT / "runs" / "photo-tryon"
DIFFUSION_MODEL_DIR = APP_ROOT / "models" / "diffusion" / "sdxl-inpaint"
FINGERS = ["thumb", "index", "middle", "ring", "pinky"]
LONG_EXTENSION_STYLE_IDS = {6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 19, 20, 23}
DEFAULT_PROVIDER = "browser_chatgpt_image2"
BASE_UPLOAD_NAME = "01_BASE_HAND_PHOTO_LOCKED_DO_NOT_CHANGE.png"
STYLE_UPLOAD_NAME = "02_MANICURE_STYLE_REFERENCE_STYLE_ONLY.png"

app = FastAPI(title="Nail Photo Try-On Service", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:4173", "http://localhost:4173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

executor = ThreadPoolExecutor(max_workers=1)
jobs: dict[str, "TryonJob"] = {}
diffusion_pipeline: Any | None = None
diffusion_error: str | None = None


@dataclass
class TryonJob:
    job_id: str
    state: str = "queued"
    progress: float = 0.0
    message: str = "Queued"
    created_at: float = field(default_factory=time.time)
    started_at: float | None = None
    finished_at: float | None = None
    preview_file: str | None = None
    result_file: str | None = None
    hand_file: str | None = None
    style_reference_file: str | None = None
    mask_file: str | None = None
    prompt_file: str | None = None
    handoff_json_file: str | None = None
    handoff_package_file: str | None = None
    provider: str = DEFAULT_PROVIDER
    result_tier: str = "quick_preview"
    fallback_reason: str | None = None
    handoff_prompt: str | None = None
    style_id: int | None = None
    recoverable: bool = True
    error: str | None = None
    future: Future | None = None

    def to_dict(self) -> dict[str, Any]:
        elapsed = None
        if self.started_at:
            elapsed = int(((self.finished_at or time.time()) - self.started_at) * 1000)
        payload: dict[str, Any] = {
            "jobId": self.job_id,
            "state": self.state,
            "progress": round(float(self.progress), 3),
            "message": self.message,
            "recoverable": self.recoverable,
            "elapsedMs": elapsed,
            "styleId": self.style_id,
            "provider": self.provider,
            "resultTier": self.result_tier,
        }
        if self.preview_file:
            payload["previewUrl"] = f"/api/photo-tryon/results/{self.preview_file}"
        if self.result_file:
            payload["resultUrl"] = f"/api/photo-tryon/results/{self.result_file}"
        if self.fallback_reason:
            payload["fallbackReason"] = self.fallback_reason
        if self.state == "login_required":
            payload["loginUrl"] = "https://chatgpt.com/"
        if self.error:
            payload["error"] = self.error
        return payload


@app.get("/api/photo-tryon/health")
def health() -> dict[str, Any]:
    browser_details = browser_automation_diagnostics()
    browser_package_ready = importlib.util.find_spec("playwright") is not None
    driver_probe = probe_playwright_driver() if browser_package_ready else {"ready": False, "error": "Python package 'playwright' is not installed"}
    driver_ready = bool(driver_probe.get("ready"))
    return {
        "ok": True,
        "preferredProvider": DEFAULT_PROVIDER,
        "browserAutomationReady": browser_package_ready and driver_ready,
        "browserAutomation": browser_details,
        "playwrightDriverReady": driver_ready,
        "playwrightDriverError": driver_probe.get("error"),
        "serviceProcessPid": os.getpid(),
        "recommendedAction": recommended_health_action(browser_package_ready, driver_probe),
        "deepseekConfigured": bool(os.environ.get("DEEPSEEK_API_KEY")),
        "diffusionModelPresent": DIFFUSION_MODEL_DIR.exists(),
        "diffusionModelPath": str(DIFFUSION_MODEL_DIR),
    }


@app.post("/api/photo-tryon/jobs")
async def create_photo_tryon_job(
    handImage: UploadFile = File(...),
    styleId: int = Form(...),
    anchorsJson: str = Form("[]"),
    masksJson: str = Form("[]"),
    qualityPreset: str = Form(DEFAULT_PROVIDER),
) -> dict[str, Any]:
    if styleId < 1 or styleId > 25:
        raise HTTPException(status_code=400, detail="styleId must be between 1 and 25")
    try:
        anchors = json.loads(anchorsJson)
        masks = json.loads(masksJson)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail=f"bad anchor/mask JSON: {exc}") from exc

    content = await handImage.read()
    job_id = uuid.uuid4().hex[:12]
    job_dir = RESULT_ROOT / job_id
    job_dir.mkdir(parents=True, exist_ok=True)
    input_path = job_dir / "hand.png"
    input_path.write_bytes(content)

    job = TryonJob(job_id=job_id, style_id=styleId)
    job.hand_file = f"{job_id}/hand.png"
    jobs[job_id] = job
    job.future = executor.submit(run_job, job, input_path, styleId, anchors, masks, qualityPreset)
    return job.to_dict()


@app.get("/api/photo-tryon/jobs/{job_id}")
def get_photo_tryon_job(job_id: str) -> dict[str, Any]:
    job = jobs.get(job_id)
    if not job:
        job = restore_job_from_disk(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="job not found")
    return job.to_dict()


@app.get("/api/photo-tryon/results/{file_path:path}")
def get_photo_tryon_result(file_path: str) -> FileResponse:
    target = (RESULT_ROOT / file_path).resolve()
    root = RESULT_ROOT.resolve()
    if root not in target.parents and target != root:
        raise HTTPException(status_code=403, detail="invalid result path")
    if not target.exists() or not target.is_file():
        raise HTTPException(status_code=404, detail="result not found")
    media_types = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".json": "application/json",
        ".txt": "text/plain; charset=utf-8",
        ".zip": "application/zip",
    }
    return FileResponse(target, media_type=media_types.get(target.suffix.lower(), "application/octet-stream"))


@app.post("/api/photo-tryon/jobs/{job_id}/chatgpt-result")
async def import_chatgpt_result(job_id: str, resultImage: UploadFile = File(...)) -> dict[str, Any]:
    job_dir = RESULT_ROOT / job_id
    if not job_dir.exists() or not job_dir.is_dir():
        raise HTTPException(status_code=404, detail="job not found")
    content = await resultImage.read()
    try:
        image = Image.open(BytesIO(content)).convert("RGB")
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=f"bad image: {exc}") from exc
    image.save(job_dir / "chatgpt-result.png")

    job = jobs.get(job_id) or TryonJob(job_id=job_id)
    jobs[job_id] = job
    job.state = "done"
    job.progress = 1.0
    job.provider = DEFAULT_PROVIDER
    job.result_tier = "chatgpt_image2"
    job.result_file = f"{job_id}/chatgpt-result.png"
    job.message = "ChatGPT Image 2 result imported"
    job.finished_at = time.time()
    if job.started_at is None:
        job.started_at = job.created_at
    return job.to_dict()


@app.post("/api/photo-tryon/jobs/{job_id}/run-browser")
def run_browser_job(job_id: str) -> dict[str, Any]:
    job_dir = RESULT_ROOT / job_id
    if not job_dir.exists() or not job_dir.is_dir():
        raise HTTPException(status_code=404, detail="job not found")
    job = jobs.get(job_id)
    if not job:
        job = TryonJob(job_id=job_id)
        jobs[job_id] = job
    existing_result = job_dir / "chatgpt-result.png"
    if existing_result.exists() and existing_result.is_file():
        mark_chatgpt_result_ready(job, job_dir, existing_result)
        return job.to_dict()
    if job.future and not job.future.done():
        return job.to_dict()
    job.state = "queued"
    job.progress = max(job.progress, 0.52)
    job.message = "Resuming ChatGPT browser automation"
    job.recoverable = True
    job.future = executor.submit(continue_browser_job, job, job_dir)
    return job.to_dict()


def run_job(job: TryonJob, input_path: Path, style_id: int, anchors: list[dict[str, Any]], masks: list[dict[str, Any]], quality_preset: str) -> None:
    job.started_at = time.time()
    job.state = "running"
    job.progress = 0.08
    job.message = "Reading hand photo"
    job_dir = RESULT_ROOT / job.job_id
    try:
        hand = Image.open(input_path).convert("RGBA")
        styles = load_styles()
        style = next((item for item in styles if int(item.get("id", 0)) == style_id), None)
        if not style:
            raise RuntimeError(f"style {style_id} not found")

        job.progress = 0.22
        job.message = "Preparing AI generation"
        preview, mask = deterministic_transfer(hand, style, anchors, masks)
        preview_name = f"{job.job_id}/quick_preview.png"
        preview_path = job_dir / "quick_preview.png"
        preview.save(preview_path)
        mask.save(job_dir / "mask.png")
        job.preview_file = preview_name
        job.mask_file = f"{job.job_id}/mask.png"

        job.progress = 0.52
        if quality_preset == "local_sdxl" and DIFFUSION_MODEL_DIR.exists():
            job.provider = "local_sdxl"
            job.message = "Running SDXL local inpainting"
            result = run_diffusion_refine(preview, mask, style)
            result_name = f"{job.job_id}/result.png"
            result.save(job_dir / "result.png")
            job.result_tier = "local_ai"
            job.message = "High-fidelity result ready"
        else:
            job.provider = DEFAULT_PROVIDER
            job.result_tier = "quick_preview"
            result_name = preview_name
            job.result_file = result_name
            prepare_browser_handoff(job, job_dir, style_id, style, anchors, masks)
            if quality_preset == "handoff_only":
                job.fallback_reason = "Internal ChatGPT inputs prepared; browser automation was skipped for this job."
                job.message = "Internal AI inputs prepared"
            else:
                try:
                    result_path = run_browser_for_job(job, job_dir)
                    result_name = f"{job.job_id}/{result_path.name}"
                    job.result_tier = "chatgpt_image2"
                    job.message = "ChatGPT Image 2 result ready"
                except LoginRequired as exc:
                    job.state = "login_required"
                    job.progress = max(job.progress, 0.52)
                    job.message = str(exc)
                    job.recoverable = True
                    return
                except RunnerError as exc:
                    write_browser_error_debug(job_dir, exc)
                    job.fallback_reason = normalize_browser_error(exc)
                    job.state = "failed"
                    job.progress = max(job.progress, 0.52)
                    job.message = "ChatGPT automation failed"
                    job.error = job.fallback_reason
                    job.recoverable = True
                    job.finished_at = time.time()
                    return
                except Exception as exc:  # noqa: BLE001 - browser automation must not fail the whole photo job
                    write_browser_error_debug(job_dir, exc)
                    job.fallback_reason = normalize_browser_error(exc)
                    job.state = "failed"
                    job.progress = max(job.progress, 0.52)
                    job.message = "ChatGPT automation failed"
                    job.error = job.fallback_reason
                    job.recoverable = True
                    job.finished_at = time.time()
                    return

        job.result_file = result_name
        job.progress = 1.0
        job.state = "done"
        job.finished_at = time.time()
    except Exception as exc:  # noqa: BLE001 - convert service failures to job state
        job.state = "failed"
        job.progress = max(job.progress, 0.05)
        job.message = "Photo generation failed"
        job.error = str(exc)
        job.finished_at = time.time()


def load_styles() -> list[dict[str, Any]]:
    return json.loads(ASSET_MANIFEST.read_text(encoding="utf-8"))


def prepare_browser_handoff(job: TryonJob, job_dir: Path, style_id: int, style: dict[str, Any], anchors: list[dict[str, Any]], masks: list[dict[str, Any]]) -> None:
    save_style_reference(style_id, style, job_dir)
    job.style_reference_file = f"{job.job_id}/style_reference.png"
    prompt, prompt_source = build_handoff_prompt(style_id, style, anchors, masks)
    refined_prompt = refine_prompt_with_deepseek(prompt, style, style_id, anchors, masks)
    if refined_prompt != prompt:
        prompt_source = "template+deepseek"
        prompt = refined_prompt
    (job_dir / "prompt.txt").write_text(prompt, encoding="utf-8")
    job.prompt_file = f"{job.job_id}/prompt.txt"
    job.handoff_prompt = prompt
    handoff = {
        "jobId": job.job_id,
        "provider": DEFAULT_PROVIDER,
        "styleId": style_id,
        "styleName": style.get("name"),
        "styleFinish": style.get("finish"),
        "allowExtension": style_id in LONG_EXTENSION_STYLE_IDS,
        "promptSource": prompt_source,
        "chatgptUploadNames": {
            "baseHandPhoto": BASE_UPLOAD_NAME,
            "styleReference": STYLE_UPLOAD_NAME,
        },
        "files": {
            "hand": "hand.png",
            "styleReference": "style_reference.png",
            "mask": "mask.png",
            "quickPreview": "quick_preview.png",
            "prompt": "prompt.txt",
        },
    }
    (job_dir / "handoff.json").write_text(json.dumps(handoff, ensure_ascii=False, indent=2), encoding="utf-8")
    job.handoff_json_file = f"{job.job_id}/handoff.json"
    package_path = write_handoff_package(job_dir)
    job.handoff_package_file = f"{job.job_id}/{package_path.name}"


def run_browser_for_job(job: TryonJob, job_dir: Path) -> Path:
    existing_result = job_dir / "chatgpt-result.png"
    if existing_result.exists() and existing_result.is_file():
        mark_chatgpt_result_ready(job, job_dir, existing_result)
        return existing_result

    def set_status(state: str, message: str, progress: float) -> None:
        job.state = state
        job.message = message
        job.progress = max(job.progress, progress)

    result_path = run_chatgpt_image2(job_dir, set_status)
    job.provider = DEFAULT_PROVIDER
    job.result_tier = "chatgpt_image2"
    job.result_file = f"{job.job_id}/{result_path.name}"
    return result_path


def mark_chatgpt_result_ready(job: TryonJob, job_dir: Path, result_path: Path) -> None:
    job.provider = DEFAULT_PROVIDER
    job.result_tier = "chatgpt_image2"
    job.result_file = f"{job_dir.name}/{result_path.name}"
    job.state = "done"
    job.progress = 1.0
    job.message = "ChatGPT Image 2 result ready"
    job.error = None
    job.fallback_reason = None
    job.finished_at = time.time()


def restore_job_from_disk(job_id: str) -> TryonJob | None:
    job_dir = RESULT_ROOT / job_id
    if not job_dir.exists() or not job_dir.is_dir():
        return None
    job = TryonJob(job_id=job_id)
    jobs[job_id] = job
    handoff_path = job_dir / "handoff.json"
    if handoff_path.exists():
        try:
            handoff = json.loads(handoff_path.read_text(encoding="utf-8"))
            job.style_id = int(handoff.get("styleId") or 0) or None
        except (OSError, ValueError, TypeError, json.JSONDecodeError):
            pass
    if (job_dir / "hand.png").exists():
        job.hand_file = f"{job_id}/hand.png"
    if (job_dir / "style_reference.png").exists():
        job.style_reference_file = f"{job_id}/style_reference.png"
    if (job_dir / "mask.png").exists():
        job.mask_file = f"{job_id}/mask.png"
    if (job_dir / "prompt.txt").exists():
        job.prompt_file = f"{job_id}/prompt.txt"
    if handoff_path.exists():
        job.handoff_json_file = f"{job_id}/handoff.json"
    if (job_dir / "chatgpt-image2-handoff.zip").exists():
        job.handoff_package_file = f"{job_id}/chatgpt-image2-handoff.zip"
    if (job_dir / "quick_preview.png").exists():
        job.preview_file = f"{job_id}/quick_preview.png"
        job.result_file = job.preview_file
        job.progress = 0.52
    result_path = job_dir / "chatgpt-result.png"
    if result_path.exists() and result_path.is_file():
        mark_chatgpt_result_ready(job, job_dir, result_path)
    else:
        job.state = "failed"
        job.message = "生成服务已重启，请点击重新生成"
        job.error = "The previous browser automation task was interrupted by a local service restart."
        job.recoverable = True
    return job


def mark_browser_fallback(job: TryonJob, job_dir: Path, exc: Exception) -> None:
    write_browser_error_debug(job_dir, exc)
    job.state = "failed"
    job.progress = max(job.progress, 0.52)
    job.fallback_reason = normalize_browser_error(exc)
    job.message = "ChatGPT automation failed"
    job.error = job.fallback_reason
    job.recoverable = True
    job.finished_at = time.time()


def write_browser_error_debug(job_dir: Path, exc: Exception) -> None:
    try:
        debug_dir = job_dir / "debug"
        debug_dir.mkdir(parents=True, exist_ok=True)
        trace = format_exception_trace(exc)
        payload = {
            "type": type(exc).__name__,
            "message": str(exc),
            "stage": classify_browser_error_stage(exc, trace),
            "normalized": normalize_browser_error(exc),
            "traceback": trace,
            "time": time.time(),
        }
        (debug_dir / f"browser-error-{int(time.time() * 1000)}.json").write_text(
            json.dumps(payload, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
    except Exception:
        pass


def recommended_health_action(browser_package_ready: bool, driver_probe: dict[str, Any]) -> str:
    if not browser_package_ready:
        return "install_playwright"
    if driver_probe.get("ready"):
        return "none"
    return "restart_elevated"


def format_exception_trace(exc: Exception) -> str:
    return "".join(traceback.format_exception(type(exc), exc, exc.__traceback__))


def classify_browser_error_stage(exc: Exception, trace: str | None = None) -> str:
    trace = trace or format_exception_trace(exc)
    text = f"{type(exc).__name__}: {exc}\n{trace}"
    if "async_playwright().start" in text or "_transport.py" in text or "windows_utils.py" in text:
        return "driver_start"
    if "unable to launch browser automation" in text or "_launch_available_context_async" in text or "launch_persistent_context" in text:
        return "browser_launch"
    if isinstance(exc, LoginRequired) or "Complete ChatGPT login" in text:
        return "login_check"
    if "_upload_images_async" in text or "set_input_files" in text:
        return "upload"
    if "_capture_generated_image" in text or "timed out waiting for a new ChatGPT generated image" in text:
        return "result_capture"
    return "unknown"


def is_windows_access_denied(exc: Exception) -> bool:
    text = str(exc)
    return (
        isinstance(exc, PermissionError)
        or getattr(exc, "winerror", None) == 5
        or "WinError 5" in text
        or "Access is denied" in text
        or "拒绝访问" in text
        or "鎷掔粷璁块棶" in text
    )


def normalize_browser_error(exc: Exception) -> str:
    text = str(exc)
    if "Python package 'playwright' is not installed" in text:
        return "Playwright is not installed in the photo try-on Python environment. Install photo_tryon_service requirements, then restart the local service."
    if is_windows_access_denied(exc):
        stage = classify_browser_error_stage(exc)
        if stage == "driver_start":
            return "Windows blocked the Playwright driver subprocess. Restart the photo generation service with scripts\\start_photo_tryon_local.ps1 and allow the administrator/UAC prompt."
        if stage == "browser_launch":
            return "Windows blocked the Chrome/Edge automation profile. Close project automation browser windows, then restart the local service from scripts\\start_photo_tryon_local.ps1."
        return "Windows blocked browser automation. Restart the photo generation service from scripts\\start_photo_tryon_local.ps1 and allow the administrator/UAC prompt."
    if isinstance(exc, PermissionError) or getattr(exc, "winerror", None) == 5 or "WinError 5" in text or "Access is denied" in text or "拒绝访问" in text:
        return "Windows blocked the ChatGPT browser automation process or profile access. Close any opened automation Chrome windows, then restart the local service from the project start script and retry."
    return text


def continue_browser_job(job: TryonJob, job_dir: Path) -> None:
    job.started_at = job.started_at or time.time()
    try:
        result_path = run_browser_for_job(job, job_dir)
        job.result_file = f"{job.job_id}/{result_path.name}"
        job.state = "done"
        job.progress = 1.0
        job.message = "ChatGPT Image 2 result ready"
        job.finished_at = time.time()
    except LoginRequired as exc:
        job.state = "login_required"
        job.progress = max(job.progress, 0.52)
        job.message = str(exc)
        job.recoverable = True
    except RunnerError as exc:
        mark_browser_fallback(job, job_dir, exc)
    except Exception as exc:  # noqa: BLE001
        mark_browser_fallback(job, job_dir, exc)


def save_style_reference(style_id: int, style: dict[str, Any], job_dir: Path) -> Path:
    candidates = [
        APP_ROOT / "assets" / "source-cache" / f"style_{style_id:02d}_original.png",
        APP_ROOT / "assets" / "source-cache" / f"style_{style_id:02d}.png",
    ]
    preview = style.get("preview")
    if preview:
        candidates.append(APP_ROOT / str(preview).replace("./", ""))
    for path in candidates:
        if path.exists():
            target = job_dir / "style_reference.png"
            Image.open(path).convert("RGB").save(target)
            return target
    raise RuntimeError(f"style reference image not found for style {style_id}")


def build_handoff_prompt(style_id: int, style: dict[str, Any], anchors: list[dict[str, Any]], masks: list[dict[str, Any]]) -> tuple[str, str]:
    profile = style.get("tryOnProfile") or {}
    finish = style.get("finish") or profile.get("finish") or "gloss"
    allow_extension = style_id in LONG_EXTENSION_STYLE_IDS or bool(profile.get("allowExtension"))
    extension_rule = (
        "This is a press-on or long-nail style. If extension is necessary, add length only as a nail tip continuing outward from the real nail plate. Keep the cuticle/root fixed, keep nail width matched to the user's real nail bed, and do not alter finger skin or finger silhouette except for the added nail tip itself."
        if allow_extension
        else f"This is a natural-length style. Keep the original nail shape, contour, and length from `{BASE_UPLOAD_NAME}`; do not extend beyond the user's real nail edge or fingertip."
    )
    prompt = f"""STRICT NAIL-ONLY LOCAL EDIT. This is not a new image generation task.

Attachment identity, highest priority:
- `{BASE_UPLOAD_NAME}` is the ORIGINAL USER HAND PHOTO. This is the locked base image and the final canvas.
- `{STYLE_UPLOAD_NAME}` is the MANICURE STYLE REFERENCE ONLY. It is not the base image and must never replace the user's hand photo.
- If the visual thumbnail order is confusing, ignore thumbnail order and use these exact filenames to decide which image is which.
- Never use `{STYLE_UPLOAD_NAME}` as the output composition, hand, skin, pose, background, crop, lighting, or camera angle.

Input images:
- The original hand photo file `{BASE_UPLOAD_NAME}` must be copied exactly, then edit only its fingernail plates.
- The style reference file `{STYLE_UPLOAD_NAME}` is only for nail color, pattern, finish, and material. Do not copy its hand, skin, background, lighting, or camera angle.
- No mask image is provided. Infer the visible fingernail plates from Image 1 yourself, using the nail/cuticle/sidewall boundaries. Be conservative.

Task:
Return an edited version of `{BASE_UPLOAD_NAME}` where only the fingernail plates have the manicure design from `{STYLE_UPLOAD_NAME}`.

Absolute preservation rules, highest priority:
- Keep the exact same image size, crop, framing, camera perspective, background, and composition as `{BASE_UPLOAD_NAME}`.
- Treat every non-nail pixel from `{BASE_UPLOAD_NAME}` as locked. Non-nail pixels must remain visually identical to `{BASE_UPLOAD_NAME}`.
- If the result is overlaid on `{BASE_UPLOAD_NAME}`, visible differences should appear only on fingernail plates.
- Do not redraw, repaint, regenerate, relight, denoise, sharpen, smooth, beautify, or stylize the hand, skin, background, clothing, jewelry, shadows, or reflections.
- Do not change hand pose, hand shape, palm, knuckles, finger count, finger length, finger width, finger spacing, wrist, skin tone, skin texture, wrinkles, veins, scars, creases, or pores.
- Do not alter background objects, table/wall/cloth, camera angle, depth of field, exposure, white balance, or global color grading.
- If a pixel might be skin rather than nail, leave it unchanged. Prefer under-editing nails over changing any skin/background.

Nail edit rules:
- The only permitted changes are nail color, nail pattern, nail material, nail gloss, nail shimmer, and nail surface finish.
- Apply those changes only inside the inferred nail plate boundaries.
- Recreate the reference manicure's color, pattern placement, gloss, shimmer, transparency, and style as accurately as possible on the user's nails.
- Preserve the original cuticle positions, nail roots, nail sidewalls, local nail curvature, and the local lighting from `{BASE_UPLOAD_NAME}`.
- Avoid color bleeding onto skin. Do not change nail-adjacent skin highlights or shadows.
- {extension_rule}

Final self-check before output:
- Same crop as Image 1: yes.
- Same hand pose and hand shape as Image 1: yes.
- Same background and lighting as Image 1: yes.
- Differences outside fingernails: none.
- Only fingernail appearance changed: yes.

Style metadata:
- Style id: {style_id}
- Style name: {style.get("name", "selected manicure")}
- Finish/material: {finish}
- Detected nail anchors: {len(anchors)}

Output requirement:
Return one image: `{BASE_UPLOAD_NAME}` with only the fingernail appearance changed. Do not output a redesigned, beautified, reframed, or regenerated hand photo."""
    return prompt, "template"


def refine_prompt_with_deepseek(prompt: str, style: dict[str, Any], style_id: int, anchors: list[dict[str, Any]], masks: list[dict[str, Any]]) -> str:
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        return prompt
    model = os.environ.get("DEEPSEEK_MODEL", "deepseek-chat")
    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You refine image-edit prompts for manicure virtual try-on. Return only the final prompt. "
                    "Never remove or weaken constraints that treat Image 1 as a locked canvas, preserve non-nail pixels, and keep the original hand pose, scale, framing, skin, lighting, and background unchanged. "
                    f"Never remove the attachment identity rules or the filenames `{BASE_UPLOAD_NAME}` and `{STYLE_UPLOAD_NAME}`. "
                    "No mask image is available; do not mention using a mask. You may only make the manicure style/material description more specific."
                ),
            },
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "basePrompt": prompt,
                        "style": {
                            "id": style_id,
                            "name": style.get("name"),
                            "finish": style.get("finish"),
                            "tryOnProfile": style.get("tryOnProfile"),
                            "assetQuality": style.get("assetQuality"),
                        },
                        "visibleAnchors": len(anchors),
                        "availableMasks": len(masks),
                    },
                    ensure_ascii=False,
                ),
            },
        ],
        "temperature": 0.2,
        "max_tokens": 900,
    }
    request = urllib_request.Request(
        "https://api.deepseek.com/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib_request.urlopen(request, timeout=18) as response:
            data = json.loads(response.read().decode("utf-8"))
        refined = data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
        return guard_refined_prompt(refined, prompt)
    except (urllib_error.URLError, TimeoutError, KeyError, ValueError, json.JSONDecodeError):
        return prompt


def guard_refined_prompt(refined: str, fallback: str) -> str:
    if not refined:
        return fallback
    required_phrases = [
        "STRICT NAIL-ONLY LOCAL EDIT",
        BASE_UPLOAD_NAME,
        STYLE_UPLOAD_NAME,
        "ORIGINAL USER HAND PHOTO",
        "MANICURE STYLE REFERENCE ONLY",
        "Treat every non-nail pixel",
        "visible differences should appear only on fingernail plates",
        "Do not redraw, repaint, regenerate, relight",
        "Do not change hand pose",
        "No mask image is provided",
        "Differences outside fingernails: none",
        "only the fingernail appearance changed",
    ]
    if all(phrase in refined for phrase in required_phrases):
        return refined
    return fallback


def write_handoff_package(job_dir: Path) -> Path:
    package_path = job_dir / "chatgpt-image2-handoff.zip"
    names = ["hand.png", "style_reference.png", "mask.png", "quick_preview.png", "prompt.txt", "handoff.json"]
    with zipfile.ZipFile(package_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for name in names:
            path = job_dir / name
            if path.exists():
                archive.write(path, arcname=name)
    return package_path


def deterministic_transfer(hand: Image.Image, style: dict[str, Any], anchors: list[dict[str, Any]], masks: list[dict[str, Any]]) -> tuple[Image.Image, Image.Image]:
    base = hand.convert("RGBA")
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    full_mask = Image.new("L", base.size, 0)
    mask_by_finger = {item.get("finger"): item for item in masks if item.get("finger")}
    profile = style.get("tryOnProfile") or {}
    root_profile = style.get("rootProfile") or {}
    textures = style.get("textures") or {}

    for index, anchor in enumerate(anchors):
        finger = anchor.get("finger") or FINGERS[min(index, len(FINGERS) - 1)]
        texture_info = textures.get(finger) or textures.get(FINGERS[min(index, len(FINGERS) - 1)]) or {}
        texture_path = APP_ROOT / str(texture_info.get("image", "")).replace("./", "")
        if not texture_path.exists():
            continue

        mask_info = mask_by_finger.get(finger, {})
        geometry = nail_geometry(anchor, mask_info, profile, root_profile)
        if not geometry:
            continue
        patch, alpha = build_texture_patch(texture_path, geometry["width"], geometry["height"], profile, style)
        rotated_patch = patch.rotate(geometry["rotation"], resample=Image.Resampling.BICUBIC, expand=True)
        rotated_alpha = alpha.rotate(geometry["rotation"], resample=Image.Resampling.BICUBIC, expand=True)
        center = geometry["center"]
        top_left = (int(round(center[0] - rotated_patch.width / 2)), int(round(center[1] - rotated_patch.height / 2)))
        overlay.paste(rotated_patch, top_left, rotated_patch)
        full_mask.paste(rotated_alpha, top_left, rotated_alpha)

    feathered = full_mask.filter(ImageFilter.GaussianBlur(radius=1.6))
    shaded = apply_local_lighting(base, overlay, feathered)
    result = Image.alpha_composite(base, shaded)
    return result.convert("RGB"), feathered


def nail_geometry(anchor: dict[str, Any], mask_info: dict[str, Any], profile: dict[str, Any], root_profile: dict[str, Any]) -> dict[str, Any] | None:
    ax = float(anchor.get("x", 0))
    ay = float(anchor.get("y", 0))
    aw = max(8.0, float(anchor.get("width", 18)))
    ah = max(12.0, float(anchor.get("height", 32)))
    rotation = float(anchor.get("rotation", 0))
    rel = mask_info.get("rel") or {}
    nail_bed = mask_info.get("nailBed") or {}
    root_line = nail_bed.get("rootLine") or {}
    root_x_rel = midpoint(root_line.get("x1"), root_line.get("x2"), rel.get("x", 0))
    root_y_rel = midpoint(root_line.get("y1"), root_line.get("y2"), float(rel.get("y", 0)) + float(rel.get("height", 1)) * 0.46)
    root_width_rel = abs(float(nail_bed.get("rootWidth", 0) or float(rel.get("width", 1)) * 0.82))
    bed_length_rel = abs(float(nail_bed.get("bedLength", 0) or float(rel.get("height", 1)) * 0.92))

    root_width_ratio = clamp(float(root_profile.get("rootWidthRatio", 0.78) or 0.78), 0.52, 1.08)
    bed_length_ratio = clamp(float(root_profile.get("bedLengthRatio", 0.84) or 0.84), 0.54, 1.0)
    width = clamp(root_width_rel * aw / root_width_ratio * float(profile.get("widthScale", 1)), aw * 0.58, aw * 1.32)
    height = clamp(bed_length_rel * ah / bed_length_ratio * float(profile.get("lengthScale", 1)), ah * 0.68, ah * 1.72)
    if profile.get("allowExtension"):
        height *= 1 + clamp(float(profile.get("tipExtension", 0.08)), 0, 0.24)

    root_local = (root_x_rel * aw, root_y_rel * ah)
    root = rotate_point(root_local[0], root_local[1], math.radians(rotation))
    root_global = (ax + root[0], ay + root[1])
    center_offset = rotate_point(0, -height / 2, math.radians(rotation))
    center = (root_global[0] + center_offset[0], root_global[1] + center_offset[1])
    return {"center": center, "width": int(round(width)), "height": int(round(height)), "rotation": rotation}


def build_texture_patch(texture_path: Path, width: int, height: int, profile: dict[str, Any], style: dict[str, Any]) -> tuple[Image.Image, Image.Image]:
    width = max(8, width)
    height = max(12, height)
    texture = Image.open(texture_path).convert("RGBA")
    scale = max(width / texture.width, height / texture.height)
    resized = texture.resize((max(1, int(texture.width * scale)), max(1, int(texture.height * scale))), Image.Resampling.LANCZOS)
    crop_x = max(0, (resized.width - width) // 2)
    crop_y = max(0, (resized.height - height) // 2)
    patch = resized.crop((crop_x, crop_y, crop_x + width, crop_y + height))
    alpha = profile_mask(width, height, str(profile.get("shape", "squoval")), float(profile.get("rootFade", 0.22)))
    patch.putalpha(alpha)
    patch = material_finish(patch, str(style.get("finish", "gloss")))
    return patch, alpha


def profile_mask(width: int, height: int, shape: str, root_fade: float) -> Image.Image:
    cx = width / 2
    top = 0
    bottom = height - 1
    points: list[tuple[float, float]] = []
    steps = 48
    for i in range(steps + 1):
        t = i / steps
        y = top + t * height
        if shape == "almond":
            half = width * 0.5 * math.sin(math.pi * min(1, t * 0.92)) ** 0.62
            half *= 0.55 + 0.45 * t
        elif shape == "oval":
            half = width * 0.46 * math.sin(math.pi * (0.08 + t * 0.84)) ** 0.36
        elif shape == "round":
            half = width * 0.44 * math.sin(math.pi * (0.16 + t * 0.74)) ** 0.32
        else:
            half = width * (0.38 + 0.1 * math.sin(math.pi * t))
            if t < 0.16:
                half *= 0.72 + t * 1.6
            if t > 0.82:
                half *= 1 - (t - 0.82) * 0.44
        points.append((cx + half, y))
    for i in range(steps, -1, -1):
        t = i / steps
        y = top + t * height
        right = points[i][0]
        points.append((cx - (right - cx), y))

    mask = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(mask)
    draw.polygon(points, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=max(0.6, min(width, height) * 0.012)))
    mask_data = np.asarray(mask, dtype=np.float32)
    fade_px = max(2, int(height * 0.18))
    for y in range(height - fade_px, height):
        alpha = 1 - root_fade * ((y - (height - fade_px)) / max(1, fade_px - 1))
        mask_data[y, :] *= alpha
    return Image.fromarray(mask_data.clip(0, 255).astype(np.uint8), "L")


def material_finish(patch: Image.Image, finish: str) -> Image.Image:
    rgba = patch.convert("RGBA")
    rgb = rgba.convert("RGB")
    if finish == "matte":
        rgb = ImageEnhance.Contrast(rgb).enhance(0.92)
    else:
        rgb = ImageEnhance.Contrast(rgb).enhance(1.06)
    rgba = Image.merge("RGBA", (*rgb.split(), rgba.getchannel("A")))
    if finish in {"gloss", "metallic", "shimmer", "jelly"}:
        shine = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(shine)
        alpha = 72 if finish != "metallic" else 108
        draw.ellipse((-rgba.width * 0.15, -rgba.height * 0.28, rgba.width * 0.74, rgba.height * 0.52), fill=(255, 255, 255, alpha))
        shine = shine.filter(ImageFilter.GaussianBlur(radius=max(3, rgba.width * 0.08)))
        rgba = Image.alpha_composite(rgba, shine)
    return rgba


def apply_local_lighting(base: Image.Image, overlay: Image.Image, mask: Image.Image) -> Image.Image:
    if not mask.getbbox():
        return overlay
    base_rgb = np.asarray(base.convert("RGB"), dtype=np.float32)
    overlay_arr = np.asarray(overlay.convert("RGBA"), dtype=np.float32)
    mask_arr = np.asarray(mask, dtype=np.float32) / 255.0
    dilated = mask.filter(ImageFilter.MaxFilter(25))
    ring = (np.asarray(dilated, dtype=np.float32) / 255.0 - mask_arr) > 0.05
    if ring.any():
        env = base_rgb[ring].mean(axis=0)
        lum = float((0.2126 * env[0] + 0.7152 * env[1] + 0.0722 * env[2]) / 255.0)
        warmth = float((env[0] - env[2]) / 255.0)
    else:
        lum = 0.55
        warmth = 0.0
    factor = clamp(0.76 + lum * 0.5, 0.72, 1.2)
    overlay_arr[:, :, :3] *= factor
    overlay_arr[:, :, 0] += max(0, warmth) * 10
    overlay_arr[:, :, 2] += max(0, -warmth) * 10
    overlay_arr[:, :, :4] = np.clip(overlay_arr[:, :, :4], 0, 255)
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    shadow_alpha = mask.filter(ImageFilter.GaussianBlur(radius=3)).point(lambda value: int(value * 0.13))
    shadow.putalpha(shadow_alpha)
    return Image.alpha_composite(shadow, Image.fromarray(overlay_arr.astype(np.uint8), "RGBA"))


def run_diffusion_refine(preview: Image.Image, mask: Image.Image, style: dict[str, Any]) -> Image.Image:
    pipe = get_diffusion_pipeline()
    run_image, run_mask, original_size = resize_for_diffusion(preview.convert("RGB"), mask)
    prompt = (
        "high fidelity realistic manicure on natural hand photo, preserve exact nail art colors and patterns, "
        f"{style.get('finish', 'gloss')} finish, natural cuticle lighting, seamless nail edges"
    )
    negative = "changed hand pose, changed skin, extra fingers, distorted nails, text, watermark, blurry nail art"
    output = pipe(
        prompt=prompt,
        negative_prompt=negative,
        image=run_image,
        mask_image=run_mask,
        strength=0.22,
        guidance_scale=4.2,
        num_inference_steps=24,
    ).images[0]
    output = output.resize(original_size, Image.Resampling.LANCZOS).convert("RGBA")
    preview_rgba = preview.convert("RGBA")
    blend_mask = mask.filter(ImageFilter.GaussianBlur(radius=1.2)).point(lambda value: int(value * 0.72))
    return Image.composite(output, preview_rgba, blend_mask).convert("RGB")


def get_diffusion_pipeline() -> Any:
    global diffusion_pipeline, diffusion_error
    if diffusion_pipeline is not None:
        return diffusion_pipeline
    if diffusion_error:
        raise RuntimeError(diffusion_error)
    try:
        import torch
        from diffusers import StableDiffusionXLInpaintPipeline

        pipe = StableDiffusionXLInpaintPipeline.from_pretrained(
            DIFFUSION_MODEL_DIR,
            torch_dtype=torch.float16,
            local_files_only=True,
        )
        pipe.enable_attention_slicing()
        try:
            pipe.enable_model_cpu_offload()
        except Exception:
            pipe.to("cuda" if torch.cuda.is_available() else "cpu")
        diffusion_pipeline = pipe
        return diffusion_pipeline
    except Exception as exc:  # noqa: BLE001
        diffusion_error = f"Unable to load local SDXL inpaint model: {exc}"
        raise RuntimeError(diffusion_error) from exc


def resize_for_diffusion(image: Image.Image, mask: Image.Image) -> tuple[Image.Image, Image.Image, tuple[int, int]]:
    original = image.size
    max_side = 1024
    scale = min(1.0, max_side / max(original))
    width = max(64, int(original[0] * scale) // 8 * 8)
    height = max(64, int(original[1] * scale) // 8 * 8)
    return image.resize((width, height), Image.Resampling.LANCZOS), mask.resize((width, height), Image.Resampling.LANCZOS), original


def rotate_point(x: float, y: float, radians: float) -> tuple[float, float]:
    return x * math.cos(radians) - y * math.sin(radians), x * math.sin(radians) + y * math.cos(radians)


def midpoint(a: Any, b: Any, fallback: Any) -> float:
    try:
        return (float(a) + float(b)) / 2
    except (TypeError, ValueError):
        return float(fallback)


def clamp(value: float, low: float, high: float) -> float:
    return min(high, max(low, value))
