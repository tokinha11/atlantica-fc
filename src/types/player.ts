export interface Player {
  id: string;
  name: string;
  number: number;
  cardImage: string;
}

export type FormationKey = "3-1-4-2" | "4-3-3" | "4-2-3-1";

export interface PitchSlot {
  slotId: string;
  role: string;
  label: string;
  /** X position on pitch in percentage (0 to 100, left to right) */
  x: number;
  /** Y position on pitch in percentage (0 to 100, top=attack to bottom=GK) */
  y: number;
}
