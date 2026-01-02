/**
 * Enhanced XP calculation with speed and streak bonuses.
 *
 * Base formula: baseXp * starMultiplier
 * Bonuses:
 * - Perfect accuracy (100%): +20%
 * - Speed: +10% per 10 WPM above 30, max +50%
 * - Streak: +5% per streak day, max +25%
 */

/**
 * Breakdown of XP earned from a lesson.
 */
export interface XpBreakdown {
  /** Base XP for the lesson */
  baseXp: number;
  /** Bonus from star rating (1-3 stars) */
  starBonus: number;
  /** Bonus from 100% accuracy */
  accuracyBonus: number;
  /** Bonus from typing speed (WPM above 30) */
  speedBonus: number;
  /** Bonus from practice streak */
  streakBonus: number;
  /** Total XP earned */
  total: number;
}

/**
 * Calculate star multiplier based on star rating.
 * 1 star: 1x, 2 stars: 1.25x, 3 stars: 1.5x
 */
function getStarMultiplier(stars: number): number {
  return 1 + Math.max(0, stars - 1) * 0.25;
}

/**
 * Calculate speed bonus multiplier.
 * +10% per 10 WPM above 30, capped at +50%
 */
function getSpeedBonusMultiplier(wpm: number): number {
  if (wpm < 30) return 0;
  const tiers = Math.floor((wpm - 30) / 10);
  return Math.min(tiers * 0.1, 0.5);
}

/**
 * Calculate streak bonus multiplier.
 * +5% per streak day, capped at +25%
 */
function getStreakBonusMultiplier(streak: number): number {
  if (streak <= 0) return 0;
  return Math.min(streak * 0.05, 0.25);
}

/**
 * Calculate enhanced XP with all bonuses.
 *
 * @param baseXp - Base XP reward for the lesson
 * @param accuracy - Accuracy percentage (0-100)
 * @param wpm - Words per minute achieved
 * @param stars - Star rating (0-3)
 * @param currentStreak - Current practice streak in days
 * @returns XpBreakdown with all bonus details
 */
export function calculateXpEnhanced(
  baseXp: number,
  accuracy: number,
  wpm: number,
  stars: number,
  currentStreak: number
): XpBreakdown {
  // Apply star multiplier to base
  const starMultiplier = getStarMultiplier(stars);
  const xpAfterStars = baseXp * starMultiplier;
  const starBonus = Math.round(xpAfterStars - baseXp);

  // Perfect accuracy bonus (20% of post-star XP)
  const accuracyBonus = accuracy >= 100 ? Math.round(xpAfterStars * 0.2) : 0;

  // Speed bonus
  const speedMultiplier = getSpeedBonusMultiplier(wpm);
  const speedBonus = Math.round(xpAfterStars * speedMultiplier);

  // Streak bonus
  const streakMultiplier = getStreakBonusMultiplier(currentStreak);
  const streakBonus = Math.round(xpAfterStars * streakMultiplier);

  // Total
  const total = Math.round(xpAfterStars) + accuracyBonus + speedBonus + streakBonus;

  return {
    baseXp,
    starBonus,
    accuracyBonus,
    speedBonus,
    streakBonus,
    total,
  };
}

/**
 * Simple XP calculation (backward compatible).
 * Uses same logic as existing calculateXp in types/lesson.ts.
 */
export function calculateXpSimple(
  baseXp: number,
  accuracy: number,
  stars: number
): number {
  const starMultiplier = getStarMultiplier(stars);
  const accuracyBonus = accuracy >= 100 ? 1.2 : 1;
  return Math.round(baseXp * starMultiplier * accuracyBonus);
}
