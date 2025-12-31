export type Lang = "en" | "ru";

export interface CharacterMeta {
  characterName: string;
  playerName: string;
  faction: string;
  concept: string;
}

export interface Attributes {
  strength: number;
  agility: number;
  intellect: number;
  willpower: number;
}

export interface Skills {
  melee: number;
  ranged: number;
  stealth: number;
  diplomacy: number;
  medicine: number;
}

export interface Notes {
  background: string;
  inventory: string;
  contacts: string;
}

export interface Character {
  schemaVersion: number;
  lang: Lang;
  meta: CharacterMeta;
  attributes: Attributes;
  skills: Skills;
  notes: Notes;
  updatedAt: string;
}
