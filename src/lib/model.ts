import type { Character } from "./types";

export const SCHEMA_VERSION = 1;

export function defaultCharacter(): Character {
  return {
    schemaVersion: SCHEMA_VERSION,
    lang: "en",

    meta: {
      characterName: "",
      playerName: "",
      journey: "",

      bigKey: "",
      smallKey: "",
      vice: "",

      concept: "",
      home: "",
      stratoc: ""
    },

    attributes: {
      intellect: 0,
      quickWits: 0,
      determination: 0,

      magic: 0,
      luck: 0,
      bodyControl: 0,

      impressiveness: 0,
      manipulation: 0,
      composure: 0
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
    notes: { ...base.notes, ...obj.notes },
    schemaVersion: SCHEMA_VERSION,
    updatedAt: new Date().toISOString()
  };
}
