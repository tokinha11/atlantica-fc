"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { BarChart3 } from "lucide-react";
import { Player } from "@/types/player";
import ClubCrest from "./ClubCrest";

interface PlayerCardProps {
  player: Player;
  index?: number;
  onSelect?: (player: Player) => void;
}

export default function PlayerCard({
  player,
  index = 0,
  onSelect,
}: PlayerCardProps) {
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Valores de movimiento para inclinación 3D interactiva con el ratón
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 220, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [12, -12]);
  const rotateY = useTransform(smoothX, [0, 1], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(Math.max(0, Math.min(1, x)));
    mouseY.set(Math.max(0, Math.min(1, y)));
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.4),
        ease: "easeOut",
      }}
      style={{ perspective: 1100 }}
      className="w-full flex items-center justify-center"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect?.(player)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect?.(player);
          }
        }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.05 }}
        className="group relative w-full aspect-[2/3] flex items-center justify-center cursor-pointer select-none focus:outline-none"
      >
        {!imageError ? (
          <img
            src={player.cardImage}
            alt={`Carta FC 27 de ${player.name} (#${player.number})`}
            onError={() => setImageError(true)}
            style={{
              filter: "drop-shadow(0 10px 20px rgba(212, 155, 53, 0.35))",
            }}
            className="w-full h-full object-contain transition-all duration-300 group-hover:[filter:drop-shadow(0_14px_28px_rgba(212,155,53,0.65))_brightness(1.06)]"
            draggable={false}
          />
        ) : (
          /* Fallback en silueta de escudo si alguna imagen no estuviera disponible */
          <div
            style={{
              filter: "drop-shadow(0 10px 20px rgba(212, 155, 53, 0.35))",
            }}
            className="relative w-full h-full flex flex-col items-center justify-between p-6 text-center"
          >
            <ClubCrest className="w-24 h-24" />
            <div>
              <span className="font-rajdhani font-extrabold text-4xl text-[#D49B35]">
                #{player.number}
              </span>
              <h3 className="font-rajdhani font-extrabold text-2xl text-white uppercase tracking-wider mt-1">
                {player.name}
              </h3>
            </div>
          </div>
        )}

        {/* Insignia sutil en dorado al hacer hover: "VER ESTADÍSTICAS 📊" */}
        <div className="pointer-events-none absolute bottom-5 inset-x-0 flex justify-center z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#041122]/95 border border-[#D49B35] text-[#D49B35] font-rajdhani font-extrabold text-xs tracking-[0.16em] uppercase shadow-[0_0_20px_rgba(212,155,53,0.65)] backdrop-blur-md">
            <BarChart3 className="w-3.5 h-3.5 text-[#D49B35]" />
            <span>VER ESTADÍSTICAS 📊</span>
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
