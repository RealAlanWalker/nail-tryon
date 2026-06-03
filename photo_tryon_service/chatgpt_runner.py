from __future__ import annotations

import asyncio
import base64
import json
import os
import shutil
import tempfile
import threading
import time
from concurrent.futures import Future
from pathlib import Path
from typing import Callable, Coroutine, TypeVar

from PIL import Image, ImageChops, ImageStat, UnidentifiedImageError

APP_ROOT = Path(__file__).resolve().parents[1]
T = TypeVar("T")
BASE_UPLOAD_NAME = "01_BASE_HAND_PHOTO_LOCKED_DO_NOT_CHANGE.png"
STYLE_UPLOAD_NAME = "02_MANICURE_STYLE_REFERENCE_STYLE_ONLY.png"


def _profile_root() -> Path:
    explicit = os.environ.get("CHATGPT_PROFILE_DIR")
    if explicit:
        return Path(explicit)
    return APP_ROOT / "runs" / "browser-profiles" / "chatgpt-profile"


def _recovery_profile_root() -> Path:
    return APP_ROOT / "runs" / "browser-profiles" / "chatgpt-profile-recovery"


class LoginRequired(RuntimeError):
    pass


class RunnerError(RuntimeError):
    pass


_SESSION = {"playwright": None, "context": None, "page": None}
_LOOP: asyncio.AbstractEventLoop | None = None
_LOOP_THREAD: threading.Thread | None = None
_LOOP_LOCK = threading.Lock()
_DRIVER_PROBE_CACHE: dict[str, object] = {"checkedAt": 0.0, "ready": False, "error": None}


def browser_automation_diagnostics() -> dict[str, object]:
    return {
        "profileDir": str(_profile_root()),
        "recoveryProfileDir": str(_recovery_profile_root()),
        "browserCandidates": [label for label, _ in _browser_launch_candidates()],
    }


def probe_playwright_driver(cache_seconds: int = 12) -> dict[str, object]:
    now = time.time()
    if now - float(_DRIVER_PROBE_CACHE.get("checkedAt") or 0) < cache_seconds:
        return {
            "ready": bool(_DRIVER_PROBE_CACHE.get("ready")),
            "error": _DRIVER_PROBE_CACHE.get("error"),
            "checkedAt": _DRIVER_PROBE_CACHE.get("checkedAt"),
            "cached": True,
        }
    try:
        asyncio.run(asyncio.wait_for(_probe_playwright_driver_async(), timeout=8))
        payload: dict[str, object] = {"checkedAt": now, "ready": True, "error": None}
    except Exception as exc:  # noqa: BLE001 - health checks must report failures without crashing the service
        payload = {"checkedAt": now, "ready": False, "error": str(exc)}
    _DRIVER_PROBE_CACHE.update(payload)
    return {**payload, "cached": False}


async def _probe_playwright_driver_async() -> None:
    try:
        from playwright.async_api import async_playwright
    except Exception as exc:  # noqa: BLE001
        raise RunnerError("Python package 'playwright' is not installed") from exc
    playwright = await async_playwright().start()
    await playwright.stop()


def run_chatgpt_image2(job_dir: Path, status: Callable[[str, str, float], None]) -> Path:
    hand = job_dir / "hand.png"
    style = job_dir / "style_reference.png"
    prompt_path = job_dir / "prompt.txt"
    if not hand.exists() or not style.exists() or not prompt_path.exists():
        raise RunnerError("missing handoff files for ChatGPT browser automation")
    return _run_on_runner_loop(_run_chatgpt_image2_async(job_dir, status))


async def _run_chatgpt_image2_async(job_dir: Path, status: Callable[[str, str, float], None]) -> Path:
    hand = job_dir / "hand.png"
    style = job_dir / "style_reference.png"
    hand_upload = _named_upload_copy(hand, job_dir / BASE_UPLOAD_NAME)
    style_upload = _named_upload_copy(style, job_dir / STYLE_UPLOAD_NAME)
    prompt = (job_dir / "prompt.txt").read_text(encoding="utf-8")
    result = job_dir / "chatgpt-result.png"

    should_close_session = False
    try:
        page = await _ensure_page_async(status)
        await _write_debug_snapshot_async(page, job_dir, "01-opened")
        await _ensure_logged_in_async(page, status)
        if _SESSION.get("visible") and not _force_visible_browser():
            await _close_session_async()
            page = await _ensure_page_async(status, visible=False)
            await _ensure_logged_in_async(page, status)
        await _upload_images_async(page, [hand_upload, style_upload], status)
        await _write_debug_snapshot_async(page, job_dir, "02-uploaded")
        await _mark_existing_images_async(page, job_dir.name)
        baseline_images = await _large_images_async(page, job_dir.name)
        baseline_count = len(baseline_images)
        baseline_sources = {str(image.get("src", "")) for image in baseline_images if image.get("src")}
        await _submit_prompt_async(page, prompt, status)
        await _write_debug_snapshot_async(page, job_dir, "03-submitted")
        await _capture_generated_image_async_v2(page, result, status, job_dir.name, baseline_count, baseline_sources)
        should_close_session = True
        return result
    except LoginRequired:
        raise
    except Exception:
        should_close_session = True
        raise
    finally:
        if should_close_session:
            await _close_session_async()


def _run_on_runner_loop(coro: Coroutine[object, object, T]) -> T:
    loop = _ensure_runner_loop()
    future: Future[T] = asyncio.run_coroutine_threadsafe(coro, loop)
    return future.result()


def _ensure_runner_loop() -> asyncio.AbstractEventLoop:
    global _LOOP, _LOOP_THREAD
    with _LOOP_LOCK:
        if _LOOP and _LOOP.is_running():
            return _LOOP

        ready = threading.Event()

        def loop_worker() -> None:
            global _LOOP
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            _LOOP = loop
            ready.set()
            loop.run_forever()

        _LOOP_THREAD = threading.Thread(target=loop_worker, name="nail-chatgpt-runner", daemon=True)
        _LOOP_THREAD.start()
        ready.wait(timeout=10)
        if not _LOOP:
            raise RunnerError("unable to start ChatGPT browser automation loop")
        return _LOOP


def _named_upload_copy(source: Path, target: Path) -> Path:
    if not target.exists() or target.stat().st_mtime < source.stat().st_mtime or target.stat().st_size != source.stat().st_size:
        target.write_bytes(source.read_bytes())
    return target


async def _ensure_page_async(status: Callable[[str, str, float], None], visible: bool | None = None):
    try:
        from playwright.async_api import async_playwright
    except Exception as exc:  # noqa: BLE001
        raise RunnerError("Python package 'playwright' is not installed") from exc

    context = _SESSION.get("context")
    requested_visible = _force_visible_browser() if visible is None else visible
    if context:
        try:
            if _SESSION.get("visible") != requested_visible:
                await _close_session_async()
                context = None
            else:
                pages = context.pages
                page = pages[0] if pages else await context.new_page()
                if requested_visible:
                    await page.bring_to_front()
                return page
        except Exception:
            _SESSION.update({"playwright": None, "context": None, "page": None, "visible": None})

    status("queued", "正在连接 ChatGPT", 0.42)
    playwright = await async_playwright().start()
    background_args = [] if requested_visible else ["--window-position=-32000,-32000", "--window-size=1365,900"]
    launch_options = {
        "headless": _force_headless_browser() and not requested_visible,
        "accept_downloads": True,
        "viewport": {"width": 1365, "height": 900},
        "args": ["--disable-blink-features=AutomationControlled", *background_args],
    }
    try:
        context, profile_root = await _launch_available_context_async(playwright, launch_options)
    except Exception as exc:  # noqa: BLE001
        try:
            await playwright.stop()
        except Exception:
            pass
        raise RunnerError(f"unable to launch browser automation: {exc}") from exc

    page = context.pages[0] if context.pages else await context.new_page()
    _SESSION.update({"playwright": playwright, "context": context, "page": page, "visible": requested_visible, "profile_root": profile_root})
    try:
        await page.goto("https://chatgpt.com/", wait_until="domcontentloaded", timeout=60000)
    except Exception as exc:  # noqa: BLE001
        raise RunnerError(f"unable to open ChatGPT: {exc}") from exc
    if requested_visible:
        await page.bring_to_front()
    return page


async def _close_session_async() -> None:
    context = _SESSION.get("context")
    playwright = _SESSION.get("playwright")
    _SESSION.update({"playwright": None, "context": None, "page": None, "visible": None})
    try:
        if context:
            await context.close()
    except Exception:
        pass
    try:
        if playwright:
            await playwright.stop()
    except Exception:
        pass


def _force_visible_browser() -> bool:
    return os.environ.get("CHATGPT_BROWSER_VISIBLE", "").strip().lower() in {"1", "true", "yes", "on"}


def _force_headless_browser() -> bool:
    return os.environ.get("CHATGPT_BROWSER_HEADLESS", "").strip().lower() in {"1", "true", "yes", "on"}


async def _launch_available_context_async(playwright, launch_options: dict):
    errors: list[str] = []
    for profile_root in _profile_launch_roots():
        try:
            profile_root.mkdir(parents=True, exist_ok=True)
        except OSError as exc:
            errors.append(f"{profile_root}: unable to create profile directory: {exc}")
            continue
        _cleanup_stale_profile_locks(profile_root)
        try:
            context = await _launch_persistent_context_async(playwright, profile_root, launch_options)
            return context, profile_root
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{profile_root}: {exc}")
            continue
    raise RunnerError(" | ".join(errors[-4:]) or "no browser profile could be opened")


def _profile_launch_roots() -> list[Path]:
    roots = [_profile_root()]
    if not os.environ.get("CHATGPT_PROFILE_DIR"):
        roots.append(_recovery_profile_root())
        roots.append(APP_ROOT / "runs" / "browser-profiles" / f"chatgpt-profile-temp-{os.getpid()}-{int(time.time())}")
    unique: list[Path] = []
    seen: set[str] = set()
    for root in roots:
        key = str(root.resolve() if root.exists() else root.absolute()).lower()
        if key not in seen:
            seen.add(key)
            unique.append(root)
    return unique


def _cleanup_stale_profile_locks(profile_root: Path) -> None:
    for name in ["SingletonLock", "SingletonSocket", "SingletonCookie", "DevToolsActivePort", "lockfile"]:
        path = profile_root / name
        try:
            if path.exists() or path.is_symlink():
                if path.is_dir() and not path.is_symlink():
                    shutil.rmtree(path, ignore_errors=True)
                else:
                    path.unlink(missing_ok=True)
        except OSError:
            pass


async def _launch_persistent_context_async(playwright, profile_root: Path, launch_options: dict):
    errors: list[str] = []
    for label, browser_options in _browser_launch_candidates():
        try:
            return await playwright.chromium.launch_persistent_context(
                str(profile_root),
                **launch_options,
                **browser_options,
            )
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{label}: {exc}")
    raise RunnerError(" | ".join(errors[-3:]) or "no browser launch candidates available")


def _browser_launch_candidates() -> list[tuple[str, dict]]:
    candidates: list[tuple[str, dict]] = []
    explicit = os.environ.get("CHATGPT_BROWSER_EXECUTABLE")
    if explicit:
        candidates.append(("CHATGPT_BROWSER_EXECUTABLE", {"executable_path": explicit}))

    channel = os.environ.get("CHATGPT_BROWSER_CHANNEL")
    if channel:
        candidates.append((f"channel:{channel}", {"channel": channel}))

    for path in _common_browser_paths():
        if path.exists():
            candidates.append((path.name, {"executable_path": str(path)}))

    candidates.append(("playwright-chromium", {}))
    return candidates


def _common_browser_paths() -> list[Path]:
    return [
        Path(os.environ.get("PROGRAMFILES", r"C:\Program Files")) / "Google" / "Chrome" / "Application" / "chrome.exe",
        Path(os.environ.get("PROGRAMFILES(X86)", r"C:\Program Files (x86)")) / "Google" / "Chrome" / "Application" / "chrome.exe",
        Path(os.environ.get("PROGRAMFILES", r"C:\Program Files")) / "Microsoft" / "Edge" / "Application" / "msedge.exe",
        Path(os.environ.get("PROGRAMFILES(X86)", r"C:\Program Files (x86)")) / "Microsoft" / "Edge" / "Application" / "msedge.exe",
    ]


async def _ensure_logged_in_async(page, status: Callable[[str, str, float], None]) -> None:
    status("queued", "正在检查 ChatGPT 登录态", 0.48)
    if await _looks_logged_out_async(page):
        if not _SESSION.get("visible"):
            await _close_session_async()
            page = await _ensure_page_async(status, visible=True)
        status("login_required", "需要完成一次 ChatGPT 登录授权", 0.52)
        raise LoginRequired("Complete ChatGPT login in the opened browser, then continue")
    if await _wait_for_composer_async(page, timeout_ms=14000):
        if await _looks_logged_out_async(page):
            if not _SESSION.get("visible"):
                await _close_session_async()
                page = await _ensure_page_async(status, visible=True)
            status("login_required", "需要完成一次 ChatGPT 登录授权", 0.52)
            raise LoginRequired("Complete ChatGPT login in the opened browser, then continue")
        return
    if await _looks_logged_out_async(page):
        if not _SESSION.get("visible"):
            await _close_session_async()
            await _ensure_page_async(status, visible=True)
        status("login_required", "需要完成一次 ChatGPT 登录授权", 0.52)
        raise LoginRequired("Complete ChatGPT login in the opened browser, then continue")
    snapshot = await _safe_text_snapshot_async(page)
    action = await asyncio.to_thread(_deepseek_action, "login_check", snapshot)
    if action == "login_required":
        if not _SESSION.get("visible"):
            await _close_session_async()
            await _ensure_page_async(status, visible=True)
        status("login_required", "需要完成一次 ChatGPT 登录授权", 0.52)
        raise LoginRequired("Complete ChatGPT login in the opened browser, then continue")
    if not _SESSION.get("visible"):
        await _close_session_async()
        await _ensure_page_async(status, visible=True)
    status("login_required", "需要确认 ChatGPT 页面可用", 0.52)
    raise LoginRequired("ChatGPT composer is not visible; complete login or close popups, then continue")


async def _upload_images_async(page, paths: list[Path], status: Callable[[str, str, float], None]) -> None:
    status("uploading", "正在上传手图和款式参考图", 0.6)
    file_input = await _find_file_input_async(page)
    if not file_input:
        for selector in [
            "button[aria-label*='Attach']",
            "button[aria-label*='Upload']",
            "button[data-testid*='attach']",
            "button:has-text('Attach')",
            "button:has-text('上传')",
            "button:has-text('+')",
        ]:
            try:
                await page.locator(selector).first.click(timeout=1800)
                break
            except Exception:
                continue
        file_input = await _find_file_input_async(page)
    if not file_input:
        snapshot = await _safe_text_snapshot_async(page)
        action = await asyncio.to_thread(_deepseek_action, "find_upload", snapshot)
        if action == "login_required":
            raise LoginRequired("ChatGPT login is required before upload")
        raise RunnerError("unable to find ChatGPT file upload input")
    await file_input.set_input_files([str(path) for path in paths])
    await page.wait_for_timeout(2500)


async def _mark_existing_images_async(page, job_id: str) -> None:
    try:
        await page.evaluate(
            """(jobId) => {
              Array.from(document.images).forEach((img) => {
                img.setAttribute('data-nail-baseline-job', jobId);
              });
              Array.from(document.querySelectorAll('a, button')).forEach((node) => {
                node.setAttribute('data-nail-baseline-job', jobId);
              });
            }""",
            job_id,
        )
    except Exception:
        pass


async def _submit_prompt_async(page, prompt: str, status: Callable[[str, str, float], None]) -> None:
    status("uploading", "正在提交生成指令", 0.68)
    composer = await _find_composer_async(page)
    if not composer:
        raise RunnerError("unable to find ChatGPT composer")
    try:
        await composer.fill(prompt, timeout=4000)
    except Exception:
        await composer.click(timeout=4000)
        await page.keyboard.insert_text(prompt)
    await _click_send_button_async(page)
    status("generating", "ChatGPT 正在生成", 0.72)


async def _click_send_button_async(page) -> None:
    deadline = time.time() + int(os.environ.get("CHATGPT_SEND_TIMEOUT_SECONDS", "35"))
    selectors = [
        "button[data-testid='send-button']",
        "button[data-testid='composer-submit-button']",
        "button[aria-label*='Send']",
        "button[aria-label*='send']",
        "button[aria-label*='发送']",
    ]
    while time.time() < deadline:
        for selector in selectors:
            try:
                locator = page.locator(selector)
                count = await locator.count()
                for index in range(count - 1, -1, -1):
                    button = locator.nth(index)
                    if await button.is_visible(timeout=500) and await button.is_enabled(timeout=500):
                        await button.click(timeout=4000)
                        await page.wait_for_timeout(1800)
                        if await _message_left_composer_async(page):
                            return
            except Exception:
                continue
        try:
            clicked = await page.evaluate(
                """() => {
                  const viewportW = window.innerWidth || document.documentElement.clientWidth;
                  const viewportH = window.innerHeight || document.documentElement.clientHeight;
                  const buttons = Array.from(document.querySelectorAll('button:not([disabled])'))
                    .map((button) => ({ button, rect: button.getBoundingClientRect(), label: button.getAttribute('aria-label') || '', testId: button.getAttribute('data-testid') || '' }))
                    .filter((item) => item.rect.width >= 24 && item.rect.height >= 24)
                    .filter((item) => item.rect.left > viewportW * 0.55 && item.rect.top > viewportH * 0.45)
                    .filter((item) => /send|发送|submit/i.test(item.label + ' ' + item.testId) || item.rect.width <= 60);
                  const target = buttons.sort((a, b) => (b.rect.top + b.rect.left) - (a.rect.top + a.rect.left))[0];
                  if (!target) return false;
                  target.button.click();
                  return true;
                }"""
            )
            if clicked:
                await page.wait_for_timeout(1800)
                if await _message_left_composer_async(page):
                    return
        except Exception:
            pass
        await page.wait_for_timeout(700)
    raise RunnerError("unable to submit ChatGPT prompt; send button did not activate")


async def _message_left_composer_async(page) -> bool:
    try:
        text = await page.locator("body").inner_text(timeout=1200)
        has_stop = any(token in text.lower() for token in ("stop streaming", "停止", "thinking", "思考"))
        composer = await _find_composer_async(page)
        if not composer:
            return True
        composer_text = (await _composer_text_async(composer)).strip()
        return has_stop and len(composer_text) < 80
    except Exception:
        return False


async def _composer_text_async(composer) -> str:
    try:
        return await composer.inner_text(timeout=800)
    except Exception:
        try:
            return await composer.input_value(timeout=800)
        except Exception:
            return ""


async def _capture_generated_image_async(
    page,
    result_path: Path,
    status: Callable[[str, str, float], None],
    job_id: str,
    baseline_count: int = 0,
    baseline_sources: set[str] | None = None,
) -> None:
    timeout_s = int(os.environ.get("CHATGPT_IMAGE_TIMEOUT_SECONDS", "300"))
    started = time.time()
    deadline = time.time() + timeout_s
    last_count = 0
    baseline_sources = baseline_sources or set()
    while time.time() < deadline:
        await page.wait_for_timeout(2500)
        elapsed = timeout_s - (deadline - time.time())
        if int(elapsed) > 0 and int(elapsed) % 30 in {0, 1, 2}:
            await _write_debug_snapshot_async(page, result_path.parent, f"04-waiting-{int(elapsed):03d}s")
        if await _page_is_generating_async(page):
            status("generating", "ChatGPT 正在生成", min(0.92, 0.72 + elapsed / max(1, timeout_s) * 0.18))
            continue
        if await _download_generated_image_async(page, result_path, job_id):
            status("downloading", "正在保存 ChatGPT 结果", 0.94)
            return
        images = await _large_images_async(page, job_id)
        if len(images) > last_count:
            last_count = len(images)
        candidates = [
            image
            for image in images
            if str(image.get("src", "")) not in baseline_sources
            and not image.get("inComposer")
            and not _looks_like_attachment_thumbnail(image)
        ]
        assistant_candidates = [
            image
            for image in candidates
            if image.get("isAssistantMessage") and not image.get("isUserMessage")
        ]
        if assistant_candidates:
            candidates = assistant_candidates
        else:
            candidates = [image for image in candidates if not image.get("isUserMessage")]
        if not candidates and len(images) > baseline_count:
            candidates = [
                image
                for image in images[baseline_count:]
                if not image.get("inComposer") and not _looks_like_attachment_thumbnail(image)
            ]
        if candidates:
            for selected in sorted(candidates, key=_candidate_sort_key, reverse=True):
                if await _save_validated_generated_image_async(page, selected, result_path):
                    status("downloading", "正在保存 ChatGPT 结果", 0.94)
                    return
        status("generating", "ChatGPT 正在生成", min(0.92, 0.72 + elapsed / max(1, timeout_s) * 0.18))
    await _write_debug_snapshot_async(page, result_path.parent, "05-timeout")
    raise RunnerError("timed out waiting for a new ChatGPT generated image")


async def _capture_generated_image_async_v2(
    page,
    result_path: Path,
    status: Callable[[str, str, float], None],
    job_id: str,
    baseline_count: int = 0,
    baseline_sources: set[str] | None = None,
) -> None:
    timeout_s = int(os.environ.get("CHATGPT_IMAGE_TIMEOUT_SECONDS", "300"))
    deadline = time.time() + timeout_s
    baseline_sources = baseline_sources or set()
    last_count = 0
    while time.time() < deadline:
        await page.wait_for_timeout(1800)
        elapsed = timeout_s - (deadline - time.time())
        if int(elapsed) > 0 and int(elapsed) % 30 in {0, 1, 2}:
            await _write_debug_snapshot_async(page, result_path.parent, f"04-waiting-{int(elapsed):03d}s")

        images = await _large_images_async(page, job_id)
        if len(images) > last_count:
            last_count = len(images)
        candidates = [
            image
            for image in images
            if str(image.get("src", "")) not in baseline_sources
            and not image.get("inComposer")
            and not _looks_like_attachment_thumbnail(image)
        ]
        assistant_candidates = [
            image
            for image in candidates
            if image.get("isAssistantMessage") and not image.get("isUserMessage")
        ]
        if assistant_candidates:
            candidates = assistant_candidates
        else:
            candidates = [image for image in candidates if not image.get("isUserMessage")]
        if not candidates and len(images) > baseline_count:
            candidates = [
                image
                for image in images[baseline_count:]
                if not image.get("inComposer") and not _looks_like_attachment_thumbnail(image)
            ]
        for selected in sorted(candidates, key=_candidate_sort_key, reverse=True):
            if await _save_validated_generated_image_async(page, selected, result_path):
                status("downloading", "正在保存 ChatGPT 结果", 0.94)
                return

        if await _download_generated_image_async(page, result_path, job_id):
            status("downloading", "正在保存 ChatGPT 结果", 0.94)
            return

        if await _page_is_generating_async(page):
            status("generating", "ChatGPT 正在生成", min(0.92, 0.72 + elapsed / max(1, timeout_s) * 0.18))
            continue
        status("generating", "等待 ChatGPT 生成结果图", min(0.92, 0.72 + elapsed / max(1, timeout_s) * 0.18))

    await _write_debug_snapshot_async(page, result_path.parent, "05-timeout")
    raise RunnerError("timed out waiting for a new ChatGPT generated image")


async def _find_file_input_async(page):
    try:
        locator = page.locator("input[type='file']")
        if await locator.count() > 0:
            return locator.first
    except Exception:
        return None
    return None


async def _find_composer_async(page):
    selectors = [
        "#prompt-textarea",
        "[data-testid='composer-input']",
        "textarea",
        "div[contenteditable='true']",
    ]
    for selector in selectors:
        try:
            locator = page.locator(selector).first
            await locator.wait_for(state="visible", timeout=1500)
            return locator
        except Exception:
            continue
    return None


async def _wait_for_composer_async(page, timeout_ms: int) -> bool:
    deadline = time.time() + timeout_ms / 1000
    while time.time() < deadline:
        if await _find_composer_async(page):
            return True
        await page.wait_for_timeout(700)
    return False


async def _looks_logged_out_async(page) -> bool:
    try:
        logged_out = await page.evaluate(
            """() => {
              const bodyText = (document.body?.innerText || '').toLowerCase();
              const visibleLabels = Array.from(document.querySelectorAll('a, button, input, textarea'))
                .map((node) => {
                  const rect = node.getBoundingClientRect();
                  if (rect.width < 1 || rect.height < 1) return '';
                  return [
                    node.innerText || '',
                    node.textContent || '',
                    node.getAttribute('aria-label') || '',
                    node.getAttribute('placeholder') || '',
                    node.getAttribute('value') || ''
                  ].join(' ');
                })
                .join('\\n')
                .toLowerCase();
              const text = `${bodyText}\\n${visibleLabels}`;
              const hasLoginAction = /\\blog\\s*in\\b|sign\\s*up|登录|登入|免费注册|注册|continue with google|使用 google|使用 apple|使用 microsoft|电子邮件地址|email address|phone number|电话号码/i.test(text);
              const hasLoggedOutCopy = /获取为你量身定制的回复|登录以获取|log in to|get smarter responses|create images and upload files|上传文件|免费注册/i.test(text);
              const hasLoginButton = Array.from(document.querySelectorAll('a, button')).some((node) => {
                const rect = node.getBoundingClientRect();
                const label = `${node.innerText || ''} ${node.textContent || ''} ${node.getAttribute('aria-label') || ''}`.toLowerCase();
                return rect.width >= 20 && rect.height >= 20 && /(登录|登入|log\\s*in|免费注册|sign\\s*up)/i.test(label);
              });
              return (hasLoginAction && hasLoginButton) || hasLoggedOutCopy;
            }"""
        )
        if logged_out:
            return True
        url = page.url.lower()
        text = (await page.locator("body").inner_text(timeout=2000)).lower()
        return any(token in url for token in ("auth", "login", "signin")) or any(token in text for token in ("log in", "sign up", "登录", "注册"))
    except Exception:
        return False


async def _large_images_async(page, job_id: str | None = None) -> list[dict]:
    try:
        return await page.evaluate(
            """(jobId) => Array.from(document.images)
              .map((img, index) => {
                window.__nailCandidateSeq = window.__nailCandidateSeq || 0;
                if (!img.getAttribute('data-nail-candidate-id')) {
                  window.__nailCandidateSeq += 1;
                  img.setAttribute('data-nail-candidate-id', `nail-candidate-${window.__nailCandidateSeq}`);
                }
                const rect = img.getBoundingClientRect();
                const ancestor = img.closest('[data-message-author-role], article, [data-testid*="conversation-turn"], [data-testid*="conversation"], form');
                const role = ancestor?.getAttribute?.('data-message-author-role') || '';
                const text = (ancestor?.innerText || '').slice(0, 500);
                const inComposer = !!img.closest('form, [data-testid*="composer"], #prompt-textarea, [contenteditable="true"]');
                const isUserMessage = role === 'user' || /ORIGINAL USER HAND PHOTO|MANICURE STYLE REFERENCE ONLY|STRICT NAIL-ONLY LOCAL EDIT/.test(text);
                const isAssistantMessage = role === 'assistant' || /download|share|regenerate|重新生成|下载/i.test(text);
                return {
                  index,
                  candidateId: img.getAttribute('data-nail-candidate-id'),
                  src: img.currentSrc || img.src,
                  width: img.naturalWidth || img.width,
                  height: img.naturalHeight || img.height,
                  displayWidth: rect.width,
                  displayHeight: rect.height,
                  top: rect.top,
                  left: rect.left,
                  baseline: jobId ? img.getAttribute('data-nail-baseline-job') === jobId : false,
                  inComposer,
                  isUserMessage,
                  isAssistantMessage,
                  text
                };
              })
              .filter((item) => item.src && item.width >= 256 && item.height >= 256 && item.displayWidth >= 120 && item.displayHeight >= 120 && !item.baseline)""",
            job_id,
        )
    except Exception:
        return []


async def _page_is_generating_async(page) -> bool:
    try:
        has_result_surface = await page.evaluate(
            """() => {
              const hasLargeResultImage = Array.from(document.images).some((img) => {
                const rect = img.getBoundingClientRect();
                const inComposer = !!img.closest('form, [data-testid*="composer"], #prompt-textarea, [contenteditable="true"]');
                return !inComposer
                  && (img.naturalWidth || img.width) >= 256
                  && (img.naturalHeight || img.height) >= 256
                  && rect.width >= 260
                  && rect.height >= 260;
              });
              if (hasLargeResultImage) return true;
              return Array.from(document.querySelectorAll('a, button')).some((node) => {
                const rect = node.getBoundingClientRect();
                const label = [
                  node.getAttribute('aria-label') || '',
                  node.getAttribute('title') || '',
                  node.getAttribute('data-testid') || '',
                  node.textContent || '',
                  node.getAttribute('download') || '',
                  node.getAttribute('href') || ''
                ].join(' ');
                const inComposer = !!node.closest('form, [data-testid*="composer"], #prompt-textarea, [contenteditable="true"]');
                return !inComposer && rect.width >= 20 && rect.height >= 20 && /download|下载|save|保存/i.test(label);
              });
            }"""
        )
        if has_result_surface:
            return False
        return bool(
            await page.evaluate(
                """() => {
                  const text = document.body?.innerText || '';
                  return /正在创建图片|正在打草稿|正在分析|Thinking|Stop responding|停止回答|creating image|drafting|analyzing/i.test(text);
                }"""
            )
        )
    except Exception:
        return False


async def _download_generated_image_async(page, result_path: Path, job_id: str | None = None) -> bool:
    if os.environ.get("CHATGPT_USE_DOWNLOAD_BUTTONS", "").strip().lower() not in {"1", "true", "yes", "on"}:
        return False
    controls = await _download_controls_async(page, job_id)
    for control in sorted(controls, key=_candidate_sort_key, reverse=True):
        if await _click_download_control_async(page, control, result_path):
            return True
    return False


async def _download_controls_async(page, job_id: str | None = None) -> list[dict]:
    try:
        return await page.evaluate(
            """(jobId) => Array.from(document.querySelectorAll('a, button'))
              .map((node, index) => {
                window.__nailDownloadSeq = window.__nailDownloadSeq || 0;
                if (!node.getAttribute('data-nail-download-id')) {
                  window.__nailDownloadSeq += 1;
                  node.setAttribute('data-nail-download-id', `nail-download-${window.__nailDownloadSeq}`);
                }
                const rect = node.getBoundingClientRect();
                const label = [
                  node.getAttribute('aria-label') || '',
                  node.getAttribute('title') || '',
                  node.getAttribute('data-testid') || '',
                  node.textContent || '',
                  node.getAttribute('download') || '',
                  node.getAttribute('href') || ''
                ].join(' ');
                const ancestor = node.closest('[data-message-author-role], article, [data-testid*="conversation-turn"], [data-testid*="conversation"], form');
                const role = ancestor?.getAttribute?.('data-message-author-role') || '';
                const text = (ancestor?.innerText || '').slice(0, 700);
                const inComposer = !!node.closest('form, [data-testid*="composer"], #prompt-textarea, [contenteditable="true"]');
                const isUserMessage = role === 'user' || /ORIGINAL USER HAND PHOTO|MANICURE STYLE REFERENCE ONLY|STRICT NAIL-ONLY LOCAL EDIT/.test(text);
                const isAssistantMessage = role === 'assistant' || /download|share|regenerate|重新生成|下载/i.test(text);
                const isLoading = /正在创建图片|正在打草稿|正在分析|Thinking|Stop responding|停止回答|creating image|drafting|analyzing/i.test(text);
                const isDownload = /download|下载|save|保存/i.test(label);
                const href = node.tagName.toLowerCase() === 'a' ? node.href : '';
                return {
                  index,
                  downloadId: node.getAttribute('data-nail-download-id'),
                  href,
                  displayWidth: rect.width,
                  displayHeight: rect.height,
                  top: rect.top,
                  left: rect.left,
                  inComposer,
                  isUserMessage,
                  isAssistantMessage,
                  isLoading,
                  isDownload,
                  baseline: jobId ? node.getAttribute('data-nail-baseline-job') === jobId : false,
                  text: label.slice(0, 300)
                };
              })
              .filter((item) => item.isDownload && item.displayWidth >= 20 && item.displayHeight >= 20 && !item.inComposer && !item.isUserMessage && !item.isLoading && !item.baseline)""",
            job_id,
        )
    except Exception:
        return []


async def _click_download_control_async(page, control: dict, result_path: Path) -> bool:
    download_id = control.get("downloadId")
    if not download_id:
        return False
    debug_dir = result_path.parent / "debug"
    debug_dir.mkdir(parents=True, exist_ok=True)
    candidate_path = debug_dir / f"download-candidate-{int(time.time() * 1000)}-{download_id}.png"
    try:
        async with page.expect_download(timeout=16000) as download_info:
            await page.locator(f"[data-nail-download-id='{download_id}']").click(timeout=5000)
        download = await download_info.value
        await download.save_as(str(candidate_path))
    except Exception:
        href = str(control.get("href") or "")
        if not href:
            return False
        try:
            payload = await page.evaluate(
                """async (href) => {
                  const response = await fetch(href);
                  const blob = await response.blob();
                  const buffer = await blob.arrayBuffer();
                  return Array.from(new Uint8Array(buffer));
                }""",
                href,
            )
            candidate_path.write_bytes(bytes(payload))
        except Exception:
            return False
    reason = _reject_generated_candidate_reason(candidate_path, result_path.parent, {**control, "isAssistantMessage": True})
    if reason:
        rejected = debug_dir / f"download-rejected-{int(time.time() * 1000)}-{download_id}.png"
        try:
            shutil.copyfile(candidate_path, rejected)
            (rejected.with_suffix(".json")).write_text(
                json.dumps({"reason": reason, "control": control}, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
        except Exception:
            pass
        try:
            candidate_path.unlink()
        except OSError:
            pass
        return False
    if result_path.exists():
        result_path.unlink()
    candidate_path.replace(result_path)
    try:
        accepted = debug_dir / f"download-accepted-{int(time.time() * 1000)}-{download_id}.json"
        accepted.write_text(json.dumps({"control": control}, ensure_ascii=False, indent=2), encoding="utf-8")
    except Exception:
        pass
    return result_path.exists() and result_path.stat().st_size > 0


def _candidate_sort_key(image: dict) -> tuple[int, float, float]:
    area = float(image.get("displayWidth") or image.get("width") or 0) * float(image.get("displayHeight") or image.get("height") or 0)
    assistant = 1 if image.get("isAssistantMessage") else 0
    top = float(image.get("top") or 0)
    return (assistant, area, top)


def _looks_like_attachment_thumbnail(image: dict) -> bool:
    width = float(image.get("displayWidth") or 0)
    height = float(image.get("displayHeight") or 0)
    src = str(image.get("src") or "")
    filename_marker = "fn=01_BASE_HAND_PHOTO" in src or "fn=02_MANICURE_STYLE_REFERENCE" in src
    return width <= 180 and height <= 180 and (filename_marker or image.get("isUserMessage"))


async def _save_validated_generated_image_async(page, image: dict, result_path: Path) -> bool:
    job_dir = result_path.parent
    debug_dir = job_dir / "debug"
    debug_dir.mkdir(parents=True, exist_ok=True)
    candidate_path = debug_dir / f"candidate-{int(time.time() * 1000)}-{image.get('index', 0)}.png"
    if not await _save_image_from_page_async(page, image, candidate_path):
        return False
    reason = _reject_generated_candidate_reason(candidate_path, job_dir, image)
    if reason:
        rejected = debug_dir / f"rejected-{int(time.time() * 1000)}-{image.get('index', 0)}.png"
        try:
            shutil.copyfile(candidate_path, rejected)
            (rejected.with_suffix(".json")).write_text(
                json.dumps({"reason": reason, "image": image}, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
        except Exception:
            pass
        try:
            candidate_path.unlink()
        except OSError:
            pass
        return False
    if result_path.exists():
        result_path.unlink()
    candidate_path.replace(result_path)
    try:
        accepted = debug_dir / f"accepted-{int(time.time() * 1000)}-{image.get('candidateId') or image.get('index', 0)}.json"
        accepted.write_text(json.dumps({"image": image}, ensure_ascii=False, indent=2), encoding="utf-8")
    except Exception:
        pass
    return result_path.exists() and result_path.stat().st_size > 0


def _reject_generated_candidate_reason(candidate_path: Path, job_dir: Path, image: dict) -> str | None:
    if image.get("inComposer"):
        return "image is still inside composer/upload area"
    if image.get("isUserMessage") and not image.get("isAssistantMessage"):
        return "image belongs to the submitted user message"
    if image.get("isLoading"):
        return "candidate is still a loading or thinking placeholder"
    source_hint = " ".join(str(image.get(key, "")) for key in ("src", "href", "text", "downloadId"))
    if "01_BASE_HAND_PHOTO" in source_hint or "02_MANICURE_STYLE_REFERENCE" in source_hint:
        return "candidate is one of the uploaded reference attachments"
    try:
        with Image.open(candidate_path) as candidate:
            candidate_size = candidate.size
    except (OSError, UnidentifiedImageError):
        return "candidate image cannot be decoded"
    if min(candidate_size) < 256:
        return "candidate image is too small"
    for reference in _reference_image_paths(job_dir):
        reason = _reference_similarity_reason(candidate_path, reference)
        if reason:
            return reason
    return None


def _reference_image_paths(job_dir: Path) -> list[Path]:
    return [
        path
        for path in [
            job_dir / "hand.png",
            job_dir / BASE_UPLOAD_NAME,
            job_dir / "style_reference.png",
            job_dir / STYLE_UPLOAD_NAME,
        ]
        if path.exists()
    ]


def _reference_similarity_reason(candidate_path: Path, reference_path: Path) -> str | None:
    try:
        if candidate_path.read_bytes() == reference_path.read_bytes():
            return f"candidate is byte-identical to {reference_path.name}"
        with Image.open(candidate_path) as candidate_raw, Image.open(reference_path) as reference_raw:
            candidate = candidate_raw.convert("RGB")
            reference = reference_raw.convert("RGB")
            candidate_hash = _average_hash(candidate)
            reference_hash = _average_hash(reference)
            hamming = sum(a != b for a, b in zip(candidate_hash, reference_hash, strict=False))
            resized_reference = reference.resize(candidate.size)
            rms = _image_rms(candidate, resized_reference)
            if reference_path.name in {BASE_UPLOAD_NAME, "hand.png"}:
                if hamming <= 4 and rms < 4.0:
                    return f"candidate appears to be the original hand photo {reference_path.name}"
                return None
            same_aspect = abs((candidate.width / max(1, candidate.height)) - (reference.width / max(1, reference.height))) < 0.04
            if hamming <= 10 and rms < 18:
                return f"candidate is visually too close to {reference_path.name}"
            if same_aspect and hamming <= 18 and rms < 26 and reference_path.name in {STYLE_UPLOAD_NAME, "style_reference.png"}:
                return f"candidate appears to be the style reference image {reference_path.name}"
    except (OSError, UnidentifiedImageError):
        return None
    return None


def _average_hash(image: Image.Image, size: int = 16) -> list[int]:
    thumbnail = image.convert("L").resize((size, size), Image.Resampling.BILINEAR)
    pixels = list(thumbnail.getdata())
    mean = sum(pixels) / max(1, len(pixels))
    return [1 if pixel >= mean else 0 for pixel in pixels]


def _image_rms(a: Image.Image, b: Image.Image) -> float:
    diff = ImageChops.difference(a, b)
    stat = ImageStat.Stat(diff)
    return sum(value**2 for value in stat.rms) ** 0.5 / max(1, len(stat.rms))


async def _save_image_from_page_async(page, image: dict, result_path: Path) -> bool:
    src = image.get("src", "")
    if src.startswith("data:image"):
        payload = src.split(",", 1)[1]
        result_path.write_bytes(base64.b64decode(payload))
        return True
    try:
        payload = await page.evaluate(
            """async (src) => {
              const response = await fetch(src);
              const blob = await response.blob();
              const buffer = await blob.arrayBuffer();
              return Array.from(new Uint8Array(buffer));
            }""",
            src,
        )
        result_path.write_bytes(bytes(payload))
        return result_path.stat().st_size > 0
    except Exception:
        return False


async def _safe_text_snapshot_async(page) -> str:
    try:
        text = await page.locator("body").inner_text(timeout=1500)
        return text[:3500]
    except Exception:
        return ""


async def _write_debug_snapshot_async(page, job_dir: Path, label: str) -> None:
    try:
        debug_dir = job_dir / "debug"
        debug_dir.mkdir(parents=True, exist_ok=True)
        safe_label = "".join(ch if ch.isalnum() or ch in {"-", "_"} else "_" for ch in label)
        await page.screenshot(path=str(debug_dir / f"{safe_label}.png"), full_page=False, timeout=8000)
        text = await _safe_text_snapshot_async(page)
        (debug_dir / f"{safe_label}.txt").write_text(text, encoding="utf-8")
        images = await _large_images_async(page, job_dir.name)
        (debug_dir / f"{safe_label}.images.json").write_text(json.dumps(images, ensure_ascii=False, indent=2), encoding="utf-8")
    except Exception:
        pass


def _deepseek_action(stage: str, dom_text: str) -> str:
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key or not dom_text:
        return "fail"
    try:
        import urllib.request

        payload = {
            "model": os.environ.get("DEEPSEEK_MODEL", "deepseek-chat"),
            "messages": [
                {
                    "role": "system",
                    "content": "Return one action only: click_upload, paste_prompt, submit, wait, download, login_required, fail.",
                },
                {
                    "role": "user",
                    "content": json.dumps({"stage": stage, "visibleText": dom_text}, ensure_ascii=False),
                },
            ],
            "temperature": 0,
            "max_tokens": 12,
        }
        request = urllib.request.Request(
            "https://api.deepseek.com/chat/completions",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=14) as response:
            data = json.loads(response.read().decode("utf-8"))
        action = data.get("choices", [{}])[0].get("message", {}).get("content", "").strip().lower()
        return action if action in {"click_upload", "paste_prompt", "submit", "wait", "download", "login_required", "fail"} else "fail"
    except Exception:
        return "fail"
