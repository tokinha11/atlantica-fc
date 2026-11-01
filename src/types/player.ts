export interface Player {
  id: string;
  name: string;
  number: number;
  cardImage: string;
  eaPlayerName?: string;
}

export type FormationKey = "3-1-4-2" | "3-4-1-2" | "4-3-3" | "4-2-3-1";

export interface PitchSlot {
  slotId: string;
  role: string;
  label: string;
  /** X position on pitch in percentage (0 to 100, left to right) */
  x: number;
  /** Y position on pitch in percentage (0 to 100, top=attack to bottom=GK) */
  y: number;
}

export interface PlayerRadarMetrics {
  attack: number;
  creation: number;
  distribution: number;
  defense: number;
  impact: number;
}

export interface NormalizedPlayerStats {
  playerId: string;
  playerName: string;
  number: number;
  cardImage: string;
  eaGamertag: string;
  proName: string;
  favoritePosition: string;
  favoritePositionLabel: string;
  proOverall: number;
  gamesPlayed: number;
  winRate: number;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
  goalsPerGame: number;
  shotsTotal: number;
  shotSuccessRate: number;
  bestStreak: number;
  assists: number;
  assistsPerGame: number;
  passesMade: number;
  passesAttempted: number;
  passesPerGame: number;
  passSuccessRate: number;
  keyPasses: number;
  tacklesMade: number;
  tacklesAttempted: number;
  tacklesPerGame: number;
  tackleSuccessRate: number;
  interceptions: number;
  cleanSheetsDef: number;
  cleanSheetsGK: number;
  ratingAve: number;
  manOfTheMatch: number;
  yellowCards: number;
  redCards: number;
  radar: PlayerRadarMetrics;
  isLiveApi: boolean;
}

export interface ClubStatsSummary {
  clubId: string;
  platform: string;
  updatedAt: string;
  isLiveSource: boolean;
  totals: {
    gamesPlayed: number;
    goals: number;
    assists: number;
    passesMade: number;
    tacklesMade: number;
    manOfTheMatch: number;
  };
  averages: {
    goalsPerGame: number;
    assistsPerGame: number;
    passesPerGame: number;
    tacklesPerGame: number;
    passSuccessRate: number;
    shotSuccessRate: number;
    tackleSuccessRate: number;
    ratingAve: number;
  };
  players: Record<string, NormalizedPlayerStats>;
}
