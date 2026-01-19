import type { Lang } from "./types";

export const DICT: Record<Lang, Record<string, string>> = {
  en: {
    title: "WorldStriders",
    language: "Language",

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

    // Attributes
    intellect: "Intellect",
    quickWits: "Quick wits",
    determination: "Determination",
    magic: "Magic",
    luck: "Luck",
    bodyControl: "Body control",
    impressiveness: "Impressiveness",
    manipulation: "Manipulation",
    composure: "Composure",

    // Characteristics
    characteristicsTitle: "CHARACTERISTICS",
    confidence: "Confidence",
    health: "Health",
    aura: "Aura",
    soul: "Soul",
    qi: "Qi",
    willpower: "Willpower",
    charge: "Charge",

    body: "Body",
    strength: "Strength",
    agility: "Agility",
    endurance: "Endurance",

    // Skills
    skillsTitle: "SKILLS",
    mentalTitle: "MENTAL",
    mentalSub: "(-3 not memorized)",
    physicalTitle: "PHYSICAL",
    physicalSub: "(-1 not memorized)",
    socialTitle: "SOCIAL",
    socialSub: "(-1 not memorized)",

    skill_humanities: "Humanities",
    skill_technical: "Technical",
    skill_business: "Business",
    skill_investigation: "Investigation",
    skill_medicine: "Medicine",
    skill_occult: "Occult",
    skill_politics: "Politics",
    skill_natural: "Natural sciences",

    skill_athletics: "Athletics",
    skill_fight: "Fight",
    skill_driving: "Driving",
    skill_firearms: "Firearms",
    skill_craft: "Craft",
    skill_stealth: "Stealth",
    skill_survival: "Survival",
    skill_coldWeapons: "Cold weapons",

    skill_animalHandling: "Animal handling",
    skill_empathy: "Empathy",
    skill_expression: "Expression",
    skill_etiquette: "Etiquette",
    skill_seduction: "Persuation",
    skill_communication: "Communication",
    skill_faces: "Streets",
    skill_deception: "Deception",

    derivedTitle: "DERIVED",
    size: "Size",
    defense: "Defense",
    initiativeMod: "Initiative modifier",
    speed: "Speed",
    perception: "Perception",

    // Left “soft” labels (the grey words in screenshot)
    power: "Power",
    grace: "Grace",
    resistance: "Resistance",

    permanentPerksTitle: "PERMANENT PERKS",
    temporaryPerksTitle: "TEMPORARY PERKS",
    add: "Add",
    delete: "Delete"


  },

  ru: {
    title: "Мироxодцы",
    language: "Язык",

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

    // Characteristics
    characteristicsTitle: "ХАРАКТЕРИСТИКИ",
    confidence: "Уверенность",
    health: "Здоровье",
    aura: "Аура",
    soul: "Душа",
    qi: "ГИ",
    willpower: "Сила воли",
    charge: "Заряд",

    body: "Тело",
    strength: "Сила",
    agility: "Ловкость",
    endurance: "Выносливость",

    // Skills
    skillsTitle: "НАВЫКИ",
    mentalTitle: "МЕНТАЛЬНЫЕ",
    mentalSub: "(-3 не изучено)",
    physicalTitle: "ФИЗИЧЕСКИЕ",
    physicalSub: "(-1 не изучено)",
    socialTitle: "СОЦИАЛЬНЫЕ",
    socialSub: "(-1 не изучено)",

    skill_humanities: "Гуманитарные н.",
    skill_technical: "Технические н.",
    skill_business: "Бизнес",
    skill_investigation: "Расследование",
    skill_medicine: "Медицина",
    skill_occult: "Оккультные н.",
    skill_politics: "Политика",
    skill_natural: "Естественные н.",

    skill_athletics: "Атлетика",
    skill_fight: "Драка",
    skill_driving: "Вождение",
    skill_firearms: "Огнестрел",
    skill_craft: "Ремесло",
    skill_stealth: "Скрытность",
    skill_survival: "Выживание",
    skill_coldWeapons: "Холодное оружие",

    skill_animalHandling: "Зн. животных",
    skill_empathy: "Эмпатия",
    skill_expression: "Экспрессия",
    skill_etiquette: "Этикет",
    skill_seduction: "Persuasion",
    skill_communication: "Общение",
    skill_faces: "Зн. yлиц",
    skill_deception: "Обман",

    power: "Мощь",
    grace: "Грация",
    resistance: "Сопротивление",

    derivedTitle: "Производные",
    size: "Размер",
    defense: "Защита",
    initiativeMod: "Мод. инициативы",
    speed: "Скорость",
    perception: "Восприятие",


    permanentPerksTitle: "ПОСТОЯННЫЕ ПЕРКИ",
    temporaryPerksTitle: "ВРЕМЕННЫЕ ПЕРКИ",
    add: "Добавить",
    delete: "Удалить"
  }
};

export function t(lang: Lang, key: string): string {
  return DICT[lang]?.[key] ?? DICT.en[key] ?? key;
}
