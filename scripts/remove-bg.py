#!/usr/bin/env python3
"""
ATLÁNTICA F.C. — Script alternativo en Python (rembg + Pillow con alpha_matting)
Recorta el fondo ambiental de todas las cartas de public/cards/, hace auto-crop (trim)
al bounding box de la silueta UT (corona dorada + escudo) y exporta a .webp transparente.
"""

from pathlib import Path
from PIL import Image
from rembg import remove

CARDS_DIR = Path(__file__).resolve().parent.parent / "public" / "cards"
TARGET_SIZE = (1000, 1500)


def process_cards() -> None:
    jpg_files = sorted(CARDS_DIR.glob("*.jpg"))
    if not jpg_files:
        print("No se encontraron archivos .jpg en public/cards/")
        return

    for idx, img_path in enumerate(jpg_files, start=1):
        print(f"[{idx:02d}/{len(jpg_files)}] Procesando {img_path.name}...")
        with Image.open(img_path) as img:
            rgba_img = img.convert("RGBA")
            cutout = remove(
                rgba_img,
                alpha_matting=True,
                alpha_matting_foreground_threshold=240,
                alpha_matting_background_threshold=10,
                alpha_matting_erode_size=10,
            )

            # Auto-crop (trim) al bounding box del canal alfa
            bbox = cutout.getbbox()
            if bbox:
                cutout = cutout.crop(bbox)

            # Normalizar tamaño manteniendo proporción exacta en lienzo transparente 1000x1500
            cutout.thumbnail(TARGET_SIZE, Image.Resampling.LANCZOS)
            canvas = Image.new("RGBA", TARGET_SIZE, (0, 0, 0, 0))
            offset_x = (TARGET_SIZE[0] - cutout.width) // 2
            offset_y = (TARGET_SIZE[1] - cutout.height) // 2
            canvas.paste(cutout, (offset_x, offset_y), cutout)

            out_path = CARDS_DIR / f"{img_path.stem}.webp"
            canvas.save(out_path, "WEBP", quality=94, method=6)
            print(f"  -> Guardado en {out_path.name}")


if __name__ == "__main__":
    process_cards()
