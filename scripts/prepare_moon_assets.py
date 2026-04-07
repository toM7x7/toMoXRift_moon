from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "source"
PUBLIC_DIR = ROOT / "public"
GENERATED_DIR = ROOT / "src" / "generated"

COLOR_CANDIDATES = [
    "lroc_color_16bit_srgb_16k.tif",
    "lroc_color_16bit_srgb.tif",
]
HEIGHT_CANDIDATES = [
    "ldem_64.tif",
    "ldem_16.tif",
]


def find_source(candidates: list[str]) -> Path:
    for candidate in candidates:
        preferred = SOURCE_DIR / candidate
        if preferred.exists():
            return preferred

        fallback = ROOT / candidate
        if fallback.exists():
            return fallback

    raise FileNotFoundError(f"Missing source asset. Looked for: {', '.join(candidates)}")


def prepare_color(source_path: Path) -> None:
    with Image.open(source_path) as image:
        color = image.convert("RGB")
        runtime = color.resize((4096, 2048), Image.Resampling.LANCZOS)
        thumbnail = color.resize((2048, 1024), Image.Resampling.LANCZOS)

    runtime.save(PUBLIC_DIR / "moon-surface-runtime.jpg", quality=92, optimize=True)
    thumbnail.save(PUBLIC_DIR / "moon-thumbnail.jpg", quality=90, optimize=True)


def prepare_height(source_path: Path) -> None:
    with Image.open(source_path) as image:
        min_km, max_km = image.getextrema()
        runtime = image.resize((2048, 1024), Image.Resampling.BILINEAR)
        data = np.asarray(runtime, dtype=np.float32)

    range_km = float(max_km - min_km)
    normalized = np.clip((data - min_km) / range_km, 0.0, 1.0)
    runtime_u16 = np.round(normalized * 65535.0).astype(np.uint16)

    height_image = Image.fromarray(runtime_u16)
    height_image.save(PUBLIC_DIR / "moon-height-runtime.png", optimize=True)

    GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    stats = {
        "sourcePath": source_path.relative_to(ROOT).as_posix(),
        "minKm": float(min_km),
        "maxKm": float(max_km),
        "rangeKm": range_km,
        "referenceRadiusKm": 1737.4,
        "displacementExaggeration": 3.0,
        "runtimeResolution": [2048, 1024],
    }
    (GENERATED_DIR / "moon-height-stats.json").write_text(
        json.dumps(stats, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    SOURCE_DIR.mkdir(parents=True, exist_ok=True)

    color_source = find_source(COLOR_CANDIDATES)
    height_source = find_source(HEIGHT_CANDIDATES)

    prepare_color(color_source)
    prepare_height(height_source)

    print(f"Prepared moon runtime assets from {color_source.name} and {height_source.name}")


if __name__ == "__main__":
    main()
