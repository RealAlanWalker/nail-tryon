# Photo Try-On Service

Local FastAPI service for uploaded-photo nail try-on. The default path creates internal ChatGPT Image 2 inputs, drives a persistent local browser session, and imports the generated result back into the app.

## Run

```powershell
cd D:\美团\nail-tryon
D:\nail-tryon-seg-venv\Scripts\python.exe -m pip install -r photo_tryon_service\requirements.txt
D:\nail-tryon-seg-venv\Scripts\python.exe -m uvicorn photo_tryon_service.server:app --host 127.0.0.1 --port 8765
```

Open the static app separately:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

## ChatGPT Image 2 Automation

`POST /api/photo-tryon/jobs` saves internal runner files:

```text
runs/photo-tryon/{jobId}/hand.png
runs/photo-tryon/{jobId}/style_reference.png
runs/photo-tryon/{jobId}/mask.png
runs/photo-tryon/{jobId}/quick_preview.png
runs/photo-tryon/{jobId}/prompt.txt
runs/photo-tryon/{jobId}/handoff.json
```

The service then attempts browser automation with a persistent profile:

```text
%LOCALAPPDATA%\nail-tryon\chatgpt-profile
```

Set `CHATGPT_PROFILE_DIR` to override the browser profile directory.

If the job returns `login_required`, complete ChatGPT login in the opened browser, then continue with:

```text
POST /api/photo-tryon/jobs/{jobId}/run-browser
```

Optional DeepSeek prompt/automation recovery uses `DEEPSEEK_API_KEY` and `DEEPSEEK_MODEL`; it only sends style metadata, stage names, visible UI text, and error messages, not user images.

## Diffusion Model

The service looks for an SDXL inpainting model at:

```text
models/diffusion/sdxl-inpaint
```

If the model is absent, the service still returns a quick deterministic texture-transfer preview. Put the model directory there to enable the secondary local SDXL path.
