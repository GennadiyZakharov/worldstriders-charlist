import type { Character } from "./types";

export const SCHEMA_VERSION = 1;

export function defaultCharacter(): Character {
  return {
    schemaVersion: SCHEMA_VERSION,
    lang: "en",

    meta: {
      characterName: "",
      playerName: "",
      faction: "",
      concept: ""
    },

    attributes: {
      strength: 1,
      agility: 1,
      intellect: 1,
      willpower: 1
    },

    skills: {
      melee: 0,
      ranged: 0,
      stealth: 0,
      diplomacy: 0,
      medicine: 0
    },

    notes: {
      background: "",
      inventory: "",
      contacts: ""
    },

    updatedAt: new Date().toISOString()
  };
}

export function normalizeCharacter(input: unknown): Character {
  const base = defaultCharacter();

  if (typeof input !== "object" || input === null) return base;
  const obj = input as Partial<Character>;

  return {
    ...base,
    ...obj,
    meta: { ...base.meta, ...obj.meta },
    attributes: { ...base.attributes, ...obj.attributes },
    skills: { ...base.skills, ...obj.skills },
    notes: { ...base.notes, ...obj.notes },
    schemaVersion: SCHEMA_VERSION,
    updatedAt: new Date().toISOString()
  };
}
