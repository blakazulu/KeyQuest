/**
 * TypeScript types for the rank system.
 * Defines rank tiers, thresholds, and progress tracking.
 */

/**
 * Rank tier identifiers.
 */
export type RankTier = 'beginner' | 'intermediate' | 'proficient' | 'master';

/**
 * Rank definition (static data).
 */
export interface Rank {
  /** Rank tier identifier */
  tier: RankTier;
  /** Localized display title */
  title: {
    en: string;
    he: string;
  };
  /** Localized description */
  description: {
    en: string;
    he: string;
  };
  /** Minimum XP required for this rank */
  minXp: number;
  /** XP needed to reach next rank (null for max rank) */
  nextRankXp: number | null;
  /** Icon/emoji for this rank */
  icon: string;
  /** CSS color variable name */
  colorVar: string;
}

/**
 * User's current rank status (computed from XP).
 */
export interface RankProgress {
  /** Current rank tier */
  currentRank: RankTier;
  /** Current total XP */
  currentXp: number;
  /** XP needed to reach next rank (null if at max) */
  xpToNextRank: number | null;
  /** Progress percentage toward next rank (0-100) */
  progressPercent: number;
}
