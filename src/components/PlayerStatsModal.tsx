"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  X,
  Trophy,
  Target,
  Zap,
  Shield,
  Award,
  Activity,
  Swords,
  ClipboardList,
  BarChart3,
  Star,
  Flame,
  Users,
  Radio,
} from "lucide-react";
import clsx from "clsx";
import {
  ClubStatsSummary,
  NormalizedPlayerStats,
  Player,
} from "@/types/player";
import ClubCrest from "./ClubCrest";

interface PlayerStatsModalProps {
  player: Player | null;
  allPlayers: Player[];
  clubStats: ClubStatsSummary | null;
  isLoadingStats: boolean;
  onClose: () => void;
  onSwitchPlayer?: (player: Player) => void;
}

type ModalTab = "efficiency" | "comparator" | "all-stats";
type ComparisonCategory = "per-game" | "percentages";

// Componente de Anillo Circular Donut de Precisión (Gráfico 2)
function PrecisionDonutGauge({
  title,
  percentage,
  subtitle,
  detail,
  accentColor = "#D49B35",
}: {
  title: string;
  percentage: number;
  subtitle: string;
  detail: string;
  accentColor?: string;
}) {
  const safePct = Math.min(100, Math.max(0, Math.round(percentage)));
  const data = [
    { name: "Éxito", value: safePct },
    { name: "Resto", value: Math.max(0, 100 - safePct) },
  ];

  return (
    <div className="rounded-xl bg-[#041122]/85 border border-[#D49B35]/30 p-4 flex flex-col items-center text-center shadow-[0_0_20px_rgba(0,75,147,0.2)]">
      <span className="font-rajdhani font-bold text-xs uppercase tracking-[0.16em] text-[#D49B35] mb-1">
        {title}
      </span>

      <div className="relative w-32 h-32 my-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={56}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
              animationDuration={900}
            >
              <Cell fill={accentColor} />
              <Cell fill="rgba(0, 75, 147, 0.28)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-rajdhani font-extrabold text-2xl text-white leading-none">
            {safePct}%
          </span>
          <span className="font-rajdhani font-bold text-[10px] uppercase tracking-wider text-[#D49B35] mt-0.5">
            EFICACIA
          </span>
        </div>
      </div>

      <p className="font-rajdhani font-bold text-sm text-white mt-1">
        {subtitle}
      </p>
      <p className="font-montserrat text-[11px] text-white/60 mt-0.5">
        {detail}
      </p>
    </div>
  );
}

// Barra animada para Pestaña 3 (Todas las Estadísticas)
function StatProgressRow({
  label,
  value,
  progress,
  highlightGold = false,
}: {
  label: string;
  value: string | number;
  progress: number;
  highlightGold?: boolean;
}) {
  const clamped = Math.min(100, Math.max(4, Math.round(progress)));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs sm:text-sm font-rajdhani">
        <span className="text-white/80 font-semibold uppercase tracking-wider">
          {label}
        </span>
        <span
          className={clsx(
            "font-extrabold tracking-wider",
            highlightGold ? "text-[#D49B35]" : "text-white"
          )}
        >
          {value}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-[#041122] border border-[#004B93]/50 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={clsx(
            "h-full rounded-full",
            highlightGold
              ? "bg-gradient-to-r from-[#004B93] via-[#D49B35] to-[#F3CA6E]"
              : "bg-gradient-to-r from-[#004B93] to-[#D49B35]"
          )}
        />
      </div>
    </div>
  );
}

export default function PlayerStatsModal({
  player,
  allPlayers,
  clubStats,
  isLoadingStats,
  onClose,
}: PlayerStatsModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>("efficiency");
  const [compareTargetId, setCompareTargetId] = useState<string>("club-avg");
  const [compareCategory, setCompareCategory] =
    useState<ComparisonCategory>("per-game");

  // Cerrar con tecla ESC y bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    if (!player) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [player, onClose]);

  // Si cambiamos de jugador y el compañero comparado era él mismo, volver a Media del Club
  useEffect(() => {
    if (player && compareTargetId === player.id) {
      setCompareTargetId("club-avg");
    }
  }, [player, compareTargetId]);

  if (!player) return null;

  const stats: NormalizedPlayerStats | undefined =
    clubStats?.players?.[player.id];

  // Datos para el Radar Pentagonal (Gráfico 1)
  const radarData = stats
    ? [
        { subject: "Ataque", value: stats.radar.attack, fullMark: 100 },
        { subject: "Creación", value: stats.radar.creation, fullMark: 100 },
        {
          subject: "Distribución",
          value: stats.radar.distribution,
          fullMark: 100,
        },
        { subject: "Defensa", value: stats.radar.defense, fullMark: 100 },
        { subject: "Impacto", value: stats.radar.impact, fullMark: 100 },
      ]
    : [];

  // Datos de Balance de Partidos (Gráfico 3A)
  const matchBalanceData = stats
    ? [
        { name: "Victorias", value: stats.wins, color: "#D49B35" },
        { name: "Empates", value: stats.draws, color: "#004B93" },
        { name: "Derrotas", value: stats.losses, color: "#1E293B" },
      ]
    : [];

  // Cuota de Aportación al Club 138351 (Gráfico 3B)
  const clubTotals = clubStats?.totals || {
    gamesPlayed: 1,
    goals: 1,
    assists: 1,
    passesMade: 1,
    tacklesMade: 1,
    manOfTheMatch: 1,
  };

  const clubShareItems = stats
    ? [
        {
          label: "Goles del Club",
          playerVal: stats.goals,
          totalVal: Math.max(1, clubTotals.goals),
          pct: Number(
            ((stats.goals / Math.max(1, clubTotals.goals)) * 100).toFixed(1)
          ),
        },
        {
          label: "Asistencias del Club",
          playerVal: stats.assists,
          totalVal: Math.max(1, clubTotals.assists),
          pct: Number(
            ((stats.assists / Math.max(1, clubTotals.assists)) * 100).toFixed(1)
          ),
        },
        {
          label: "Pases Completados",
          playerVal: stats.passesMade,
          totalVal: Math.max(1, clubTotals.passesMade),
          pct: Number(
            (
              (stats.passesMade / Math.max(1, clubTotals.passesMade)) *
              100
            ).toFixed(1)
          ),
        },
        {
          label: "Entradas Exitosas",
          playerVal: stats.tacklesMade,
          totalVal: Math.max(1, clubTotals.tacklesMade),
          pct: Number(
            (
              (stats.tacklesMade / Math.max(1, clubTotals.tacklesMade)) *
              100
            ).toFixed(1)
          ),
        },
      ]
    : [];

  // Datos para el Comparador Interactivo (Gráfico 4 - Pestaña 2)
  const comparedTeammateStats =
    compareTargetId !== "club-avg"
      ? clubStats?.players?.[compareTargetId]
      : undefined;

  const comparisonTargetName =
    compareTargetId === "club-avg"
      ? "Media Atlántica F.C."
      : comparedTeammateStats?.playerName || "Compañero";

  const comparatorChartData = stats
    ? compareCategory === "per-game"
      ? [
          {
            metric: "Goles / Part.",
            jugador: stats.goalsPerGame,
            comparado:
              compareTargetId === "club-avg"
                ? clubStats?.averages.goalsPerGame ?? 0.45
                : comparedTeammateStats?.goalsPerGame ?? 0,
          },
          {
            metric: "Asist. / Part.",
            jugador: stats.assistsPerGame,
            comparado:
              compareTargetId === "club-avg"
                ? clubStats?.averages.assistsPerGame ?? 0.38
                : comparedTeammateStats?.assistsPerGame ?? 0,
          },
          {
            metric: "Pases / Part.",
            jugador: stats.passesPerGame,
            comparado:
              compareTargetId === "club-avg"
                ? clubStats?.averages.passesPerGame ?? 18.5
                : comparedTeammateStats?.passesPerGame ?? 0,
          },
          {
            metric: "Entradas / Part.",
            jugador: stats.tacklesPerGame,
            comparado:
              compareTargetId === "club-avg"
                ? clubStats?.averages.tacklesPerGame ?? 2.1
                : comparedTeammateStats?.tacklesPerGame ?? 0,
          },
        ]
      : [
          {
            metric: "% Éxito Pase",
            jugador: stats.passSuccessRate,
            comparado:
              compareTargetId === "club-avg"
                ? clubStats?.averages.passSuccessRate ?? 81
                : comparedTeammateStats?.passSuccessRate ?? 0,
          },
          {
            metric: "% Efect. Tiro",
            jugador: stats.shotSuccessRate,
            comparado:
              compareTargetId === "club-avg"
                ? clubStats?.averages.shotSuccessRate ?? 28
                : comparedTeammateStats?.shotSuccessRate ?? 0,
          },
          {
            metric: "% Éxito Entradas",
            jugador: stats.tackleSuccessRate,
            comparado:
              compareTargetId === "club-avg"
                ? clubStats?.averages.tackleSuccessRate ?? 38
                : comparedTeammateStats?.tackleSuccessRate ?? 0,
          },
          {
            metric: "Nota Media (x10)",
            jugador: Number((stats.ratingAve * 10).toFixed(1)),
            comparado:
              compareTargetId === "club-avg"
                ? Number(((clubStats?.averages.ratingAve ?? 7.4) * 10).toFixed(1))
                : Number(((comparedTeammateStats?.ratingAve ?? 7.0) * 10).toFixed(1)),
          },
        ]
    : [];

  return (
    <AnimatePresence>
      <motion.div
        key="player-stats-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#041122]/85 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto custom-scrollbar rounded-2xl bg-gradient-to-b from-[#041122] via-[#04152B] to-[#041122] border-2 border-[#D49B35]/70 shadow-[0_0_60px_rgba(0,75,147,0.65)] p-5 sm:p-7 text-white"
        >
          {/* Resplandores decorativos internos */}
          <div className="pointer-events-none absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#004B93]/35 blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#D49B35]/15 blur-[110px]" />

          {/* Cabecera Superior del Modal */}
          <div className="relative z-10 flex items-center justify-between gap-4 pb-4 mb-6 border-b border-[#D49B35]/30">
            <div className="flex items-center gap-3">
              <ClubCrest className="w-10 h-10 sm:w-12 sm:h-12" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-cinzel font-bold text-base sm:text-xl tracking-[0.14em] text-white">
                    EXPEDIENTE TÁCTICO OFICIAL
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#004B93]/50 border border-[#D49B35]/50 font-rajdhani font-bold text-[11px] tracking-widest text-[#D49B35] uppercase">
                    <Radio className="w-3 h-3 text-[#25D366] animate-pulse" />
                    CLUB ID: 138351
                  </span>
                </div>
                <p className="font-rajdhani text-xs sm:text-sm text-white/65 tracking-wider uppercase">
                  EA SPORTS FC 27 • TELEMETRÍA EN TIEMPO REAL DE PLANTILLA
                </p>
              </div>
            </div>

            {/* Botón X Dorado para cerrar */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal de estadísticas"
              className="w-10 h-10 rounded-xl bg-[#041122] hover:bg-[#D49B35] text-[#D49B35] hover:text-[#041122] border border-[#D49B35] flex items-center justify-center transition-all shadow-[0_0_15px_rgba(212,155,53,0.35)]"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {isLoadingStats || !stats ? (
            <div className="py-24 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-[#D49B35] border-t-transparent animate-spin" />
              <p className="font-cinzel text-lg tracking-widest text-[#D49B35]">
                SINCRONIZANDO TELEMETRÍA DEL CLUB 138351...
              </p>
            </div>
          ) : (
            /* ESTRUCTURA PRINCIPAL: COLUMNA IZQUIERDA (Identidad + Radar) + COLUMNA DERECHA (KPIs + 3 Pestañas) */
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* ============================================================
                  COLUMNA IZQUIERDA (4 cols): CARTA TRANSPARENTE + RADAR PENTAGONAL
              ============================================================= */}
              <div className="lg:col-span-4 flex flex-col items-center rounded-2xl bg-[#041122]/80 border border-[#D49B35]/35 p-4 sm:p-5 shadow-xl">
                {/* Carta .webp transparente con drop-shadow dorado */}
                <div className="relative w-44 sm:w-52 aspect-[2/3] flex items-center justify-center">
                  <img
                    src={player.cardImage}
                    alt={player.name}
                    style={{
                      filter:
                        "drop-shadow(0 12px 24px rgba(212, 155, 53, 0.45))",
                    }}
                    className="w-full h-full object-contain select-none"
                    draggable={false}
                  />
                </div>

                {/* Identidad, Dorsal y Posición Favorita devuelta por la API */}
                <div className="w-full text-center mt-2 pb-4 border-b border-[#D49B35]/25">
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#004B93]/50 border border-[#D49B35]/60 text-xs font-rajdhani font-bold tracking-widest text-[#D49B35] uppercase mb-1.5">
                    <span>{stats.favoritePositionLabel}</span>
                    <span>•</span>
                    <span>MEDIA {stats.proOverall}</span>
                  </div>

                  <h2 className="font-cinzel font-black text-2xl sm:text-3xl tracking-[0.1em] text-white">
                    <span className="text-[#D49B35] mr-1.5">
                      #{player.number}
                    </span>
                    {player.name}
                  </h2>

                  <p className="font-rajdhani font-bold text-xs tracking-[0.2em] text-white/60 uppercase mt-0.5">
                    EA ID:{" "}
                    <span className="text-white/90">{stats.eaGamertag}</span> (
                    {stats.proName})
                  </p>
                </div>

                {/* GRÁFICO 1: RADAR DE PERFIL DE RENDIMIENTO (5 VÉRTICES) */}
                <div className="w-full mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-rajdhani font-extrabold text-xs uppercase tracking-[0.18em] text-[#D49B35]">
                      PERFIL TÁCTICO (0 - 100)
                    </span>
                    <span className="font-rajdhani font-bold text-xs text-white/60">
                      FC 27 PRO
                    </span>
                  </div>

                  <div className="w-full h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="72%"
                        data={radarData}
                      >
                        <PolarGrid stroke="rgba(212, 155, 53, 0.25)" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{
                            fill: "#FFFFFF",
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 100]}
                          tick={false}
                          axisLine={false}
                        />
                        <Radar
                          name={player.name}
                          dataKey="value"
                          stroke="#D49B35"
                          strokeWidth={2}
                          fill="#D49B35"
                          fillOpacity={0.35}
                          isAnimationActive={true}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(4, 17, 34, 0.95)",
                            borderColor: "#D49B35",
                            borderRadius: "10px",
                            color: "#FFFFFF",
                            fontSize: "12px",
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Mini resumen numérico de los 5 vértices */}
                  <div className="grid grid-cols-5 gap-1.5 text-center pt-1">
                    {radarData.map((item) => (
                      <div
                        key={item.subject}
                        className="rounded-lg bg-[#041122] border border-[#D49B35]/30 py-1.5 px-1"
                      >
                        <span className="block font-rajdhani font-extrabold text-sm text-[#D49B35] leading-none">
                          {item.value}
                        </span>
                        <span className="block font-rajdhani text-[9px] text-white/70 uppercase tracking-tighter truncate mt-0.5">
                          {item.subject}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ============================================================
                  COLUMNA DERECHA (8 cols): 6 KPIs + 3 PESTAÑAS INTERACTIVAS
              ============================================================= */}
              <div className="lg:col-span-8 flex flex-col gap-5">
                {/* FILA SUPERIOR DE 6 KPIs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                  {/* KPI 1: Partidos Jugados */}
                  <div className="rounded-xl bg-[#041122]/90 border border-[#D49B35]/40 p-3.5 flex flex-col justify-between shadow-lg">
                    <span className="font-rajdhani font-bold text-[11px] uppercase tracking-wider text-white/70 flex items-center justify-between">
                      <span>PARTIDOS</span>
                      <Activity className="w-3.5 h-3.5 text-[#D49B35]" />
                    </span>
                    <span className="font-rajdhani font-extrabold text-2xl sm:text-3xl text-white mt-1">
                      {stats.gamesPlayed}
                    </span>
                    <span className="font-montserrat text-[10px] text-white/50">
                      Oficiales Club
                    </span>
                  </div>

                  {/* KPI 2: Nota Media (Destacada en Dorado) */}
                  <div className="rounded-xl bg-gradient-to-br from-[#D49B35]/25 via-[#041122] to-[#041122] border-2 border-[#D49B35] p-3.5 flex flex-col justify-between shadow-[0_0_20px_rgba(212,155,53,0.3)]">
                    <span className="font-rajdhani font-extrabold text-[11px] uppercase tracking-wider text-[#D49B35] flex items-center justify-between">
                      <span>NOTA MEDIA</span>
                      <Star className="w-3.5 h-3.5 text-[#D49B35] fill-[#D49B35]" />
                    </span>
                    <span className="font-rajdhani font-extrabold text-2xl sm:text-3xl text-[#D49B35] mt-1 drop-shadow-[0_0_8px_rgba(212,155,53,0.5)]">
                      {stats.ratingAve.toFixed(1)}
                    </span>
                    <span className="font-montserrat text-[10px] text-[#D49B35]/80">
                      Valoración EA
                    </span>
                  </div>

                  {/* KPI 3: Goles */}
                  <div className="rounded-xl bg-[#041122]/90 border border-[#D49B35]/40 p-3.5 flex flex-col justify-between shadow-lg">
                    <span className="font-rajdhani font-bold text-[11px] uppercase tracking-wider text-white/70 flex items-center justify-between">
                      <span>GOLES</span>
                      <Flame className="w-3.5 h-3.5 text-[#D49B35]" />
                    </span>
                    <span className="font-rajdhani font-extrabold text-2xl sm:text-3xl text-white mt-1">
                      {stats.goals}
                    </span>
                    <span className="font-montserrat text-[10px] text-[#D49B35]">
                      {stats.goalsPerGame} / partido
                    </span>
                  </div>

                  {/* KPI 4: Asistencias */}
                  <div className="rounded-xl bg-[#041122]/90 border border-[#D49B35]/40 p-3.5 flex flex-col justify-between shadow-lg">
                    <span className="font-rajdhani font-bold text-[11px] uppercase tracking-wider text-white/70 flex items-center justify-between">
                      <span>ASISTENCIAS</span>
                      <Zap className="w-3.5 h-3.5 text-[#D49B35]" />
                    </span>
                    <span className="font-rajdhani font-extrabold text-2xl sm:text-3xl text-white mt-1">
                      {stats.assists}
                    </span>
                    <span className="font-montserrat text-[10px] text-[#D49B35]">
                      {stats.assistsPerGame} / partido
                    </span>
                  </div>

                  {/* KPI 5: MOTM */}
                  <div className="rounded-xl bg-[#041122]/90 border border-[#D49B35]/40 p-3.5 flex flex-col justify-between shadow-lg">
                    <span className="font-rajdhani font-bold text-[11px] uppercase tracking-wider text-white/70 flex items-center justify-between">
                      <span>MOTM (MVP)</span>
                      <Award className="w-3.5 h-3.5 text-[#D49B35]" />
                    </span>
                    <span className="font-rajdhani font-extrabold text-2xl sm:text-3xl text-white mt-1">
                      {stats.manOfTheMatch}
                    </span>
                    <span className="font-montserrat text-[10px] text-white/50">
                      Jugador del Partido
                    </span>
                  </div>

                  {/* KPI 6: % Victorias */}
                  <div className="rounded-xl bg-[#041122]/90 border border-[#D49B35]/40 p-3.5 flex flex-col justify-between shadow-lg">
                    <span className="font-rajdhani font-bold text-[11px] uppercase tracking-wider text-white/70 flex items-center justify-between">
                      <span>% VICTORIAS</span>
                      <Trophy className="w-3.5 h-3.5 text-[#D49B35]" />
                    </span>
                    <span className="font-rajdhani font-extrabold text-2xl sm:text-3xl text-white mt-1">
                      {stats.winRate}%
                    </span>
                    <span className="font-montserrat text-[10px] text-[#D49B35]">
                      {stats.wins}V - {stats.draws}E - {stats.losses}D
                    </span>
                  </div>
                </div>

                {/* NAVEGACIÓN INTERNA POR 3 PESTAÑAS INTERACTIVAS */}
                <div className="flex flex-wrap items-center gap-2 bg-[#041122]/90 p-1.5 rounded-xl border border-[#D49B35]/35">
                  <button
                    type="button"
                    onClick={() => setActiveTab("efficiency")}
                    className={clsx(
                      "flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-rajdhani font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all",
                      activeTab === "efficiency"
                        ? "bg-gradient-to-r from-[#D49B35] to-[#b88222] text-[#041122] shadow-[0_0_16px_rgba(212,155,53,0.45)]"
                        : "text-white/75 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>📊 ANÁLISIS VISUAL Y EFICIENCIA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("comparator")}
                    className={clsx(
                      "flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-rajdhani font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all",
                      activeTab === "comparator"
                        ? "bg-gradient-to-r from-[#D49B35] to-[#b88222] text-[#041122] shadow-[0_0_16px_rgba(212,155,53,0.45)]"
                        : "text-white/75 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Swords className="w-4 h-4" />
                    <span>⚔️ COMPARADOR DE RENDIMIENTO</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("all-stats")}
                    className={clsx(
                      "flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-rajdhani font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all",
                      activeTab === "all-stats"
                        ? "bg-gradient-to-r from-[#D49B35] to-[#b88222] text-[#041122] shadow-[0_0_16px_rgba(212,155,53,0.45)]"
                        : "text-white/75 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span>📋 TODAS LAS ESTADÍSTICAS</span>
                  </button>
                </div>

                {/* ==========================================================
                    PESTAÑA 1: ANÁLISIS VISUAL Y EFICIENCIA
                =========================================================== */}
                {activeTab === "efficiency" && (
                  <div className="space-y-5">
                    {/* GRÁFICO 2: 3 ANILLOS DE PRECISIÓN */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <PrecisionDonutGauge
                        title="PRECISIÓN DE PASE"
                        percentage={stats.passSuccessRate}
                        subtitle={`${stats.passesMade} pases completados`}
                        detail={`${stats.passesPerGame} pases por partido`}
                        accentColor="#D49B35"
                      />
                      <PrecisionDonutGauge
                        title="EFECTIVIDAD DE TIRO"
                        percentage={stats.shotSuccessRate}
                        subtitle={`${stats.goals} goles / ${stats.shotsTotal} tiros`}
                        detail={`Promedio: ${stats.goalsPerGame} goles/partido`}
                        accentColor="#D49B35"
                      />
                      <PrecisionDonutGauge
                        title="ÉXITO EN ENTRADAS"
                        percentage={stats.tackleSuccessRate}
                        subtitle={`${stats.tacklesMade} entradas ganadas`}
                        detail={`${stats.tacklesPerGame} entradas por partido`}
                        accentColor="#D49B35"
                      />
                    </div>

                    {/* GRÁFICO 3: BALANCE DE PARTIDOS + CUOTA EN EL CLUB 138351 */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Balance de Partidos (Victorias / Empates / Derrotas) */}
                      <div className="md:col-span-5 rounded-xl bg-[#041122]/85 border border-[#D49B35]/30 p-4 flex flex-col justify-between">
                        <div>
                          <h3 className="font-cinzel font-bold text-sm tracking-wider text-white uppercase">
                            BALANCE DE PARTIDOS
                          </h3>
                          <p className="font-rajdhani text-xs text-[#D49B35] uppercase tracking-wider">
                            Proporción en {stats.gamesPlayed} encuentros
                          </p>
                        </div>

                        <div className="h-44 w-full my-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={matchBalanceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={38}
                                outerRadius={62}
                                paddingAngle={3}
                                dataKey="value"
                                stroke="none"
                              >
                                {matchBalanceData.map((entry, idx) => (
                                  <Cell key={idx} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(4, 17, 34, 0.95)",
                                  borderColor: "#D49B35",
                                  borderRadius: "10px",
                                  color: "#FFFFFF",
                                  fontSize: "12px",
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#D49B35]/20">
                          <div>
                            <span className="block font-rajdhani font-extrabold text-base text-[#D49B35]">
                              {stats.wins}
                            </span>
                            <span className="text-[10px] font-rajdhani uppercase text-white/70">
                              Victorias
                            </span>
                          </div>
                          <div>
                            <span className="block font-rajdhani font-extrabold text-base text-[#38bdf8]">
                              {stats.draws}
                            </span>
                            <span className="text-[10px] font-rajdhani uppercase text-white/70">
                              Empates
                            </span>
                          </div>
                          <div>
                            <span className="block font-rajdhani font-extrabold text-base text-white/60">
                              {stats.losses}
                            </span>
                            <span className="text-[10px] font-rajdhani uppercase text-white/70">
                              Derrotas
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Cuota de Aportación al Total del Club 138351 */}
                      <div className="md:col-span-7 rounded-xl bg-[#041122]/85 border border-[#D49B35]/30 p-4 flex flex-col justify-between">
                        <div className="mb-3">
                          <h3 className="font-cinzel font-bold text-sm tracking-wider text-white uppercase">
                            CUOTA DE APORTACIÓN EN ATLÁNTICA F.C.
                          </h3>
                          <p className="font-rajdhani text-xs text-[#D49B35] uppercase tracking-wider">
                            Peso de {player.name} sobre el total acumulado del
                            Club #138351
                          </p>
                        </div>

                        <div className="space-y-3.5 my-auto">
                          {clubShareItems.map((item) => (
                            <div key={item.label} className="space-y-1">
                              <div className="flex items-center justify-between text-xs font-rajdhani">
                                <span className="font-bold text-white uppercase tracking-wider">
                                  {item.label}
                                </span>
                                <span className="text-white/80">
                                  <strong className="text-[#D49B35]">
                                    {item.playerVal}
                                  </strong>{" "}
                                  de {item.totalVal} ({item.pct}%)
                                </span>
                              </div>
                              <div className="h-3 w-full rounded-full bg-[#004B93]/30 border border-[#004B93] overflow-hidden flex">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${Math.min(100, Math.max(4, item.pct * 2.2))}%`,
                                  }}
                                  transition={{ duration: 0.8 }}
                                  className="h-full bg-gradient-to-r from-[#D49B35] to-[#F3CA6E]"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-2.5 border-t border-[#D49B35]/20 flex items-center justify-between text-[11px] font-rajdhani text-white/60">
                          <span>PLANTILLA OFICIAL: 17 JUGADORES</span>
                          <span className="text-[#D49B35] font-bold">
                            DONEC VINCAS
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ==========================================================
                    PESTAÑA 2: COMPARADOR DE RENDIMIENTO (BAR CHART RECHARTS)
                =========================================================== */}
                {activeTab === "comparator" && (
                  <div className="rounded-xl bg-[#041122]/85 border border-[#D49B35]/35 p-4 sm:p-5 space-y-5">
                    {/* Controles del Comparador */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-[#D49B35]/25">
                      {/* Selector de rival/compañero a comparar */}
                      <div className="flex flex-col gap-1 flex-1">
                        <label className="font-rajdhani font-bold text-xs uppercase tracking-wider text-[#D49B35] flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span>Comparar a {player.name} contra:</span>
                        </label>
                        <select
                          value={compareTargetId}
                          onChange={(e) => setCompareTargetId(e.target.value)}
                          className="bg-[#020913] border border-[#D49B35]/60 rounded-xl px-3.5 py-2 font-rajdhani font-bold text-sm text-white uppercase tracking-wider focus:outline-none focus:border-[#D49B35]"
                        >
                          <option value="club-avg">
                            ⭐ MEDIA DE ATLÁNTICA F.C. (CLUB #138351)
                          </option>
                          {allPlayers
                            .filter((p) => p.id !== player.id)
                            .map((teammate) => (
                              <option key={teammate.id} value={teammate.id}>
                                #{teammate.number} {teammate.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Selector de categoría de métricas */}
                      <div className="flex flex-col gap-1">
                        <span className="font-rajdhani font-bold text-xs uppercase tracking-wider text-white/70">
                          Categoría de métricas:
                        </span>
                        <div className="inline-flex rounded-xl bg-[#020913] border border-[#D49B35]/40 p-1">
                          <button
                            type="button"
                            onClick={() => setCompareCategory("per-game")}
                            className={clsx(
                              "px-3 py-1.5 rounded-lg font-rajdhani font-bold text-xs uppercase tracking-wider transition-all",
                              compareCategory === "per-game"
                                ? "bg-[#D49B35] text-[#041122]"
                                : "text-white/70 hover:text-white"
                            )}
                          >
                            Promedios / Partido
                          </button>
                          <button
                            type="button"
                            onClick={() => setCompareCategory("percentages")}
                            className={clsx(
                              "px-3 py-1.5 rounded-lg font-rajdhani font-bold text-xs uppercase tracking-wider transition-all",
                              compareCategory === "percentages"
                                ? "bg-[#D49B35] text-[#041122]"
                                : "text-white/70 hover:text-white"
                            )}
                          >
                            % Éxito y Nota
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* GRÁFICO 4: BARRAS DOBLES INTERACTIVAS */}
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={comparatorChartData}
                          margin={{ top: 12, right: 16, left: -10, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(212, 155, 53, 0.15)"
                          />
                          <XAxis
                            dataKey="metric"
                            tick={{
                              fill: "#FFFFFF",
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          />
                          <YAxis
                            tick={{
                              fill: "rgba(255,255,255,0.7)",
                              fontSize: 11,
                            }}
                          />
                          <Tooltip
                            cursor={{ fill: "rgba(212, 155, 53, 0.08)" }}
                            contentStyle={{
                              backgroundColor: "rgba(4, 17, 34, 0.92)",
                              backdropFilter: "blur(12px)",
                              borderColor: "#D49B35",
                              borderRadius: "12px",
                              color: "#FFFFFF",
                            }}
                          />
                          <Legend
                            wrapperStyle={{
                              paddingTop: "10px",
                              fontSize: "12px",
                              fontWeight: 700,
                            }}
                          />
                          <Bar
                            name={`#${player.number} ${player.name}`}
                            dataKey="jugador"
                            fill="#D49B35"
                            radius={[6, 6, 0, 0]}
                          />
                          <Bar
                            name={comparisonTargetName}
                            dataKey="comparado"
                            fill="#004B93"
                            radius={[6, 6, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* ==========================================================
                    PESTAÑA 3: TODAS LAS ESTADÍSTICAS (3 BLOQUES COMPLETOS)
                =========================================================== */}
                {activeTab === "all-stats" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* BLOQUE 1: ATAQUE */}
                    <div className="rounded-xl bg-[#041122]/85 border border-[#D49B35]/35 p-4 space-y-3.5">
                      <div className="flex items-center gap-2 pb-2 border-b border-[#D49B35]/25">
                        <Target className="w-4 h-4 text-[#D49B35]" />
                        <h3 className="font-cinzel font-bold text-sm tracking-wider text-[#D49B35] uppercase">
                          1. ATAQUE
                        </h3>
                      </div>

                      <StatProgressRow
                        label="Goles Totales"
                        value={stats.goals}
                        progress={(stats.goals / 65) * 100}
                        highlightGold
                      />
                      <StatProgressRow
                        label="Goles / Partido"
                        value={stats.goalsPerGame}
                        progress={stats.goalsPerGame * 85}
                      />
                      <StatProgressRow
                        label="Tiros Totales"
                        value={stats.shotsTotal}
                        progress={(stats.shotsTotal / 220) * 100}
                      />
                      <StatProgressRow
                        label="% Precisión de Tiro"
                        value={`${stats.shotSuccessRate}%`}
                        progress={stats.shotSuccessRate * 1.8}
                        highlightGold
                      />
                      <StatProgressRow
                        label="Mejor Racha (Goles)"
                        value={`${stats.bestStreak} seguidos`}
                        progress={(stats.bestStreak / 6) * 100}
                      />
                    </div>

                    {/* BLOQUE 2: CREACIÓN Y DISTRIBUCIÓN */}
                    <div className="rounded-xl bg-[#041122]/85 border border-[#D49B35]/35 p-4 space-y-3.5">
                      <div className="flex items-center gap-2 pb-2 border-b border-[#D49B35]/25">
                        <Zap className="w-4 h-4 text-[#D49B35]" />
                        <h3 className="font-cinzel font-bold text-sm tracking-wider text-[#D49B35] uppercase">
                          2. CREACIÓN Y PASE
                        </h3>
                      </div>

                      <StatProgressRow
                        label="Asistencias"
                        value={stats.assists}
                        progress={(stats.assists / 65) * 100}
                        highlightGold
                      />
                      <StatProgressRow
                        label="Asistencias / Partido"
                        value={stats.assistsPerGame}
                        progress={stats.assistsPerGame * 85}
                      />
                      <StatProgressRow
                        label="Pases Completados"
                        value={stats.passesMade}
                        progress={(stats.passesMade / 2600) * 100}
                      />
                      <StatProgressRow
                        label="% Precisión de Pase"
                        value={`${stats.passSuccessRate}%`}
                        progress={stats.passSuccessRate}
                        highlightGold
                      />
                      <StatProgressRow
                        label="Pases Clave / Centros"
                        value={stats.keyPasses}
                        progress={(stats.keyPasses / 140) * 100}
                      />
                    </div>

                    {/* BLOQUE 3: DEFENSA, PORTERÍA Y DISCIPLINA */}
                    <div className="rounded-xl bg-[#041122]/85 border border-[#D49B35]/35 p-4 space-y-3.5">
                      <div className="flex items-center gap-2 pb-2 border-b border-[#D49B35]/25">
                        <Shield className="w-4 h-4 text-[#D49B35]" />
                        <h3 className="font-cinzel font-bold text-sm tracking-wider text-[#D49B35] uppercase">
                          3. DEFENSA Y DISCIPLINA
                        </h3>
                      </div>

                      <StatProgressRow
                        label="Entradas Exitosas"
                        value={stats.tacklesMade}
                        progress={(stats.tacklesMade / 280) * 100}
                        highlightGold
                      />
                      <StatProgressRow
                        label="% Éxito Entradas"
                        value={`${stats.tackleSuccessRate}%`}
                        progress={stats.tackleSuccessRate * 1.6}
                      />
                      <StatProgressRow
                        label="Recuperaciones / Interc."
                        value={stats.interceptions}
                        progress={(stats.interceptions / 260) * 100}
                      />
                      <StatProgressRow
                        label="Porterías a Cero (DEF / GK)"
                        value={`${stats.cleanSheetsDef} DEF • ${stats.cleanSheetsGK} GK`}
                        progress={
                          ((stats.cleanSheetsDef + stats.cleanSheetsGK) / 15) *
                          100
                        }
                        highlightGold
                      />
                      <StatProgressRow
                        label="Disciplina (Amarillas / Rojas)"
                        value={`${stats.yellowCards} 🟨 • ${stats.redCards} 🟥`}
                        progress={Math.max(
                          8,
                          100 - (stats.yellowCards * 6 + stats.redCards * 20)
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
