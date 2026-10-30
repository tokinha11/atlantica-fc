import React from "react";
import TacticalBoard from "@/components/TacticalBoard";
import ClubCrest from "@/components/ClubCrest";

export default function PizarraPage() {
  return (
    <main className="relative min-h-screen pt-24 pb-16 text-white overflow-x-hidden">
      {/* ====================================================================
          FONDO ESTÁTICO DE ALTO RENDIMIENTO ESTILO MENÚ "CLUBS / UT" FC 27
      ===================================================================== */}
      <div
        className="fixed inset-0 z-0 bg-[#041122] overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {/* Degradados radiales en Azul Atlántico (#004B93/40) */}
        <div className="absolute -top-40 -left-40 w-[680px] h-[680px] rounded-full bg-[#004B93]/40 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[620px] h-[620px] rounded-full bg-[#004B93]/35 blur-[150px]" />
        <div className="absolute -bottom-48 left-1/3 w-[580px] h-[580px] rounded-full bg-[#004B93]/30 blur-[130px]" />

        {/* Haces de luz diagonales sutiles en Dorado Real (#D49B35/15) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(125deg, transparent 20%, rgba(212, 155, 53, 0.12) 36%, transparent 52%),
              linear-gradient(125deg, transparent 58%, rgba(212, 155, 53, 0.08) 70%, transparent 84%)
            `,
          }}
        />

        {/* Rejilla táctica sutil en SVG */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="fc27-tactical-grid"
              width="56"
              height="56"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 56 0 L 0 0 0 56"
                fill="none"
                stroke="#D49B35"
                strokeWidth="0.75"
              />
              <circle cx="0" cy="0" r="1" fill="#D49B35" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fc27-tactical-grid)" />
        </svg>

        {/* Escudo gigante de Atlántica F.C. en el centro como marca de agua translúcida (opacity-5) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <ClubCrest className="w-[540px] h-[540px] sm:w-[720px] sm:h-[720px]" />
        </div>
      </div>

      <div className="relative z-10">
        {/* Cabecera de la página Pizarra Táctica */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="font-rajdhani font-bold text-xs sm:text-sm uppercase tracking-[0.28em] text-[#D49B35]">
              EA SPORTS FC 27 • CENTRO DE MANDO TÁCTICO
            </span>
            <h1 className="font-cinzel font-bold text-2xl sm:text-4xl tracking-[0.12em] text-white mt-1">
              PIZARRA TÁCTICA OFICIAL
            </h1>
          </div>
          <p className="font-cinzel text-xs sm:text-sm tracking-[0.28em] text-[#D49B35]/90 uppercase">
            &ldquo;DONEC VINCAS&rdquo;
          </p>
        </div>

        {/* Componente Interactivo de Pizarra Táctica */}
        <TacticalBoard />
      </div>
    </main>
  );
}
