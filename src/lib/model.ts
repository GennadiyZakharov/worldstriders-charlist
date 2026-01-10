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

  const baseSkills = base.skills;
  const objSkills = (obj as any).skills;

  function normGroup(group: any, baseGroup: any) {
    if (!Array.isArray(group)) return baseGroup;
    return group.map((e: any, i: number) => ({
      id: typeof e?.id === "string" ? e.id : baseGroup[i]?.id,
      line: {
        enabled: !!e?.line?.enabled,
        note: typeof e?.line?.note === "string" ? e.line.note : "",
        rating: typeof e?.line?.rating === "number" ? e.line.rating : 0
      }
    }));
  }

  const skills =
      objSkills && typeof objSkills === "object"
          ? {
            mental: normGroup(objSkills.mental, baseSkills.mental),
            physical: normGroup(objSkills.physical, baseSkills.physical),
            social: normGroup(objSkills.social, baseSkills.social)
          }
          : baseSkills;

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
