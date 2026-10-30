"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Crosshair } from "lucide-react";
import clsx from "clsx";
import ClubCrest from "./ClubCrest";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#041122]/70 border-b border-[#D49B35]/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Izquierda: Escudo + Nombre del Club */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-105">
            <div className="absolute inset-0 rounded-full bg-[#D49B35]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <ClubCrest className="w-10 h-10 sm:w-11 sm:h-11 relative z-10 drop-shadow-[0_0_8px_rgba(212,155,53,0.4)]" />
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel font-bold text-base sm:text-xl tracking-[0.15em] text-white group-hover:text-[#D49B35] transition-colors">
              ATLÁNTICA F.C.
            </span>
            <span className="font-cinzel text-[10px] tracking-[0.28em] text-[#D49B35]/80 uppercase hidden xs:block">
              Donec Vincas
            </span>
          </div>
        </Link>

        {/* Derecha: Enlaces de navegación */}
        <nav className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/"
            className={clsx(
              "relative font-rajdhani font-bold uppercase tracking-[0.16em] text-sm sm:text-base px-3 py-2 transition-colors duration-200 flex items-center gap-1.5",
              pathname === "/"
                ? "text-[#D49B35]"
                : "text-white/80 hover:text-white"
            )}
          >
            <Shield className="w-4 h-4 text-[#D49B35] hidden sm:inline-block" />
            <span>EL CLUB</span>
            {pathname === "/" && (
              <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-[#D49B35] to-transparent shadow-[0_0_8px_#D49B35]" />
            )}
          </Link>

          <Link
            href="/pizarra"
            className={clsx(
              "relative group overflow-hidden rounded-lg font-rajdhani font-bold uppercase tracking-[0.14em] text-xs sm:text-sm px-4 sm:px-5 py-2.5 transition-all duration-300",
              "border border-[#D49B35] text-white",
              "shadow-[0_0_18px_rgba(212,155,53,0.35)] hover:shadow-[0_0_28px_rgba(212,155,53,0.7)]",
              pathname === "/pizarra"
                ? "bg-gradient-to-r from-[#004B93] via-[#004B93]/90 to-[#041122] ring-1 ring-[#D49B35]/60"
                : "bg-gradient-to-r from-[#041122]/90 via-[#004B93]/60 to-[#041122]/90 hover:from-[#004B93] hover:to-[#041122]"
            )}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D49B35]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10 flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-[#D49B35] transition-transform duration-300 group-hover:rotate-90" />
              <span>PIZARRA TÁCTICA</span>
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
