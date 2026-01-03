/**
 * Targeted Text Generator
 * Generates practice text with high focus on weak letters
 * Used for Problem Letters practice mode
 */

import type { AgeGroup } from '@/stores/useSettingsStore';
import { wordsByLength, wordsByLetter, allWords } from '@/data/calmModeWords';
import { getDifficultyProfile } from './difficultySettings';
import { getRandomWeakLetter } from './calmTextGenerator';

/**
 * Configuration for targeted text generation
 */
export interface TargetedTextConfig {
  /** User's weak letters with accuracy scores (0-100) */
  weakLetters: Record<string, number>;
  /** User's age group for word length preferences */
  ageGroup: AgeGroup;
  /** Specific letters to focus on (overrides weak letter selection) */
  targetLetters?: string[];
  /** Target length of generated text in characters (default: 60) */
  chunkSize?: number;
  /** Probability of selecting a weak/target letter word (default: 0.7) */
  weakLetterWeight?: number;
}

/**
 * Get words filtered by length range
 */
function getWordsByLengthRange(
  words: string[],
  minLength: number,
  maxLength: number
): string[] {
  return words.filter((word) => word.length >= minLength && word.length <= maxLength);
}

/**
 * Get a random word appropriate for the age group
 */
function getRandomWordForAge(ageGroup: AgeGroup): string {
  const profile = getDifficultyProfile(ageGroup);
  const [minLen, maxLen] = profile.wordLengthRange;

  // Build a pool of appropriate-length words
  const appropriateWords: string[] = [];

  if (minLen <= 2) {
    appropriateWords.push(
      ...getWordsByLengthRange(wordsByLength.short, minLen, maxLen)
    );
  }

  if (maxLen >= 3) {
    appropriateWords.push(
      ...getWordsByLengthRange(wordsByLength.medium, minLen, maxLen)
    );
  }

  if (maxLen >= 5) {
    appropriateWords.push(
      ...getWordsByLengthRange(wordsByLength.long, minLen, maxLen)
    );
  }

  if (appropriateWords.length === 0) {
    // Fallback to medium words
    return wordsByLength.medium[
      Math.floor(Math.random() * wordsByLength.medium.length)
    ];
  }

  return appropriateWords[Math.floor(Math.random() * appropriateWords.length)];
}

/**
 * Get a random word containing a specific letter, filtered by age group
 */
function getRandomWordWithLetterForAge(letter: string, ageGroup: AgeGroup): string {
  const profile = getDifficultyProfile(ageGroup);
  const [minLen, maxLen] = profile.wordLengthRange;

  const letterWords = wordsByLetter[letter.toLowerCase()] || [];
  const appropriateWords = getWordsByLengthRange(letterWords, minLen, maxLen);

  if (appropriateWords.length === 0) {
    // Fallback: try any word with the letter
    if (letterWords.length > 0) {
      return letterWords[Math.floor(Math.random() * letterWords.length)];
    }
    // Ultimate fallback: random word for age
    return getRandomWordForAge(ageGroup);
  }

  return appropriateWords[Math.floor(Math.random() * appropriateWords.length)];
}

/**
 * Select a target letter from the provided list or weak letters
 */
function selectTargetLetter(
  targetLetters: string[] | undefined,
  weakLetters: Record<string, number>
): string | null {
  // If specific target letters provided, pick from those
  if (targetLetters && targetLetters.length > 0) {
    return targetLetters[Math.floor(Math.random() * targetLetters.length)];
  }

  // Otherwise, use weak letter selection (weighted by weakness)
  return getRandomWeakLetter(weakLetters);
}

/**
 * Generate targeted practice text focusing on weak/target letters
 *
 * @param config - Configuration for text generation
 * @returns Generated text string
 */
export function generateTargetedText(config: TargetedTextConfig): string {
  const {
    weakLetters,
    ageGroup,
    targetLetters,
    chunkSize = 60,
    weakLetterWeight = 0.7, // Higher than calm mode's 0.4
  } = config;

  const words: string[] = [];
  let charCount = 0;

  // Determine if we should focus on specific letters
  const hasTargets =
    (targetLetters && targetLetters.length > 0) ||
    Object.keys(weakLetters).length > 0;

  while (charCount < chunkSize) {
    let word: string;

    if (hasTargets && Math.random() < weakLetterWeight) {
      // Pick a word containing a target/weak letter
      const letter = selectTargetLetter(targetLetters, weakLetters);
      if (letter) {
        word = getRandomWordWithLetterForAge(letter, ageGroup);
      } else {
        word = getRandomWordForAge(ageGroup);
      }
    } else {
      // Pick a random age-appropriate word
      word = getRandomWordForAge(ageGroup);
    }

    words.push(word);
    charCount += word.length + 1; // +1 for space
  }

  return words.join(' ');
}

/**
 * Generate more text to append to existing text
 *
 * @param existingText - Current text being typed
 * @param config - Generation configuration
 * @returns New text chunk to append
 */
export function generateMoreTargetedText(
  existingText: string,
  config: TargetedTextConfig
): string {
  const newText = generateTargetedText(config);

  // Ensure space between existing and new text
  const needsSpace = existingText.length > 0 && !existingText.endsWith(' ');

  return needsSpace ? ' ' + newText : newText;
}

/**
 * Check if more text should be generated based on position
 *
 * @param currentPosition - User's current typing position
 * @param textLength - Total text length
 * @param threshold - Percentage threshold (default: 0.8)
 * @returns True if more text should be generated
 */
export function shouldGenerateMoreTargeted(
  currentPosition: number,
  textLength: number,
  threshold: number = 0.8
): boolean {
  return currentPosition >= Math.floor(textLength * threshold);
}

/**
 * Generate initial text for a targeted practice session
 *
 * @param config - Configuration for text generation
 * @param initialChunks - Number of chunks to generate initially (default: 3)
 * @returns Generated text string
 */
export function generateInitialTargetedText(
  config: TargetedTextConfig,
  initialChunks: number = 3
): string {
  const chunks: string[] = [];

  for (let i = 0; i < initialChunks; i++) {
    chunks.push(generateTargetedText(config));
  }

  return chunks.join(' ');
}

/**
 * Get statistics about how many target letters are in the text
 *
 * @param text - The generated text
 * @param targetLetters - Letters we're targeting
 * @returns Statistics about letter coverage
 */
export function getTargetLetterStats(
  text: string,
  targetLetters: string[]
): {
  totalChars: number;
  targetLetterCount: number;
  targetLetterPercentage: number;
  letterBreakdown: Record<string, number>;
} {
  const lowerText = text.toLowerCase();
  const targetSet = new Set(targetLetters.map((l) => l.toLowerCase()));

  let targetLetterCount = 0;
  const letterBreakdown: Record<string, number> = {};

  for (const letter of targetLetters) {
    letterBreakdown[letter.toLowerCase()] = 0;
  }

  for (const char of lowerText) {
    if (targetSet.has(char)) {
      targetLetterCount++;
      letterBreakdown[char] = (letterBreakdown[char] || 0) + 1;
    }
  }

  const totalChars = text.replace(/\s/g, '').length;

  return {
    totalChars,
    targetLetterCount,
    targetLetterPercentage:
      totalChars > 0 ? Math.round((targetLetterCount / totalChars) * 100) : 0,
    letterBreakdown,
  };
}
