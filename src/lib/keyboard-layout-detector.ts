/**
 * Keyboard Layout Detection Utilities
 * Detects if the user's keyboard input matches the expected layout
 */

import type { KeyboardLayoutType } from '@/data/keyboard-layout';

// Hebrew Unicode range: U+0590 to U+05FF (Hebrew letters are U+05D0 to U+05EA)
const HEBREW_CHAR_REGEX = /[\u0590-\u05FF]/;
// Basic Latin letters
const LATIN_CHAR_REGEX = /[a-zA-Z]/;

/**
 * Detect if a character is Hebrew
 */
export function isHebrewChar(char: string): boolean {
  return HEBREW_CHAR_REGEX.test(char);
}

/**
 * Detect if a character is Latin (English)
 */
export function isLatinChar(char: string): boolean {
  return LATIN_CHAR_REGEX.test(char);
}

/**
 * Check if a typed character matches the expected keyboard layout
 * Returns true if the character is compatible with the layout
 */
export function isCharacterCompatibleWithLayout(
  char: string,
  expectedLayout: KeyboardLayoutType
): boolean {
  // Non-letter characters (numbers, punctuation, space) are always compatible
  if (!isHebrewChar(char) && !isLatinChar(char)) {
    return true;
  }

  if (expectedLayout === 'hebrew') {
    // Hebrew layout expects Hebrew characters
    return isHebrewChar(char);
  } else {
    // QWERTY layout expects Latin characters
    return isLatinChar(char);
  }
}

/**
 * Detect keyboard layout from a character
 * Returns the detected layout or null if can't determine
 */
export function detectLayoutFromChar(char: string): KeyboardLayoutType | null {
  if (isHebrewChar(char)) {
    return 'hebrew';
  }
  if (isLatinChar(char)) {
    return 'qwerty';
  }
  return null;
}

/**
 * Try to detect keyboard layout using the Keyboard Layout Map API
 * This is a modern API with limited browser support (Chrome/Edge only)
 * Returns null if not supported or fails
 */
export async function detectKeyboardLayoutFromAPI(): Promise<KeyboardLayoutType | null> {
  try {
    // Check if the API is available
    if (!('keyboard' in navigator)) {
      return null;
    }

    const keyboard = (navigator as Navigator & { keyboard?: { getLayoutMap: () => Promise<Map<string, string>> } }).keyboard;
    if (!keyboard?.getLayoutMap) {
      return null;
    }

    const layoutMap = await keyboard.getLayoutMap();

    // Check a common key to determine layout
    // KeyA on QWERTY produces 'a', on Hebrew produces 'ש'
    const keyAValue = layoutMap.get('KeyA');

    if (keyAValue && isHebrewChar(keyAValue)) {
      return 'hebrew';
    }

    return 'qwerty';
  } catch {
    // API not available or failed
    return null;
  }
}

/**
 * Get user-friendly instructions for switching keyboard layout
 */
export function getLayoutSwitchInstructions(
  targetLayout: KeyboardLayoutType,
  locale: 'en' | 'he'
): { title: string; instructions: string[]; dismissLabel: string } {
  if (locale === 'he') {
    if (targetLayout === 'hebrew') {
      return {
        title: 'נראה שהמקלדת שלך באנגלית',
        instructions: [
          'כדי לעבור לעברית:',
          '• Windows: לחצו Alt + Shift',
          '• Mac: לחצו Cmd + Space או Ctrl + Space',
          'לאחר המעבר, לחצו על כפתור "הבנתי" כדי להמשיך',
        ],
        dismissLabel: 'הבנתי, עברתי לעברית',
      };
    } else {
      return {
        title: 'נראה שהמקלדת שלך בעברית',
        instructions: [
          'כדי לעבור לאנגלית:',
          '• Windows: לחצו Alt + Shift',
          '• Mac: לחצו Cmd + Space או Ctrl + Space',
          'לאחר המעבר, לחצו על כפתור "הבנתי" כדי להמשיך',
        ],
        dismissLabel: 'הבנתי, עברתי לאנגלית',
      };
    }
  } else {
    if (targetLayout === 'hebrew') {
      return {
        title: 'Your keyboard seems to be in English',
        instructions: [
          'To switch to Hebrew:',
          '• Windows: Press Alt + Shift',
          '• Mac: Press Cmd + Space or Ctrl + Space',
          'After switching, click the button below to continue',
        ],
        dismissLabel: 'Got it, I switched to Hebrew',
      };
    } else {
      return {
        title: 'Your keyboard seems to be in Hebrew',
        instructions: [
          'To switch to English:',
          '• Windows: Press Alt + Shift',
          '• Mac: Press Cmd + Space or Ctrl + Space',
          'After switching, click the button below to continue',
        ],
        dismissLabel: 'Got it, I switched to English',
      };
    }
  }
}
