from __future__ import annotations

import argparse
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run local nail instance segmentation and save visual checks.")
    parser.add_argument("--weights", required=True, help="Path to trained YOLO segmentation weights.")
    parser.add_argument("--source", required=True, help="Image, directory, or glob to test.")
    parser.add_argument("--imgsz", type=int, default=640, help="Prediction image size.")
    parser.add_argument("--conf", type=float, default=0.35, help="Confidence threshold.")
    parser.add_argument("--device", default="0", help="CUDA device, CPU, or mps.")
    parser.add_argument("--project", default="runs/nail-seg-predict", help="Output directory.")
    parser.add_argument("--name", default="visual-check", help="Run name.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    try:
        from ultralytics import YOLO
    except ImportError as error:
        raise SystemExit("Missing ultralytics. Install local segmentation dependencies first.") from error

    weights = Path(args.weights)
    if not weights.exists():
        raise SystemExit(f"Weights not found: {weights}")

    model = YOLO(str(weights))
    model.predict(
        source=args.source,
        task="segment",
        imgsz=args.imgsz,
        conf=args.conf,
        device=args.device,
        save=True,
        save_txt=True,
        save_conf=True,
        retina_masks=True,
        project=args.project,
        name=args.name,
    )


if __name__ == "__main__":
    main()
