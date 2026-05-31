from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


FINGERS = ["thumb", "index", "middle", "ring", "pinky"]


def find_source_image(app_dir: Path, style_id: int) -> Path | None:
    cache_dir = app_dir / "assets" / "source-cache"
    candidates = sorted(cache_dir.glob(f"style_{style_id:02d}.*"))
    for candidate in candidates:
        if "_original" not in candidate.stem and candidate.is_file():
            return candidate
    return None


def load_thumb(path: Path | None, size: tuple[int, int]) -> Image.Image:
    if path is None or not path.exists():
        return Image.new("RGB", size, (35, 35, 35))
    image = Image.open(path).convert("RGB")
    image.thumbnail(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, (24, 24, 24))
    canvas.paste(image, ((size[0] - image.width) // 2, (size[1] - image.height) // 2))
    return canvas


def draw_label(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, fill=(235, 235, 235)) -> None:
    draw.text(xy, text, fill=fill, font=ImageFont.load_default())


def build_sheet(app_dir: Path, style: dict[str, object]) -> Image.Image:
    style_id = int(style["id"])
    profile = style.get("tryOnProfile") or {}
    quality = style.get("assetQuality") or {}
    metrics = style.get("shapeMetrics") or {}
    root = style.get("rootProfile") or {}
    textures = style.get("textures") or {}
    width, height = 1180, 520
    sheet = Image.new("RGB", (width, height), (16, 16, 18))
    draw = ImageDraw.Draw(sheet)

    source = load_thumb(find_source_image(app_dir, style_id), (300, 420))
    preview = load_thumb(app_dir / str(style.get("preview", "")).replace("./", ""), (180, 280))
    sheet.paste(source, (24, 72))
    sheet.paste(preview, (350, 98))
    root_y = int(98 + float(root.get("rootY", 0.9)) * 280)
    draw.line((350, root_y, 530, root_y), fill=(255, 90, 90), width=2)

    draw_label(draw, (24, 24), f"style {style_id:02d} | {style.get('name', '')}")
    draw_label(
        draw,
        (560, 52),
        f"profile: {profile.get('fitMode')} / {profile.get('geometryMode')} / {profile.get('shape')} shapeConf={profile.get('shapeConfidence')}",
    )
    draw_label(
        draw,
        (560, 82),
        f"allowExtension={style.get('allowExtension')} scale: L={profile.get('lengthScale')} W={profile.get('widthScale')} tip={profile.get('tipExtension')}",
    )
    draw_label(
        draw,
        (560, 112),
        f"policy: {profile.get('assetPolicy')} review={profile.get('needsReview')} confidence={profile.get('confidence')}",
    )
    draw_label(
        draw,
        (560, 150),
        f"quality: conf={quality.get('confidence')} cover={quality.get('coverage')} aspect={quality.get('aspectMedian')} std={quality.get('aspectStd')}",
    )
    draw_label(draw, (560, 180), f"shapeMetrics: aspect={metrics.get('aspectRatio')} tip={metrics.get('tipSharpness')} rootW={metrics.get('rootWidthRatio')}")
    draw_label(draw, (560, 205), f"rootProfile: rootY={root.get('rootY')} rootX={root.get('rootCenterX')} bed={root.get('bedLengthRatio')}")
    draw_label(draw, (560, 230), f"sources: {quality.get('sourceCounts')} reasons: {quality.get('reasons')}")

    x = 560
    for finger in FINGERS:
        texture = textures.get(finger) or {}
        thumb = load_thumb(app_dir / str(texture.get("image", "")).replace("./", ""), (96, 148))
        mask = load_thumb(app_dir / str(texture.get("mask", "")).replace("./", ""), (96, 148))
        sheet.paste(thumb, (x, 270))
        sheet.paste(mask, (x, 422))
        draw_label(draw, (x, 247), f"{finger} {texture.get('source')} {texture.get('confidence')}")
        x += 118
    return sheet


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate contact sheets for nail asset/profile QA.")
    parser.add_argument("--out", default="runs/asset-qa", help="Output directory.")
    parser.add_argument("--dry-run", action="store_true", help="Validate inputs without writing PNG files.")
    args = parser.parse_args()

    app_dir = Path(__file__).resolve().parents[1]
    manifest_path = app_dir / "assets" / "nail-assets" / "styles.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    out_dir = (app_dir / args.out).resolve()
    if args.dry_run:
        print(f"would generate {len(manifest)} QA sheets in {out_dir}")
        return
    out_dir.mkdir(parents=True, exist_ok=True)
    for style in manifest:
        sheet = build_sheet(app_dir, style)
        sheet.save(out_dir / f"style-{int(style['id']):02d}-qa.png")
    print(f"wrote {len(manifest)} QA sheets to {out_dir}")


if __name__ == "__main__":
    main()
