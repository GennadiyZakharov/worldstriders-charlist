// LocalStorage keys
export const STORAGE_KEYS = {
  CHARACTER_NAME: 'worldstriders-character-name',
  CHARACTER_ATTRIBUTES: 'worldstriders-character-attributes',
  LANGUAGE: 'worldstriders-language',
} as const;

// Attribute constraints
export const ATTRIBUTE_CONSTRAINTS = {
  MIN_VALUE: 1,
  MAX_VALUE: 5,
  DEFAULT_VALUE: 1,
} as const;

// Attribute names
export const ATTRIBUTE_NAMES = [
  'intelligence', 
  'comprehension', 
  'resoluteness',
  'magic', 
  'luck', 
  'bodyControl',
  'impressiveness', 
  'manipulation', 
  'poise'
] as const;

// UI constants
export const UI_CONSTANTS = {
  CIRCLES_COUNT: 5,
} as const;