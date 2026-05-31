from __future__ import annotations

import json
from pathlib import Path


def main() -> None:
    app_dir = Path(__file__).resolve().parents[1]
    manifest_path = app_dir / "assets" / "nail-assets" / "styles.json"
    metadata_path = app_dir / "models" / "nail-seg" / "metadata.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    assert len(manifest) == 25, f"expected 25 styles, got {len(manifest)}"
    for style in manifest:
        assert style.get("finish") in {"gloss", "matte", "metallic", "jelly", "shimmer", "press_on"}
        profile = style.get("tryOnProfile") or {}
        assert profile.get("fitMode") in {"natural", "press_on"}, f"bad fitMode in style {style.get('id')}"
        assert profile.get("geometryMode") in {
            "natural_style",
            "press_on_style",
            "hybrid_root",
        }, f"bad geometryMode in style {style.get('id')}"
        assert profile.get("assetPolicy") in {
            "seg_only",
            "best_available",
            "manual_patch",
        }, f"bad assetPolicy in style {style.get('id')}"
        assert isinstance(profile.get("needsReview"), bool), f"bad needsReview in style {style.get('id')}"
        assert isinstance(profile.get("allowExtension"), bool), f"bad allowExtension in profile {style.get('id')}"
        assert profile.get("shape") in {"round", "oval", "squoval", "almond"}, f"bad shape in style {style.get('id')}"
        assert isinstance(profile.get("shapeConfidence"), (int, float)), f"bad shapeConfidence in style {style.get('id')}"
        for key in ("lengthScale", "widthScale", "tipExtension", "rootFade", "confidence"):
            assert isinstance(profile.get(key), (int, float)), f"missing numeric {key} in style {style.get('id')}"
        assert isinstance(style.get("allowExtension"), bool), f"bad allowExtension in style {style.get('id')}"
        assert isinstance(style.get("shapeConfidence"), (int, float)), f"bad style shapeConfidence {style.get('id')}"
        metrics = style.get("shapeMetrics") or {}
        for key in ("aspectRatio", "tipSharpness", "rootWidthRatio", "maxWidthPosition", "sideTaper", "coverage"):
            assert isinstance(metrics.get(key), (int, float)), f"missing shapeMetrics.{key} in style {style.get('id')}"
        root = style.get("rootProfile") or {}
        for key in ("rootY", "rootWidthRatio", "rootCenterX", "tipY", "bedLengthRatio"):
            assert isinstance(root.get(key), (int, float)), f"missing rootProfile.{key} in style {style.get('id')}"
        quality = style.get("assetQuality") or {}
        for key in ("sourceCounts", "confidence", "coverage", "aspectMedian", "aspectStd", "heuristicRatio", "complexStyle", "needsReview", "reasons"):
            assert key in quality, f"missing assetQuality.{key} in style {style.get('id')}"
        assert isinstance(quality["sourceCounts"], dict), f"bad sourceCounts in style {style.get('id')}"
        assert isinstance(quality["reasons"], list), f"bad reasons in style {style.get('id')}"
        textures = style.get("textures") or {}
        assert set(textures) == {"thumb", "index", "middle", "ring", "pinky"}
        for texture in textures.values():
            for key in ("image", "mask", "bbox", "confidence", "finish", "source"):
                assert key in texture, f"missing {key} in style {style.get('id')}"
            assert (app_dir / texture["image"].replace("./", "")).exists(), texture["image"]
            assert (app_dir / texture["mask"].replace("./", "")).exists(), texture["mask"]
    assert metadata["model"].endswith(".onnx")
    assert metadata["inputSize"] == 640
    assert metadata["classNames"] == ["nail"]
    print("tryon asset schema ok")


if __name__ == "__main__":
    main()
