"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { toBlob } from "html-to-image";
import {
  Download,
  RotateCcw,
  Sparkles,
  Users,
  CheckCircle2,
  X,
  Edit3,
  Move,
  Copy,
  Check,
  Share2,
  MessageCircle,
  Settings,
  Send,
  AlertCircle,
  Link2,
  Trash2,
} from "lucide-react";
import clsx from "clsx";
import playersData from "@/data/players.json";
import { FormationKey, PitchSlot, Player } from "@/types/player";
import ClubCrest from "./ClubCrest";

const players: Player[] = playersData;
const DISCORD_WEBHOOK_STORAGE_KEY = "atlantica_fc_discord_webhook_url";

// Definición exacta de formaciones (coordenadas en porcentaje sobre el césped)
const FORMATIONS: Record<FormationKey, PitchSlot[]> = {
  "3-1-4-2": [
    { slotId: "slot-0", role: "POR", label: "Portero", x: 50, y: 88 },
    { slotId: "slot-1", role: "DFC", label: "DFC Izquierdo", x: 23, y: 71 },
    { slotId: "slot-2", role: "DFC", label: "DFC Central", x: 50, y: 73 },
    { slotId: "slot-3", role: "DFC", label: "DFC Derecho", x: 77, y: 71 },
    { slotId: "slot-4", role: "MCD", label: "Pivote Defensivo", x: 50, y: 55 },
    { slotId: "slot-5", role: "MI", label: "Banda Izquierda", x: 14, y: 38 },
    { slotId: "slot-6", role: "MC", label: "Interior Izquierdo", x: 38, y: 37 },
    { slotId: "slot-7", role: "MC", label: "Interior Derecho", x: 62, y: 37 },
    { slotId: "slot-8", role: "MD", label: "Banda Derecha", x: 86, y: 38 },
    { slotId: "slot-9", role: "DC", label: "Delantero Izquierdo", x: 35, y: 16 },
    { slotId: "slot-10", role: "DC", label: "Delantero Derecho", x: 65, y: 16 },
  ],
  "3-4-1-2": [
    { slotId: "slot-0", role: "POR", label: "Portero", x: 50, y: 88 },
    { slotId: "slot-1", role: "DFC", label: "DFC Izquierdo", x: 23, y: 72 },
    { slotId: "slot-2", role: "DFC", label: "DFC Central", x: 50, y: 74 },
    { slotId: "slot-3", role: "DFC", label: "DFC Derecho", x: 77, y: 72 },
    { slotId: "slot-4", role: "MCO", label: "Mediapunta Central", x: 50, y: 32 },
    { slotId: "slot-5", role: "MI", label: "Banda Izquierda", x: 14, y: 50 },
    { slotId: "slot-6", role: "MC", label: "Interior Izquierdo", x: 38, y: 53 },
    { slotId: "slot-7", role: "MC", label: "Interior Derecho", x: 62, y: 53 },
    { slotId: "slot-8", role: "MD", label: "Banda Derecha", x: 86, y: 50 },
    { slotId: "slot-9", role: "DC", label: "Delantero Izquierdo", x: 35, y: 15 },
    { slotId: "slot-10", role: "DC", label: "Delantero Derecho", x: 65, y: 15 },
  ],
  "4-3-3": [
    { slotId: "slot-0", role: "POR", label: "Portero", x: 50, y: 88 },
    { slotId: "slot-1", role: "LI", label: "Lateral Izquierdo", x: 15, y: 71 },
    { slotId: "slot-2", role: "DFC", label: "Central Izquierdo", x: 38, y: 73 },
    { slotId: "slot-3", role: "DFC", label: "Central Derecho", x: 62, y: 73 },
    { slotId: "slot-4", role: "LD", label: "Lateral Derecho", x: 85, y: 71 },
    { slotId: "slot-5", role: "MCD", label: "Pivote Defensivo", x: 50, y: 53 },
    { slotId: "slot-6", role: "MC", label: "Interior Izquierdo", x: 30, y: 39 },
    { slotId: "slot-7", role: "MC", label: "Interior Derecho", x: 70, y: 39 },
    { slotId: "slot-8", role: "EI", label: "Extremo Izquierdo", x: 18, y: 19 },
    { slotId: "slot-9", role: "DC", label: "Delantero Centro", x: 50, y: 15 },
    { slotId: "slot-10", role: "ED", label: "Extremo Derecho", x: 82, y: 19 },
  ],
  "4-2-3-1": [
    { slotId: "slot-0", role: "POR", label: "Portero", x: 50, y: 88 },
    { slotId: "slot-1", role: "LI", label: "Lateral Izquierdo", x: 15, y: 72 },
    { slotId: "slot-2", role: "DFC", label: "Central Izquierdo", x: 38, y: 74 },
    { slotId: "slot-3", role: "DFC", label: "Central Derecho", x: 62, y: 74 },
    { slotId: "slot-4", role: "LD", label: "Lateral Derecho", x: 85, y: 72 },
    { slotId: "slot-5", role: "MCD", label: "Doble Pivote Izq.", x: 36, y: 54 },
    { slotId: "slot-6", role: "MCD", label: "Doble Pivote Der.", x: 64, y: 54 },
    { slotId: "slot-7", role: "MCO", label: "Mediapunta Izq.", x: 20, y: 35 },
    { slotId: "slot-8", role: "MCO", label: "Enganche Central", x: 50, y: 33 },
    { slotId: "slot-9", role: "MCO", label: "Mediapunta Der.", x: 80, y: 35 },
    { slotId: "slot-10", role: "DC", label: "Delantero Centro", x: 50, y: 15 },
  ],
};

interface ToastNotification {
  id: number;
  variant: "whatsapp" | "discord" | "gold" | "error";
  title: string;
  message: string;
}

// Icono SVG oficial de Discord
function DiscordIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}

// Miniatura con silueta real transparente y drop-shadow dorado siguiendo la corona y el escudo
function MiniCardArt({
  player,
  sizeClass = "w-16 sm:w-20",
}: {
  player: Player;
  sizeClass?: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={clsx(
        sizeClass,
        "aspect-[2/3] relative flex items-center justify-center select-none"
      )}
    >
      {!imgError ? (
        <img
          src={player.cardImage}
          alt={player.name}
          onError={() => setImgError(true)}
          style={{
            filter: "drop-shadow(0 10px 20px rgba(212, 155, 53, 0.35))",
          }}
          className="w-full h-full object-contain pointer-events-none"
          draggable={false}
        />
      ) : (
        <div
          style={{
            filter: "drop-shadow(0 10px 20px rgba(212, 155, 53, 0.35))",
          }}
          className="w-full h-full flex flex-col items-center justify-center p-1 text-center"
        >
          <ClubCrest className="w-10 h-10" />
          <span className="font-rajdhani font-extrabold text-xs text-[#D49B35]">
            #{player.number}
          </span>
        </div>
      )}
    </div>
  );
}

// Componente de hueco en el campo (Droppable + Draggable si tiene jugador)
interface PitchSlotNodeProps {
  slot: PitchSlot;
  assignedPlayer: Player | null;
  isSelected: boolean;
  onSelectSlot: (slotId: string) => void;
  onRemovePlayer: (slotId: string) => void;
}

function PitchSlotNode({
  slot,
  assignedPlayer,
  isSelected,
  onSelectSlot,
  onRemovePlayer,
}: PitchSlotNodeProps) {
  const { isOver, setNodeRef: setDropRef } = useDroppable({
    id: slot.slotId,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `pitch:${slot.slotId}`,
    disabled: !assignedPlayer,
    data: {
      source: "pitch",
      slotId: slot.slotId,
      player: assignedPlayer,
    },
  });

  const dragStyle = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <div
      ref={setDropRef}
      style={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
      }}
      className={clsx(
        "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 transition-transform duration-200",
        isDragging && "z-40 opacity-40"
      )}
    >
      {/* Insignia dorada superior con la posición del hueco (DC, MCD, DFC, etc.) */}
      <div
        className={clsx(
          "mb-0.5 px-2 py-0.2 rounded-full text-[10px] sm:text-[11px] font-rajdhani font-extrabold tracking-wider uppercase border shadow-md transition-colors",
          assignedPlayer
            ? "bg-gradient-to-r from-[#D49B35] via-[#F3CA6E] to-[#D49B35] text-[#041122] border-white/40 shadow-[0_0_10px_rgba(212,155,53,0.6)]"
            : "bg-[#041122]/90 text-[#D49B35] border-[#D49B35]/60"
        )}
      >
        {slot.role}
      </div>

      {/* Contenedor de la Mini-Carta en Silueta o Hueco Vacío */}
      {assignedPlayer ? (
        <div className="relative group/slot flex flex-col items-center">
          {/* Botón rápido de quitar jugador (excluido en el PNG exportado) */}
          <button
            type="button"
            data-export-ignore="true"
            onClick={(e) => {
              e.stopPropagation();
              onRemovePlayer(slot.slotId);
            }}
            title="Devolver al banquillo"
            className="absolute top-0 -right-1 z-30 w-5 h-5 rounded-full bg-red-600/90 hover:bg-red-500 text-white border border-white/50 flex items-center justify-center opacity-0 group-hover/slot:opacity-100 focus:opacity-100 transition-opacity shadow-md"
          >
            <X className="w-3 h-3" />
          </button>

          <div
            ref={setDragRef}
            {...listeners}
            {...attributes}
            onClick={() => onSelectSlot(slot.slotId)}
            style={dragStyle}
            className={clsx(
              "cursor-grab active:cursor-grabbing transition-transform duration-200",
              isOver && "scale-110 [filter:drop-shadow(0_0_16px_rgba(212,155,53,0.9))]",
              isSelected &&
                "scale-110 [filter:drop-shadow(0_0_18px_rgba(212,155,53,0.95))]"
            )}
          >
            <MiniCardArt
              player={assignedPlayer}
              sizeClass="w-14 xs:w-16 sm:w-[74px] md:w-[82px]"
            />
          </div>

          {/* Etiqueta tipo píldora de alta legibilidad debajo de la miniatura */}
          <div className="-mt-1 relative z-20 bg-[#041122]/95 border border-[#D49B35] px-2 py-0.5 rounded text-[10px] sm:text-xs font-rajdhani font-bold text-white whitespace-nowrap shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
            <span className="text-[#D49B35] mr-1">#{assignedPlayer.number}</span>
            <span>{assignedPlayer.name}</span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onSelectSlot(slot.slotId)}
          className={clsx(
            "w-12 xs:w-14 sm:w-16 md:w-[72px] aspect-[3/4] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all duration-200 backdrop-blur-sm",
            isOver
              ? "border-[#D49B35] bg-[#D49B35]/25 scale-105 shadow-[0_0_20px_rgba(212,155,53,0.6)]"
              : isSelected
              ? "border-[#D49B35] bg-[#004B93]/50 scale-105 shadow-[0_0_20px_rgba(212,155,53,0.75)]"
              : "border-[#D49B35]/45 bg-[#041122]/65 hover:border-[#D49B35] hover:bg-[#004B93]/35"
          )}
        >
          <span className="w-6 h-6 rounded-full border border-[#D49B35]/50 flex items-center justify-center text-[#D49B35] text-sm font-bold">
            +
          </span>
          <span
            data-export-ignore="true"
            className="text-[9px] font-rajdhani font-bold uppercase tracking-wider text-white/70"
          >
            Elegir
          </span>
        </button>
      )}
    </div>
  );
}

// Ficha de jugador en el banquillo
interface BenchPlayerCardProps {
  player: Player;
  isInLineup: boolean;
  isSelectedPlayer: boolean;
  hasSelectedSlot: boolean;
  onClickBenchPlayer: (player: Player) => void;
}

function BenchPlayerCard({
  player,
  isInLineup,
  isSelectedPlayer,
  hasSelectedSlot,
  onClickBenchPlayer,
}: BenchPlayerCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `bench:${player.id}`,
      data: {
        source: "bench",
        player,
      },
    });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onClickBenchPlayer(player)}
      className={clsx(
        "group relative flex flex-col items-center p-1.5 rounded-xl transition-all duration-200 select-none cursor-grab active:cursor-grabbing",
        isDragging && "opacity-40 z-50",
        isInLineup
          ? "opacity-40 hover:opacity-75"
          : isSelectedPlayer
          ? "scale-105 [filter:drop-shadow(0_0_16px_rgba(212,155,53,0.8))]"
          : "hover:scale-105",
        hasSelectedSlot && !isInLineup && "hover:scale-105"
      )}
    >
      <div className="relative flex items-center justify-center">
        <MiniCardArt player={player} sizeClass="w-20 sm:w-24" />
        {/* Distintivo "EN EL 11" cuando el jugador ya está colocado en el campo */}
        {isInLineup && (
          <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 bg-[#041122]/90 rounded-lg py-1 px-1.5 flex flex-col items-center justify-center border border-[#D49B35] shadow-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#D49B35] mb-0.5" />
            <span className="px-1.5 py-0.5 rounded bg-[#D49B35] text-[#041122] font-rajdhani font-extrabold text-[9px] tracking-wider uppercase">
              EN EL 11
            </span>
          </div>
        )}
      </div>

      {/* Etiqueta inferior en el banquillo */}
      <div className="-mt-1 relative z-10 bg-[#041122]/95 border border-[#D49B35]/80 px-2 py-0.5 rounded text-[11px] font-rajdhani font-bold text-white whitespace-nowrap shadow">
        <span className="text-[#D49B35] mr-1">#{player.number}</span>
        <span>{player.name}</span>
      </div>
    </div>
  );
}

export default function TacticalBoard() {
  const [formation, setFormation] = useState<FormationKey>("3-1-4-2");
  const [lineup, setLineup] = useState<Record<string, string | null>>(() => {
    const initial: Record<string, string | null> = {};
    FORMATIONS["3-1-4-2"].forEach((slot, idx) => {
      initial[slot.slotId] = players[idx]?.id ?? null;
    });
    return initial;
  });

  const [matchSubtitle, setMatchSubtitle] = useState<string>(
    "JORNADA OFICIAL — EA SPORTS FC 27"
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedBenchPlayerId, setSelectedBenchPlayerId] = useState<
    string | null
  >(null);
  const [activeDragPlayer, setActiveDragPlayer] = useState<Player | null>(null);

  // Estados de exportación y compartición
  const [busyAction, setBusyAction] = useState<
    null | "download" | "whatsapp" | "discord" | "copy"
  >(null);
  const [copiedQuickState, setCopiedQuickState] = useState(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Configuración opcional de Discord Webhook en localStorage
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState<string>("");
  const [webhookInputDraft, setWebhookInputDraft] = useState<string>("");
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

  const posterRef = useRef<HTMLDivElement | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DISCORD_WEBHOOK_STORAGE_KEY) || "";
      setDiscordWebhookUrl(saved);
      setWebhookInputDraft(saved);
    } catch {
      // Ignorar si localStorage no está disponible
    }
  }, []);

  const showToast = (
    variant: ToastNotification["variant"],
    title: string,
    message: string
  ) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({
      id: Date.now(),
      variant,
      title,
      message,
    });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 6000);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  const { setNodeRef: setBenchDropRef, isOver: isOverBench } = useDroppable({
    id: "bench-dropzone",
  });

  const currentSlots = FORMATIONS[formation];

  const getPlayerById = (id: string | null | undefined): Player | null => {
    if (!id) return null;
    return players.find((p) => p.id === id) ?? null;
  };

  const playersInLineup = new Set(
    Object.values(lineup).filter((id): id is string => Boolean(id))
  );

  // Ordenar el banquillo para mostrar primero los suplentes disponibles y al final los que ya están en el 11
  const sortedBenchPlayers = [...players].sort((a, b) => {
    const aInEleven = playersInLineup.has(a.id) ? 1 : 0;
    const bInEleven = playersInLineup.has(b.id) ? 1 : 0;
    return aInEleven - bInEleven;
  });

  const assignPlayerToSlot = (playerId: string, targetSlotId: string) => {
    setLineup((prev) => {
      const next = { ...prev };
      const existingSlotForPlayer = Object.keys(next).find(
        (key) => next[key] === playerId
      );
      const occupantInTarget = next[targetSlotId] ?? null;

      if (existingSlotForPlayer && existingSlotForPlayer !== targetSlotId) {
        next[existingSlotForPlayer] = occupantInTarget;
      }
      next[targetSlotId] = playerId;
      return next;
    });
  };

  const swapPitchSlots = (slotA: string, slotB: string) => {
    if (slotA === slotB) return;
    setLineup((prev) => {
      const next = { ...prev };
      const temp = next[slotA] ?? null;
      next[slotA] = next[slotB] ?? null;
      next[slotB] = temp;
      return next;
    });
  };

  const removePlayerFromSlot = (slotId: string) => {
    setLineup((prev) => ({
      ...prev,
      [slotId]: null,
    }));
  };

  const handleClearBoard = () => {
    const empty: Record<string, string | null> = {};
    currentSlots.forEach((s) => {
      empty[s.slotId] = null;
    });
    setLineup(empty);
    setSelectedSlotId(null);
    setSelectedBenchPlayerId(null);
  };

  const handleAutoFill = () => {
    const filled: Record<string, string | null> = {};
    currentSlots.forEach((s, index) => {
      filled[s.slotId] = players[index]?.id ?? null;
    });
    setLineup(filled);
    setSelectedSlotId(null);
    setSelectedBenchPlayerId(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.player) {
      setActiveDragPlayer(data.player as Player);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragPlayer(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId.startsWith("bench:")) {
      const playerId = activeId.replace("bench:", "");
      const targetSlotId = overId.startsWith("pitch:")
        ? overId.replace("pitch:", "")
        : overId;

      if (targetSlotId.startsWith("slot-")) {
        assignPlayerToSlot(playerId, targetSlotId);
        setSelectedSlotId(null);
        setSelectedBenchPlayerId(null);
      }
      return;
    }

    if (activeId.startsWith("pitch:")) {
      const sourceSlotId = activeId.replace("pitch:", "");

      if (overId === "bench-dropzone" || overId.startsWith("bench:")) {
        removePlayerFromSlot(sourceSlotId);
        return;
      }

      const targetSlotId = overId.startsWith("pitch:")
        ? overId.replace("pitch:", "")
        : overId;

      if (targetSlotId.startsWith("slot-")) {
        swapPitchSlots(sourceSlotId, targetSlotId);
        setSelectedSlotId(null);
        setSelectedBenchPlayerId(null);
      }
    }
  };

  const handleSelectSlot = (slotId: string) => {
    if (selectedBenchPlayerId) {
      assignPlayerToSlot(selectedBenchPlayerId, slotId);
      setSelectedBenchPlayerId(null);
      setSelectedSlotId(null);
      return;
    }

    if (selectedSlotId && selectedSlotId !== slotId) {
      if (lineup[selectedSlotId] || lineup[slotId]) {
        swapPitchSlots(selectedSlotId, slotId);
        setSelectedSlotId(null);
        return;
      }
    }

    setSelectedSlotId((prev) => (prev === slotId ? null : slotId));
  };

  const handleClickBenchPlayer = (player: Player) => {
    if (selectedSlotId) {
      assignPlayerToSlot(player.id, selectedSlotId);
      setSelectedSlotId(null);
      setSelectedBenchPlayerId(null);
      return;
    }

    setSelectedBenchPlayerId((prev) =>
      prev === player.id ? null : player.id
    );
  };

  // ==========================================================================
  // FUNCIÓN AUXILIAR: generateLineupBlob() con toBlob (pixelRatio: 2)
  // ==========================================================================
  const generateLineupBlob = async (): Promise<{
    blob: Blob;
    file: File;
  }> => {
    if (!posterRef.current) {
      throw new Error("No se encontró el contenedor del cartel táctico.");
    }

    setSelectedSlotId(null);
    setSelectedBenchPlayerId(null);
    await new Promise((r) => setTimeout(r, 60));

    const blob = await toBlob(posterRef.current, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#041122",
      filter: (node) => {
        if (
          node instanceof HTMLElement &&
          node.dataset?.exportIgnore === "true"
        ) {
          return false;
        }
        return true;
      },
    });

    if (!blob) {
      throw new Error("No se pudo generar el archivo PNG de la alineación.");
    }

    const file = new File([blob], "alineacion-atlantica-fc.png", {
      type: "image/png",
    });

    return { blob, file };
  };

  const isMobileDevice = () => {
    if (typeof window === "undefined") return false;
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  };

  const copyBlobToClipboard = async (blob: Blob) => {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof ClipboardItem !== "undefined"
    ) {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      return true;
    }
    return false;
  };

  // 0. Botón Descargar Alineación (PNG)
  const handleDownloadPng = async () => {
    if (busyAction) return;
    try {
      setBusyAction("download");
      const { blob } = await generateLineupBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "alineacion-atlantica-fc.png";
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      showToast(
        "gold",
        "Cartel Descargado",
        "Se ha descargado 'alineacion-atlantica-fc.png' en alta resolución."
      );
    } catch (error) {
      console.error("Error al descargar PNG:", error);
      showToast(
        "error",
        "Error al generar imagen",
        "No se pudo descargar el cartel de la alineación."
      );
    } finally {
      setBusyAction(null);
    }
  };

  // 1. Botón "COMPARTIR EN WHATSAPP"
  const handleShareWhatsApp = async () => {
    if (busyAction) return;
    try {
      setBusyAction("whatsapp");
      const { blob, file } = await generateLineupBlob();

      // En móviles: compartir directamente el archivo con navigator.share
      if (
        isMobileDevice() &&
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: "XI Titular - Atlántica F.C.",
          text: "⚽ ¡Alineación oficial de Atlántica F.C.! Donec vincas.",
        });
        showToast(
          "whatsapp",
          "Compartido en WhatsApp",
          "Se ha abierto el menú para enviar el XI Titular."
        );
        return;
      }

      // En escritorio (Fallback automático): Copiar al portapapeles + abrir WhatsApp Web
      await copyBlobToClipboard(blob);
      showToast(
        "whatsapp",
        "¡Imagen copiada al portapapeles!",
        "Solo pulsa Ctrl+V en el chat de WhatsApp para pegar el cartel."
      );
      window.open("https://web.whatsapp.com/", "_blank", "noopener,noreferrer");
    } catch (error) {
      if ((error as Error)?.name === "AbortError") return;
      console.error("Error al compartir en WhatsApp:", error);
      showToast(
        "error",
        "No se pudo compartir automáticamente",
        "Prueba con el botón 'Copiar Imagen' o 'Descargar PNG'."
      );
    } finally {
      setBusyAction(null);
    }
  };

  // 2. Botón "COMPARTIR EN DISCORD" (Webhook directo, móvil nativo o portapapeles en escritorio)
  const handleShareDiscord = async () => {
    if (busyAction) return;
    try {
      setBusyAction("discord");
      const { blob, file } = await generateLineupBlob();

      // A) Si hay un Discord Webhook configurado en localStorage -> Envío directo por POST FormData
      const trimmedWebhook = discordWebhookUrl.trim();
      if (trimmedWebhook) {
        const formData = new FormData();
        formData.append(
          "content",
          `⚔️ **XI TITULAR DE ATLÁNTICA F.C.** (${formation}) — *Donec vincas*\n📋 \`${matchSubtitle || "PARTIDO OFICIAL FC 27"}\``
        );
        formData.append("file", file, "alineacion-atlantica-fc.png");

        const response = await fetch(trimmedWebhook, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Discord Webhook respondió con estado ${response.status}`);
        }

        showToast(
          "discord",
          "¡Publicado en el Servidor de Discord!",
          "El cartel del XI Titular se ha enviado directamente al canal por Webhook."
        );
        return;
      }

      // B) En móviles (sin Webhook): Lanzar menú nativo navigator.share con el archivo .png
      if (
        isMobileDevice() &&
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: "XI Titular - Atlántica F.C.",
          text: "⚔️ XI TITULAR DE ATLÁNTICA F.C. — Donec vincas",
        });
        showToast(
          "discord",
          "Compartir en Discord",
          "Selecciona la app de Discord para enviar el cartel."
        );
        return;
      }

      // C) En escritorio (Fallback automático): Copiar al portapapeles
      await copyBlobToClipboard(blob);
      showToast(
        "discord",
        "¡Alineación copiada al portapapeles!",
        "Entra a tu canal de Discord y pulsa Ctrl+V para pegarla (o configura un Webhook en ⚙️)."
      );
    } catch (error) {
      if ((error as Error)?.name === "AbortError") return;
      console.error("Error al compartir en Discord:", error);
      showToast(
        "error",
        "Error al enviar a Discord",
        "Verifica la URL del Webhook o usa Ctrl+V tras pulsar 'Copiar Imagen'."
      );
    } finally {
      setBusyAction(null);
    }
  };

  // 3. Botón "COPIAR IMAGEN"
  const handleQuickCopyImage = async () => {
    if (busyAction) return;
    try {
      setBusyAction("copy");
      const { blob } = await generateLineupBlob();
      await copyBlobToClipboard(blob);
      setCopiedQuickState(true);
      setTimeout(() => setCopiedQuickState(false), 3200);
      showToast(
        "gold",
        "¡Copiada! Lista para pegar",
        "La imagen PNG del XI Titular está en tu portapapeles (Ctrl+V)."
      );
    } catch (error) {
      console.error("Error al copiar imagen al portapapeles:", error);
      showToast(
        "error",
        "No se pudo copiar al portapapeles",
        "Tu navegador bloqueó el acceso al portapapeles. Usa 'Descargar PNG'."
      );
    } finally {
      setBusyAction(null);
    }
  };

  // Guardar / Limpiar URL de Discord Webhook en localStorage
  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = webhookInputDraft.trim();
    setDiscordWebhookUrl(cleaned);
    try {
      if (cleaned) {
        localStorage.setItem(DISCORD_WEBHOOK_STORAGE_KEY, cleaned);
        showToast(
          "discord",
          "Webhook de Discord Guardado",
          "Ahora al pulsar 'Compartir en Discord' la alineación se publicará al instante en tu canal."
        );
      } else {
        localStorage.removeItem(DISCORD_WEBHOOK_STORAGE_KEY);
        showToast(
          "gold",
          "Webhook Desvinculado",
          "Se ha vuelto al modo de copia al portapapeles para Discord."
        );
      }
    } catch {
      // Ignorar errores de almacenamiento
    }
    setIsWebhookModalOpen(false);
  };

  const selectedSlotObj = currentSlots.find((s) => s.slotId === selectedSlotId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* NOTIFICACIÓN TOAST FLOTANTE */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div
              className={clsx(
                "backdrop-blur-xl rounded-2xl p-4 border-2 shadow-2xl flex items-start gap-3.5",
                toast.variant === "whatsapp" &&
                  "bg-[#041122]/95 border-[#25D366] shadow-[0_0_30px_rgba(37,211,102,0.4)]",
                toast.variant === "discord" &&
                  "bg-[#041122]/95 border-[#5865F2] shadow-[0_0_30px_rgba(88,101,242,0.45)]",
                toast.variant === "gold" &&
                  "bg-[#041122]/95 border-[#D49B35] shadow-[0_0_30px_rgba(212,155,53,0.45)]",
                toast.variant === "error" &&
                  "bg-[#041122]/95 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]"
              )}
            >
              <div
                className={clsx(
                  "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                  toast.variant === "whatsapp" &&
                    "bg-[#25D366]/20 text-[#25D366]",
                  toast.variant === "discord" &&
                    "bg-[#5865F2]/20 text-[#5865F2]",
                  toast.variant === "gold" && "bg-[#D49B35]/20 text-[#D49B35]",
                  toast.variant === "error" && "bg-red-500/20 text-red-400"
                )}
              >
                {toast.variant === "whatsapp" && (
                  <MessageCircle className="w-5 h-5" />
                )}
                {toast.variant === "discord" && (
                  <DiscordIcon className="w-5 h-5" />
                )}
                {toast.variant === "gold" && <Check className="w-5 h-5" />}
                {toast.variant === "error" && (
                  <AlertCircle className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-rajdhani font-extrabold text-sm sm:text-base uppercase tracking-wider text-white">
                  {toast.title}
                </h4>
                <p className="font-montserrat text-xs text-white/80 mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setToast(null)}
                className="text-white/50 hover:text-white p-1 transition-colors"
                aria-label="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* MODAL DE CONFIGURACIÓN DE DISCORD WEBHOOK */}
        {isWebhookModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-[#041122] border-2 border-[#5865F2] shadow-[0_0_40px_rgba(88,101,242,0.5)] p-6 relative">
              <button
                type="button"
                onClick={() => setIsWebhookModalOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#5865F2]/20 border border-[#5865F2] flex items-center justify-center text-[#5865F2]">
                  <DiscordIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-lg text-white tracking-wider">
                    WEBHOOK DE DISCORD
                  </h3>
                  <p className="font-rajdhani text-xs text-[#D49B35] uppercase tracking-wider">
                    Publicación directa en el canal del club
                  </p>
                </div>
              </div>

              <p className="font-montserrat text-xs sm:text-sm text-white/75 leading-relaxed mb-4">
                Si pegas aquí la URL de un Webhook de vuestro servidor de
                Discord, al pulsar <strong>&ldquo;Compartir en Discord&rdquo;</strong>{" "}
                el cartel PNG se enviará directamente al canal con el mensaje{" "}
                <code className="text-[#D49B35]">
                  ⚔️ XI TITULAR DE ATLÁNTICA F.C. — Donec vincas
                </code>{" "}
                sin salir de la web.
              </p>

              <form onSubmit={handleSaveWebhook} className="space-y-4">
                <div>
                  <label className="block font-rajdhani font-bold text-xs uppercase tracking-wider text-white/80 mb-1.5">
                    URL del Webhook de Discord (Opcional)
                  </label>
                  <div className="relative">
                    <Link2 className="w-4 h-4 text-[#5865F2] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={webhookInputDraft}
                      onChange={(e) => setWebhookInputDraft(e.target.value)}
                      placeholder="https://discord.com/api/webhooks/..."
                      className="w-full bg-[#020913] border border-[#5865F2]/50 focus:border-[#5865F2] rounded-xl pl-10 pr-4 py-2.5 font-montserrat text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  {discordWebhookUrl ? (
                    <button
                      type="button"
                      onClick={() => {
                        setWebhookInputDraft("");
                        setDiscordWebhookUrl("");
                        try {
                          localStorage.removeItem(DISCORD_WEBHOOK_STORAGE_KEY);
                        } catch {
                          // ignore
                        }
                        setIsWebhookModalOpen(false);
                        showToast(
                          "gold",
                          "Webhook Eliminado",
                          "El botón de Discord volverá a copiar la imagen al portapapeles."
                        );
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/70 border border-red-500/40 font-rajdhani font-bold text-xs uppercase tracking-wider text-red-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Borrar Webhook</span>
                    </button>
                  ) : (
                    <span className="text-xs font-rajdhani text-white/50">
                      Se guarda localmente en tu navegador
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsWebhookModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-white/20 font-rajdhani font-bold text-xs uppercase tracking-wider text-white/80 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] font-rajdhani font-extrabold text-xs sm:text-sm uppercase tracking-wider text-white shadow-[0_0_20px_rgba(88,101,242,0.5)] transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Guardar</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Barra de Controles Superiores de la Pizarra */}
        <div className="backdrop-blur-xl bg-[#041122]/85 border border-[#D49B35]/35 rounded-2xl p-4 sm:p-5 mb-6 shadow-[0_0_30px_rgba(0,75,147,0.3)] flex flex-col gap-4">
          {/* Fila 1: Selector de Formación + Input de Jornada/Rival + Acciones de Pizarra */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-1">
              {/* Selector de Formación */}
              <div className="flex items-center gap-2 bg-[#041122] border border-[#D49B35]/50 rounded-xl p-1.5">
                <span className="font-rajdhani font-bold text-xs uppercase tracking-wider text-[#D49B35] px-2.5">
                  Formación:
                </span>
                {(
                  ["3-1-4-2", "3-4-1-2", "4-3-3", "4-2-3-1"] as FormationKey[]
                ).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormation(fmt)}
                      className={clsx(
                        "font-rajdhani font-extrabold text-xs sm:text-sm px-3 py-1.5 rounded-lg transition-all",
                        formation === fmt
                          ? "bg-gradient-to-r from-[#D49B35] to-[#b57f20] text-[#041122] shadow-[0_0_12px_rgba(212,155,53,0.5)]"
                          : "text-white/75 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {fmt}
                    </button>
                  )
                )}
              </div>

              {/* Input Editable de Jornada / Rival */}
              <div className="relative flex-1 max-w-md">
                <Edit3 className="w-4 h-4 text-[#D49B35] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={matchSubtitle}
                  onChange={(e) => setMatchSubtitle(e.target.value)}
                  placeholder="Ej: JORNADA 4 vs RIVAL"
                  maxLength={48}
                  className="w-full bg-[#041122]/90 border border-[#D49B35]/40 focus:border-[#D49B35] rounded-xl pl-10 pr-4 py-2 font-rajdhani font-bold text-sm text-white uppercase tracking-wider placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#D49B35]"
                />
              </div>
            </div>

            {/* Botones de gestión rápida de fichas */}
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleAutoFill}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#004B93]/35 hover:bg-[#004B93]/60 border border-[#004B93] text-xs sm:text-sm font-rajdhani font-bold uppercase tracking-wider text-white transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#D49B35]" />
                <span>Cargar 11 Base</span>
              </button>

              <button
                type="button"
                onClick={handleClearBoard}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#041122] hover:bg-red-950/50 border border-white/20 hover:border-red-400/50 text-xs sm:text-sm font-rajdhani font-bold uppercase tracking-wider text-white/85 hover:text-white transition-all"
              >
                <RotateCcw className="w-4 h-4 text-[#D49B35]" />
                <span>Limpiar Pizarra</span>
              </button>
            </div>
          </div>

          {/* Fila 2: Botonera de Exportación y Compartición Directa (WhatsApp, Discord, Copiar y Descargar PNG) */}
          <div className="pt-3 border-t border-[#D49B35]/20 flex flex-wrap items-center justify-between gap-3">
            <span className="font-rajdhani font-bold text-xs uppercase tracking-[0.2em] text-[#D49B35]/90 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-[#D49B35]" />
              <span>COMPARTIR CARTEL OFICIAL DEL XI TITULAR:</span>
            </span>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* 1. BOTÓN COMPARTIR EN WHATSAPP (#25D366) */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                disabled={Boolean(busyAction)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#041122] font-rajdhani font-extrabold text-xs sm:text-sm uppercase tracking-[0.1em] shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_28px_rgba(37,211,102,0.75)] transition-all disabled:opacity-60"
              >
                <MessageCircle className="w-4 h-4 fill-current stroke-[2.2]" />
                <span>
                  {busyAction === "whatsapp"
                    ? "PREPARANDO..."
                    : "COMPARTIR EN WHATSAPP"}
                </span>
              </button>

              {/* 2. BOTÓN COMPARTIR EN DISCORD (#5865F2) + CONFIGURACIÓN WEBHOOK */}
              <div className="inline-flex items-stretch rounded-xl shadow-[0_0_20px_rgba(88,101,242,0.45)] hover:shadow-[0_0_28px_rgba(88,101,242,0.75)] transition-all">
                <button
                  type="button"
                  onClick={handleShareDiscord}
                  disabled={Boolean(busyAction)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-l-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-rajdhani font-extrabold text-xs sm:text-sm uppercase tracking-[0.1em] transition-colors disabled:opacity-60"
                >
                  <DiscordIcon className="w-4 h-4" />
                  <span>
                    {busyAction === "discord"
                      ? "ENVIANDO..."
                      : "COMPARTIR EN DISCORD"}
                  </span>
                  {discordWebhookUrl && (
                    <span
                      title="Webhook activo: envío directo al canal"
                      className="w-2 h-2 rounded-full bg-[#25D366] shadow-[0_0_6px_#25D366]"
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWebhookInputDraft(discordWebhookUrl);
                    setIsWebhookModalOpen(true);
                  }}
                  title="Configurar Webhook de Discord (Opcional)"
                  className="px-2.5 py-2.5 rounded-r-xl bg-[#4752C4] hover:bg-[#3c45a5] border-l border-white/20 text-white/90 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* 3. BOTÓN COPIAR IMAGEN (Secundario con borde Dorado #D49B35) */}
              <button
                type="button"
                onClick={handleQuickCopyImage}
                disabled={Boolean(busyAction)}
                className={clsx(
                  "inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border font-rajdhani font-extrabold text-xs sm:text-sm uppercase tracking-[0.1em] transition-all disabled:opacity-60",
                  copiedQuickState
                    ? "bg-[#D49B35]/25 border-[#D49B35] text-[#D49B35] shadow-[0_0_20px_rgba(212,155,53,0.45)]"
                    : "bg-[#041122] hover:bg-[#004B93]/35 border-[#D49B35] text-white hover:text-[#D49B35] shadow-[0_0_15px_rgba(212,155,53,0.2)]"
                )}
              >
                {copiedQuickState ? (
                  <>
                    <Check className="w-4 h-4 text-[#D49B35]" />
                    <span>¡COPIADA! LISTA PARA PEGAR</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#D49B35]" />
                    <span>
                      {busyAction === "copy" ? "COPIANDO..." : "COPIAR IMAGEN"}
                    </span>
                  </>
                )}
              </button>

              {/* 4. BOTÓN DESCARGAR ALINEACIÓN (PNG) */}
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={Boolean(busyAction)}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F3CA6E] via-[#D49B35] to-[#A6731B] hover:brightness-110 text-[#041122] font-rajdhani font-extrabold text-xs sm:text-sm uppercase tracking-[0.1em] shadow-[0_0_24px_rgba(212,155,53,0.5)] hover:shadow-[0_0_32px_rgba(212,155,53,0.8)] transition-all disabled:opacity-60"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {busyAction === "download"
                    ? "GENERANDO..."
                    : "DESCARGAR ALINEACIÓN (PNG)"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Aviso interactivo para selección rápida en móvil/escritorio */}
        {(selectedSlotObj || selectedBenchPlayerId) && (
          <div className="mb-4 px-4 py-2.5 rounded-xl bg-[#004B93]/40 border border-[#D49B35] flex items-center justify-between text-xs sm:text-sm font-rajdhani font-bold text-white animate-pulse">
            <div className="flex items-center gap-2">
              <Move className="w-4 h-4 text-[#D49B35]" />
              {selectedSlotObj ? (
                <span>
                  Posición seleccionada:{" "}
                  <strong className="text-[#D49B35]">
                    {selectedSlotObj.role} ({selectedSlotObj.label})
                  </strong>
                  . Toca un jugador del banquillo u otra posición del campo para
                  asignar.
                </span>
              ) : (
                <span>
                  Jugador seleccionado:{" "}
                  <strong className="text-[#D49B35]">
                    {getPlayerById(selectedBenchPlayerId)?.name}
                  </strong>
                  . Toca cualquiera de las 11 posiciones del campo para
                  colocarlo.
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedSlotId(null);
                setSelectedBenchPlayerId(null);
              }}
              className="text-[#D49B35] hover:underline uppercase text-xs ml-4"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Layout Principal: Cartel Táctico Exportable (Izquierda) + Banquillo (Derecha / Abajo en móvil) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ÁREA DEL CARTEL OFICIAL DE ESPORTS (Capturada por html-to-image) */}
          <div className="lg:col-span-7 xl:col-span-8 flex justify-center">
            <div
              ref={posterRef}
              className="w-full max-w-[720px] rounded-2xl overflow-hidden border-2 border-[#D49B35]/70 bg-[#041122] shadow-[0_0_45px_rgba(0,75,147,0.45)] flex flex-col"
            >
              {/* 1. CABECERA DEL CARTEL OFICIAL */}
              <div className="relative px-5 py-4 sm:px-7 sm:py-5 bg-gradient-to-r from-[#041122] via-[#004B93]/60 to-[#041122] border-b border-[#D49B35]/50 flex items-center justify-between gap-4 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,155,53,0.18),transparent_60%)] pointer-events-none" />
                <div className="relative z-10 flex items-center gap-3.5">
                  <ClubCrest className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_10px_rgba(212,155,53,0.5)] shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-cinzel font-bold text-base sm:text-xl md:text-2xl tracking-[0.14em] text-white">
                        ATLÁNTICA F.C. — XI TITULAR
                      </span>
                    </div>
                    <p className="font-rajdhani font-bold text-xs sm:text-sm tracking-[0.2em] text-[#D49B35] uppercase mt-0.5">
                      {matchSubtitle || "EA SPORTS FC 27 — CLUBES PRO"}
                    </p>
                  </div>
                </div>

                {/* Insignia del sistema táctico */}
                <div className="relative z-10 flex flex-col items-end shrink-0">
                  <span className="text-[10px] font-rajdhani font-bold uppercase tracking-[0.2em] text-white/60">
                    SISTEMA
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#041122]/90 border border-[#D49B35] font-rajdhani font-extrabold text-sm sm:text-base text-[#D49B35] tracking-widest shadow-[0_0_12px_rgba(212,155,53,0.3)]">
                    {formation}
                  </span>
                </div>
              </div>

              {/* 2. CAMPO DE FÚTBOL TÁCTICO EN SVG/CSS CON LAS 11 MINI-CARTAS */}
              <div className="relative w-full aspect-[3/4] sm:aspect-[4/4.6] overflow-hidden select-none bg-[#04182E]">
                {/* Césped nocturno estilizado eSports Atlántica */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 50% 50%, rgba(0, 75, 147, 0.35) 0%, rgba(4, 17, 34, 0.92) 85%),
                      repeating-linear-gradient(
                        0deg,
                        rgba(0, 75, 147, 0.14) 0px,
                        rgba(0, 75, 147, 0.14) 36px,
                        rgba(4, 17, 34, 0.25) 36px,
                        rgba(4, 17, 34, 0.25) 72px
                      )
                    `,
                  }}
                />

                {/* Marca de agua del escudo en el círculo central del césped */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08]">
                  <ClubCrest className="w-56 h-56 sm:w-72 sm:h-72" />
                </div>

                {/* Líneas reglamentarias del campo en SVG */}
                <svg
                  viewBox="0 0 600 750"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="none"
                >
                  <g
                    stroke="#D49B35"
                    strokeOpacity="0.42"
                    strokeWidth="2.2"
                  >
                    <rect x="30" y="25" width="540" height="700" rx="6" />
                    <line x1="30" y1="375" x2="570" y2="375" />
                    <circle cx="300" cy="375" r="72" />
                    <circle
                      cx="300"
                      cy="375"
                      r="4"
                      fill="#D49B35"
                      fillOpacity="0.6"
                    />
                    <rect x="135" y="25" width="330" height="115" />
                    <rect x="210" y="25" width="180" height="42" />
                    <circle
                      cx="300"
                      cy="102"
                      r="3"
                      fill="#D49B35"
                      fillOpacity="0.6"
                    />
                    <path d="M 245 140 A 65 65 0 0 0 355 140" />
                    <rect x="135" y="610" width="330" height="115" />
                    <rect x="210" y="683" width="180" height="42" />
                    <circle
                      cx="300"
                      cy="648"
                      r="3"
                      fill="#D49B35"
                      fillOpacity="0.6"
                    />
                    <path d="M 245 610 A 65 65 0 0 1 355 610" />
                    <path d="M 30 42 A 17 17 0 0 0 47 25" />
                    <path d="M 553 25 A 17 17 0 0 0 570 42" />
                    <path d="M 30 708 A 17 17 0 0 1 47 725" />
                    <path d="M 553 725 A 17 17 0 0 1 570 708" />
                  </g>
                </svg>

                {/* Los 11 Huecos Tácticos sobre el Césped */}
                {currentSlots.map((slot) => {
                  const assignedPlayer = getPlayerById(lineup[slot.slotId]);
                  return (
                    <PitchSlotNode
                      key={slot.slotId}
                      slot={slot}
                      assignedPlayer={assignedPlayer}
                      isSelected={selectedSlotId === slot.slotId}
                      onSelectSlot={handleSelectSlot}
                      onRemovePlayer={removePlayerFromSlot}
                    />
                  );
                })}
              </div>

              {/* 3. PIE DEL CARTEL OFICIAL CON EL LEMA "DONEC VINCAS" */}
              <div className="px-6 py-3.5 bg-[#041122] border-t border-[#D49B35]/50 flex items-center justify-between">
                <span className="font-rajdhani font-bold text-xs tracking-[0.22em] text-white/70 uppercase">
                  ATLÁNTICA F.C. • EA SPORTS FC 27
                </span>
                <span className="font-cinzel font-bold text-sm sm:text-base tracking-[0.28em] text-[#D49B35] uppercase drop-shadow-[0_0_8px_rgba(212,155,53,0.4)]">
                  DONEC VINCAS
                </span>
              </div>
            </div>
          </div>

          {/* BANQUILLO LATERAL (En escritorio) / INFERIOR (En móvil) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div
              ref={setBenchDropRef}
              className={clsx(
                "backdrop-blur-xl bg-[#041122]/85 border rounded-2xl p-4 sm:p-5 shadow-2xl transition-colors",
                isOverBench
                  ? "border-[#D49B35] bg-[#004B93]/30"
                  : "border-[#D49B35]/35"
              )}
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D49B35]/25">
                <div className="flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-[#D49B35]" />
                  <div>
                    <h2 className="font-cinzel font-bold text-base sm:text-lg text-white tracking-wider">
                      CONVOCATORIA OFICIAL
                    </h2>
                    <p className="font-rajdhani text-xs text-white/65 tracking-wider">
                      Arrastra al campo o toca para asignar ({playersInLineup.size}/11 en el once)
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#004B93]/50 border border-[#D49B35]/50 font-rajdhani font-extrabold text-xs text-[#D49B35]">
                  {players.length} JUG.
                </span>
              </div>

              {/* Grid de los 17 jugadores del banquillo (suplentes primero, titulares al final) */}
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2.5 sm:gap-3 max-h-[680px] overflow-y-auto pr-1 custom-scrollbar">
                {sortedBenchPlayers.map((player) => (
                  <BenchPlayerCard
                    key={player.id}
                    player={player}
                    isInLineup={playersInLineup.has(player.id)}
                    isSelectedPlayer={selectedBenchPlayerId === player.id}
                    hasSelectedSlot={Boolean(selectedSlotId)}
                    onClickBenchPlayer={handleClickBenchPlayer}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay flotante al arrastrar una ficha */}
      <DragOverlay>
        {activeDragPlayer ? (
          <div className="flex flex-col items-center scale-105 opacity-95 pointer-events-none">
            <MiniCardArt player={activeDragPlayer} sizeClass="w-16 sm:w-20" />
            <div className="-mt-1 bg-[#041122] border border-[#D49B35] px-2 py-0.5 rounded text-xs font-rajdhani font-bold text-white shadow-xl">
              <span className="text-[#D49B35] mr-1">
                #{activeDragPlayer.number}
              </span>
              <span>{activeDragPlayer.name}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
