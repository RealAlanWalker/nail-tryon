from __future__ import annotations

import argparse
import json
import math
import os
import subprocess
import urllib.request
from collections import deque
from pathlib import Path

import numpy as np
try:
    import pandas as pd
except ImportError:
    pd = None
from PIL import Image, ImageDraw, ImageFilter, ImageOps


FINGERS = ["thumb", "index", "middle", "ring", "pinky"]
FINGER_ASPECTS = {
    "thumb": (148, 216),
    "index": (132, 248),
    "middle": (136, 260),
    "ring": (130, 244),
    "pinky": (116, 218),
}
METALLIC_STYLES = {5, 10, 14, 17, 19, 23}
SHIMMER_STYLES = {1, 3, 8, 11, 25}
JELLY_STYLES = {7, 9, 13, 21, 24}
COMPLEX_STYLES = METALLIC_STYLES | SHIMMER_STYLES | {20}
ALLOW_EXTENSION_STYLES = {6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 19, 20, 23}


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def fetch_image(url: str, cache_dir: Path, index: int) -> Path:
    suffix = ".jpg" if url.lower().split("?")[0].endswith((".jpg", ".jpeg")) else ".png"
    output = cache_dir / f"style_{index:02d}{suffix}"
    if output.exists() and output.stat().st_size > 0:
        return output


def find_cached_style_image(cache_dir: Path, style_id: int) -> Path:
    candidates = sorted(cache_dir.glob(f"style_{style_id:02d}.*"))
    for candidate in candidates:
        if "_original" in candidate.stem:
            continue
        if candidate.is_file() and candidate.stat().st_size > 0:
            return candidate
    raise SystemExit(
        f"Missing cached image for style {style_id:02d}. "
        "Install pandas/openpyxl to read the workbook, or keep assets/source-cache populated."
    )

    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.build_opener(urllib.request.ProxyHandler({})).open(request, timeout=25) as response:
            output.write_bytes(response.read())
            return output
    except Exception:
        subprocess.run(
            ["curl.exe", "-L", "--fail", "--retry", "2", "-o", str(output), url],
            check=True,
            timeout=90,
        )
        return output


def configure_local_ml_cache() -> None:
    app_dir = Path(__file__).resolve().parents[1]
    cache_dir = app_dir / ".cache"
    os.environ.setdefault("YOLO_CONFIG_DIR", str(cache_dir / "ultralytics"))
    os.environ.setdefault("MPLCONFIGDIR", str(cache_dir / "matplotlib"))
    Path(os.environ["YOLO_CONFIG_DIR"]).mkdir(parents=True, exist_ok=True)
    Path(os.environ["MPLCONFIGDIR"]).mkdir(parents=True, exist_ok=True)


def largest_components(mask: np.ndarray, limit: int = 5) -> list[tuple[int, int, int, int]]:
    height, width = mask.shape
    seen = np.zeros_like(mask, dtype=bool)
    components: list[tuple[int, int, int, int, int]] = []
    min_area = max(90, int(height * width * 0.0018))

    for y in range(height):
        for x in range(width):
            if not mask[y, x] or seen[y, x]:
                continue
            queue = deque([(x, y)])
            seen[y, x] = True
            area = 0
            min_x = max_x = x
            min_y = max_y = y
            while queue:
                cx, cy = queue.popleft()
                area += 1
                min_x = min(min_x, cx)
                max_x = max(max_x, cx)
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < width and 0 <= ny < height and mask[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        queue.append((nx, ny))
            box_w = max_x - min_x + 1
            box_h = max_y - min_y + 1
            if area >= min_area and box_w >= 10 and box_h >= 10:
                components.append((area, min_x, min_y, max_x + 1, max_y + 1))

    components.sort(reverse=True)
    return [(x0, y0, x1, y1) for _, x0, y0, x1, y1 in components[:limit]]


def component_stats(mask: np.ndarray, min_area: int = 3, max_area: int | None = None) -> list[dict[str, float]]:
    height, width = mask.shape
    seen = np.zeros_like(mask, dtype=bool)
    components: list[dict[str, float]] = []

    for y in range(height):
        for x in range(width):
            if not mask[y, x] or seen[y, x]:
                continue
            queue = deque([(x, y)])
            seen[y, x] = True
            area = 0
            sum_x = 0.0
            sum_y = 0.0
            min_x = max_x = x
            min_y = max_y = y
            while queue:
                cx, cy = queue.popleft()
                area += 1
                sum_x += cx
                sum_y += cy
                min_x = min(min_x, cx)
                max_x = max(max_x, cx)
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < width and 0 <= ny < height and mask[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        queue.append((nx, ny))
            if area >= min_area and (max_area is None or area <= max_area):
                components.append(
                    {
                        "area": float(area),
                        "x0": float(min_x),
                        "y0": float(min_y),
                        "x1": float(max_x + 1),
                        "y1": float(max_y + 1),
                        "cx": sum_x / area,
                        "cy": sum_y / area,
                    }
                )
    return components


def estimate_foreground_mask(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    arr = np.asarray(rgba)
    rgb = arr[:, :, :3].astype(np.float32)
    alpha = arr[:, :, 3]

    if alpha.min() < 245:
        mask = alpha > 18
    else:
        edges = np.concatenate([rgb[0, :, :], rgb[-1, :, :], rgb[:, 0, :], rgb[:, -1, :]], axis=0)
        bg = np.median(edges, axis=0)
        color_distance = np.linalg.norm(rgb - bg, axis=2)
        max_channel = rgb.max(axis=2)
        min_channel = rgb.min(axis=2)
        saturation = (max_channel - min_channel) / np.maximum(max_channel, 1)
        brightness = rgb.mean(axis=2)
        mask = (color_distance > 28) | ((saturation > 0.12) & (brightness < 246))
        border = max(2, min(mask.shape) // 60)
        mask[:border, :] = False
        mask[-border:, :] = False
        mask[:, :border] = False
        mask[:, -border:] = False

    mask_img = Image.fromarray((mask.astype(np.uint8) * 255), "L")
    mask_img = mask_img.filter(ImageFilter.MedianFilter(size=5))
    mask_img = mask_img.filter(ImageFilter.GaussianBlur(radius=1.3))
    return mask_img.point(lambda value: 255 if value > 44 else 0)


def image_arrays(image: Image.Image) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    rgb = np.asarray(image.convert("RGB")).astype(np.float32)
    red = rgb[:, :, 0]
    green = rgb[:, :, 1]
    blue = rgb[:, :, 2]
    max_channel = rgb.max(axis=2)
    min_channel = rgb.min(axis=2)
    saturation = (max_channel - min_channel) / np.maximum(max_channel, 1)
    brightness = rgb.mean(axis=2)
    return rgb, red, green, blue, saturation, brightness


def estimate_skin_mask(rgb: np.ndarray, saturation: np.ndarray, brightness: np.ndarray) -> np.ndarray:
    red = rgb[:, :, 0]
    green = rgb[:, :, 1]
    blue = rgb[:, :, 2]
    return (
        (red > 115)
        & (green > 70)
        & (blue > 48)
        & ((red - green) > 4)
        & ((green - blue) > -6)
        & ((red - blue) > 16)
        & (saturation > 0.045)
        & (saturation < 0.44)
        & (brightness < 242)
    )


def estimate_background_mask(rgb: np.ndarray) -> np.ndarray:
    edges = np.concatenate([rgb[0, :, :], rgb[-1, :, :], rgb[:, 0, :], rgb[:, -1, :]], axis=0)
    bg = np.median(edges, axis=0)
    return np.linalg.norm(rgb - bg, axis=2) < 26


def local_fraction(mask: np.ndarray, cx: float, cy: float, radius: float) -> float:
    height, width = mask.shape
    x0 = max(0, int(cx - radius))
    x1 = min(width, int(cx + radius))
    y0 = max(0, int(cy - radius))
    y1 = min(height, int(cy + radius))
    if x1 <= x0 or y1 <= y0:
        return 0.0
    return float(mask[y0:y1, x0:x1].mean())


def cluster_seeds(seeds: list[dict[str, float]], min_distance: float, limit: int) -> list[dict[str, float]]:
    accepted: list[dict[str, float]] = []
    for seed in sorted(seeds, key=lambda item: item["score"], reverse=True):
        if all(math.hypot(seed["cx"] - other["cx"], seed["cy"] - other["cy"]) >= min_distance for other in accepted):
            accepted.append(seed)
        if len(accepted) >= limit:
            break
    return accepted


def pca_angle(mask: np.ndarray, cx: float, cy: float, radius: float) -> float:
    height, width = mask.shape
    x0 = max(0, int(cx - radius))
    x1 = min(width, int(cx + radius))
    y0 = max(0, int(cy - radius))
    y1 = min(height, int(cy + radius))
    yy, xx = np.nonzero(mask[y0:y1, x0:x1])
    if len(xx) < 30:
        return 0.0
    coords = np.column_stack([xx + x0 - cx, yy + y0 - cy]).astype(np.float32)
    covariance = np.cov(coords, rowvar=False)
    values, vectors = np.linalg.eigh(covariance)
    vector = vectors[:, int(np.argmax(values))]
    angle = math.degrees(math.atan2(float(vector[1]), float(vector[0])))
    return angle


def rotated_crop(image: Image.Image, cx: float, cy: float, angle: float, crop_w: int, crop_h: int) -> Image.Image:
    square = int(max(crop_w, crop_h) * 1.8)
    x0 = int(round(cx - square / 2))
    y0 = int(round(cy - square / 2))
    patch = Image.new("RGBA", (square, square), (0, 0, 0, 0))
    source = image.convert("RGBA")
    crop = source.crop((x0, y0, x0 + square, y0 + square))
    paste_x = max(0, -x0)
    paste_y = max(0, -y0)
    patch.alpha_composite(crop, (paste_x, paste_y))
    # PCA gives the long finger direction. Rotate it upright before taking a nail-sized crop.
    rotation = 90 - angle
    patch = patch.rotate(rotation, resample=Image.Resampling.BICUBIC, center=(square / 2, square / 2))
    left = int(round((square - crop_w) / 2))
    top = int(round((square - crop_h) / 2))
    return trim_transparent(patch.crop((left, top, left + crop_w, top + crop_h)))


def extract_nail_patches(image: Image.Image) -> list[Image.Image]:
    rgb, _, _, _, saturation, brightness = image_arrays(image)
    height, width = brightness.shape
    min_side = min(width, height)
    bg_mask = estimate_background_mask(rgb)
    skin_mask = estimate_skin_mask(rgb, saturation, brightness)
    dilated_skin = np.asarray(
        Image.fromarray((skin_mask.astype(np.uint8) * 255), "L").filter(ImageFilter.MaxFilter(25))
    ) > 0

    foreground = ~bg_mask
    if foreground.mean() < 0.12:
        foreground = np.ones_like(bg_mask, dtype=bool)

    skin_pixels = rgb[skin_mask]
    skin_color = np.median(skin_pixels, axis=0) if len(skin_pixels) else np.median(rgb.reshape(-1, 3), axis=0)
    skin_distance = np.linalg.norm(rgb - skin_color, axis=2)

    bright_threshold = max(218.0, float(np.percentile(brightness[dilated_skin], 95.2)) if dilated_skin.any() else 225.0)
    highlight_mask = foreground & dilated_skin & (brightness > bright_threshold) & (saturation < 0.24)
    color_mask = foreground & dilated_skin & (skin_distance > 28) & (brightness > 55) & (saturation > 0.05)

    seeds: list[dict[str, float]] = []
    local_radius = max(42, min_side * 0.078)
    edge_margin = max(34, min_side * 0.045)

    def is_edge_or_wrist_seed(cx: float, cy: float) -> bool:
        return (
            cx > width - edge_margin
            or cy > height - edge_margin
            or (cx > width * 0.82 and cy > height * 0.60)
        )

    for component in component_stats(highlight_mask, min_area=3, max_area=int(min_side * min_side * 0.0014)):
        if is_edge_or_wrist_seed(component["cx"], component["cy"]):
            continue
        skin_near = local_fraction(skin_mask, component["cx"], component["cy"], local_radius)
        fg_near = local_fraction(foreground, component["cx"], component["cy"], local_radius)
        bg_near = local_fraction(bg_mask, component["cx"], component["cy"], local_radius * 0.68)
        if skin_near < 0.22 or fg_near < 0.42 or bg_near > 0.46:
            continue
        seeds.append(
            {
                "cx": component["cx"],
                "cy": component["cy"],
                "score": 1.4 + skin_near * 1.4 + (1 - bg_near) * 0.9 + min(component["area"] / 90, 1.0),
                "kind": 1.0,
            }
        )

    for component in component_stats(color_mask, min_area=max(18, int(min_side * min_side * 0.00006)), max_area=int(min_side * min_side * 0.018)):
        if is_edge_or_wrist_seed(component["cx"], component["cy"]):
            continue
        box_w = component["x1"] - component["x0"]
        box_h = component["y1"] - component["y0"]
        if box_w < 6 or box_h < 6 or box_w > width * 0.36 or box_h > height * 0.32:
            continue
        skin_near = local_fraction(skin_mask, component["cx"], component["cy"], local_radius)
        bg_near = local_fraction(bg_mask, component["cx"], component["cy"], local_radius * 0.68)
        if skin_near < 0.18 or bg_near > 0.54:
            continue
        seeds.append(
            {
                "cx": component["cx"],
                "cy": component["cy"],
                "score": 3.0 + skin_near * 1.4 + (1 - bg_near) * 1.2 + min(component["area"] / 700, 1.5),
                "kind": 0.0,
            }
        )

    seeds = cluster_seeds(seeds, min_distance=max(34, min_side * 0.052), limit=10)
    crop_h = int(clamp(min_side * 0.135, 78, 150))
    crop_w = int(crop_h * 0.66)
    patches: list[Image.Image] = []
    for seed in seeds:
        angle = pca_angle(dilated_skin, seed["cx"], seed["cy"], max(crop_h * 0.72, 70))
        patch = rotated_crop(image, seed["cx"], seed["cy"], angle, crop_w, crop_h)
        if patch.width >= 14 and patch.height >= 18:
            patches.append(patch)
    return patches


def extract_color_cluster_patches(image: Image.Image) -> list[dict[str, object]]:
    rgb, _, _, _, saturation, brightness = image_arrays(image)
    height, width = brightness.shape
    min_side = min(width, height)
    bg_mask = estimate_background_mask(rgb)
    skin_mask = estimate_skin_mask(rgb, saturation, brightness)
    dilated_skin = np.asarray(
        Image.fromarray((skin_mask.astype(np.uint8) * 255), "L").filter(ImageFilter.MaxFilter(35))
    ) > 0

    skin_pixels = rgb[skin_mask]
    skin_color = np.median(skin_pixels, axis=0) if len(skin_pixels) else np.median(rgb.reshape(-1, 3), axis=0)
    skin_distance = np.linalg.norm(rgb - skin_color, axis=2)
    foreground = ~bg_mask
    polish_mask = (
        foreground
        & dilated_skin
        & (skin_distance > 22)
        & (brightness > 42)
        & (brightness < 252)
        & ((saturation > 0.065) | (brightness > 206))
    )

    patches: list[dict[str, object]] = []
    max_area = int(min_side * min_side * 0.024)
    for component in component_stats(polish_mask, min_area=max(22, int(min_side * min_side * 0.00007)), max_area=max_area):
        box_w = component["x1"] - component["x0"]
        box_h = component["y1"] - component["y0"]
        if box_w < 8 or box_h < 10 or box_w > width * 0.34 or box_h > height * 0.32:
            continue
        skin_near = local_fraction(skin_mask, component["cx"], component["cy"], max(40, min_side * 0.078))
        bg_near = local_fraction(bg_mask, component["cx"], component["cy"], max(28, min_side * 0.052))
        if skin_near < 0.16 or bg_near > 0.58:
            continue
        x0, y0, x1, y1 = expand_box(
            (int(component["x0"]), int(component["y0"]), int(component["x1"]), int(component["y1"])),
            image.size,
            padding=0.18,
        )
        crop = image.convert("RGBA").crop((x0, y0, x1, y1))
        crop_mask = Image.fromarray((polish_mask.astype(np.uint8) * 255), "L").crop((x0, y0, x1, y1))
        crop_mask = crop_mask.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(radius=1.2))
        crop.putalpha(crop_mask)
        crop = trim_transparent(crop)
        if crop.width < 14 or crop.height < 20:
            continue
        confidence = clamp(0.34 + skin_near * 0.26 + (1 - bg_near) * 0.16, 0.34, 0.68)
        patches.append(
            {
                "image": crop,
                "confidence": float(confidence),
                "bbox": [int(x0), int(y0), int(x1), int(y1)],
                "source": "cluster",
            }
        )
    patches.sort(key=lambda item: float(item["confidence"]), reverse=True)
    return patches[:10]


def fallback_polish_patch(image: Image.Image) -> Image.Image:
    rgb, _, _, _, saturation, brightness = image_arrays(image)
    skin_mask = estimate_skin_mask(rgb, saturation, brightness)
    skin_pixels = rgb[skin_mask]
    skin_color = np.median(skin_pixels, axis=0) if len(skin_pixels) else np.median(rgb.reshape(-1, 3), axis=0)
    skin_distance = np.linalg.norm(rgb - skin_color, axis=2)
    polish = (skin_distance > 24) & (brightness > 60) & (brightness < 250)
    if polish.sum() < 120:
        polish = (brightness > np.percentile(brightness, 68)) & (saturation < 0.32)
    color = np.median(rgb[polish], axis=0) if polish.any() else np.array([218, 170, 150], dtype=np.float32)
    base = tuple(int(clamp(value, 0, 255)) for value in color)
    width, height = 180, 260
    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas, "RGBA")
    for y in range(height):
        t = y / max(1, height - 1)
        shade = 1.12 - t * 0.28
        rgb_row = tuple(int(clamp(channel * shade + 255 * (1 - shade) * 0.08, 0, 255)) for channel in base)
        draw.line([(0, y), (width, y)], fill=(*rgb_row, 255))
    draw.ellipse((width * 0.25, height * 0.08, width * 0.52, height * 0.55), fill=(255, 255, 255, 58))
    draw.rounded_rectangle((width * 0.54, height * 0.18, width * 0.63, height * 0.68), radius=9, fill=(255, 255, 255, 42))
    canvas.putalpha(make_nail_mask((width, height)))
    return canvas


def load_segmentation_model(model_path: str | None):
    if not model_path:
        return None
    configure_local_ml_cache()
    try:
        from ultralytics import YOLO
    except ImportError as error:
        raise SystemExit("Missing ultralytics. Install scripts/requirements-segmentation.txt before using --seg-model.") from error
    model = YOLO(model_path)
    return model


def extract_nail_patches_with_segmentation(
    image: Image.Image,
    model,
    *,
    device: str = "cpu",
    confidence: float = 0.2,
) -> list[dict[str, object]]:
    if model is None:
        return []
    rgb = np.asarray(image.convert("RGB"))
    result = model.predict(
        rgb,
        task="segment",
        imgsz=640,
        conf=confidence,
        retina_masks=True,
        device=device,
        verbose=False,
    )[0]
    if result.masks is None or result.boxes is None:
        return []

    masks = result.masks.data.cpu().numpy()
    boxes = result.boxes.xyxy.cpu().numpy()
    confidences = result.boxes.conf.cpu().numpy()
    image_w, image_h = image.size
    patches: list[dict[str, object]] = []
    for mask, box, confidence in sorted(zip(masks, boxes, confidences), key=lambda item: float(item[2]), reverse=True):
        if mask.shape != (image_h, image_w):
            mask_img = Image.fromarray((mask * 255).astype(np.uint8), "L").resize((image_w, image_h), Image.Resampling.BILINEAR)
        else:
            mask_img = Image.fromarray((mask * 255).astype(np.uint8), "L")
        mask_img = mask_img.filter(ImageFilter.GaussianBlur(radius=0.8)).point(lambda value: 255 if value > 88 else 0)
        bbox = mask_img.getbbox()
        if not bbox:
            continue
        x0, y0, x1, y1 = expand_box(bbox, image.size, padding=0.12)
        crop = image.convert("RGBA").crop((x0, y0, x1, y1))
        crop_mask = mask_img.crop((x0, y0, x1, y1)).filter(ImageFilter.GaussianBlur(radius=1.1))
        crop.putalpha(crop_mask)
        crop = trim_transparent(crop)
        if crop.width < 14 or crop.height < 20:
            continue
        patches.append(
            {
                "image": crop,
                "confidence": float(confidence),
                "bbox": [int(v) for v in box.tolist()],
                "source": "seg",
            }
        )
    return patches[:10]


def component_image(component) -> Image.Image:
    return component["image"] if isinstance(component, dict) else component


def component_confidence(component) -> float:
    return float(component.get("confidence", 0.55)) if isinstance(component, dict) else 0.55


def component_source(component) -> str:
    return str(component.get("source", "heuristic")) if isinstance(component, dict) else "heuristic"


def component_bbox(component) -> list[int] | None:
    if isinstance(component, dict) and component.get("bbox"):
        return list(component["bbox"])
    return None


def component_aspect(component) -> float:
    image = component_image(component)
    return image.height / max(1, image.width)


def wrap_component(image: Image.Image, source: str, confidence: float, bbox: list[int] | None = None) -> dict[str, object]:
    return {
        "image": image,
        "confidence": confidence,
        "bbox": bbox,
        "source": source,
    }


def assess_asset_quality(style_id: int, components: list[object], stats: dict[str, object], finish: str) -> dict[str, object]:
    sources = [component_source(component) for component in components[:5]]
    confidences = [component_confidence(component) for component in components[:5]]
    aspects = [component_aspect(component) for component in components[:5]]
    source_counts = {source: sources.count(source) for source in sorted(set(sources))}
    confidence = float(np.median(confidences)) if confidences else 0.0
    aspect_median = float(np.median(aspects)) if aspects else 0.0
    aspect_std = float(np.std(aspects)) if len(aspects) > 1 else 0.0
    heuristic_count = source_counts.get("heuristic", 0) + source_counts.get("fallback", 0)
    heuristic_ratio = heuristic_count / max(1, len(sources))
    complex_style = style_id in COMPLEX_STYLES or finish in {"metallic", "shimmer"}
    reasons: list[str] = []
    if confidence < 0.58:
        reasons.append("low_confidence")
    if heuristic_ratio >= 0.4:
        reasons.append("heuristic_source")
    if aspect_std > 0.24:
        reasons.append("unstable_aspect")
    if complex_style:
        reasons.append("complex_finish")
    coverage = float(stats.get("coverage", 0))
    if coverage < 0.36 or coverage > 0.88:
        reasons.append("coverage_outlier")
    needs_review = ("low_confidence" in reasons or "heuristic_source" in reasons or "unstable_aspect" in reasons) and complex_style
    return {
        "sourceCounts": source_counts,
        "confidence": round(confidence, 4),
        "coverage": round(coverage, 4),
        "aspectMedian": round(aspect_median, 4),
        "aspectStd": round(aspect_std, 4),
        "heuristicRatio": round(heuristic_ratio, 4),
        "complexStyle": bool(complex_style),
        "needsReview": bool(needs_review),
        "reasons": reasons,
    }


def alpha_width_profile(image: Image.Image) -> dict[str, object]:
    alpha = np.asarray(image.convert("RGBA").getchannel("A")) > 24
    yy, xx = np.nonzero(alpha)
    if len(xx) < 12:
        return {
            "aspectRatio": 1.5,
            "tipSharpness": 0.2,
            "rootWidthRatio": 0.78,
            "maxWidthPosition": 0.62,
            "sideTaper": 0.12,
            "coverage": 0.0,
            "rootY": 0.92,
            "tipY": 0.08,
            "rootCenterX": 0.5,
            "bedLengthRatio": 0.84,
        }
    x0, x1 = int(xx.min()), int(xx.max()) + 1
    y0, y1 = int(yy.min()), int(yy.max()) + 1
    cropped = alpha[y0:y1, x0:x1]
    height, width = cropped.shape
    widths = np.zeros(height, dtype=np.float32)
    centers = np.full(height, 0.5, dtype=np.float32)
    for row in range(height):
        xs = np.nonzero(cropped[row])[0]
        if len(xs):
            widths[row] = (xs.max() - xs.min() + 1) / max(1, width)
            centers[row] = float((xs.max() + xs.min()) / 2 / max(1, width - 1))
    nonzero = widths > 0
    if not nonzero.any():
        nonzero = np.ones_like(widths, dtype=bool)
    max_width = float(widths.max()) or 1.0
    root_start = max(0, int(height * 0.72))
    tip_end = max(1, int(height * 0.22))
    root_width = float(np.median(widths[root_start:][widths[root_start:] > 0])) if (widths[root_start:] > 0).any() else max_width
    tip_width = float(np.median(widths[:tip_end][widths[:tip_end] > 0])) if (widths[:tip_end] > 0).any() else 0.0
    max_pos = float(np.argmax(widths) / max(1, height - 1))
    root_rows = np.where(widths >= max_width * 0.35)[0]
    root_row = int(root_rows.max()) if len(root_rows) else height - 1
    tip_row = int(root_rows.min()) if len(root_rows) else 0
    return {
        "aspectRatio": round(float(height / max(1, width)), 4),
        "tipSharpness": round(float(clamp(1 - tip_width / max_width, 0, 1)), 4),
        "rootWidthRatio": round(float(clamp(root_width / max_width, 0, 1.4)), 4),
        "maxWidthPosition": round(max_pos, 4),
        "sideTaper": round(float(clamp((max_width - root_width) / max_width, -0.4, 1)), 4),
        "coverage": round(float(cropped.mean()), 4),
        "rootY": round(float((root_row + y0) / max(1, image.height - 1)), 4),
        "tipY": round(float((tip_row + y0) / max(1, image.height - 1)), 4),
        "rootCenterX": round(float(clamp(centers[root_row], 0, 1)), 4),
        "bedLengthRatio": round(float(clamp((root_row - tip_row + 1) / max(1, height), 0, 1)), 4),
    }


def infer_shape_from_metrics(metrics: dict[str, object], confidence: float) -> tuple[str, float]:
    aspect = float(metrics.get("aspectRatio", 1.5))
    tip = float(metrics.get("tipSharpness", 0.2))
    root_width = float(metrics.get("rootWidthRatio", 0.78))
    max_pos = float(metrics.get("maxWidthPosition", 0.62))
    taper = float(metrics.get("sideTaper", 0.12))
    score = clamp(confidence, 0.18, 0.95)
    # Shape is inferred from the transparent material contour only.  Manual config
    # may allow extension, but it must not overwrite these contour decisions.
    if aspect >= 1.12 and (
        (tip >= 0.46 and root_width <= 0.72)
        or (tip >= 0.36 and taper >= 0.34)
        or (taper >= 0.54 and root_width <= 0.62)
    ):
        return "almond", round(score * 0.92, 4)
    if aspect >= 1.18 and (tip >= 0.22 or taper >= 0.24 or root_width <= 0.68):
        return "oval", round(score * 0.88, 4)
    if aspect >= 1.38 and root_width >= 0.72 and tip <= 0.28:
        return "squoval", round(score * 0.86, 4)
    if root_width >= 0.72 and max_pos >= 0.36 and tip <= 0.42:
        return "squoval", round(score * 0.84, 4)
    return "round", round(score * 0.78, 4)


def summarize_shape(components: list[object]) -> tuple[dict[str, object], str, float, dict[str, object]]:
    ranked = sorted(
        components[:8],
        key=lambda component: (
            1 if component_source(component) == "seg" else 0,
            1 if component_source(component) == "cluster" else 0,
            component_confidence(component),
        ),
        reverse=True,
    )
    best = ranked[0] if ranked else wrap_component(fallback_polish_patch(Image.new("RGBA", (180, 260))), "fallback", 0.2)
    metrics = alpha_width_profile(component_image(best))
    shape, shape_confidence = infer_shape_from_metrics(metrics, component_confidence(best))
    root_profile = {
        "rootY": metrics["rootY"],
        "rootWidthRatio": metrics["rootWidthRatio"],
        "rootCenterX": metrics["rootCenterX"],
        "tipY": metrics["tipY"],
        "bedLengthRatio": metrics["bedLengthRatio"],
    }
    return metrics, shape, shape_confidence, root_profile


def save_alpha_mask(image: Image.Image, path: Path) -> None:
    mask = image.getchannel("A").point(lambda value: 255 if value > 24 else 0)
    mask.save(path)


def infer_finish(style_id: int) -> str:
    if style_id in METALLIC_STYLES:
        return "metallic"
    if style_id in SHIMMER_STYLES:
        return "shimmer"
    if style_id in JELLY_STYLES:
        return "jelly"
    return "gloss"


def crop_style_components(image: Image.Image, mask: Image.Image) -> list[Image.Image]:
    mask_arr = np.asarray(mask) > 0
    boxes = largest_components(mask_arr, limit=5)
    if not boxes:
        bbox = mask.getbbox() or (0, 0, image.width, image.height)
        boxes = [bbox]

    rgba = image.convert("RGBA")
    crops: list[Image.Image] = []
    for box in boxes:
        x0, y0, x1, y1 = expand_box(box, rgba.size, padding=0.12)
        crop = rgba.crop((x0, y0, x1, y1))
        crop_mask = mask.crop((x0, y0, x1, y1)).filter(ImageFilter.GaussianBlur(radius=1.0))
        crop.putalpha(crop_mask)
        if crop.width >= 8 and crop.height >= 8:
            crops.append(trim_transparent(crop))
    return crops or [trim_transparent(rgba)]


def expand_box(box: tuple[int, int, int, int], size: tuple[int, int], padding: float) -> tuple[int, int, int, int]:
    x0, y0, x1, y1 = box
    width, height = size
    pad_x = int((x1 - x0) * padding)
    pad_y = int((y1 - y0) * padding)
    return max(0, x0 - pad_x), max(0, y0 - pad_y), min(width, x1 + pad_x), min(height, y1 + pad_y)


def trim_transparent(image: Image.Image) -> Image.Image:
    bbox = image.getchannel("A").getbbox()
    return image.crop(bbox) if bbox else image


def make_nail_mask(size: tuple[int, int]) -> Image.Image:
    width, height = size
    y = np.linspace(0, 1, height, dtype=np.float32)[:, None]
    x = np.linspace(-1, 1, width, dtype=np.float32)[None, :]
    half_width = 0.74 * (0.42 + 0.58 * np.sin(np.clip(y, 0, 1) * math.pi * 0.92))
    half_width *= 1 - 0.15 * y
    bottom_round = ((x / 0.88) ** 2 + ((y - 0.78) / 0.36) ** 2) < 1.18
    top_round = ((x / 0.82) ** 2 + ((y - 0.14) / 0.26) ** 2) < 1.18
    body = (np.abs(x) <= half_width) & (y > 0.08) & (y < 0.96)
    mask = (body | top_round | bottom_round) & (y < 0.98)
    mask_img = Image.fromarray((mask.astype(np.uint8) * 255), "L")
    return mask_img.filter(ImageFilter.GaussianBlur(radius=max(0.7, min(size) * 0.012)))


def fit_texture_to_nail(texture: Image.Image, size: tuple[int, int]) -> Image.Image:
    width, height = size
    texture = texture.convert("RGBA")
    scale = max(width / texture.width, height / texture.height)
    resized = texture.resize((max(1, int(texture.width * scale)), max(1, int(texture.height * scale))), Image.Resampling.LANCZOS)
    x = max(0, (resized.width - width) // 2)
    y = max(0, (resized.height - height) // 2)
    fitted = resized.crop((x, y, x + width, y + height))
    mask = make_nail_mask(size)
    alpha = ImageChops_multiply_alpha(fitted.getchannel("A"), mask)
    fitted.putalpha(alpha)
    return fitted


def ImageChops_multiply_alpha(a: Image.Image, b: Image.Image) -> Image.Image:
    arr = (np.asarray(a, dtype=np.float32) * np.asarray(b, dtype=np.float32) / 255.0).clip(0, 255)
    return Image.fromarray(arr.astype(np.uint8), "L")


def image_stats(image: Image.Image) -> dict[str, object]:
    rgba = image.convert("RGBA")
    arr = np.asarray(rgba)
    alpha = arr[:, :, 3] > 20
    if not alpha.any():
        alpha = np.ones(arr.shape[:2], dtype=bool)
    rgb = arr[:, :, :3][alpha].astype(np.float32)
    mean = rgb.mean(axis=0)
    return {
        "meanColor": [int(v) for v in mean],
        "luminance": float((0.2126 * mean[0] + 0.7152 * mean[1] + 0.0722 * mean[2]) / 255.0),
        "coverage": float(alpha.mean()),
    }


def load_style_overrides(output_dir: Path) -> dict[str, dict[str, object]]:
    path = output_dir / "style-overrides.json"
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def infer_try_on_profile(
    style_id: int,
    components: list[object],
    finish: str,
    overrides: dict[str, dict[str, object]],
    asset_quality: dict[str, object],
    shape_metrics: dict[str, object],
    shape: str,
    shape_confidence: float,
    allow_extension: bool,
) -> dict[str, object]:
    aspects: list[float] = []
    confidences: list[float] = []
    for component in components[:5]:
        image = component_image(component)
        width = max(1, image.width)
        aspects.append(image.height / width)
        confidences.append(component_confidence(component))
    aspect = float(np.median(aspects)) if aspects else 1.65
    confidence = float(np.median(confidences)) if confidences else 0.55

    shape_aspect = float(shape_metrics.get("aspectRatio", aspect))
    length_hint = overrides.get(str(style_id), {}).get("lengthScaleHint")
    fit_mode = "press_on" if allow_extension else "natural"
    if allow_extension:
        auto_length = 1.1 + max(0, shape_aspect - 1.2) * 0.16 + float(shape_metrics.get("tipSharpness", 0.2)) * 0.08
        length_scale = float(length_hint) if isinstance(length_hint, (int, float)) else auto_length
        length_scale = float(clamp(length_scale, 1.08, 1.32))
    else:
        length_scale = 1.0
    width_scale = float(clamp(1.02 - (aspect - 1.55) * 0.08, 0.9, 1.08))
    tip_extension = 0.0 if not allow_extension else float(clamp((length_scale - 1.0) * 0.58, 0.04, 0.2))
    root_fade = 0.2 if not allow_extension else 0.32
    profile: dict[str, object] = {
        "fitMode": fit_mode,
        "geometryMode": "press_on_style" if fit_mode == "press_on" else "natural_style",
        "assetPolicy": "best_available",
        "needsReview": bool(asset_quality.get("needsReview")),
        "allowExtension": bool(allow_extension),
        "shape": shape,
        "shapeConfidence": round(shape_confidence, 4),
        "lengthScale": round(length_scale, 3),
        "widthScale": round(width_scale, 3),
        "tipExtension": round(tip_extension, 3),
        "rootFade": round(root_fade, 3),
        "confidence": round(confidence, 4),
    }
    override = overrides.get(str(style_id), {})
    if isinstance(override.get("assetPolicy"), str):
        profile["assetPolicy"] = override["assetPolicy"]
    if isinstance(override.get("needsReview"), bool):
        profile["needsReview"] = override["needsReview"]
    if isinstance(override.get("tryOnProfile"), dict):
        # Manual overrides may tune policy/length, but shape remains inferred from the material mask.
        for key, value in override["tryOnProfile"].items():
            if key not in {"shape", "fitMode", "geometryMode", "lengthScale", "tipExtension"}:
                profile[key] = value
    return profile


def prepare_assets(
    excel_path: Path,
    output_dir: Path,
    cache_dir: Path,
    seg_model_path: str | None = None,
    *,
    seg_device: str = "cpu",
    seg_confidence: float = 0.2,
) -> list[dict[str, object]]:
    output_dir.mkdir(parents=True, exist_ok=True)
    cache_dir.mkdir(parents=True, exist_ok=True)
    overrides = load_style_overrides(output_dir)
    if pd is not None:
        frame_records = pd.read_excel(excel_path, sheet_name="款式图").to_dict(orient="records")
    else:
        manifest_path = output_dir / "styles.json"
        if not manifest_path.exists():
            raise SystemExit("Missing pandas/openpyxl and no existing styles.json to reuse.")
        seed_manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        frame_records = [
            {
                "__style_id": int(item["id"]),
                "__url": str(item.get("sourceUrl", "")),
                "__original_url": str(item.get("originalUrl", "")),
                "__raw_path": find_cached_style_image(cache_dir, int(item["id"])),
            }
            for item in seed_manifest
        ]
    seg_model = load_segmentation_model(seg_model_path)
    manifest: list[dict[str, object]] = []

    for row in frame_records:
        if "__style_id" in row:
            style_id = int(row["__style_id"])
            url = str(row["__url"])
            original_url = str(row["__original_url"])
            raw_path = Path(row["__raw_path"])
        else:
            style_id = int(row["序号"])
            url = str(row["增强后款式图URL"])
            original_url = str(row["原始款式图URL"])
            raw_path = fetch_image(url, cache_dir, style_id)
        image = ImageOps.exif_transpose(Image.open(raw_path)).convert("RGBA")
        components = extract_nail_patches_with_segmentation(
            image,
            seg_model,
            device=seg_device,
            confidence=seg_confidence,
        )
        if components and len(components) < 5:
            cluster_components = extract_color_cluster_patches(image)
            existing_boxes = {tuple(component_bbox(component) or []) for component in components}
            for component in cluster_components:
                box_key = tuple(component_bbox(component) or [])
                if box_key and box_key not in existing_boxes:
                    components.append(component)
                    existing_boxes.add(box_key)
                if len(components) >= 8:
                    break
        if not components:
            components = [wrap_component(patch, "heuristic", 0.46) for patch in extract_nail_patches(image)]
            if len(components) < 5:
                components.extend(extract_color_cluster_patches(image))
        if len(components) < 3:
            fallback = wrap_component(fallback_polish_patch(image), "fallback", 0.25)
            components = components + [fallback] * (3 - len(components))
        # Keep the old foreground crop only as a last diagnostic fallback; never let a whole hand become the texture.
        if not components:
            components = [wrap_component(fallback_polish_patch(image), "fallback", 0.25)]
        style_dir = output_dir / f"style-{style_id:02d}"
        style_dir.mkdir(parents=True, exist_ok=True)

        finish = infer_finish(style_id)
        texture_paths: dict[str, dict[str, object]] = {}
        stats_source: Image.Image | None = None
        for finger_index, finger in enumerate(FINGERS):
            component = components[min(finger_index, len(components) - 1)]
            asset = fit_texture_to_nail(component_image(component), FINGER_ASPECTS[finger])
            if stats_source is None:
                stats_source = asset
            filename = f"{finger}.png"
            mask_filename = f"{finger}-mask.png"
            asset.save(style_dir / filename)
            save_alpha_mask(asset, style_dir / mask_filename)
            texture_paths[finger] = {
                "image": f"./assets/nail-assets/style-{style_id:02d}/{filename}",
                "mask": f"./assets/nail-assets/style-{style_id:02d}/{mask_filename}",
                "bbox": component_bbox(component) or [0, 0, asset.width, asset.height],
                "confidence": round(component_confidence(component), 4),
                "finish": finish,
                "source": component_source(component),
            }

        source_preview = component_image(components[0])
        preview = fit_texture_to_nail(source_preview, (160, 236))
        preview.save(style_dir / "preview.png")
        stats = image_stats(stats_source or preview)
        asset_quality = assess_asset_quality(style_id, components, stats, finish)
        if isinstance(overrides.get(str(style_id), {}).get("assetQuality"), dict):
            asset_quality.update(overrides[str(style_id)]["assetQuality"])
        override = overrides.get(str(style_id), {})
        allow_extension = bool(override.get("allowExtension", style_id in ALLOW_EXTENSION_STYLES))
        shape_metrics, inferred_shape, shape_confidence, root_profile = summarize_shape(components)
        try_on_profile = infer_try_on_profile(
            style_id,
            components,
            finish,
            overrides,
            asset_quality,
            shape_metrics,
            inferred_shape,
            shape_confidence,
            allow_extension,
        )
        manifest.append(
            {
                "id": style_id,
                "name": f"{style_id:02d} 自动提取款式",
                "sourceUrl": url,
                "originalUrl": original_url,
                "preview": f"./assets/nail-assets/style-{style_id:02d}/preview.png",
                "textures": texture_paths,
                "finish": finish,
                "allowExtension": allow_extension,
                "shapeMetrics": shape_metrics,
                "shapeConfidence": shape_confidence,
                "rootProfile": root_profile,
                "assetQuality": asset_quality,
                "tryOnProfile": try_on_profile,
                **stats,
            }
        )
        print(f"style {style_id:02d}: {len(components)} nail patch(es), coverage={stats['coverage']:.3f}")

    (output_dir / "styles.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract transparent nail textures from the competition style workbook.")
    parser.add_argument("--excel", default="../副本命题三美甲评测数据（对外版）.xlsx", help="Path to the workbook.")
    parser.add_argument("--out", default="assets/nail-assets", help="Output directory under the app.")
    parser.add_argument("--cache", default="assets/source-cache", help="Downloaded source image cache.")
    parser.add_argument("--seg-model", default=None, help="Optional local YOLO segmentation weights for real nail masks.")
    parser.add_argument("--seg-device", default="cpu", help="YOLO device for style extraction. Use cpu while training is running.")
    parser.add_argument("--seg-conf", type=float, default=0.2, help="Confidence threshold for style nail segmentation.")
    args = parser.parse_args()

    app_dir = Path(__file__).resolve().parents[1]
    excel_path = (app_dir / args.excel).resolve() if not Path(args.excel).is_absolute() else Path(args.excel)
    output_dir = (app_dir / args.out).resolve()
    cache_dir = (app_dir / args.cache).resolve()
    manifest = prepare_assets(
        excel_path,
        output_dir,
        cache_dir,
        args.seg_model,
        seg_device=args.seg_device,
        seg_confidence=args.seg_conf,
    )
    print(f"wrote {len(manifest)} style records to {output_dir / 'styles.json'}")


if __name__ == "__main__":
    main()
