import type { Lang } from "./types";

export const DICT: Record<Lang, Record<string, string>> = {
  en: {
    title: "Character Sheet",
    language: "Language",
    autosave: "Autosave",
    saved: "Saved",
    notSaved: "Not saved",
    meta: "Meta",
    attributes: "Attributes",
    skills: "Skills",
    notes: "Notes",
    exportYaml: "Export YAML",
    importYaml: "Import YAML",
    reset: "Reset",
    characterName: "Character name",
    playerName: "Player name",
    faction: "Faction",
    concept: "Concept",
    background: "Background",
    inventory: "Inventory",
    contacts: "Contacts"
  },
  ru: {
    title: "Лист персонажа",
    language: "Язык",
    autosave: "Автосохранение",
    saved: "Сохранено",
    notSaved: "Не сохранено",
    meta: "Данные",
    attributes: "Атрибуты",
    skills: "Навыки",
    notes: "Заметки",
    exportYaml: "Экспорт YAML",
    importYaml: "Импорт YAML",
    reset: "Сброс",
    characterName: "Имя персонажа",
    playerName: "Игрок",
    faction: "Фракция",
    concept: "Концепт",
    background: "Предыстория",
    inventory: "Инвентарь",
    contacts: "Контакты"
  }
};

export function t(lang: Lang, key: string): string {
  return DICT[lang]?.[key] ?? DICT.en[key] ?? key;
}
