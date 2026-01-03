/**
 * Text generation utilities for Calm Mode
 * Generates endless, flowing text with optional weak letter targeting
 */

import {
  getRandomWord as getRandomEnglishWord,
  getRandomWordWithLetter as getRandomEnglishWordWithLetter,
  getWordsForLetter as getEnglishWordsForLetter,
} from '@/data/calmModeWords';
import {
  getRandomHebrewWord,
  getRandomHebrewWordWithLetter,
  getHebrewWordsForLetter,
} from '@/data/hebrewWords';
import type { KeyboardLayoutType } from '@/data/keyboard-layout';

/**
 * Configuration for text generation
 */
export interface TextGeneratorConfig {
  /** Target length of generated text in characters (default: 60) */
  chunkSize?: number;
  /** User's weak letters with their accuracy scores (0-100) */
  weakLetters?: Record<string, number>;
  /** Whether to weight word selection toward weak letters (default: true) */
  focusWeakLetters?: boolean;
  /** Probability of selecting a weak letter word when focusing (default: 0.4) */
  weakLetterWeight?: number;
  /** Keyboard layout to use for word generation (default: 'qwerty') */
  layout?: KeyboardLayoutType;
}

// Helper functions that switch based on layout
function getRandomWord(layout: KeyboardLayoutType = 'qwerty'): string {
  return layout === 'hebrew' ? getRandomHebrewWord() : getRandomEnglishWord();
}

function getRandomWordWithLetter(letter: string, layout: KeyboardLayoutType = 'qwerty'): string {
  return layout === 'hebrew'
    ? getRandomHebrewWordWithLetter(letter)
    : getRandomEnglishWordWithLetter(letter);
}

function getWordsForLetter(letter: string, layout: KeyboardLayoutType = 'qwerty'): string[] {
  return layout === 'hebrew'
    ? getHebrewWordsForLetter(letter)
    : getEnglishWordsForLetter(letter);
}

/**
 * Get the weakest letter from the weak letters map
 * Returns the letter with the lowest accuracy score
 */
export function getWeakestLetter(weakLetters: Record<string, number>): string | null {
  const entries = Object.entries(weakLetters);
  if (entries.length === 0) return null;

  // Sort by accuracy (ascending) and return the weakest
  entries.sort((a, b) => a[1] - b[1]);
  return entries[0][0];
}

/**
 * Get a random weak letter, weighted by how weak it is
 * Letters with lower accuracy have higher chance of being selected
 */
export function getRandomWeakLetter(weakLetters: Record<string, number>): string | null {
  const entries = Object.entries(weakLetters);
  if (entries.length === 0) return null;

  // Only consider letters with accuracy below 85%
  const weakOnes = entries.filter(([, accuracy]) => accuracy < 85);
  if (weakOnes.length === 0) return null;

  // Invert accuracy to get weight (lower accuracy = higher weight)
  const weights = weakOnes.map(([letter, accuracy]) => ({
    letter,
    weight: 100 - accuracy,
  }));

  // Calculate total weight
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);

  // Random selection based on weights
  let random = Math.random() * totalWeight;
  for (const { letter, weight } of weights) {
    random -= weight;
    if (random <= 0) {
      return letter;
    }
  }

  return weakOnes[0][0];
}

/**
 * Generate a chunk of text for Calm Mode practice
 *
 * @param config - Configuration options
 * @returns Generated text string
 */
export function generateCalmText(config: TextGeneratorConfig = {}): string {
  const {
    chunkSize = 60,
    weakLetters = {},
    focusWeakLetters = true,
    weakLetterWeight = 0.4,
    layout = 'qwerty',
  } = config;

  const words: string[] = [];
  let charCount = 0;

  // Determine if we should focus on weak letters
  const shouldFocusWeak =
    focusWeakLetters && Object.keys(weakLetters).length > 0;

  while (charCount < chunkSize) {
    let word: string;

    if (shouldFocusWeak && Math.random() < weakLetterWeight) {
      // Pick a word containing a weak letter
      const weakLetter = getRandomWeakLetter(weakLetters);
      if (weakLetter && getWordsForLetter(weakLetter, layout).length > 0) {
        word = getRandomWordWithLetter(weakLetter, layout);
      } else {
        word = getRandomWord(layout);
      }
    } else {
      // Pick a random word
      word = getRandomWord(layout);
    }

    words.push(word);
    charCount += word.length + 1; // +1 for space
  }

  return words.join(' ');
}

/**
 * Generate additional text to append to existing text
 * Ensures smooth continuation without abrupt transitions
 *
 * @param existingText - The current text being typed
 * @param config - Generation configuration
 * @returns New text chunk to append (with leading space)
 */
export function generateMoreText(
  existingText: string,
  config: TextGeneratorConfig = {}
): string {
  // Generate new chunk
  const newText = generateCalmText(config);

  // Ensure we have a space between existing and new text
  const needsSpace = existingText.length > 0 && !existingText.endsWith(' ');

  return needsSpace ? ' ' + newText : newText;
}

/**
 * Calculate the threshold position for generating more text
 * Returns the character index at which more text should be generated
 *
 * @param textLength - Current text length
 * @param threshold - Percentage threshold (default: 0.8 = 80%)
 * @returns Character position threshold
 */
export function getAppendThreshold(
  textLength: number,
  threshold: number = 0.8
): number {
  return Math.floor(textLength * threshold);
}

/**
 * Check if more text should be generated based on current position
 *
 * @param currentPosition - User's current typing position
 * @param textLength - Total text length
 * @param threshold - Percentage threshold (default: 0.8)
 * @returns True if more text should be generated
 */
export function shouldGenerateMore(
  currentPosition: number,
  textLength: number,
  threshold: number = 0.8
): boolean {
  return currentPosition >= getAppendThreshold(textLength, threshold);
}
