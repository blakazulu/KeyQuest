/**
 * Keyboard layout data for the visual keyboard component.
 * Defines key positions, sizes, and finger assignments for QWERTY and Hebrew layouts.
 */

/** Supported keyboard layout types */
export type KeyboardLayoutType = 'qwerty' | 'hebrew';

export type Finger =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky'
  | 'thumb';

export interface KeyData {
  /** The character this key produces (lowercase) */
  key: string;
  /** Display label (can differ from key, e.g., "Shift") */
  label: string;
  /** Secondary label (e.g., shift character like "!" for "1") */
  shiftLabel?: string;
  /** Which finger should press this key */
  finger: Finger;
  /** Width multiplier (1 = standard key width) */
  width?: number;
  /** Whether this is a home row key */
  isHomeRow?: boolean;
  /** Key code for matching keyboard events */
  code?: string;
}

export interface KeyboardRow {
  keys: KeyData[];
}

/**
 * Finger to CSS class mapping for color coding.
 * Maps to the finger color variables defined in globals.css.
 */
export const fingerToClass: Record<Finger, string> = {
  'left-pinky': 'finger-lpinky',
  'left-ring': 'finger-lring',
  'left-middle': 'finger-lmiddle',
  'left-index': 'finger-lindex',
  'right-index': 'finger-rindex',
  'right-middle': 'finger-rmiddle',
  'right-ring': 'finger-rring',
  'right-pinky': 'finger-rpinky',
  'thumb': 'finger-thumb',
};

/**
 * Finger display names for accessibility and tooltips.
 */
export const fingerNames: Record<Finger, { en: string; he: string }> = {
  'left-pinky': { en: 'Left Pinky', he: 'זרת שמאל' },
  'left-ring': { en: 'Left Ring', he: 'קמיצה שמאל' },
  'left-middle': { en: 'Left Middle', he: 'אמה שמאל' },
  'left-index': { en: 'Left Index', he: 'אצבע שמאל' },
  'right-index': { en: 'Right Index', he: 'אצבע ימין' },
  'right-middle': { en: 'Right Middle', he: 'אמה ימין' },
  'right-ring': { en: 'Right Ring', he: 'קמיצה ימין' },
  'right-pinky': { en: 'Right Pinky', he: 'זרת ימין' },
  'thumb': { en: 'Thumb', he: 'אגודל' },
};

/**
 * Standard QWERTY keyboard layout.
 * Each row contains keys with their properties.
 */
export const qwertyLayout: KeyboardRow[] = [
  // Number row
  {
    keys: [
      { key: '`', label: '`', shiftLabel: '~', finger: 'left-pinky' },
      { key: '1', label: '1', shiftLabel: '!', finger: 'left-pinky' },
      { key: '2', label: '2', shiftLabel: '@', finger: 'left-ring' },
      { key: '3', label: '3', shiftLabel: '#', finger: 'left-middle' },
      { key: '4', label: '4', shiftLabel: '$', finger: 'left-index' },
      { key: '5', label: '5', shiftLabel: '%', finger: 'left-index' },
      { key: '6', label: '6', shiftLabel: '^', finger: 'right-index' },
      { key: '7', label: '7', shiftLabel: '&', finger: 'right-index' },
      { key: '8', label: '8', shiftLabel: '*', finger: 'right-middle' },
      { key: '9', label: '9', shiftLabel: '(', finger: 'right-ring' },
      { key: '0', label: '0', shiftLabel: ')', finger: 'right-pinky' },
      { key: '-', label: '-', shiftLabel: '_', finger: 'right-pinky' },
      { key: '=', label: '=', shiftLabel: '+', finger: 'right-pinky' },
      { key: 'Backspace', label: '←', finger: 'right-pinky', width: 2, code: 'Backspace' },
    ],
  },
  // Top row (QWERTY)
  {
    keys: [
      { key: 'Tab', label: 'Tab', finger: 'left-pinky', width: 1.5, code: 'Tab' },
      { key: 'q', label: 'Q', finger: 'left-pinky' },
      { key: 'w', label: 'W', finger: 'left-ring' },
      { key: 'e', label: 'E', finger: 'left-middle' },
      { key: 'r', label: 'R', finger: 'left-index' },
      { key: 't', label: 'T', finger: 'left-index' },
      { key: 'y', label: 'Y', finger: 'right-index' },
      { key: 'u', label: 'U', finger: 'right-index' },
      { key: 'i', label: 'I', finger: 'right-middle' },
      { key: 'o', label: 'O', finger: 'right-ring' },
      { key: 'p', label: 'P', finger: 'right-pinky' },
      { key: '[', label: '[', shiftLabel: '{', finger: 'right-pinky' },
      { key: ']', label: ']', shiftLabel: '}', finger: 'right-pinky' },
      { key: '\\', label: '\\', shiftLabel: '|', finger: 'right-pinky', width: 1.5 },
    ],
  },
  // Home row (ASDF)
  {
    keys: [
      { key: 'CapsLock', label: 'Caps', finger: 'left-pinky', width: 1.75, code: 'CapsLock' },
      { key: 'a', label: 'A', finger: 'left-pinky', isHomeRow: true },
      { key: 's', label: 'S', finger: 'left-ring', isHomeRow: true },
      { key: 'd', label: 'D', finger: 'left-middle', isHomeRow: true },
      { key: 'f', label: 'F', finger: 'left-index', isHomeRow: true },
      { key: 'g', label: 'G', finger: 'left-index' },
      { key: 'h', label: 'H', finger: 'right-index' },
      { key: 'j', label: 'J', finger: 'right-index', isHomeRow: true },
      { key: 'k', label: 'K', finger: 'right-middle', isHomeRow: true },
      { key: 'l', label: 'L', finger: 'right-ring', isHomeRow: true },
      { key: ';', label: ';', shiftLabel: ':', finger: 'right-pinky', isHomeRow: true },
      { key: "'", label: "'", shiftLabel: '"', finger: 'right-pinky' },
      { key: 'Enter', label: 'Enter', finger: 'right-pinky', width: 2.25, code: 'Enter' },
    ],
  },
  // Bottom row (ZXCV)
  {
    keys: [
      { key: 'Shift', label: 'Shift', finger: 'left-pinky', width: 2.25, code: 'ShiftLeft' },
      { key: 'z', label: 'Z', finger: 'left-pinky' },
      { key: 'x', label: 'X', finger: 'left-ring' },
      { key: 'c', label: 'C', finger: 'left-middle' },
      { key: 'v', label: 'V', finger: 'left-index' },
      { key: 'b', label: 'B', finger: 'left-index' },
      { key: 'n', label: 'N', finger: 'right-index' },
      { key: 'm', label: 'M', finger: 'right-index' },
      { key: ',', label: ',', shiftLabel: '<', finger: 'right-middle' },
      { key: '.', label: '.', shiftLabel: '>', finger: 'right-ring' },
      { key: '/', label: '/', shiftLabel: '?', finger: 'right-pinky' },
      { key: 'Shift', label: 'Shift', finger: 'right-pinky', width: 2.75, code: 'ShiftRight' },
    ],
  },
  // Space row
  {
    keys: [
      { key: 'Ctrl', label: 'Ctrl', finger: 'left-pinky', width: 1.25, code: 'ControlLeft' },
      { key: 'Win', label: 'Win', finger: 'left-pinky', width: 1.25, code: 'MetaLeft' },
      { key: 'Alt', label: 'Alt', finger: 'left-pinky', width: 1.25, code: 'AltLeft' },
      { key: ' ', label: '', finger: 'thumb', width: 6.25, code: 'Space' },
      { key: 'Alt', label: 'Alt', finger: 'right-pinky', width: 1.25, code: 'AltRight' },
      { key: 'Win', label: 'Win', finger: 'right-pinky', width: 1.25, code: 'MetaRight' },
      { key: 'Menu', label: 'Menu', finger: 'right-pinky', width: 1.25 },
      { key: 'Ctrl', label: 'Ctrl', finger: 'right-pinky', width: 1.25, code: 'ControlRight' },
    ],
  },
];

/**
 * Hebrew keyboard layout (SI-1452 standard).
 * Maps Hebrew letters to standard QWERTY physical key positions.
 * Home row: ש ד ג כ (left hand) | ח ל ך ף (right hand)
 */
export const hebrewLayout: KeyboardRow[] = [
  // Number row (same as QWERTY with Hebrew punctuation on shift)
  {
    keys: [
      { key: ';', label: ';', shiftLabel: '~', finger: 'left-pinky' },
      { key: '1', label: '1', shiftLabel: '!', finger: 'left-pinky' },
      { key: '2', label: '2', shiftLabel: '@', finger: 'left-ring' },
      { key: '3', label: '3', shiftLabel: '#', finger: 'left-middle' },
      { key: '4', label: '4', shiftLabel: '$', finger: 'left-index' },
      { key: '5', label: '5', shiftLabel: '%', finger: 'left-index' },
      { key: '6', label: '6', shiftLabel: '^', finger: 'right-index' },
      { key: '7', label: '7', shiftLabel: '&', finger: 'right-index' },
      { key: '8', label: '8', shiftLabel: '*', finger: 'right-middle' },
      { key: '9', label: '9', shiftLabel: '(', finger: 'right-ring' },
      { key: '0', label: '0', shiftLabel: ')', finger: 'right-pinky' },
      { key: '-', label: '-', shiftLabel: '_', finger: 'right-pinky' },
      { key: '=', label: '=', shiftLabel: '+', finger: 'right-pinky' },
      { key: 'Backspace', label: '←', finger: 'right-pinky', width: 2, code: 'Backspace' },
    ],
  },
  // Top row (Hebrew letters mapped to QWERTY positions)
  {
    keys: [
      { key: 'Tab', label: 'Tab', finger: 'left-pinky', width: 1.5, code: 'Tab' },
      { key: '/', label: '/', finger: 'left-pinky' },
      { key: "'", label: "'", finger: 'left-ring' },
      { key: 'ק', label: 'ק', finger: 'left-middle' },
      { key: 'ר', label: 'ר', finger: 'left-index' },
      { key: 'א', label: 'א', finger: 'left-index' },
      { key: 'ט', label: 'ט', finger: 'right-index' },
      { key: 'ו', label: 'ו', finger: 'right-index' },
      { key: 'ן', label: 'ן', finger: 'right-middle' },
      { key: 'ם', label: 'ם', finger: 'right-ring' },
      { key: 'פ', label: 'פ', finger: 'right-pinky' },
      { key: ']', label: ']', shiftLabel: '}', finger: 'right-pinky' },
      { key: '[', label: '[', shiftLabel: '{', finger: 'right-pinky' },
      { key: '\\', label: '\\', shiftLabel: '|', finger: 'right-pinky', width: 1.5 },
    ],
  },
  // Home row (Hebrew home keys: ש ד ג כ | ח ל ך ף)
  {
    keys: [
      { key: 'CapsLock', label: 'Caps', finger: 'left-pinky', width: 1.75, code: 'CapsLock' },
      { key: 'ש', label: 'ש', finger: 'left-pinky', isHomeRow: true },
      { key: 'ד', label: 'ד', finger: 'left-ring', isHomeRow: true },
      { key: 'ג', label: 'ג', finger: 'left-middle', isHomeRow: true },
      { key: 'כ', label: 'כ', finger: 'left-index', isHomeRow: true },
      { key: 'ע', label: 'ע', finger: 'left-index' },
      { key: 'י', label: 'י', finger: 'right-index' },
      { key: 'ח', label: 'ח', finger: 'right-index', isHomeRow: true },
      { key: 'ל', label: 'ל', finger: 'right-middle', isHomeRow: true },
      { key: 'ך', label: 'ך', finger: 'right-ring', isHomeRow: true },
      { key: 'ף', label: 'ף', finger: 'right-pinky', isHomeRow: true },
      { key: ',', label: ',', shiftLabel: '"', finger: 'right-pinky' },
      { key: 'Enter', label: 'Enter', finger: 'right-pinky', width: 2.25, code: 'Enter' },
    ],
  },
  // Bottom row
  {
    keys: [
      { key: 'Shift', label: 'Shift', finger: 'left-pinky', width: 2.25, code: 'ShiftLeft' },
      { key: 'ז', label: 'ז', finger: 'left-pinky' },
      { key: 'ס', label: 'ס', finger: 'left-ring' },
      { key: 'ב', label: 'ב', finger: 'left-middle' },
      { key: 'ה', label: 'ה', finger: 'left-index' },
      { key: 'נ', label: 'נ', finger: 'left-index' },
      { key: 'מ', label: 'מ', finger: 'right-index' },
      { key: 'צ', label: 'צ', finger: 'right-index' },
      { key: 'ת', label: 'ת', finger: 'right-middle' },
      { key: 'ץ', label: 'ץ', finger: 'right-ring' },
      { key: '.', label: '.', shiftLabel: '?', finger: 'right-pinky' },
      { key: 'Shift', label: 'Shift', finger: 'right-pinky', width: 2.75, code: 'ShiftRight' },
    ],
  },
  // Space row (same as QWERTY)
  {
    keys: [
      { key: 'Ctrl', label: 'Ctrl', finger: 'left-pinky', width: 1.25, code: 'ControlLeft' },
      { key: 'Win', label: 'Win', finger: 'left-pinky', width: 1.25, code: 'MetaLeft' },
      { key: 'Alt', label: 'Alt', finger: 'left-pinky', width: 1.25, code: 'AltLeft' },
      { key: ' ', label: '', finger: 'thumb', width: 6.25, code: 'Space' },
      { key: 'Alt', label: 'Alt', finger: 'right-pinky', width: 1.25, code: 'AltRight' },
      { key: 'Win', label: 'Win', finger: 'right-pinky', width: 1.25, code: 'MetaRight' },
      { key: 'Menu', label: 'Menu', finger: 'right-pinky', width: 1.25 },
      { key: 'Ctrl', label: 'Ctrl', finger: 'right-pinky', width: 1.25, code: 'ControlRight' },
    ],
  },
];

/**
 * All available keyboard layouts.
 */
export const layouts: Record<KeyboardLayoutType, KeyboardRow[]> = {
  qwerty: qwertyLayout,
  hebrew: hebrewLayout,
};

/**
 * Get the KeyData for a specific character.
 * Searches through all rows to find the matching key.
 * @param char - The character to find
 * @param layout - The keyboard layout to search (defaults to 'qwerty')
 */
export function getKeyData(char: string, layout: KeyboardLayoutType = 'qwerty'): KeyData | undefined {
  const lowerChar = char.toLowerCase();
  const layoutData = layouts[layout];

  for (const row of layoutData) {
    for (const keyData of row.keys) {
      if (keyData.key === lowerChar || keyData.key === char) {
        return keyData;
      }
      // Check shift label for uppercase/symbols
      if (keyData.shiftLabel === char) {
        return keyData;
      }
      // Check if it's the uppercase version (only for Latin letters)
      if (keyData.label === char.toUpperCase() && keyData.key === lowerChar) {
        return keyData;
      }
    }
  }

  return undefined;
}

/**
 * Get the finger assignment for a specific character.
 * @param char - The character to find
 * @param layout - The keyboard layout to search (defaults to 'qwerty')
 */
export function getFingerForKey(char: string, layout: KeyboardLayoutType = 'qwerty'): Finger | undefined {
  const keyData = getKeyData(char, layout);
  return keyData?.finger;
}

/**
 * Check if a character is on the home row.
 * @param char - The character to check
 * @param layout - The keyboard layout to search (defaults to 'qwerty')
 */
export function isHomeRowKey(char: string, layout: KeyboardLayoutType = 'qwerty'): boolean {
  const keyData = getKeyData(char, layout);
  return keyData?.isHomeRow ?? false;
}

/**
 * Get all home row keys for a specific layout.
 * @param layout - The keyboard layout (defaults to 'qwerty')
 */
export function getHomeRowKeys(layout: KeyboardLayoutType = 'qwerty'): string[] {
  const homeKeys: string[] = [];
  const layoutData = layouts[layout];

  for (const row of layoutData) {
    for (const keyData of row.keys) {
      if (keyData.isHomeRow) {
        homeKeys.push(keyData.key);
      }
    }
  }

  return homeKeys;
}

/**
 * Check if a character is a Hebrew letter.
 * Hebrew letters are in Unicode range U+05D0 to U+05EA (Aleph to Tav).
 */
export function isHebrewChar(char: string): boolean {
  if (!char || char.length === 0) return false;
  const code = char.charCodeAt(0);
  return code >= 0x05D0 && code <= 0x05EA;
}

/**
 * Get all Hebrew letters (Aleph to Tav).
 */
export function getHebrewLetters(): string[] {
  return ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ך', 'ל', 'מ', 'ם', 'נ', 'ן', 'ס', 'ע', 'פ', 'ף', 'צ', 'ץ', 'ק', 'ר', 'ש', 'ת'];
}

/**
 * Detect the appropriate layout for a given text based on content.
 * Returns 'hebrew' if the majority of letters are Hebrew, otherwise 'qwerty'.
 */
export function detectLayoutFromText(text: string): KeyboardLayoutType {
  let hebrewCount = 0;
  let latinCount = 0;

  for (const char of text) {
    if (isHebrewChar(char)) {
      hebrewCount++;
    } else if (/[a-zA-Z]/.test(char)) {
      latinCount++;
    }
  }

  return hebrewCount > latinCount ? 'hebrew' : 'qwerty';
}
