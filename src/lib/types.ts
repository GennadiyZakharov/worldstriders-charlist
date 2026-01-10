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

export interface SkillLine {
  enabled: boolean;
  note: string;
  rating: number; // 0..5
}

export type MentalSkillId =
    | "humanities"
    | "technical"
    | "business"
    | "investigation"
    | "medicine"
    | "occult"
    | "politics"
    | "natural";

export type PhysicalSkillId =
    | "athletics"
    | "fight"
    | "driving"
    | "firearms"
    | "craft"
    | "stealth"
    | "survival"
    | "coldWeapons";

export type SocialSkillId =
    | "animalHandling"
    | "empathy"
    | "expression"
    | "etiquette"
    | "seduction"
    | "communication"
    | "faces"
    | "deception";

export interface SkillEntry {
  id: string;         // one of the ids above
  line: SkillLine;
}

export interface CharacterSkills {
  mental: SkillEntry[];
  physical: SkillEntry[];
  social: SkillEntry[];
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
  notes: Notes;
  updatedAt: string;
}
