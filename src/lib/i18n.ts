import type { Lang } from "./types";

export const DICT: Record<Lang, Record<string, string>> = {
  en: {
    title: "WorldStriders",
    language: "Language",
    autosave: "Autosave",
    saved: "Saved",
    notSaved: "Not saved",

    exportYaml: "Export YAML",
    importYaml: "Import YAML",
    reset: "Reset",

    name: "Name",
    player: "Player",
    journey: "Journey",

    bigKey: "Big key",
    smallKey: "Small key",
    vice: "Vice",

    concept: "Concept",
    home: "Home",
    stratoc: "Stratoc",

    attributesTitle: "ATTRIBUTES",

    // Attributes (bold labels)
    intellect: "Intellect",
    quickWits: "Quick wits",
    determination: "Determination",
    magic: "Magic",
    luck: "Luck",
    bodyControl: "Body control",
    impressiveness: "Impressiveness",
    manipulation: "Manipulation",
    composure: "Composure",

    // Left “soft” labels (the grey words in screenshot)
    power: "Power",
    grace: "Grace",
    resistance: "Resistance"
  },

  ru: {
    title: "МироХодцы",
    language: "Язык",
    autosave: "Автосохранение",
    saved: "Сохранено",
    notSaved: "Не сохранено",

    exportYaml: "Экспорт YAML",
    importYaml: "Импорт YAML",
    reset: "Сброс",

    name: "Имя",
    player: "Игрок",
    journey: "Путешествие",

    bigKey: "Большой ключ",
    smallKey: "Малый ключ",
    vice: "Порок",

    concept: "Концепт",
    home: "Дом",
    stratoc: "Стратос",

    attributesTitle: "АТРИБУТЫ",

    intellect: "Интеллект",
    quickWits: "Сообразительность",
    determination: "Решительность",
    magic: "Магия",
    luck: "Удача",
    bodyControl: "Контроль тела",
    impressiveness: "Внушительность",
    manipulation: "Манипулирование",
    composure: "Самообладание",

    power: "Мощь",
    grace: "Грация",
    resistance: "Сопротивление"
  }
};

export function t(lang: Lang, key: string): string {
  return DICT[lang]?.[key] ?? DICT.en[key] ?? key;
}
