from __future__ import annotations

import argparse
import os
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train a local YOLO segmentation model for nail instance masks.")
    parser.add_argument("--data", default="configs/nails343-seg.yaml", help="YOLO dataset YAML.")
    parser.add_argument("--model", default="yolo11n-seg.pt", help="Ultralytics segmentation checkpoint.")
    parser.add_argument("--imgsz", type=int, default=640, help="Training image size.")
    parser.add_argument("--epochs", type=int, default=80, help="Training epochs.")
    parser.add_argument("--batch", type=int, default=8, help="Training batch size. Keep at 8 to stay under 3GB VRAM on RTX 3060.")
    parser.add_argument("--device", default="0", help="CUDA device, CPU, or mps.")
    parser.add_argument("--workers", type=int, default=4, help="DataLoader workers.")
    parser.add_argument("--project", default="runs/nail-seg", help="Output project directory.")
    parser.add_argument("--name", default="yolo11n-seg-nails343", help="Run name.")
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
        raise SystemExit(
            "Missing ultralytics. Create a local venv and install the segmentation dependencies first. "
            "See README.md section '本机指甲实例分割'."
        ) from error

    data_path = Path(args.data)
    if not data_path.exists():
        raise SystemExit(f"Dataset YAML not found: {data_path}")
    data_path = data_path.resolve()

    project_path = Path(args.project)
    if not project_path.is_absolute():
        project_path = (Path.cwd() / project_path).resolve()

    model = YOLO(args.model)
    model.train(
        data=str(data_path),
        task="segment",
        imgsz=args.imgsz,
        epochs=args.epochs,
        batch=args.batch,
        device=args.device,
        project=str(project_path),
        name=args.name,
        workers=args.workers,
        patience=24,
        cos_lr=True,
        close_mosaic=10,
        degrees=8,
        translate=0.08,
        scale=0.42,
        fliplr=0.5,
        hsv_h=0.015,
        hsv_s=0.28,
        hsv_v=0.22,
        plots=True,
    )


if __name__ == "__main__":
    main()
