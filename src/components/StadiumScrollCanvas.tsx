"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 120;

function getFramePath(index: number): string {
  const padded = String(index + 1).padStart(4, "0");
  return `/frames/frame_${padded}.webp`;
}

export default function StadiumScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let isUnmounted = false;
    const images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(
      null
    );
    let loadedCount = 0;
    let lastDrawnFrameIndex = -1;

    // Estado de interpolación suave vinculada al scroll
    let targetFrame = 0;
    let currentFrame = 0;

    // Escalado tipo object-fit: cover en el canvas
    const drawImageCover = (img: HTMLImageElement) => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.naturalWidth || 1920;
      const imgHeight = img.naturalHeight || 1080;

      const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;
      const offsetX = (canvasWidth - drawWidth) * 0.5;
      const offsetY = (canvasHeight - drawHeight) * 0.5;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Fallback nocturno si aún no ha cargado ningún frame
    const drawFallbackStadium = (progress: number) => {
      const width = canvas.width;
      const height = canvas.height;
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#020913");
      bgGrad.addColorStop(0.5, "#041122");
      bgGrad.addColorStop(1, "#002B59");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const horizonY = height * (0.65 - progress * 0.15);
      const stadiumGlow = ctx.createRadialGradient(
        width * 0.5,
        horizonY,
        width * 0.05,
        width * 0.5,
        horizonY,
        width * 0.65
      );
      stadiumGlow.addColorStop(0, "rgba(0, 75, 147, 0.45)");
      stadiumGlow.addColorStop(1, "rgba(4, 17, 34, 0)");
      ctx.fillStyle = stadiumGlow;
      ctx.fillRect(0, 0, width, height);
    };

    const renderFrame = (frameIdx: number, force = false) => {
      if (isUnmounted) return;
      const clampedIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(frameIdx))
      );

      if (!force && clampedIndex === lastDrawnFrameIndex && loadedCount > 0) {
        return;
      }

      if (loadedCount > 0) {
        let targetImg = images[clampedIndex];
        if (!targetImg) {
          for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
            if (clampedIndex - offset >= 0 && images[clampedIndex - offset]) {
              targetImg = images[clampedIndex - offset];
              break;
            }
            if (
              clampedIndex + offset < TOTAL_FRAMES &&
              images[clampedIndex + offset]
            ) {
              targetImg = images[clampedIndex + offset];
              break;
            }
          }
        }

        if (targetImg) {
          drawImageCover(targetImg);
          lastDrawnFrameIndex = clampedIndex;
          return;
        }
      }

      drawFallbackStadium(clampedIndex / (TOTAL_FRAMES - 1));
    };

    // Calcula el progreso real del scroll del documento (0 a 1)
    const updateScrollTarget = () => {
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || 0;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
      targetFrame = progress * (TOTAL_FRAMES - 1);
    };

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      updateScrollTarget();
      renderFrame(currentFrame, true);
    };

    handleResize();

    // Precargar todos los 120 fotogramas priorizando frames clave para respuesta instantánea
    const loadOrder: number[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i += 6) loadOrder.push(i);
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (i % 6 !== 0) loadOrder.push(i);
    }

    loadOrder.forEach((index) => {
      const img = new Image();
      img.decoding = "async";
      img.src = getFramePath(index);
      img.onload = () => {
        if (isUnmounted) return;
        images[index] = img;
        loadedCount++;
        if (
          loadedCount === 1 ||
          Math.abs(Math.round(currentFrame) - index) <= 2
        ) {
          renderFrame(currentFrame, true);
        }
      };
    });

    // Ticker de GSAP para interpolar con suavidad los fotogramas al hacer scroll
    const onTick = () => {
      updateScrollTarget();
      const diff = targetFrame - currentFrame;
      if (Math.abs(diff) > 0.01) {
        currentFrame += diff * 0.22;
        renderFrame(currentFrame);
      } else if (lastDrawnFrameIndex === -1 && loadedCount > 0) {
        renderFrame(currentFrame, true);
      }
    };

    gsap.ticker.add(onTick);

    // Vinculación adicional con GSAP ScrollTrigger + evento nativo de scroll
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        targetFrame = self.progress * (TOTAL_FRAMES - 1);
      },
    });

    window.addEventListener("scroll", updateScrollTarget, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      isUnmounted = true;
      gsap.ticker.remove(onTick);
      window.removeEventListener("scroll", updateScrollTarget);
      window.removeEventListener("resize", handleResize);
      trigger.kill();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 w-full h-full pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block object-cover" />
      {/* Capa de superposición oscura gradual equilibrada para ver el estadio con nitidez y mantener legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#041122]/35 via-[#041122]/50 to-[#041122]/80" />
    </div>
  );
}
