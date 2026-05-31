# Nail Segmentation Model Slot

Expected browser model:

```text
models/nail-seg/yolo11n-seg-nails343.onnx
models/nail-seg/metadata.json
```

The web app already loads `metadata.json` and attempts to create an ONNX Runtime Web session. If the `.onnx` file is absent, it reports a basic-fit state and falls back to MediaPipe landmark masks.

Create/update both files with:

```powershell
python scripts\export_nail_seg_onnx.py --weights runs\nail-seg\yolo11n-seg-nails343\weights\best.pt
```
