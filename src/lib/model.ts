import type {Character, PerkEntry} from "./types";

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

    perks: [],

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
  const skills = normalizeSkills(input.skills, base.skills);
  const perks = normalizePerks(input.perks);
  const notes = normalizeNotes(input.notes, base.notes);

  // Only allow known scalar fields; don't spread whole input.
  const lang = input.lang === "ru" || input.lang === "en" ? input.lang : base.lang;

  return {
    schemaVersion: SCHEMA_VERSION,
    lang,
    meta,
    attributes,
    skills,
    perks,
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

type SkillEntry = Character["skills"]["mental"][number];
type SkillGroup = SkillEntry[];

function normalizeSkillGroup(group: unknown, baseGroup: SkillGroup): SkillGroup {
  if (!Array.isArray(group)) return baseGroup;

  // Keep ordering from baseGroup. If imported file has fewer items, use base for missing.
  return baseGroup.map((baseItem, i) => {
    const raw = group[i];
    if (!isRecord(raw)) return baseItem;

    const id =
        typeof raw.id === "string"
            ? raw.id
            : baseItem.id;

    const line = asRecord(raw.line);
    const enabled = line ? !!line.enabled : baseItem.line.enabled;
    const note = line && typeof line.note === "string" ? (line.note as string) : baseItem.line.note;
    const rating = line ? clampInt(line.rating, 0, 5, baseItem.line.rating) : baseItem.line.rating;

    return {
      id,
      line: { enabled, note, rating }
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

function normalizePerks(v: unknown): Character["perks"] {
  if (!Array.isArray(v)) return [];

  return v
      .filter((x): x is unknown => true)
      .map((x) => {
        if (typeof x !== "object" || x === null) return { text: "", level: 0 };
        const r = x as Record<string, unknown>;

        const text = typeof r.text === "string" ? r.text : "";
        const level =
            typeof r.level === "number" && Number.isFinite(r.level)
                ? Math.min(5, Math.max(0, Math.trunc(r.level)))
                : 0;

        return { text, level };
      })
      .filter((p) => p.text.trim() !== "" || p.level !== 0); // optional: drop empty noise
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
