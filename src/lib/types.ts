export type Lang = "en" | "ru";

export interface CharacterMeta {
  characterName: string;
  playerName: string;
  journey: string;

  bigKey: string;
  smallKey: string;
  vice: string;

  concept: string;
  home: string;
  stratoc: string;
}

export interface Attributes {
  intellect: number;
  quickWits: number;
  determination: number;

  magic: number;
  luck: number;
  bodyControl: number;

  impressiveness: number;
  manipulation: number;
  composure: number;
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
  notes: Notes;
  updatedAt: string;
}
