# AI 美甲高保真试戴用户端

照片优先的美甲试戴原型，支持上传手图、选择款式、快速预览和本机高保真生成。当前架构是 `MediaPipe Hand Landmarker + Nails343/YOLO-Seg 指甲实例分割 + Canvas 快速预览 + FastAPI/Diffusers 照片生成服务`：没有启动生成服务时，静态网页仍可独立演示；启动服务并放置本地 SDXL inpainting 模型后，可生成前后对比结果。

## 当前能力

- 自动手部定位：MediaPipe 输出 21 个手部关键点，前端计算 5 个指甲 anchor。
- 本地 ONNX 分割入口：`vendor/onnxruntime-web/` 已 vendor，读取 `models/nail-seg/metadata.json` 和 `yolo11n-seg-nails343.onnx`。
- 快速预览：Canvas 根据真实/回退 mask 绘制颜色、纹理、根部阴影、边缘 feather、方向高光、金属/亮片/果冻 finish。
- 在线高保真生成：`photo_tryon_service` 接收手图、款式、anchors 和 masks，后台自动驱动已登录的 ChatGPT 浏览器会话生成结果并回填页面。
- 款式素材 schema：`assets/nail-assets/styles.json` 已扩展为每指 `image + mask + bbox + confidence + finish`。
- 开源兜底：没有 ONNX 模型或模型加载失败时，仍可用基础贴合演示。

## 本地运行

一键启动前端和照片生成服务：

```powershell
cd D:\美团\nail-tryon
powershell -ExecutionPolicy Bypass -File scripts\start_photo_tryon_local.ps1
```

脚本会后台启动 `http://127.0.0.1:4173/` 和 `http://127.0.0.1:8765/`，并打印服务健康检查结果。如果只想打开静态页面，也可以单独运行：

```powershell
cd D:\美团\nail-tryon
python -m http.server 4173 --bind 127.0.0.1
```

浏览器打开：

```text
http://127.0.0.1:4173/
```

## ChatGPT Image 2 自动生成服务

静态网页可以独立运行；如需上传照片后的“自动 AI 生成 + 前后对比 + 下载 PNG”，另开一个 PowerShell 启动本机服务：

```powershell
cd D:\美团\nail-tryon
D:\nail-tryon-seg-venv\Scripts\python.exe -m pip install -r photo_tryon_service\requirements.txt
D:\nail-tryon-seg-venv\Scripts\python.exe -m uvicorn photo_tryon_service.server:app --host 127.0.0.1 --port 8765
```

上传手图并选择款式后，服务会保存内部调试文件：

```text
runs/photo-tryon/{jobId}/hand.png
runs/photo-tryon/{jobId}/style_reference.png
runs/photo-tryon/{jobId}/mask.png
runs/photo-tryon/{jobId}/quick_preview.png
runs/photo-tryon/{jobId}/prompt.txt
runs/photo-tryon/{jobId}/handoff.json
```

随后后端会用 Playwright 复用本地浏览器资料目录（默认 `%LOCALAPPDATA%\nail-tryon\chatgpt-profile`，可用 `CHATGPT_PROFILE_DIR` 覆盖）自动打开 ChatGPT、上传图片、提交生成指令、保存结果。首次使用若没有登录，页面只提示完成一次 ChatGPT 登录授权，登录后点击“我已登录，继续”即可。

如果设置了 `DEEPSEEK_API_KEY`，后端只会把款式元数据、阶段名、可见 UI 文本和错误信息发送给 DeepSeek 做 prompt/自动化恢复辅助，不上传用户手图。

本地 SDXL 作为二级兜底，服务默认查找模型：

```text
models/diffusion/sdxl-inpaint
```

如果模型目录不存在，服务仍会返回快速贴图预览，并在页面提示它不是 ChatGPT 生成图。模型文件体积较大，不进入 Git；下载或手动放入该目录后，可用 `qualityPreset=local_sdxl` 启用本地 inpainting。

## Nails343 训练数据

当前默认使用 Roboflow YOLO segmentation 结构：

```text
datasets/nails-seg/
  train/images
  train/labels
  valid/images
  valid/labels
  test/images
  test/labels
```

数据配置为：

```text
configs/nails343-seg.yaml
```

校验 YOLO segmentation 标签并导出随机可视化：

```powershell
python scripts\validate_nail_seg_dataset.py --dataset datasets\nails-seg --samples 100 --out runs\nails343-label-check
```

## 本机 YOLO-Seg 训练与导出

安装依赖：

```powershell
cd D:\美团\nail-tryon
python -m venv .venv-seg
.\.venv-seg\Scripts\python -m pip install --upgrade pip
.\.venv-seg\Scripts\python -m pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
.\.venv-seg\Scripts\python -m pip install -r scripts\requirements-segmentation.txt
```

训练默认 `yolo11n-seg.pt`：

```powershell
.\.venv-seg\Scripts\python scripts\train_nail_seg_yolo.py --data configs\nails343-seg.yaml --epochs 80 --batch 8 --device 0
```

RTX 3060 12GB 上实测 `batch=8, imgsz=640, yolo11n-seg` 训练显存约 `1.55GB`，按此档位可稳定控制在 `3GB` 以内。若其它程序同时占用显存，优先保持 `batch=8`，必要时把 `--imgsz` 降到 `512`。

离线预测检查：

```powershell
.\.venv-seg\Scripts\python scripts\predict_nail_seg_yolo.py --weights runs\nail-seg\yolo11n-seg-nails343\weights\best.pt --source assets\source-cache --device 0
```

导出前端模型和 metadata：

```powershell
.\.venv-seg\Scripts\python scripts\export_nail_seg_onnx.py --weights runs\nail-seg\yolo11n-seg-nails343\weights\best.pt
```

把训练模型用于款式素材抠甲：

```powershell
.\.venv-seg\Scripts\python scripts\prepare_nail_assets.py --seg-model runs\nail-seg\yolo11n-seg-nails343\weights\best.pt
```

## 静态检查

```powershell
node --check app.js
python scripts\check_tryon_assets.py
python -c "import ast,pathlib; [ast.parse(p.read_text(encoding='utf-8')) for p in pathlib.Path('scripts').glob('*.py')]"
```

## 参考效果标准

目标不是单纯 landmarks 贴图，而是“手部 ROI + 指甲实例分割 + 颜色/纹理/假甲材质 + 光照融合”。本项目按这个结构实现本地开源版本：MediaPipe 负责手部 ROI 和高频跟踪，YOLO-Seg 输出真实指甲 mask，Canvas 负责 PBR-like 合成。
