/**
 * Progress and Analytics Types
 * Types for tracking user progress and letter performance history
 */

/**
 * A single entry in a letter's accuracy history
 */
export interface LetterHistoryEntry {
  /** Accuracy percentage for this letter in the session (0-100) */
  accuracy: number;
  /** ISO timestamp of when this was recorded */
  date: string;
  /** Unique session identifier (lessonId or 'calm-mode' or 'problem-letters') */
  sessionId: string;
}

/**
 * Trend direction for letter performance
 */
export type LetterTrend = 'improving' | 'declining' | 'stable';

/**
 * Detailed information about a weak letter including analytics
 */
export interface WeakLetterInfo {
  /** The letter character */
  letter: string;
  /** Current accuracy percentage (EMA) */
  accuracy: number;
  /** Performance trend based on history */
  trend: LetterTrend;
  /** Consistency score (0-100, higher = more consistent) */
  consistency: number;
  /** Priority score for targeting (higher = needs more practice) */
  priority: number;
}

/**
 * Mastery level for a letter
 */
export type MasteryLevel = 'mastered' | 'learning' | 'weak' | 'locked';

/**
 * Friendly display labels for mastery levels
 */
export const MASTERY_LABELS = {
  mastered: { en: 'Mastered', he: 'נשלט' },
  learning: { en: 'Getting Better', he: 'משתפר' },
  weak: { en: 'Needs Practice', he: 'דורש תרגול' },
  locked: { en: 'Not Started', he: 'לא התחיל' },
} as const;
