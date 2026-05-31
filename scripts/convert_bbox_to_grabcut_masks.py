from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image


IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Convert YOLO bbox labels to coarse YOLO segmentation masks with GrabCut.")
    parser.add_argument("--dataset", default="datasets/nails-seg", help="Dataset root.")
    parser.add_argument("--overwrite", action="store_true", help="Overwrite label files in place.")
    parser.add_argument("--out", default="datasets/nails-seg-pseudo", help="Output dataset root when not overwriting.")
    return parser.parse_args()


def matching_image(dataset: Path, split: str, stem: str) -> Path | None:
    for ext in IMAGE_EXTS:
        candidate = dataset / "images" / split / f"{stem}{ext}"
        if candidate.exists():
            return candidate
    return None


def bbox_to_polygon(image_path: Path, bbox: list[float]) -> list[tuple[float, float]]:
    try:
        import cv2
    except ImportError as error:
        raise SystemExit("Missing opencv-python. Install scripts/requirements-segmentation.txt first.") from error

    image = np.asarray(Image.open(image_path).convert("RGB"))
    height, width = image.shape[:2]
    cx, cy, bw, bh = bbox
    x0 = max(0, int((cx - bw / 2) * width))
    y0 = max(0, int((cy - bh / 2) * height))
    x1 = min(width - 1, int((cx + bw / 2) * width))
    y1 = min(height - 1, int((cy + bh / 2) * height))
    if x1 <= x0 or y1 <= y0:
        return []

    rect_pad = max(2, int(min(x1 - x0, y1 - y0) * 0.08))
    rect = (x0 + rect_pad, y0 + rect_pad, max(2, x1 - x0 - rect_pad * 2), max(2, y1 - y0 - rect_pad * 2))
    mask = np.zeros((height, width), dtype=np.uint8)
    bgd = np.zeros((1, 65), dtype=np.float64)
    fgd = np.zeros((1, 65), dtype=np.float64)
    cv2.grabCut(image, mask, rect, bgd, fgd, 4, cv2.GC_INIT_WITH_RECT)
    fg = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    fg[:y0, :] = 0
    fg[y1:, :] = 0
    fg[:, :x0] = 0
    fg[:, x1:] = 0
    contours, _ = cv2.findContours(fg, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return []
    contour = max(contours, key=cv2.contourArea)
    epsilon = max(1.0, cv2.arcLength(contour, True) * 0.012)
    approx = cv2.approxPolyDP(contour, epsilon, True).reshape(-1, 2)
    if len(approx) < 3:
        return []
    return [(float(x) / width, float(y) / height) for x, y in approx]


def convert_label(dataset: Path, split: str, label_path: Path) -> list[str]:
    image_path = matching_image(dataset, split, label_path.stem)
    if image_path is None:
        return label_path.read_text(encoding="utf-8").splitlines()
    converted: list[str] = []
    for line in label_path.read_text(encoding="utf-8").splitlines():
        parts = line.strip().split()
        if len(parts) != 5:
            converted.append(line)
            continue
        cls = parts[0]
        bbox = [float(value) for value in parts[1:]]
        polygon = bbox_to_polygon(image_path, bbox)
        if not polygon:
            converted.append(line)
            continue
        coords = " ".join(f"{value:.6f}" for point in polygon for value in point)
        converted.append(f"{cls} {coords}")
    return converted


def main() -> None:
    args = parse_args()
    dataset = Path(args.dataset)
    output_root = dataset if args.overwrite else Path(args.out)
    converted_files = 0

    for split in ("train", "val", "test"):
        label_dir = dataset / "labels" / split
        if not label_dir.exists():
            continue
        for label_path in label_dir.glob("*.txt"):
            converted = convert_label(dataset, split, label_path)
            target = output_root / "labels" / split / label_path.name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text("\n".join(converted) + "\n", encoding="utf-8")
            if not args.overwrite:
                image = matching_image(dataset, split, label_path.stem)
                if image:
                    image_target = output_root / "images" / split / image.name
                    image_target.parent.mkdir(parents=True, exist_ok=True)
                    image_target.write_bytes(image.read_bytes())
            converted_files += 1
    print(f"converted label files={converted_files} output={output_root}")


if __name__ == "__main__":
    main()
