#!/usr/bin/env node
/**
 * Script multiplataforma (Windows / macOS / Linux) para extraer 120 fotogramas
 * en formato .webp (1920x1080, calidad 80) a partir de public/video/estadio.mp4
 * hacia public/frames/frame_0001.webp ... frame_0120.webp
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

let ffmpegBin = "ffmpeg";
let ffprobeBin = "ffprobe";

try {
  const staticFfmpeg = require("ffmpeg-static");
  if (staticFfmpeg) ffmpegBin = staticFfmpeg;
} catch {
  // Usa ffmpeg del PATH si ffmpeg-static no está instalado
}

try {
  const staticFfprobe = require("ffprobe-static");
  if (staticFfprobe?.path) ffprobeBin = staticFfprobe.path;
} catch {
  // Usa ffprobe del PATH si ffprobe-static no está instalado
}

const INPUT_VIDEO = path.resolve(process.cwd(), "public/video/estadio.mp4");
const OUTPUT_DIR = path.resolve(process.cwd(), "public/frames");
const TOTAL_FRAMES = 120;

console.log("==================================================");
console.log("  ATLÁNTICA F.C. — Extractor de Frames de Estadio");
console.log("==================================================");

if (!fs.existsSync(INPUT_VIDEO)) {
  console.error(`❌ Error: No se encontró el archivo de vídeo en: ${INPUT_VIDEO}`);
  console.error("👉 Coloca 'estadio.mp4' dentro de la carpeta 'public/video/' y vuelve a ejecutar:");
  console.error("   npm run extract-frames");
  process.exit(1);
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Limpiar frames previos si existen
for (const file of fs.readdirSync(OUTPUT_DIR)) {
  if (file.startsWith("frame_") && file.endsWith(".webp")) {
    fs.unlinkSync(path.join(OUTPUT_DIR, file));
  }
}

let fpsFilter = "";
try {
  const durationOut = execFileSync(
    ffprobeBin,
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      INPUT_VIDEO,
    ],
    { encoding: "utf-8" }
  ).trim();

  const duration = parseFloat(durationOut);
  if (!Number.isNaN(duration) && duration > 0) {
    const fps = (TOTAL_FRAMES / duration).toFixed(6);
    fpsFilter = `fps=${fps},`;
    console.log(`⏱️  Duración del vídeo: ${duration.toFixed(2)}s | Extrayendo ${TOTAL_FRAMES} frames a ${fps} FPS...`);
  }
} catch {
  console.warn("⚠️  No se pudo ejecutar ffprobe para calcular la duración; se extraerán 120 fotogramas directos.");
}

const outputPattern = path.join(OUTPUT_DIR, "frame_%04d.webp");
const vf = `${fpsFilter}scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080`;

try {
  execFileSync(
    ffmpegBin,
    [
      "-y",
      "-i",
      INPUT_VIDEO,
      "-vf",
      vf,
      "-frames:v",
      String(TOTAL_FRAMES),
      "-c:v",
      "libwebp",
      "-quality",
      "80",
      "-compression_level",
      "4",
      outputPattern,
    ],
    { stdio: "inherit" }
  );

  console.log(`\n✅ ¡Extracción completada con éxito! Se han generado los fotogramas en: ${OUTPUT_DIR}`);
} catch (error) {
  console.error("\n❌ Error al ejecutar ffmpeg:", error.message);
  process.exit(1);
}
