import playersData from "@/data/players.json";
import {
  ClubStatsSummary,
  NormalizedPlayerStats,
  Player,
  PlayerRadarMetrics,
} from "@/types/player";

export const DEFAULT_CLUB_ID = "138351";
export const DEFAULT_PLATFORM = "common-gen5";

const EA_BASE_URL = "https://proclubs.ea.com/api/fc";

const EA_HEADERS: HeadersInit = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
  Referer: "https://www.ea.com/",
  Origin: "https://www.ea.com",
};

interface RawEaMemberStat {
  name?: string;
  proName?: string;
  proPos?: string;
  proOverall?: string | number;
  gamesPlayed?: string | number;
  winRate?: string | number;
  goals?: string | number;
  assists?: string | number;
  cleanSheetsDef?: string | number;
  cleanSheetsGK?: string | number;
  shotSuccessRate?: string | number;
  passesMade?: string | number;
  passSuccessRate?: string | number;
  ratingAve?: string | number;
  tacklesMade?: string | number;
  tackleSuccessRate?: string | number;
  manOfTheMatch?: string | number;
  redCards?: string | number;
  yellowCards?: string | number;
  prevGoals?: string | number;
  prevGoals1?: string | number;
  prevGoals2?: string | number;
  prevGoals3?: string | number;
  prevGoals4?: string | number;
  favoritePosition?: string;
}

// Snapshot real de respaldo del Club ID 138351 (Atlántica F.C.) por si el servidor de EA tarda en responder
const CLUB_138351_FALLBACK_SNAPSHOT: RawEaMemberStat[] = [
  { name: "xXToka11Xx", proName: "Tokinha", favoritePosition: "forward", proPos: "25", proOverall: "82", gamesPlayed: "57", winRate: "52", goals: "34", assists: "25", manOfTheMatch: "18", ratingAve: "7.9", shotSuccessRate: "25", passesMade: "1173", passSuccessRate: "79", tacklesMade: "105", tackleSuccessRate: "31", cleanSheetsDef: "2", cleanSheetsGK: "0", redCards: "0" },
  { name: "MonkeyDGall23", proName: "Canutinho", favoritePosition: "midfielder", proPos: "14", proOverall: "70", gamesPlayed: "59", winRate: "40", goals: "33", assists: "32", manOfTheMatch: "5", ratingAve: "7.1", shotSuccessRate: "35", passesMade: "2566", passSuccessRate: "82", tacklesMade: "270", tackleSuccessRate: "45", cleanSheetsDef: "6", cleanSheetsGK: "0", redCards: "1" },
  { name: "diegorille", proName: "Samos", favoritePosition: "defender", proPos: "5", proOverall: "83", gamesPlayed: "25", winRate: "44", goals: "5", assists: "0", manOfTheMatch: "6", ratingAve: "8.3", shotSuccessRate: "45", passesMade: "358", passSuccessRate: "88", tacklesMade: "68", tackleSuccessRate: "48", cleanSheetsDef: "0", cleanSheetsGK: "0", redCards: "0" },
  { name: "xavicarne", proName: "Carne", favoritePosition: "midfielder", proPos: "14", proOverall: "84", gamesPlayed: "33", winRate: "42", goals: "34", assists: "17", manOfTheMatch: "4", ratingAve: "7.5", shotSuccessRate: "37", passesMade: "811", passSuccessRate: "77", tacklesMade: "42", tackleSuccessRate: "41", cleanSheetsDef: "0", cleanSheetsGK: "0", redCards: "0" },
  { name: "koke47", proName: "Krosske", favoritePosition: "midfielder", proPos: "14", proOverall: "80", gamesPlayed: "44", winRate: "47", goals: "8", assists: "8", manOfTheMatch: "10", ratingAve: "8.1", shotSuccessRate: "26", passesMade: "766", passSuccessRate: "85", tacklesMade: "105", tackleSuccessRate: "40", cleanSheetsDef: "0", cleanSheetsGK: "0", redCards: "3" },
  { name: "janoopc", proName: "P. Nazario", favoritePosition: "forward", proPos: "25", proOverall: "73", gamesPlayed: "82", winRate: "48", goals: "22", assists: "13", manOfTheMatch: "8", ratingAve: "7.5", shotSuccessRate: "23", passesMade: "1627", passSuccessRate: "81", tacklesMade: "132", tackleSuccessRate: "44", cleanSheetsDef: "12", cleanSheetsGK: "0", redCards: "0" },
  { name: "Chamrat10", proName: "Viti", favoritePosition: "forward", proPos: "25", proOverall: "82", gamesPlayed: "5", winRate: "80", goals: "0", assists: "0", manOfTheMatch: "0", ratingAve: "6.5", shotSuccessRate: "0", passesMade: "68", passSuccessRate: "83", tacklesMade: "9", tackleSuccessRate: "47", cleanSheetsDef: "2", cleanSheetsGK: "1", redCards: "0" },
  { name: "klausm99", proName: "Klaus", favoritePosition: "forward", proPos: "25", proOverall: "83", gamesPlayed: "79", winRate: "41", goals: "60", assists: "33", manOfTheMatch: "11", ratingAve: "7.2", shotSuccessRate: "26", passesMade: "1499", passSuccessRate: "83", tacklesMade: "86", tackleSuccessRate: "36", cleanSheetsDef: "0", cleanSheetsGK: "0", redCards: "0" },
  { name: "PatoSonrisas", proName: "Norauto", favoritePosition: "forward", proPos: "25", proOverall: "83", gamesPlayed: "63", winRate: "42", goals: "47", assists: "38", manOfTheMatch: "8", ratingAve: "7.5", shotSuccessRate: "28", passesMade: "898", passSuccessRate: "78", tacklesMade: "48", tackleSuccessRate: "29", cleanSheetsDef: "0", cleanSheetsGK: "1", redCards: "0" },
  { name: "Rayder2010D", proName: "f. FISHERMAN2 0", favoritePosition: "forward", proPos: "25", proOverall: "78", gamesPlayed: "54", winRate: "57", goals: "22", assists: "8", manOfTheMatch: "5", ratingAve: "6.7", shotSuccessRate: "30", passesMade: "590", passSuccessRate: "81", tacklesMade: "39", tackleSuccessRate: "25", cleanSheetsDef: "0", cleanSheetsGK: "10", redCards: "1" },
  { name: "AlexOural", proName: "A. Oural", favoritePosition: "midfielder", proPos: "14", proOverall: "78", gamesPlayed: "56", winRate: "41", goals: "13", assists: "32", manOfTheMatch: "5", ratingAve: "7.6", shotSuccessRate: "25", passesMade: "957", passSuccessRate: "73", tacklesMade: "76", tackleSuccessRate: "43", cleanSheetsDef: "0", cleanSheetsGK: "0", redCards: "0" },
  { name: "JowiRCCV", proName: "M Joaorente", favoritePosition: "forward", proPos: "25", proOverall: "77", gamesPlayed: "29", winRate: "41", goals: "6", assists: "7", manOfTheMatch: "3", ratingAve: "7.1", shotSuccessRate: "24", passesMade: "365", passSuccessRate: "79", tacklesMade: "23", tackleSuccessRate: "16", cleanSheetsDef: "0", cleanSheetsGK: "0", redCards: "0" },
  { name: "Lolowio", proName: "Lolo", favoritePosition: "midfielder", proPos: "14", proOverall: "79", gamesPlayed: "91", winRate: "46", goals: "18", assists: "23", manOfTheMatch: "8", ratingAve: "7.4", shotSuccessRate: "26", passesMade: "1822", passSuccessRate: "82", tacklesMade: "118", tackleSuccessRate: "53", cleanSheetsDef: "1", cleanSheetsGK: "0", redCards: "0" },
  { name: "PelochoLV", proName: "P. Pelochinho", favoritePosition: "forward", proPos: "25", proOverall: "83", gamesPlayed: "38", winRate: "55", goals: "41", assists: "41", manOfTheMatch: "5", ratingAve: "7.4", shotSuccessRate: "46", passesMade: "2273", passSuccessRate: "86", tacklesMade: "225", tackleSuccessRate: "46", cleanSheetsDef: "1", cleanSheetsGK: "0", redCards: "1" },
  { name: "luismalopez5", proName: "luisma", favoritePosition: "forward", proPos: "25", proOverall: "81", gamesPlayed: "20", winRate: "40", goals: "19", assists: "5", manOfTheMatch: "2", ratingAve: "7.2", shotSuccessRate: "24", passesMade: "233", passSuccessRate: "83", tacklesMade: "13", tackleSuccessRate: "10", cleanSheetsDef: "0", cleanSheetsGK: "0", redCards: "0" },
  { name: "Iagomago", proName: "El Pulpo", favoritePosition: "defender", proPos: "5", proOverall: "83", gamesPlayed: "44", winRate: "43", goals: "2", assists: "1", manOfTheMatch: "2", ratingAve: "7.4", shotSuccessRate: "7", passesMade: "430", passSuccessRate: "79", tacklesMade: "63", tackleSuccessRate: "18", cleanSheetsDef: "7", cleanSheetsGK: "0", redCards: "1" },
  { name: "luismasei", proName: "sei", favoritePosition: "midfielder", proPos: "14", proOverall: "76", gamesPlayed: "48", winRate: "47", goals: "42", assists: "61", manOfTheMatch: "7", ratingAve: "7.2", shotSuccessRate: "36", passesMade: "2343", passSuccessRate: "82", tacklesMade: "274", tackleSuccessRate: "34", cleanSheetsDef: "0", cleanSheetsGK: "0", redCards: "0" },
];

function cleanStr(val: string | undefined): string {
  return (val || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function toNum(val: string | number | undefined, fallback = 0): number {
  if (val === undefined || val === null || val === "") return fallback;
  const parsed = typeof val === "number" ? val : parseFloat(String(val));
  return Number.isNaN(parsed) ? fallback : parsed;
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

function translatePosition(favPos: string, proPos?: string): {
  code: string;
  label: string;
} {
  const pos = (favPos || "").toLowerCase();
  if (pos === "forward" || proPos === "25") {
    return { code: "DC / ATQ", label: "Delantero (ATQ)" };
  }
  if (pos === "midfielder" || proPos === "14") {
    return { code: "MC / MCO", label: "Centrocampista (MED)" };
  }
  if (pos === "defender" || proPos === "5") {
    return { code: "DFC / DEF", label: "Defensa (DEF)" };
  }
  if (pos === "goalkeeper" || proPos === "0") {
    return { code: "POR", label: "Portero (POR)" };
  }
  return { code: "POL", label: "Polivalente" };
}

function computeRadarMetrics(stats: {
  goalsPerGame: number;
  shotSuccessRate: number;
  assistsPerGame: number;
  passesPerGame: number;
  passSuccessRate: number;
  tacklesPerGame: number;
  tackleSuccessRate: number;
  cleanSheetsDef: number;
  cleanSheetsGK: number;
  ratingAve: number;
  manOfTheMatch: number;
  gamesPlayed: number;
  winRate: number;
}): PlayerRadarMetrics {
  const gp = Math.max(1, stats.gamesPlayed);

  // 1. Ataque (0-100): Goles/partido + efectividad de tiro
  const attackRaw =
    stats.goalsPerGame * 62 + stats.shotSuccessRate * 0.95 + 15;
  const attack = Math.round(clamp(attackRaw, 35, 99));

  // 2. Creación (0-100): Asistencias/partido + volumen de pases ofensivos
  const creationRaw =
    stats.assistsPerGame * 68 + stats.passesPerGame * 0.85 + 18;
  const creation = Math.round(clamp(creationRaw, 38, 99));

  // 3. Distribución (0-100): % Precisión de pase + pases completados por partido
  const distributionRaw =
    stats.passSuccessRate * 0.85 + Math.min(25, stats.passesPerGame * 0.55);
  const distribution = Math.round(clamp(distributionRaw, 45, 99));

  // 4. Defensa (0-100): Entradas/partido + % éxito en entradas + porterías a cero
  const csBonus = Math.min(22, ((stats.cleanSheetsDef + stats.cleanSheetsGK) / gp) * 70);
  const defenseRaw =
    stats.tacklesPerGame * 14 + stats.tackleSuccessRate * 0.82 + csBonus + 18;
  const defense = Math.round(clamp(defenseRaw, 32, 98));

  // 5. Impacto (Nota Media / MOTM / % Victorias)
  const ratingScore = clamp(((stats.ratingAve - 5.5) / 3.2) * 65, 20, 68);
  const motmBonus = Math.min(22, (stats.manOfTheMatch / gp) * 85);
  const winBonus = stats.winRate * 0.18;
  const impact = Math.round(clamp(ratingScore + motmBonus + winBonus, 45, 99));

  return {
    attack,
    creation,
    distribution,
    defense,
    impact,
  };
}

function matchPlayerToEaMember(
  player: Player,
  members: RawEaMemberStat[]
): RawEaMemberStat | null {
  const targetEa = cleanStr(player.eaPlayerName);
  const targetName = cleanStr(player.name);
  const targetId = cleanStr(player.id);

  // 1. Coincidencia exacta por eaPlayerName
  if (targetEa) {
    const exactEa = members.find(
      (m) => cleanStr(m.name) === targetEa || cleanStr(m.proName) === targetEa
    );
    if (exactEa) return exactEa;
  }

  // 2. Coincidencia exacta o contenida en proName o name
  const bySimilarity = members.find((m) => {
    const mName = cleanStr(m.name);
    const mPro = cleanStr(m.proName);
    if (!mName && !mPro) return false;
    return (
      mPro === targetName ||
      mPro === targetId ||
      mName === targetName ||
      mName === targetId ||
      (targetName.length >= 4 && mPro.includes(targetName)) ||
      (mPro.length >= 3 && targetName.includes(mPro)) ||
      (targetId.length >= 4 && mName.includes(targetId))
    );
  });

  return bySimilarity || null;
}

function normalizeMemberStats(
  player: Player,
  raw: RawEaMemberStat | null,
  careerRaw: RawEaMemberStat | null,
  isLiveApi: boolean
): NormalizedPlayerStats {
  const src = raw || careerRaw || {};
  const gamesPlayed = Math.max(
    toNum(src.gamesPlayed),
    toNum(careerRaw?.gamesPlayed)
  );
  const gpSafe = Math.max(1, gamesPlayed);

  const winRate = clamp(toNum(src.winRate, 45), 0, 100);
  const wins = Math.round((gamesPlayed * winRate) / 100);
  const remaining = Math.max(0, gamesPlayed - wins);
  const draws = Math.round(remaining * 0.28);
  const losses = Math.max(0, remaining - draws);

  const goals = Math.max(toNum(src.goals), toNum(careerRaw?.goals));
  const assists = Math.max(toNum(src.assists), toNum(careerRaw?.assists));
  const shotSuccessRate = clamp(toNum(src.shotSuccessRate, 28), 0, 100);
  const shotsTotal =
    shotSuccessRate > 0
      ? Math.max(goals, Math.round((goals / shotSuccessRate) * 100))
      : goals * 3;

  const passesMade = toNum(src.passesMade, gamesPlayed * 18);
  const passSuccessRate = clamp(toNum(src.passSuccessRate, 80), 0, 100);
  const passesAttempted =
    passSuccessRate > 0
      ? Math.max(passesMade, Math.round((passesMade / passSuccessRate) * 100))
      : Math.round(passesMade * 1.22);

  const tacklesMade = toNum(src.tacklesMade, gamesPlayed * 2);
  const tackleSuccessRate = clamp(toNum(src.tackleSuccessRate, 38), 0, 100);
  const tacklesAttempted =
    tackleSuccessRate > 0
      ? Math.max(
          tacklesMade,
          Math.round((tacklesMade / tackleSuccessRate) * 100)
        )
      : Math.round(tacklesMade * 2.3);

  const cleanSheetsDef = toNum(src.cleanSheetsDef, 0);
  const cleanSheetsGK = toNum(src.cleanSheetsGK, 0);
  const ratingAve = Number(toNum(src.ratingAve, 7.3).toFixed(2));
  const manOfTheMatch = Math.max(
    toNum(src.manOfTheMatch),
    toNum(careerRaw?.manOfTheMatch)
  );
  const redCards = toNum(src.redCards, 0);
  const yellowCards = toNum(
    src.yellowCards,
    Math.min(12, redCards * 2 + Math.floor(tacklesMade / 65))
  );

  const goalsPerGame = Number((goals / gpSafe).toFixed(2));
  const assistsPerGame = Number((assists / gpSafe).toFixed(2));
  const passesPerGame = Number((passesMade / gpSafe).toFixed(1));
  const tacklesPerGame = Number((tacklesMade / gpSafe).toFixed(2));

  // Calcular mejor racha goleadora y métricas tácticas complementarias
  const prevGoalsArr = [
    toNum(src.prevGoals),
    toNum(src.prevGoals1),
    toNum(src.prevGoals2),
    toNum(src.prevGoals3),
    toNum(src.prevGoals4),
  ];
  const bestStreak = Math.max(
    ...prevGoalsArr,
    goals > 0 ? Math.min(6, Math.ceil(goalsPerGame * 2.5)) : 1
  );

  const keyPasses = Math.max(
    assists,
    Math.round(assists * 1.85 + passesMade * 0.035)
  );
  const interceptions = Math.round(
    tacklesMade * 0.78 + cleanSheetsDef * 2 + gamesPlayed * 0.65
  );

  const posInfo = translatePosition(
    src.favoritePosition || careerRaw?.favoritePosition || "midfielder",
    String(src.proPos || "")
  );

  const radar = computeRadarMetrics({
    goalsPerGame,
    shotSuccessRate,
    assistsPerGame,
    passesPerGame,
    passSuccessRate,
    tacklesPerGame,
    tackleSuccessRate,
    cleanSheetsDef,
    cleanSheetsGK,
    ratingAve,
    manOfTheMatch,
    gamesPlayed,
    winRate,
  });

  return {
    playerId: player.id,
    playerName: player.name,
    number: player.number,
    cardImage: player.cardImage,
    eaGamertag: src.name || player.eaPlayerName || player.id,
    proName: src.proName || player.name,
    favoritePosition: posInfo.code,
    favoritePositionLabel: posInfo.label,
    proOverall: toNum(src.proOverall, 82),
    gamesPlayed,
    winRate,
    wins,
    draws,
    losses,
    goals,
    goalsPerGame,
    shotsTotal,
    shotSuccessRate,
    bestStreak,
    assists,
    assistsPerGame,
    passesMade,
    passesAttempted,
    passesPerGame,
    passSuccessRate,
    keyPasses,
    tacklesMade,
    tacklesAttempted,
    tacklesPerGame,
    tackleSuccessRate,
    interceptions,
    cleanSheetsDef,
    cleanSheetsGK,
    ratingAve,
    manOfTheMatch,
    yellowCards,
    redCards,
    radar,
    isLiveApi,
  };
}

export async function fetchClub138351Stats(
  clubId = DEFAULT_CLUB_ID,
  platform = DEFAULT_PLATFORM
): Promise<ClubStatsSummary> {
  const squad: Player[] = playersData;
  let liveMembers: RawEaMemberStat[] = [];
  let careerMembers: RawEaMemberStat[] = [];
  let isLiveSource = false;

  try {
    const [statsRes, careerRes] = await Promise.all([
      fetch(
        `${EA_BASE_URL}/members/stats?platform=${platform}&clubId=${clubId}`,
        {
          headers: EA_HEADERS,
          next: { revalidate: 300 },
          signal: AbortSignal.timeout(6500),
        }
      ),
      fetch(
        `${EA_BASE_URL}/members/career/stats?platform=${platform}&clubId=${clubId}`,
        {
          headers: EA_HEADERS,
          next: { revalidate: 300 },
          signal: AbortSignal.timeout(6500),
        }
      ).catch(() => null),
    ]);

    if (statsRes.ok) {
      const statsData = await statsRes.json();
      if (Array.isArray(statsData?.members) && statsData.members.length > 0) {
        liveMembers = statsData.members;
        isLiveSource = true;
      }
    }

    if (careerRes && careerRes.ok) {
      const careerData = await careerRes.json();
      if (Array.isArray(careerData?.members)) {
        careerMembers = careerData.members;
      }
    }
  } catch {
    // Si la API de EA no responde a tiempo, usamos el snapshot real del club 138351 como respaldo
    isLiveSource = false;
  }

  const effectiveMembers =
    liveMembers.length > 0 ? liveMembers : CLUB_138351_FALLBACK_SNAPSHOT;

  const normalizedPlayers: Record<string, NormalizedPlayerStats> = {};

  for (const player of squad) {
    const matchedLive = matchPlayerToEaMember(player, effectiveMembers);
    const matchedCareer = matchPlayerToEaMember(player, careerMembers);
    const fallbackMatch =
      matchedLive ||
      matchPlayerToEaMember(player, CLUB_138351_FALLBACK_SNAPSHOT);

    normalizedPlayers[player.id] = normalizeMemberStats(
      player,
      fallbackMatch,
      matchedCareer,
      isLiveSource && Boolean(matchedLive)
    );
  }

  const allStats = Object.values(normalizedPlayers);
  const count = Math.max(1, allStats.length);

  const totals = allStats.reduce(
    (acc, p) => {
      acc.gamesPlayed += p.gamesPlayed;
      acc.goals += p.goals;
      acc.assists += p.assists;
      acc.passesMade += p.passesMade;
      acc.tacklesMade += p.tacklesMade;
      acc.manOfTheMatch += p.manOfTheMatch;
      return acc;
    },
    {
      gamesPlayed: 0,
      goals: 0,
      assists: 0,
      passesMade: 0,
      tacklesMade: 0,
      manOfTheMatch: 0,
    }
  );

  const averages = {
    goalsPerGame: Number(
      (
        allStats.reduce((s, p) => s + p.goalsPerGame, 0) / count
      ).toFixed(2)
    ),
    assistsPerGame: Number(
      (
        allStats.reduce((s, p) => s + p.assistsPerGame, 0) / count
      ).toFixed(2)
    ),
    passesPerGame: Number(
      (
        allStats.reduce((s, p) => s + p.passesPerGame, 0) / count
      ).toFixed(1)
    ),
    tacklesPerGame: Number(
      (
        allStats.reduce((s, p) => s + p.tacklesPerGame, 0) / count
      ).toFixed(2)
    ),
    passSuccessRate: Number(
      (
        allStats.reduce((s, p) => s + p.passSuccessRate, 0) / count
      ).toFixed(1)
    ),
    shotSuccessRate: Number(
      (
        allStats.reduce((s, p) => s + p.shotSuccessRate, 0) / count
      ).toFixed(1)
    ),
    tackleSuccessRate: Number(
      (
        allStats.reduce((s, p) => s + p.tackleSuccessRate, 0) / count
      ).toFixed(1)
    ),
    ratingAve: Number(
      (
        allStats.reduce((s, p) => s + p.ratingAve, 0) / count
      ).toFixed(2)
    ),
  };

  return {
    clubId,
    platform,
    updatedAt: new Date().toISOString(),
    isLiveSource,
    totals,
    averages,
    players: normalizedPlayers,
  };
}
