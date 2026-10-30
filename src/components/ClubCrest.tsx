"use client";

import React, { useState } from "react";
import clsx from "clsx";

const LOGO_SOURCES = [
  "/logo/escudo.png",
  "/logo/escudo.webp",
  "/logo/escudo.jpg",
];

interface ClubCrestProps {
  className?: string;
  alt?: string;
}

export default function ClubCrest({
  className = "w-12 h-12",
  alt = "Escudo Atlántica F.C.",
}: ClubCrestProps) {
  const [sourceIndex, setSourceIndex] = useState(0);

  if (sourceIndex < LOGO_SOURCES.length) {
    return (
      <img
        src={LOGO_SOURCES[sourceIndex]}
        alt={alt}
        onError={() => setSourceIndex((prev) => prev + 1)}
        className={clsx("object-contain select-none", className)}
        draggable={false}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("select-none", className)}
      aria-label={alt}
    >
      <circle
        cx="60"
        cy="75"
        r="50"
        fill="#004B93"
        stroke="#D49B35"
        strokeWidth="4"
      />
      <text
        x="60"
        y="84"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="serif"
        fontWeight="bold"
        fontSize="28"
      >
        AFC
      </text>
    </svg>
  );
}
