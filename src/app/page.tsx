"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Shield,
  Trophy,
  Compass,
  Instagram,
  Tv,
  ExternalLink,
  Crosshair,
  Award,
} from "lucide-react";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import StadiumScrollCanvas from "@/components/StadiumScrollCanvas";
import PlayerCard from "@/components/PlayerCard";
import PlayerStatsModal from "@/components/PlayerStatsModal";
import ClubCrest from "@/components/ClubCrest";
import playersData from "@/data/players.json";
import { ClubStatsSummary, Player } from "@/types/player";

const players: Player[] = playersData;

// ============================================================================
// CONFIGURACIÓN EDITABLE DE ENLACES E HISTORIA DEL CLUB
// ============================================================================
const SOCIAL_AND_COMPETITION_LINKS = {
  instagram: {
    title: "INSTAGRAM OFICIAL",
    handle: "@atlanticafc",
    description:
      "Resultados de jornada, mejores goles, anuncios de plantilla y contenido exclusivo del vestuario.",
    url: "https://www.instagram.com/atlanticafc26?obrf=eHVsdmZqcjMwMTZv",
  },
  twitch: {
    title: "CANAL DE TWITCH",
    handle: "twitch.tv/atlanticafc",
    description:
      "Retransmisiones en directo de todos nuestros partidos oficiales de liga y torneos de Clubes Pro FC 27.",
    url: "https://www.twitch.tv/luismaseii",
  },
  leagues: [
    {
      id: "liga-1",
      name: "LIGA OFICIAL VIRUTAL PRO NETWORK",
      badge: "COMPETICIÓN OFICIAL",
      description:
        "Clasificación, calendario de jornadas, estadísticas oficiales y cuadro de enfrentamientos PLG.",
      url: "https://virtualpronetwork.com/es/teams/atlantica-fc",
    },
    {
      id: "liga-2",
      name: "LIGA OFICIAL VIRTUAL PRO GAMING",
      badge: "TORNEO ÉLITE FC 27",
      description:
        "Clasificación, calendario de jornadas, estadísticas oficiales y cuadro de enfrentamientos VPG.",
      url: "https://virtualprogaming.com/team/atlantica-fc",
    },
  ],
};

const CLUB_HISTORY_BLOCKS = [
  {
    id: "identidad",
    icon: Compass,
    tag: "01 • ORIGEN E IDENTIDAD",
    title: "Forjados en la Tormenta del Atlántico",
    text: "Nacidos de la pasión por el fútbol virtual competitivo y la hermandad dentro y fuera del terreno de juego, Atlántica F.C. representa la bravura del océano que nos da nombre. Nuestro escudo es símbolo de unión, lealtad al compañero y respeto por la camiseta en cada noche de partido.",
  },
  {
    id: "filosofia",
    icon: Trophy,
    tag: "02 • FILOSOFÍA COMPETITIVA EN FC 27",
    title: "Rigor Táctico y Dominio Colectivo",
    text: "En EA Sports FC 27 no entendemos el éxito como una jugada individual aislada, sino como la sincronía perfecta de once mentes sobre el césped. Desde la salida limpia de balón hasta la presión alta coordinada en nuestro 3-1-4-2 insignia, cada posesión tiene un propósito.",
  },
  {
    id: "valores",
    icon: Shield,
    tag: "03 • NUESTRO JURAMENTO",
    title: "Donec Vincas — Hasta que Venzas",
    text: "Nuestro lema en latín resume el carácter inquebrantable de esta plantilla: no importa la adversidad del marcador ni el minuto de descuento. En Atlántica F.C. se lucha cada balón dividido hasta el pitido final, con humildad en la victoria y firmeza en el aprendizaje.",
  },
];

export default function HomePage() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [clubStats, setClubStats] = useState<ClubStatsSummary | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    fetch("/api/club-stats?clubId=138351")
      .then((res) => res.json())
      .then((data: ClubStatsSummary) => {
        if (active && data?.players) {
          setClubStats(data);
        }
      })
      .catch((err) => {
        console.error("Error cargando estadísticas del club 138351:", err);
      })
      .finally(() => {
        if (active) setIsLoadingStats(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen text-white overflow-x-hidden">
        {/* Fondo Interactivo de Estadio conectado a GSAP ScrollTrigger */}
        <StadiumScrollCanvas />

        <div className="relative z-10">
          {/* ================================================================
              SECCIÓN 1 — HERO / PORTADA (100vh)
          ================================================================= */}
          <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center">
            {/* Halo de luz detrás del escudo */}
            <div
              className="pointer-events-none absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#004B93]/40 blur-[110px]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[#D49B35]/25 blur-[80px]"
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.82, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6 sm:mb-8"
            >
              <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 mx-auto">
                <div className="absolute inset-0 rounded-full border border-[#D49B35]/35 animate-pulse" />
                <div className="absolute inset-3 rounded-full border border-[#004B93]/60" />
                <ClubCrest className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 drop-shadow-[0_0_30px_rgba(212,155,53,0.55)]" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#041122]/80 border border-[#D49B35]/40 text-xs sm:text-sm font-rajdhani font-bold tracking-[0.28em] text-[#D49B35] uppercase mb-4 shadow-[0_0_20px_rgba(0,75,147,0.5)]">
                EA SPORTS FC 27 • CLUBES PRO COMPETITIVO
              </span>

              <h1 className="font-cinzel font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.12em] text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.9)]">
                ATLÁNTICA F.C.
              </h1>

              <div className="flex items-center justify-center gap-4 my-4 sm:my-5">
                <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-[#D49B35]" />
                <p className="font-cinzel font-bold text-lg sm:text-2xl md:text-3xl tracking-[0.35em] text-[#D49B35] uppercase drop-shadow-[0_0_15px_rgba(212,155,53,0.5)]">
                  &ldquo;DONEC VINCAS&rdquo;
                </p>
                <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-[#D49B35]" />
              </div>

              <p className="font-rajdhani text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto tracking-wide mt-2">
                Honor, pizarra y ambición competitiva en cada jornada. Bienvenidos
                al coliseo digital de nuestra plantilla oficial.
              </p>

              {/* Botones de acción rápida en Hero */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#plantilla"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#004B93] to-[#041122] border border-[#D49B35]/70 font-rajdhani font-bold text-sm sm:text-base uppercase tracking-[0.18em] text-white shadow-[0_0_25px_rgba(0,75,147,0.6)] hover:shadow-[0_0_30px_rgba(212,155,53,0.6)] hover:border-[#D49B35] transition-all"
                >
                  VER PLANTILLA OFICIAL
                </a>
                <Link
                  href="/pizarra"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#F3CA6E] via-[#D49B35] to-[#A6731B] text-[#041122] font-rajdhani font-extrabold text-sm sm:text-base uppercase tracking-[0.16em] shadow-[0_0_25px_rgba(212,155,53,0.45)] hover:brightness-110 transition-all"
                >
                  <Crosshair className="w-4 h-4 stroke-[2.5]" />
                  <span>ABRIR PIZARRA TÁCTICA</span>
                </Link>
              </div>
            </motion.div>

            {/* Indicador animado invitando a hacer scroll para adentrarse en el estadio */}
            <motion.a
              href="#historia"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/75 hover:text-[#D49B35] transition-colors cursor-pointer group"
            >
              <span className="font-rajdhani font-bold text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#D49B35]">
                ADÉNTRATE EN EL ESTADIO
              </span>
              <div className="w-7 h-11 rounded-full border border-[#D49B35]/50 flex items-start justify-center p-1.5 bg-[#041122]/60 backdrop-blur-sm group-hover:border-[#D49B35]">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ChevronDown className="w-4 h-4 text-[#D49B35]" />
                </motion.div>
              </div>
            </motion.a>
          </section>

          {/* ================================================================
              SECCIÓN 2 — SOBRE EL CLUB / HISTORIA
          ================================================================= */}
          <section
            id="historia"
            className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="backdrop-blur-xl bg-[#041122]/75 border border-[#D49B35]/30 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
              {/* Resplandor decorativo interior */}
              <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#004B93]/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#D49B35]/15 blur-3xl" />

              {/* Cabecera de la sección */}
              <div className="relative z-10 text-center max-w-3xl mx-auto mb-12">
                <span className="font-rajdhani font-bold text-xs sm:text-sm uppercase tracking-[0.28em] text-[#D49B35]">
                  LEGADO & FILOSOFÍA
                </span>
                <h2 className="font-cinzel font-bold text-3xl sm:text-4xl md:text-5xl tracking-[0.12em] text-white mt-2">
                  NUESTRA HISTORIA
                </h2>
                <p className="font-cinzel italic text-base sm:text-lg text-[#D49B35] tracking-[0.18em] mt-2">
                  &ldquo;Donec vincas — Hasta que venzas&rdquo;
                </p>
                <div className="w-28 h-[2px] bg-gradient-to-r from-transparent via-[#D49B35] to-transparent mx-auto mt-5" />
              </div>

              {/* 3 Bloques/Tarjetas sobre Identidad, Filosofía Competitiva y Valores */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {CLUB_HISTORY_BLOCKS.map((block, idx) => {
                  const IconComponent = block.icon;
                  return (
                    <motion.article
                      key={block.id}
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.12 }}
                      className="group relative rounded-xl bg-[#041122]/80 border border-[#D49B35]/25 hover:border-[#D49B35]/70 p-6 sm:p-7 transition-all duration-300 shadow-[0_0_20px_rgba(0,75,147,0.25)] hover:shadow-[0_0_30px_rgba(212,155,53,0.25)] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <span className="font-rajdhani font-bold text-xs tracking-[0.2em] text-[#D49B35] uppercase">
                            {block.tag}
                          </span>
                          <div className="w-10 h-10 rounded-lg bg-[#004B93]/40 border border-[#D49B35]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <IconComponent className="w-5 h-5 text-[#D49B35]" />
                          </div>
                        </div>

                        <h3 className="font-cinzel font-bold text-lg sm:text-xl text-white tracking-wide mb-3 group-hover:text-[#D49B35] transition-colors">
                          {block.title}
                        </h3>

                        <p className="font-montserrat text-sm sm:text-[15px] leading-relaxed text-white/80">
                          {block.text}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#D49B35]/15 flex items-center justify-between text-xs font-rajdhani font-bold tracking-widest text-white/50 uppercase">
                        <span>ATLÁNTICA F.C.</span>
                        <span className="text-[#D49B35]">EST. FC 27</span>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </motion.div>
          </section>

          {/* ================================================================
              SECCIÓN 3 — PLANTILLA OFICIAL (ESTILO ULTIMATE TEAM)
          ================================================================= */}
          <section
            id="plantilla"
            className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
          >
            {/* Título de Sección con detalles dorados */}
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#004B93]/40 border border-[#D49B35]/40 text-xs font-rajdhani font-bold tracking-[0.25em] text-[#D49B35] uppercase mb-3">
                <Award className="w-3.5 h-3.5 text-[#D49B35]" />
                <span>17 JUGADORES OFICIALES • ULTIMATE TEAM SHOWCASE</span>
              </div>
              <h2 className="font-cinzel font-bold text-3xl sm:text-5xl tracking-[0.14em] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                PLANTILLA OFICIAL FC 27
              </h2>
              <p className="font-rajdhani text-sm sm:text-base text-white/75 tracking-wider mt-2">
                Haz clic en cualquier carta para abrir su expediente táctico y
                estadísticas en tiempo real (Club ID: 138351)
              </p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D49B35]" />
                <span className="w-2.5 h-2.5 rotate-45 bg-[#D49B35] shadow-[0_0_10px_#D49B35]" />
                <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D49B35]" />
              </div>
            </div>

            {/* Grid responsivo: 1 col en móvil, 2 en tablet, 3-4 en escritorio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
              {players.map((player, index) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  index={index}
                  onSelect={(p) => setSelectedPlayer(p)}
                />
              ))}
            </div>
          </section>

          {/* ================================================================
              SECCIÓN 4 — ENLACES DE INTERÉS Y COMPETICIONES (FOOTER INTERACTIVO)
          ================================================================= */}
          <footer className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-t border-[#D49B35]/30 bg-gradient-to-b from-transparent via-[#041122]/85 to-[#041122]">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="font-rajdhani font-bold text-xs sm:text-sm uppercase tracking-[0.28em] text-[#D49B35]">
                  COMUNIDAD & COMPETICIÓN
                </span>
                <h2 className="font-cinzel font-bold text-2xl sm:text-4xl tracking-[0.12em] text-white mt-2">
                  SÍGUENOS EN DIRECTO Y EN LIGA
                </h2>
              </div>

              {/* Tarjetas Grandes Interactivas: Redes Sociales + 2 Ligas Oficiales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                {/* 1. Instagram Oficial */}
                <a
                  href={SOCIAL_AND_COMPETITION_LINKS.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-2xl p-6 sm:p-8 backdrop-blur-xl bg-[#041122]/80 border border-[#D49B35]/35 hover:border-[#D49B35] shadow-[0_0_25px_rgba(0,75,147,0.35)] hover:shadow-[0_0_35px_rgba(212,155,53,0.45)] transition-all duration-300 flex items-start justify-between gap-4 overflow-hidden"
                >
                  <div className="pointer-events-none absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-[#D49B35]/15 blur-2xl group-hover:bg-[#D49B35]/30 transition-all" />
                  <div className="flex items-start gap-4 sm:gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#004B93] to-[#041122] border border-[#D49B35] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,155,53,0.4)] group-hover:scale-105 transition-transform">
                      <Instagram className="w-7 h-7 text-[#D49B35]" />
                    </div>
                    <div>
                      <span className="font-rajdhani font-bold text-xs tracking-[0.22em] text-[#D49B35] uppercase">
                        {SOCIAL_AND_COMPETITION_LINKS.instagram.handle}
                      </span>
                      <h3 className="font-cinzel font-bold text-xl sm:text-2xl text-white tracking-wider mt-0.5 group-hover:text-[#D49B35] transition-colors">
                        {SOCIAL_AND_COMPETITION_LINKS.instagram.title}
                      </h3>
                      <p className="font-montserrat text-xs sm:text-sm text-white/75 mt-2 leading-relaxed">
                        {SOCIAL_AND_COMPETITION_LINKS.instagram.description}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-[#D49B35]/70 group-hover:text-[#D49B35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                </a>

                {/* 2. Canal de Twitch */}
                <a
                  href={SOCIAL_AND_COMPETITION_LINKS.twitch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-2xl p-6 sm:p-8 backdrop-blur-xl bg-[#041122]/80 border border-[#D49B35]/35 hover:border-[#D49B35] shadow-[0_0_25px_rgba(0,75,147,0.35)] hover:shadow-[0_0_35px_rgba(212,155,53,0.45)] transition-all duration-300 flex items-start justify-between gap-4 overflow-hidden"
                >
                  <div className="pointer-events-none absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-[#004B93]/30 blur-2xl group-hover:bg-[#004B93]/50 transition-all" />
                  <div className="flex items-start gap-4 sm:gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#004B93] to-[#041122] border border-[#D49B35] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,155,53,0.4)] group-hover:scale-105 transition-transform">
                      <Tv className="w-7 h-7 text-[#D49B35]" />
                    </div>
                    <div>
                      <span className="font-rajdhani font-bold text-xs tracking-[0.22em] text-[#D49B35] uppercase">
                        {SOCIAL_AND_COMPETITION_LINKS.twitch.handle}
                      </span>
                      <h3 className="font-cinzel font-bold text-xl sm:text-2xl text-white tracking-wider mt-0.5 group-hover:text-[#D49B35] transition-colors">
                        {SOCIAL_AND_COMPETITION_LINKS.twitch.title}
                      </h3>
                      <p className="font-montserrat text-xs sm:text-sm text-white/75 mt-2 leading-relaxed">
                        {SOCIAL_AND_COMPETITION_LINKS.twitch.description}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-[#D49B35]/70 group-hover:text-[#D49B35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                </a>

                {/* 3. Ligas Oficiales donde competimos (2 tarjetas destacadas) */}
                {SOCIAL_AND_COMPETITION_LINKS.leagues.map((league) => (
                  <a
                    key={league.id}
                    href={league.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative rounded-2xl p-6 sm:p-8 backdrop-blur-xl bg-gradient-to-br from-[#041122]/90 via-[#004B93]/25 to-[#041122]/90 border border-[#D49B35]/40 hover:border-[#D49B35] shadow-[0_0_25px_rgba(0,75,147,0.4)] hover:shadow-[0_0_35px_rgba(212,155,53,0.5)] transition-all duration-300 flex items-start justify-between gap-4 overflow-hidden"
                  >
                    <div className="flex items-start gap-4 sm:gap-5 relative z-10">
                      {/* Espacio para logo de la liga */}
                      <div className="w-14 h-14 rounded-xl bg-[#041122] border-2 border-[#D49B35]/70 flex flex-col items-center justify-center shrink-0 shadow-[0_0_18px_rgba(0,75,147,0.6)] group-hover:scale-105 transition-transform">
                        <Trophy className="w-6 h-6 text-[#D49B35]" />
                        <span className="text-[8px] font-rajdhani font-bold tracking-widest text-white/70 mt-0.5">
                          LIGA
                        </span>
                      </div>
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded bg-[#D49B35]/15 border border-[#D49B35]/40 font-rajdhani font-bold text-[10px] tracking-[0.2em] text-[#D49B35] uppercase">
                          {league.badge}
                        </span>
                        <h3 className="font-cinzel font-bold text-lg sm:text-xl text-white tracking-wider mt-1.5 group-hover:text-[#D49B35] transition-colors">
                          {league.name}
                        </h3>
                        <p className="font-montserrat text-xs sm:text-sm text-white/75 mt-2 leading-relaxed">
                          {league.description}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-[#D49B35]/70 group-hover:text-[#D49B35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </a>
                ))}
              </div>

              {/* Cierre Inferior con Escudo en Miniatura, Copyright y Lema */}
              <div className="pt-8 border-t border-[#D49B35]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <ClubCrest className="w-9 h-9" />
                  <div>
                    <p className="font-cinzel font-bold text-sm tracking-[0.18em] text-white">
                      ATLÁNTICA F.C.
                    </p>
                    <p className="font-rajdhani text-xs text-white/60 tracking-wider">
                      © {new Date().getFullYear()} Atlántica F.C. • Clubes Pro EA
                      Sports FC 27. Todos los derechos reservados.
                    </p>
                  </div>
                </div>

                <p className="font-cinzel font-bold text-sm sm:text-base tracking-[0.3em] text-[#D49B35] uppercase">
                  &ldquo;DONEC VINCAS&rdquo;
                </p>
              </div>
            </div>
          </footer>
        </div>

        {/* Modal Táctico Interactivo de Estadísticas en Tiempo Real (Club ID: 138351) */}
        <PlayerStatsModal
          player={selectedPlayer}
          allPlayers={players}
          clubStats={clubStats}
          isLoadingStats={isLoadingStats}
          onClose={() => setSelectedPlayer(null)}
        />
      </main>
    </SmoothScrollProvider>
  );
}
