/**
 * Typing calculation utilities for WPM, accuracy, and related metrics.
 *
 * WPM Calculation Standard:
 * - A "word" is defined as 5 characters (industry standard)
 * - WPM = (correct characters / 5) / minutes (only correct chars count)
 * - Net WPM = Gross WPM - (errors / minutes) (legacy formula)
 */

/**
 * Calculate words per minute (WPM) based on correctly typed characters.
 * Only correct characters count toward WPM - errors don't inflate the score.
 *
 * @param correctCharacters - Number of correctly typed characters
 * @param elapsedMs - Time elapsed in milliseconds
 * @returns WPM rounded to nearest integer, minimum 0
 */
export function calculateWPM(correctCharacters: number, elapsedMs: number): number {
  if (elapsedMs <= 0 || correctCharacters <= 0) return 0;

  const minutes = elapsedMs / 60000; // Convert ms to minutes
  const words = correctCharacters / 5; // Standard: 5 chars = 1 word
  const wpm = words / minutes;

  return Math.max(0, Math.round(wpm));
}

/**
 * Calculate net words per minute (Net WPM).
 * Accounts for errors by subtracting them from the gross WPM.
 *
 * @param charactersTyped - Total number of characters typed
 * @param errorCount - Number of errors made
 * @param elapsedMs - Time elapsed in milliseconds
 * @returns Net WPM rounded to nearest integer, minimum 0
 */
export function calculateNetWPM(
  charactersTyped: number,
  errorCount: number,
  elapsedMs: number
): number {
  if (elapsedMs <= 0 || charactersTyped <= 0) return 0;

  const minutes = elapsedMs / 60000;
  const grossWPM = (charactersTyped / 5) / minutes;
  const errorPenalty = errorCount / minutes;
  const netWPM = grossWPM - errorPenalty;

  return Math.max(0, Math.round(netWPM));
}

/**
 * Calculate typing accuracy as a percentage.
 *
 * @param correctCount - Number of correct keystrokes
 * @param totalTyped - Total keystrokes attempted
 * @returns Accuracy percentage (0-100), rounded to 1 decimal
 */
export function calculateAccuracy(correctCount: number, totalTyped: number): number {
  if (totalTyped <= 0) return 100; // No typing = 100% accuracy (no mistakes)

  const accuracy = (correctCount / totalTyped) * 100;
  return Math.round(accuracy * 10) / 10; // Round to 1 decimal place
}

/**
 * Format elapsed time as mm:ss or m:ss.
 *
 * @param elapsedMs - Time elapsed in milliseconds
 * @returns Formatted time string
 */
export function formatTime(elapsedMs: number): string {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Calculate progress percentage through the text.
 *
 * @param currentPosition - Current character position
 * @param totalLength - Total text length
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(currentPosition: number, totalLength: number): number {
  if (totalLength <= 0) return 0;
  return Math.round((currentPosition / totalLength) * 100);
}

/**
 * Determine performance rating based on accuracy and WPM.
 *
 * @param accuracy - Accuracy percentage
 * @param wpm - Words per minute
 * @returns Rating from 1-5 stars
 */
export function calculateRating(accuracy: number, wpm: number): number {
  // Weight accuracy more heavily than speed for beginners
  const accuracyScore = accuracy >= 98 ? 5 : accuracy >= 95 ? 4 : accuracy >= 90 ? 3 : accuracy >= 80 ? 2 : 1;
  const speedScore = wpm >= 60 ? 5 : wpm >= 40 ? 4 : wpm >= 25 ? 3 : wpm >= 15 ? 2 : 1;

  // 70% accuracy, 30% speed
  const weighted = (accuracyScore * 0.7) + (speedScore * 0.3);

  return Math.round(weighted);
}

/**
 * Get feedback message based on performance.
 *
 * @param accuracy - Accuracy percentage
 * @param wpm - Words per minute
 * @returns Feedback key for translation
 */
export function getPerformanceFeedback(accuracy: number, wpm: number): string {
  if (accuracy >= 98 && wpm >= 40) return 'excellent';
  if (accuracy >= 95 && wpm >= 30) return 'great';
  if (accuracy >= 90) return 'good';
  if (accuracy >= 80) return 'keepPracticing';
  return 'needsWork';
}
