export type Lang = "en" | "ru";

export interface PerkEntry {
  text: string;
  level: number; // 0..5
}

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

type MentalSkillId =
    | "humanities" | "technical" | "business" | "investigation"
    | "medicine" | "occult" | "politics" | "natural";

type PhysicalSkillId =
    | "athletics" | "fight" | "driving" | "firearms"
    | "craft" | "stealth" | "survival" | "coldWeapons";

type SocialSkillId =
    | "animalHandling" | "empathy" | "expression" | "etiquette"
    | "seduction" | "communication" | "faces" | "deception";

export type SkillLine = { enabled: boolean; note: string; rating: number };
export type SkillEntry<ID extends string> = { id: ID; line: SkillLine };

export interface CharacterSkills {
  mental: SkillEntry<MentalSkillId>[];
  physical: SkillEntry<PhysicalSkillId>[];
  social: SkillEntry<SocialSkillId>[];
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
  skills: CharacterSkills;
  permanentPerks: PerkEntry[];
  temporaryPerks: PerkEntry[];
  notes: Notes;
  updatedAt: string;
}
