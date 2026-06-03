---
name: nail-chatgpt-image2
description: Use this skill when the nail-tryon project needs ChatGPT Image 2 browser automation, login recovery, or debugging for the automatic high-fidelity manicure try-on runner.
---

# Nail ChatGPT Image 2 Runner

Use this only for the local nail-tryon repository. The user-facing app must never expose prompt copying, handoff downloads, or manual ChatGPT upload steps.

## Runner Contract

- The backend creates internal files in `runs/photo-tryon/{jobId}/`: `hand.png`, `style_reference.png`, `mask.png`, `quick_preview.png`, `prompt.txt`, and `handoff.json`.
- The automatic runner drives a persistent ChatGPT browser profile at `%LOCALAPPDATA%\nail-tryon\chatgpt-profile` by default; `CHATGPT_PROFILE_DIR` may override it.
- The normal user flow is upload hand photo, select style, wait, view result.
- If ChatGPT is not logged in, the UI may show only "need one-time ChatGPT login" and a continue button.

## Recovery Workflow

1. Inspect `GET /api/photo-tryon/jobs/{jobId}`.
2. If state is `login_required`, make sure the ChatGPT browser window is logged in, then call `POST /api/photo-tryon/jobs/{jobId}/run-browser`.
3. If state is `failed`, inspect `runs/photo-tryon/{jobId}/handoff.json` and `prompt.txt` only for debugging.
4. Do not ask the user to upload `hand.png` or `style_reference.png` manually unless browser automation is impossible.

## Guardrails

- Do not send user images to DeepSeek; DeepSeek may only receive style metadata, stage names, visible UI text, and error messages.
- Do not weaken the prompt rules that preserve hand pose, skin tone, skin texture, lighting, background, and composition.
- Long/press-on styles may extend only outward from the real nail bed and must not cover finger joints or finger pads.
