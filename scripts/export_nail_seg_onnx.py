from __future__ import annotations

import argparse
import json
import os
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Export a trained nail YOLO segmentation model to ONNX.")
    parser.add_argument("--weights", required=True, help="Path to best.pt or another trained checkpoint.")
    parser.add_argument("--imgsz", type=int, default=640, help="Export image size.")
    parser.add_argument("--opset", type=int, default=12, help="ONNX opset.")
    parser.add_argument("--out", default="models/nail-seg/yolo11n-seg-nails343.onnx", help="Stable output path for the web app.")
    return parser.parse_args()


def configure_local_ml_cache() -> None:
    app_dir = Path(__file__).resolve().parents[1]
    cache_dir = app_dir / ".cache"
    os.environ.setdefault("YOLO_CONFIG_DIR", str(cache_dir / "ultralytics"))
    os.environ.setdefault("MPLCONFIGDIR", str(cache_dir / "matplotlib"))
    Path(os.environ["YOLO_CONFIG_DIR"]).mkdir(parents=True, exist_ok=True)
    Path(os.environ["MPLCONFIGDIR"]).mkdir(parents=True, exist_ok=True)


def main() -> None:
    args = parse_args()
    configure_local_ml_cache()
    try:
        from ultralytics import YOLO
    except ImportError as error:
        raise SystemExit("Missing ultralytics. Install local segmentation dependencies first.") from error

    weights = Path(args.weights)
    if not weights.exists():
        raise SystemExit(f"Weights not found: {weights}")

    model = YOLO(str(weights))
    exported = Path(
        model.export(
            format="onnx",
            imgsz=args.imgsz,
            opset=args.opset,
            simplify=True,
            dynamic=False,
        )
    )
    output = Path(args.out)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(exported.read_bytes())
    metadata = {
        "name": output.stem,
        "version": f"local-export-{int(weights.stat().st_mtime)}",
        "model": f"./models/nail-seg/{output.name}",
        "inputName": "images",
        "inputSize": args.imgsz,
        "classNames": ["nail"],
        "confThreshold": 0.35,
        "iouThreshold": 0.45,
        "maskThreshold": 0.48,
        "maxDetections": 12,
        "staleAfterMs": 350,
        "videoIntervalMs": 260,
        "videoStaleAfterMs": 1600,
        "source": "local-yolo-seg",
    }
    (output.parent / "metadata.json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {output}")


if __name__ == "__main__":
    main()
