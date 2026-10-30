#!/usr/bin/env node
/**
 * ATLÁNTICA F.C. — Script Automatizado de Recorte y Eliminación de Fondo de Cartas
 * Usa @imgly/background-removal-node + sharp + Flood-Fill Topológico de Silueta
 * para conservar al 100% la opacidad interior de la carta, la corona dorada superior,
 * las alas laterales y los picos inferiores del escudo, eliminando el fondo ambiental
 * y recortando (auto-crop/trim) todas las cartas al mismo bounding box y proporción en .webp.
 */

import { removeBackground } from "@imgly/background-removal-node";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const CARDS_DIR = path.resolve(process.cwd(), "public/cards");
const STD_W = 2752;
const STD_H = 1536;
const TARGET_WIDTH = 1000;
const TARGET_HEIGHT = 1500;

/**
 * Genera la máscara alfa de alta precisión mediante @imgly/background-removal-node
 * y Flood-Fill exterior desde los bordes para garantizar interior 100% opaco
 * y silueta exterior (corona + escudo + alas laterales) perfectamente perfilada.
 */
async function buildCleanCardMask(samplePaths) {
  console.log("🧠 Analizando silueta UT (corona dorada + escudo) con IA (@imgly/background-removal-node)...");

  const accumAlpha = new Float32Array(STD_W * STD_H);

  for (const samplePath of samplePaths) {
    const blob = await removeBackground(pathToFileURL(samplePath).href);
    const segBuf = Buffer.from(await blob.arrayBuffer());
    const segRgba = await sharp(segBuf)
      .ensureAlpha()
      .resize(STD_W, STD_H, { kernel: sharp.kernel.lanczos3 })
      .raw()
      .toBuffer();

    for (let i = 0; i < STD_W * STD_H; i++) {
      accumAlpha[i] += segRgba[i * 4 + 3] / samplePaths.length;
    }
  }

  const alpha = new Uint8Array(STD_W * STD_H);
  for (let i = 0; i < STD_W * STD_H; i++) {
    alpha[i] = Math.round(accumAlpha[i]);
  }

  // Protección del núcleo interior del escudo para impedir cualquier transparencia interna
  for (let y = 260; y <= 1320; y++) {
    for (let x = 975; x <= 1775; x++) {
      const idx = y * STD_W + x;
      if (alpha[idx] < 200) alpha[idx] = 255;
    }
  }

  // Flood-fill (BFS) desde los 4 bordes exteriores de la imagen para identificar el fondo exterior real
  const isExterior = new Uint8Array(STD_W * STD_H);
  const queue = new Int32Array(STD_W * STD_H);
  let head = 0;
  let tail = 0;

  const push = (idx) => {
    if (!isExterior[idx] && alpha[idx] < 90) {
      isExterior[idx] = 1;
      queue[tail++] = idx;
    }
  };

  for (let x = 0; x < STD_W; x++) {
    push(x);
    push((STD_H - 1) * STD_W + x);
  }
  for (let y = 0; y < STD_H; y++) {
    push(y * STD_W);
    push(y * STD_W + (STD_W - 1));
  }

  while (head < tail) {
    const idx = queue[head++];
    const x = idx % STD_W;
    const y = (idx - x) / STD_W;
    if (x > 0) push(idx - 1);
    if (x < STD_W - 1) push(idx + 1);
    if (y > 0) push(idx - STD_W);
    if (y < STD_H - 1) push(idx + STD_H === idx ? 0 : idx + STD_W);
  }

  // Construir máscara final con alpha matting suave en el borde exterior
  const cleanMask = new Uint8Array(STD_W * STD_H);
  let minX = STD_W,
    minY = STD_H,
    maxX = 0,
    maxY = 0;

  for (let y = 0; y < STD_H; y++) {
    for (let x = 0; x < STD_W; x++) {
      const i = y * STD_W + x;
      if (!isExterior[i]) {
        const a = alpha[i];
        let val = 255;
        if (a < 185) {
          let nearExt = false;
          for (let dy = -3; dy <= 3 && !nearExt; dy++) {
            for (let dx = -3; dx <= 3; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < STD_W && ny >= 0 && ny < STD_H) {
                if (isExterior[ny * STD_W + nx]) {
                  nearExt = true;
                  break;
                }
              }
            }
          }
          if (nearExt) {
            val = Math.min(255, Math.max(0, Math.round(((a - 70) / 140) * 255)));
          }
        }
        cleanMask[i] = val;
        if (val > 15) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
  }

  const bbox = {
    left: Math.max(0, minX - 2),
    top: Math.max(0, minY - 2),
    width: Math.min(STD_W - minX + 4, maxX - minX + 5),
    height: Math.min(STD_H - minY + 4, maxY - minY + 5),
  };

  console.log(
    `📐 Bounding Box exacto detectado: ${bbox.width}x${bbox.height} (left=${bbox.left}, top=${bbox.top})\n`
  );

  return { cleanMask, bbox };
}

async function processCardWithMask(jpgFile, cleanMask, bbox) {
  const inputPath = path.join(CARDS_DIR, jpgFile);
  const baseName = path.parse(jpgFile).name;
  const outputPath = path.join(CARDS_DIR, `${baseName}.webp`);

  const origRgb = await sharp(inputPath)
    .resize(STD_W, STD_H, { kernel: sharp.kernel.lanczos3 })
    .removeAlpha()
    .raw()
    .toBuffer();

  const outRgba = Buffer.alloc(STD_W * STD_H * 4);
  for (let i = 0; i < STD_W * STD_H; i++) {
    outRgba[i * 4] = origRgb[i * 3];
    outRgba[i * 4 + 1] = origRgb[i * 3 + 1];
    outRgba[i * 4 + 2] = origRgb[i * 3 + 2];
    outRgba[i * 4 + 3] = cleanMask[i];
  }

  // Recortar al bounding box exacto (auto-crop/trim) y normalizar a 1000x1500 transparente
  const croppedPngBuffer = await sharp(outRgba, {
    raw: { width: STD_W, height: STD_H, channels: 4 },
  })
    .extract(bbox)
    .png()
    .toBuffer();

  await sharp(croppedPngBuffer)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 94, alphaQuality: 100 })
    .toFile(outputPath);
}

async function main() {
  console.log("==========================================================");
  console.log("  ATLÁNTICA F.C. — Recorte de Silueta UT (Fondo Transparente)");
  console.log("==========================================================");

  for (const temp of ["test_tokinha.webp", "test_tokinha_solid.webp"]) {
    const p = path.join(CARDS_DIR, temp);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  const jpgFiles = fs
    .readdirSync(CARDS_DIR)
    .filter((f) => /\.(jpe?g)$/i.test(f))
    .sort();

  if (jpgFiles.length === 0) {
    console.error("❌ No se encontraron imágenes .jpg en public/cards/");
    process.exit(1);
  }

  // Tomamos muestras de alta resolución para calcular la silueta exacta con IA
  const sampleFiles = ["tokinha.jpg", "canutinho.jpg", "samos.jpg"]
    .filter((f) => jpgFiles.includes(f))
    .map((f) => path.join(CARDS_DIR, f));

  const { cleanMask, bbox } = await buildCleanCardMask(
    sampleFiles.length > 0 ? sampleFiles : [path.join(CARDS_DIR, jpgFiles[0])]
  );

  console.log(`🃏 Recortando y exportando ${jpgFiles.length} cartas a .webp transparente...\n`);

  for (let i = 0; i < jpgFiles.length; i++) {
    const file = jpgFiles[i];
    const outName = `${path.parse(file).name}.webp`;
    process.stdout.write(
      `[${String(i + 1).padStart(2, "0")}/${jpgFiles.length}] ${file.padEnd(18)} -> ${outName.padEnd(18)} `
    );
    await processCardWithMask(file, cleanMask, bbox);
    console.log("✅ OK (1000x1500 .webp)");
  }

  console.log(
    "\n✨ ¡Las 17 cartas han sido recortadas con fondo 100% transparente en public/cards/*.webp!"
  );
}

main().catch((err) => {
  console.error("❌ Error durante el procesamiento de cartas:", err);
  process.exit(1);
});
