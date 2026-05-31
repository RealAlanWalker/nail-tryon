# AI 美甲 AR 试穿用户端

静态 Web AR 原型，支持上传手图和摄像头试穿。当前架构是 `MediaPipe Hand Landmarker + Nails343/YOLO-Seg 指甲实例分割 + Canvas 真实感合成`：有本地 ONNX 指甲分割模型时使用像素级 mask；模型缺失或加载失败时自动回退 landmarks 程序甲形，页面不会白屏。

## 当前能力

- 自动手部定位：MediaPipe 输出 21 个手部关键点，前端计算 5 个指甲 anchor。
- 本地 ONNX 分割入口：`vendor/onnxruntime-web/` 已 vendor，读取 `models/nail-seg/metadata.json` 和 `yolo11n-seg-nails343.onnx`。
- 真实感合成：Canvas 根据真实/回退 mask 绘制颜色、纹理、根部阴影、边缘 feather、方向高光、金属/亮片/果冻 finish。
- 款式素材 schema：`assets/nail-assets/styles.json` 已扩展为每指 `image + mask + bbox + confidence + finish`。
- 开源兜底：没有 ONNX 模型或模型加载失败时，仍可用基础贴合演示。

## 本地运行

```powershell
cd D:\美团\nail-tryon
python -m http.server 4173 --bind 127.0.0.1
```

浏览器打开：

```text
http://127.0.0.1:4173/
```

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
