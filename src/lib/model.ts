import type {Character, SkillLine, SkillEntry, CharacterCharacteristics, CharacteristicPair} from "./types";

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
      intellect: 1,
      quickWits: 1,
      determination: 1,

      magic: 1,
      luck: 1,
      bodyControl: 1,

      impressiveness: 1,
      manipulation: 1,
      composure: 1
    },

    characteristics: {
      confidence: { dots: 1, boxes: 5 },
      health: { dots: 1, boxes: 5 },
      aura: { dots: 1, boxes: 5 },
      soul: { dots: 1, boxes: 5 },
      qi: { dots: 1, boxes: 5 },
      willpower: { dots: 2, boxes: 2 },
      charge: 4
    },

    skills: {
      mental: [
        { id: "humanities",   line: { enabled: false, note: "", rating: 0 } },
        { id: "technical",    line: { enabled: false, note: "", rating: 0 } },
        { id: "business",     line: { enabled: false, note: "", rating: 0 } },
        { id: "investigation",line: { enabled: false, note: "", rating: 0 } },
        { id: "medicine",     line: { enabled: false, note: "", rating: 0 } },
        { id: "occult",       line: { enabled: false, note: "", rating: 0 } },
        { id: "politics",     line: { enabled: false, note: "", rating: 0 } },
        { id: "natural",      line: { enabled: false, note: "", rating: 0 } }
      ],
      physical: [
        { id: "athletics",    line: { enabled: false, note: "", rating: 0 } },
        { id: "fight",        line: { enabled: false, note: "", rating: 0 } },
        { id: "driving",      line: { enabled: false, note: "", rating: 0 } },
        { id: "firearms",     line: { enabled: false, note: "", rating: 0 } },
        { id: "craft",        line: { enabled: false, note: "", rating: 0 } },
        { id: "stealth",      line: { enabled: false, note: "", rating: 0 } },
        { id: "survival",     line: { enabled: false, note: "", rating: 0 } },
        { id: "coldWeapons",  line: { enabled: false, note: "", rating: 0 } }
      ],
      social: [
        { id: "animalHandling", line: { enabled: false, note: "", rating: 0 } },
        { id: "empathy",        line: { enabled: false, note: "", rating: 0 } },
        { id: "expression",     line: { enabled: false, note: "", rating: 0 } },
        { id: "etiquette",      line: { enabled: false, note: "", rating: 0 } },
        { id: "seduction",      line: { enabled: false, note: "", rating: 0 } },
        { id: "communication",  line: { enabled: false, note: "", rating: 0 } },
        { id: "faces",          line: { enabled: false, note: "", rating: 0 } },
        { id: "deception",      line: { enabled: false, note: "", rating: 0 } }
      ]
    },

    permanentPerks: [],
    temporaryPerks: [],

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
  if (!isRecord(input)) return base;

  const meta = normalizeMeta(input.meta, base.meta);
  const attributes = normalizeAttributes(input.attributes, base.attributes);
  const characteristics = normalizeCharacteristics(input.characteristics, base.characteristics);
  const skills = normalizeSkills(input.skills, base.skills);
  const permanentPerks = normalizePerks(input.permanentPerks);
  const temporaryPerks = normalizePerks(input.temporaryPerks);
  const notes = normalizeNotes(input.notes, base.notes);

  // Only allow known scalar fields; don't spread whole input.
  const lang = input.lang === "ru" || input.lang === "en" ? input.lang : base.lang;

  return {
    schemaVersion: SCHEMA_VERSION,
    lang,
    meta,
    attributes,
    characteristics,
    skills,
    permanentPerks,
    temporaryPerks,
    notes,
    updatedAt: new Date().toISOString()
  };
}

/** Type guard: plain object record */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return isRecord(v) ? v : null;
}

function normalizeMeta(
    v: unknown,
    base: Character["meta"]
): Character["meta"] {
  const r = asRecord(v);
  if (!r) return base;

  // helper
  const str = (k: keyof Character["meta"]) =>
      typeof r[k] === "string" ? (r[k] as string) : base[k];

  return {
    characterName: str("characterName"),
    playerName: str("playerName"),
    journey: str("journey"),

    bigKey: str("bigKey"),
    smallKey: str("smallKey"),
    vice: str("vice"),

    concept: str("concept"),
    home: str("home"),
    stratoc: str("stratoc")
  };
}

function clampInt(n: unknown, min: number, max: number, fallback: number): number {
  if (typeof n !== "number" || !Number.isFinite(n)) return fallback;
  const x = Math.trunc(n);
  return Math.min(max, Math.max(min, x));
}

function normalizeAttributes(
    v: unknown,
    base: Character["attributes"]
): Character["attributes"] {
  const r = asRecord(v);
  if (!r) return base;

  // attributes are 1..5 in your design
  const attr = (k: keyof Character["attributes"]) =>
      clampInt(r[k], 1, 5, base[k]);

  return {
    intellect: attr("intellect"),
    quickWits: attr("quickWits"),
    determination: attr("determination"),

    magic: attr("magic"),
    luck: attr("luck"),
    bodyControl: attr("bodyControl"),

    impressiveness: attr("impressiveness"),
    manipulation: attr("manipulation"),
    composure: attr("composure")
  };
}

function normalizePair(v: unknown, base: CharacteristicPair): CharacteristicPair {
  const r = asRecord(v);
  if (!r) return base;

  return {
    dots: clampInt(r.dots, 0, 50, base.dots),
    boxes: clampInt(r.boxes, 0, 50, base.boxes)
  };
}

function normalizeCharacteristics(
    v: unknown,
    base: CharacterCharacteristics
): CharacterCharacteristics {
  const r = asRecord(v);
  if (!r) return base;

  return {
    confidence: normalizePair(r.confidence, base.confidence),
    health: normalizePair(r.health, base.health),
    aura: normalizePair(r.aura, base.aura),
    soul: normalizePair(r.soul, base.soul),
    qi: normalizePair(r.qi, base.qi),
    willpower: normalizePair(r.willpower, base.willpower),
    charge: clampInt(r.charge, 0, 200, base.charge)
  };
}

function normalizeSkillLine(raw: unknown, base: SkillLine): SkillLine {
  const r = asRecord(raw);
  if (!r) return base;

  return {
    enabled: !!r.enabled,
    note: typeof r.note === "string" ? (r.note as string) : base.note,
    rating: clampInt(r.rating, 0, 5, base.rating)
  };
}

function normalizeSkillGroup<ID extends string>(
    group: unknown,
    baseGroup: SkillEntry<ID>[]
): SkillEntry<ID>[] {
  if (!Array.isArray(group)) return baseGroup;

  // Build lookup from imported data by id
  const byId = new Map<string, unknown>();
  for (const item of group) {
    const r = asRecord(item);
    if (!r) continue;
    if (typeof r.id !== "string") continue;
    byId.set(r.id, r.line);
  }

  // Keep base order and base ids; only take line data if id matches
  return baseGroup.map((baseItem) => {
    const rawLine = byId.get(baseItem.id);
    return {
      id: baseItem.id,
      line: normalizeSkillLine(rawLine, baseItem.line)
    };
  });
}

function normalizeSkills(
    v: unknown,
    base: Character["skills"]
): Character["skills"] {
  const r = asRecord(v);
  if (!r) return base;

  return {
    mental: normalizeSkillGroup(r.mental, base.mental),
    physical: normalizeSkillGroup(r.physical, base.physical),
    social: normalizeSkillGroup(r.social, base.social)
  };
}

function normalizePerks(v: unknown): Character["permanentPerks"] {
  if (!Array.isArray(v)) return [];

  return v.map((x) => {
    if (typeof x !== "object" || x === null) {
      return { text: "", level: 0 };
    }

    const r = x as Record<string, unknown>;

    const text = typeof r.text === "string" ? r.text : "";
    const level =
        typeof r.level === "number" && Number.isFinite(r.level)
            ? Math.min(5, Math.max(0, Math.trunc(r.level)))
            : 0;

    return { text, level };
  });
}

function normalizeNotes(
    v: unknown,
    base: Character["notes"]
): Character["notes"] {
  const r = asRecord(v);
  if (!r) return base;

  const str = (k: keyof Character["notes"]) =>
      typeof r[k] === "string" ? (r[k] as string) : base[k];

  return {
    background: str("background"),
    inventory: str("inventory"),
    contacts: str("contacts")
  };
}
