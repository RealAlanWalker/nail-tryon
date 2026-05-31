from __future__ import annotations

import argparse
import random
from pathlib import Path

from PIL import Image, ImageDraw


IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate YOLO segmentation labels for the nail dataset.")
    parser.add_argument("--dataset", default="datasets/nails-seg", help="YOLO dataset root; supports images/train or Roboflow train/images layouts.")
    parser.add_argument("--samples", type=int, default=100, help="Number of random labels to visualize/check.")
    parser.add_argument("--out", default="runs/nail-seg-label-check", help="Visualization output directory.")
    return parser.parse_args()


def matching_image(image_dir: Path, stem: str) -> Path | None:
    for ext in IMAGE_EXTS:
        candidate = image_dir / f"{stem}{ext}"
        if candidate.exists():
            return candidate
    return None


def discover_splits(dataset: Path) -> list[tuple[str, Path, Path]]:
    candidates = [
        ("train", dataset / "images" / "train", dataset / "labels" / "train"),
        ("val", dataset / "images" / "val", dataset / "labels" / "val"),
        ("test", dataset / "images" / "test", dataset / "labels" / "test"),
        ("train", dataset / "train" / "images", dataset / "train" / "labels"),
        ("valid", dataset / "valid" / "images", dataset / "valid" / "labels"),
        ("test", dataset / "test" / "images", dataset / "test" / "labels"),
    ]
    splits: list[tuple[str, Path, Path]] = []
    seen: set[Path] = set()
    for split, image_dir, label_dir in candidates:
        if label_dir.exists() and image_dir.exists() and label_dir not in seen:
            splits.append((split, image_dir, label_dir))
            seen.add(label_dir)
    return splits


def read_label(path: Path) -> tuple[int, int, int]:
    seg_lines = 0
    bbox_lines = 0
    bad_lines = 0
    for line in path.read_text(encoding="utf-8").splitlines():
        parts = line.strip().split()
        if not parts:
            continue
        try:
            cls = int(float(parts[0]))
            coords = [float(value) for value in parts[1:]]
        except ValueError:
            bad_lines += 1
            continue
        if cls != 0:
            bad_lines += 1
        if coords and any(value < 0 or value > 1 for value in coords):
            bad_lines += 1
        if len(coords) == 4:
            bbox_lines += 1
        elif len(coords) >= 6 and len(coords) % 2 == 0:
            seg_lines += 1
        else:
            bad_lines += 1
    return seg_lines, bbox_lines, bad_lines


def draw_label(image_path: Path, label_path: Path, output_path: Path) -> None:
    image = Image.open(image_path).convert("RGB")
    draw = ImageDraw.Draw(image, "RGBA")
    width, height = image.size
    for line in label_path.read_text(encoding="utf-8").splitlines():
        parts = line.strip().split()
        if len(parts) < 5:
            continue
        coords = [float(value) for value in parts[1:]]
        if len(coords) == 4:
            cx, cy, bw, bh = coords
            box = [
                (cx - bw / 2) * width,
                (cy - bh / 2) * height,
                (cx + bw / 2) * width,
                (cy + bh / 2) * height,
            ]
            draw.rectangle(box, outline=(255, 80, 80, 255), width=3)
        elif len(coords) >= 6 and len(coords) % 2 == 0:
            points = [(coords[i] * width, coords[i + 1] * height) for i in range(0, len(coords), 2)]
            draw.polygon(points, fill=(80, 255, 210, 72), outline=(80, 255, 210, 255))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(output_path)


def main() -> None:
    args = parse_args()
    dataset = Path(args.dataset)
    if not dataset.exists():
        raise SystemExit(f"Dataset root not found: {dataset}")

    label_paths: list[tuple[str, Path, Path]] = []
    for split, image_dir, label_dir in discover_splits(dataset):
        label_paths.extend((split, image_dir, path) for path in label_dir.glob("*.txt"))

    if not label_paths:
        raise SystemExit(f"No YOLO labels found under {dataset}")

    total_seg = total_bbox = total_bad = missing_images = 0
    for split, image_dir, label_path in label_paths:
        seg, bbox, bad = read_label(label_path)
        total_seg += seg
        total_bbox += bbox
        total_bad += bad
        if matching_image(image_dir, label_path.stem) is None:
            missing_images += 1

    sample_items = random.sample(label_paths, min(args.samples, len(label_paths)))
    for split, image_dir, label_path in sample_items:
        image_path = matching_image(image_dir, label_path.stem)
        if image_path:
            draw_label(image_path, label_path, Path(args.out) / split / f"{label_path.stem}.jpg")

    print(f"labels={len(label_paths)} segmentation_instances={total_seg} bbox_instances={total_bbox} bad_lines={total_bad}")
    print(f"missing_images={missing_images} visualizations={len(sample_items)} out={args.out}")
    if total_bad or missing_images:
        raise SystemExit(2)
    if total_bbox and not total_seg:
        raise SystemExit("Dataset appears to be bbox-only; run pseudo-mask conversion before YOLO-Seg training.")


if __name__ == "__main__":
    main()
