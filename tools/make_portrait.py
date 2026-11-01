"""Clean transparent portrait from hero.png — originals untouched.

Root cause of the rectangular shelf:
- Pre-cropping hero before rembg makes rembg treat the cut edge (black
  background + torso) as opaque foreground → full-width black bar.
- portrait.png also bakes a long semi-transparent fade (grey fog).

Correct pipeline: rembg the full photo, then hard-clear desk rows in alpha,
crop to the silhouette bbox, feather only the outer fringe.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from rembg import remove
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
HERO = ROOT / "assets" / "hero.png"
OUT = ROOT / "assets" / "portrait-clean.png"


def main() -> None:
    hero = Image.open(HERO).convert("RGB")
    cut = remove(hero)
    arr = np.array(cut)
    rgb, a = arr[:, :, :3], arr[:, :, 3].astype(np.float32)
    h, w = a.shape

    # Desk / laptop live in the lowest ~18% — hard-clear (no fog gradient).
    desk_y = int(h * 0.80)
    a[desk_y:] = 0

    # Keep only the main silhouette island.
    labeled, n = ndimage.label(a > 40)
    if n:
        sizes = ndimage.sum(a > 40, labeled, range(1, n + 1))
        keep_id = int(np.argmax(sizes) + 1)
        a = np.where(labeled == keep_id, a, 0.0)

    # Tiny anti-alias at the new bottom cut only (≤12px), RGB unchanged.
    band = 12
    for i in range(band):
        y = desk_y - band + i
        if 0 <= y < h:
            a[y] *= 1.0 - (i + 1) / (band + 1)

    # Outer silhouette feather for hair; interior stays fully opaque.
    soft = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).filter(
        ImageFilter.GaussianBlur(0.75)
    )
    soft_a = np.array(soft).astype(np.float32)
    core = ndimage.binary_erosion(a > 250, iterations=2)
    soft_a = np.where(core, 255.0, soft_a)
    soft_a = np.where(a < 5, 0.0, soft_a)

    out = Image.fromarray(
        np.dstack([rgb, np.clip(soft_a, 0, 255).astype(np.uint8)]), "RGBA"
    )
    bbox = out.split()[-1].getbbox()
    if bbox:
        x0, y0, x1, y1 = bbox
        pad = 6
        out = out.crop(
            (
                max(0, x0 - pad),
                max(0, y0 - pad),
                min(out.width, x1 + pad),
                min(out.height, y1 + pad),
            )
        )
    out.save(OUT)

    a2 = np.array(out.split()[-1])
    ys = [a2.shape[0] - 1, a2.shape[0] // 2]
    print("saved", OUT, out.size)
    print("trans%", round(float((a2 == 0).mean() * 100), 1),
          "opaque%", round(float((a2 == 255).mean() * 100), 1))
    for y in ys:
        xs = np.where(a2[y] > 200)[0]
        span = (int(xs[0]), int(xs[-1]), len(xs)) if len(xs) else None
        print("y", y, "span", span, "corners", a2[y, :3].tolist(), a2[y, -3:].tolist())


if __name__ == "__main__":
    main()
