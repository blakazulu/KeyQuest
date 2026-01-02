/**
 * Rank definitions and helper functions for the progression system.
 * Thresholds: Beginner (0-499), Intermediate (500-1999), Proficient (2000-4999), Master (5000+)
 */

import type { Rank, RankTier, RankProgress } from '@/types/rank';

export const ranks: Rank[] = [
  {
    tier: 'beginner',
    title: { en: 'Beginner', he: 'מתחיל' },
    description: { en: 'Just starting your typing journey', he: 'רק מתחילים את מסע ההקלדה' },
    minXp: 0,
    nextRankXp: 500,
    icon: '🌱',
    colorVar: '--color-rank-beginner',
  },
  {
    tier: 'intermediate',
    title: { en: 'Intermediate', he: 'מתקדם' },
    description: { en: 'Building solid typing foundations', he: 'בונים בסיס הקלדה מוצק' },
    minXp: 500,
    nextRankXp: 2000,
    icon: '⚡',
    colorVar: '--color-rank-intermediate',
  },
  {
    tier: 'proficient',
    title: { en: 'Proficient', he: 'מיומן' },
    description: { en: 'Typing with confidence and speed', he: 'מקלידים בביטחון ומהירות' },
    minXp: 2000,
    nextRankXp: 5000,
    icon: '🌟',
    colorVar: '--color-rank-proficient',
  },
  {
    tier: 'master',
    title: { en: 'Master', he: 'מאסטר' },
    description: { en: 'Keyboard virtuoso - typing mastery achieved', he: 'וירטואוז מקלדת - שליטה מלאה בהקלדה' },
    minXp: 5000,
    nextRankXp: null,
    icon: '👑',
    colorVar: '--color-rank-master',
  },
];

/**
 * Get the rank for a given XP amount.
 */
export function getRankByXp(xp: number): Rank {
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (xp >= ranks[i].minXp) {
      return ranks[i];
    }
  }
  return ranks[0];
}

/**
 * Get the rank by tier name.
 */
export function getRankByTier(tier: RankTier): Rank {
  return ranks.find((r) => r.tier === tier) || ranks[0];
}

/**
 * Calculate rank progress for a given XP amount.
 */
export function getRankProgress(xp: number): RankProgress {
  const rank = getRankByXp(xp);
  const nextRank = ranks.find((r) => r.minXp > rank.minXp);

  let progressPercent = 100;
  let xpToNextRank: number | null = null;

  if (nextRank) {
    const rangeXp = nextRank.minXp - rank.minXp;
    const currentInRange = xp - rank.minXp;
    progressPercent = Math.min(100, Math.round((currentInRange / rangeXp) * 100));
    xpToNextRank = nextRank.minXp - xp;
  }

  return {
    currentRank: rank.tier,
    currentXp: xp,
    xpToNextRank,
    progressPercent,
  };
}

/**
 * Check if a rank up occurred between two XP amounts.
 */
export function checkRankUp(oldXp: number, newXp: number): RankTier | null {
  const oldRank = getRankByXp(oldXp);
  const newRank = getRankByXp(newXp);

  if (newRank.tier !== oldRank.tier) {
    return newRank.tier;
  }

  return null;
}
