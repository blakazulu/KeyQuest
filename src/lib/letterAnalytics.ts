/**
 * Letter Analytics Utilities
 * Analyzes letter performance history to detect trends and identify problem areas
 */

import type { LetterHistoryEntry, LetterTrend, WeakLetterInfo } from '@/types/progress';

/**
 * Minimum number of history entries needed to determine a trend
 */
const MIN_ENTRIES_FOR_TREND = 3;

/**
 * Threshold for considering a letter as "weak" (below this accuracy %)
 */
const WEAK_THRESHOLD = 80;

/**
 * Threshold for trend detection - minimum accuracy change to be considered improving/declining
 */
const TREND_THRESHOLD = 5;

/**
 * Calculate the trend for a letter based on its history
 * Compares the average of recent entries vs older entries
 *
 * @param history - Array of letter history entries (oldest first)
 * @returns The trend direction
 */
export function getLetterTrend(history: LetterHistoryEntry[]): LetterTrend {
  if (history.length < MIN_ENTRIES_FOR_TREND) {
    return 'stable';
  }

  // Split history into two halves
  const midPoint = Math.floor(history.length / 2);
  const olderHalf = history.slice(0, midPoint);
  const recentHalf = history.slice(midPoint);

  // Calculate averages
  const olderAvg =
    olderHalf.reduce((sum, entry) => sum + entry.accuracy, 0) / olderHalf.length;
  const recentAvg =
    recentHalf.reduce((sum, entry) => sum + entry.accuracy, 0) / recentHalf.length;

  // Determine trend based on difference
  const diff = recentAvg - olderAvg;

  if (diff >= TREND_THRESHOLD) {
    return 'improving';
  } else if (diff <= -TREND_THRESHOLD) {
    return 'declining';
  }

  return 'stable';
}

/**
 * Calculate consistency score for a letter (0-100)
 * Higher score means more consistent performance (lower variance)
 *
 * @param history - Array of letter history entries
 * @returns Consistency score (0-100)
 */
export function getConsistency(history: LetterHistoryEntry[]): number {
  if (history.length < 2) {
    return 100; // Not enough data, assume consistent
  }

  // Calculate mean
  const mean = history.reduce((sum, entry) => sum + entry.accuracy, 0) / history.length;

  // Calculate standard deviation
  const squaredDiffs = history.map((entry) => Math.pow(entry.accuracy - mean, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / history.length;
  const stdDev = Math.sqrt(variance);

  // Convert to 0-100 score (lower stdDev = higher consistency)
  // Max expected stdDev is around 30-35 for highly inconsistent performance
  const maxStdDev = 35;
  const consistencyScore = Math.max(0, Math.min(100, 100 - (stdDev / maxStdDev) * 100));

  return Math.round(consistencyScore);
}

/**
 * Calculate priority score for a weak letter
 * Higher priority means this letter needs more practice
 *
 * Factors:
 * - Lower accuracy = higher priority
 * - Declining trend = higher priority
 * - Lower consistency = slightly higher priority
 *
 * @param accuracy - Current accuracy percentage
 * @param trend - Performance trend
 * @param consistency - Consistency score
 * @returns Priority score (0-100)
 */
export function calculatePriority(
  accuracy: number,
  trend: LetterTrend,
  consistency: number
): number {
  // Base priority from accuracy (inverted: lower accuracy = higher priority)
  let priority = 100 - accuracy;

  // Adjust for trend
  if (trend === 'declining') {
    priority += 15; // Declining letters get higher priority
  } else if (trend === 'improving') {
    priority -= 10; // Improving letters get lower priority
  }

  // Slight adjustment for consistency (inconsistent = slightly higher priority)
  priority += (100 - consistency) * 0.1;

  // Clamp to 0-100
  return Math.max(0, Math.min(100, Math.round(priority)));
}

/**
 * Get ranked list of weak letters with analytics information
 *
 * @param weakLetters - Current accuracy per letter (EMA values)
 * @param letterHistory - Historical accuracy data per letter
 * @returns Sorted array of weak letter info (highest priority first)
 */
export function getWeakLettersRanked(
  weakLetters: Record<string, number>,
  letterHistory: Record<string, LetterHistoryEntry[]>
): WeakLetterInfo[] {
  const result: WeakLetterInfo[] = [];

  for (const [letter, accuracy] of Object.entries(weakLetters)) {
    // Only include letters below the weak threshold
    if (accuracy >= WEAK_THRESHOLD) {
      continue;
    }

    const history = letterHistory[letter] || [];
    const trend = getLetterTrend(history);
    const consistency = getConsistency(history);
    const priority = calculatePriority(accuracy, trend, consistency);

    result.push({
      letter,
      accuracy: Math.round(accuracy * 100) / 100,
      trend,
      consistency,
      priority,
    });
  }

  // Sort by priority (highest first)
  result.sort((a, b) => b.priority - a.priority);

  return result;
}

/**
 * Get the most problematic letters that need the most practice
 *
 * @param weakLetters - Current accuracy per letter
 * @param letterHistory - Historical accuracy data per letter
 * @param limit - Maximum number of letters to return
 * @returns Array of letter characters (highest priority first)
 */
export function getMostProblematic(
  weakLetters: Record<string, number>,
  letterHistory: Record<string, LetterHistoryEntry[]>,
  limit: number = 5
): string[] {
  const ranked = getWeakLettersRanked(weakLetters, letterHistory);
  return ranked.slice(0, limit).map((info) => info.letter);
}

/**
 * Get letters that are improving (for positive feedback)
 *
 * @param weakLetters - Current accuracy per letter
 * @param letterHistory - Historical accuracy data per letter
 * @returns Array of letters with improving trends
 */
export function getImprovingLetters(
  weakLetters: Record<string, number>,
  letterHistory: Record<string, LetterHistoryEntry[]>
): string[] {
  const improving: string[] = [];

  for (const [letter] of Object.entries(weakLetters)) {
    const history = letterHistory[letter] || [];
    if (getLetterTrend(history) === 'improving') {
      improving.push(letter);
    }
  }

  return improving;
}

/**
 * Get letters that are declining (for alerts)
 *
 * @param weakLetters - Current accuracy per letter
 * @param letterHistory - Historical accuracy data per letter
 * @returns Array of letters with declining trends
 */
export function getDecliningLetters(
  weakLetters: Record<string, number>,
  letterHistory: Record<string, LetterHistoryEntry[]>
): string[] {
  const declining: string[] = [];

  for (const [letter] of Object.entries(weakLetters)) {
    const history = letterHistory[letter] || [];
    if (getLetterTrend(history) === 'declining') {
      declining.push(letter);
    }
  }

  return declining;
}

/**
 * Get recently mastered letters (accuracy crossed 95% threshold)
 *
 * @param weakLetters - Current accuracy per letter
 * @param letterHistory - Historical accuracy data per letter
 * @param daysBack - Number of days to look back
 * @returns Array of recently mastered letters
 */
export function getRecentlyMastered(
  weakLetters: Record<string, number>,
  letterHistory: Record<string, LetterHistoryEntry[]>,
  daysBack: number = 7
): string[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  const mastered: string[] = [];

  for (const [letter, accuracy] of Object.entries(weakLetters)) {
    // Must be currently mastered
    if (accuracy < 95) continue;

    const history = letterHistory[letter] || [];
    if (history.length < 2) continue;

    // Check if there was a recent entry below 95%
    const recentHistory = history.filter(
      (entry) => new Date(entry.date) >= cutoffDate
    );

    const hadLowAccuracy = recentHistory.some((entry) => entry.accuracy < 95);

    if (hadLowAccuracy) {
      mastered.push(letter);
    }
  }

  return mastered;
}

/**
 * Get summary statistics for letter performance
 *
 * @param weakLetters - Current accuracy per letter
 * @param letterHistory - Historical accuracy data per letter
 * @returns Summary statistics
 */
export function getLetterStats(
  weakLetters: Record<string, number>,
  letterHistory: Record<string, LetterHistoryEntry[]>
): {
  totalTracked: number;
  mastered: number;
  learning: number;
  weak: number;
  improving: number;
  declining: number;
} {
  let mastered = 0;
  let learning = 0;
  let weak = 0;
  let improving = 0;
  let declining = 0;

  for (const [letter, accuracy] of Object.entries(weakLetters)) {
    // Mastery levels
    if (accuracy >= 95) {
      mastered++;
    } else if (accuracy >= 70) {
      learning++;
    } else {
      weak++;
    }

    // Trends
    const history = letterHistory[letter] || [];
    const trend = getLetterTrend(history);
    if (trend === 'improving') {
      improving++;
    } else if (trend === 'declining') {
      declining++;
    }
  }

  return {
    totalTracked: Object.keys(weakLetters).length,
    mastered,
    learning,
    weak,
    improving,
    declining,
  };
}
