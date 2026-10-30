#!/usr/bin/env bash
set -e

INPUT_VIDEO="public/video/estadio.mp4"
OUTPUT_DIR="public/frames"
TOTAL_FRAMES=120

echo "=================================================="
echo "  ATLÁNTICA F.C. — Extractor de Frames de Estadio"
echo "=================================================="

if [ ! -f "$INPUT_VIDEO" ]; then
  echo "❌ Error: No se encontró el vídeo en '$INPUT_VIDEO'."
  echo "Por favor, coloca el archivo 'estadio.mp4' dentro de 'public/video/' y vuelve a ejecutar el comando."
  exit 1
fi

if ! command -v ffmpeg &> /dev/null; then
  echo "❌ Error: 'ffmpeg' no está instalado o no se encuentra en el PATH del sistema."
  exit 1
fi

mkdir -p "$OUTPUT_DIR"
rm -f "$OUTPUT_DIR"/frame_*.webp

# Calcular la duración del vídeo con ffprobe para distribuir exactamente 120 fotogramas
if command -v ffprobe &> /dev/null; then
  DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$INPUT_VIDEO")
  FPS=$(awk "BEGIN {printf \"%.6f\", $TOTAL_FRAMES / $DURATION}")
  echo "⏱️  Duración detectada: ${DURATION}s -> Extrayendo $TOTAL_FRAMES frames (fps=$FPS)..."
  ffmpeg -y -i "$INPUT_VIDEO" \
    -vf "fps=${FPS},scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
    -frames:v "$TOTAL_FRAMES" \
    -c:v libwebp \
    -quality 80 \
    -compression_level 4 \
    "$OUTPUT_DIR/frame_%04d.webp"
else
  echo "⚠️  ffprobe no detectado. Extrayendo los primeros $TOTAL_FRAMES fotogramas..."
  ffmpeg -y -i "$INPUT_VIDEO" \
    -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
    -frames:v "$TOTAL_FRAMES" \
    -c:v libwebp \
    -quality 80 \
    -compression_level 4 \
    "$OUTPUT_DIR/frame_%04d.webp"
fi

echo "✅ ¡Extracción completada! 120 fotogramas generados en '$OUTPUT_DIR/frame_0001.webp' ... 'frame_0120.webp'"
