/**
 * TypeScript types for the achievement system.
 * Defines achievement categories, rarities, conditions, and progress tracking.
 */

/**
 * Achievement category for grouping and filtering.
 */
export type AchievementCategory =
  | 'milestone'    // Lesson/stage completion milestones
  | 'speed'        // WPM-related achievements
  | 'accuracy'     // Accuracy-related achievements
  | 'streak'       // Streak-related achievements
  | 'dedication'   // Practice time/session count
  | 'mastery'      // Key mastery achievements
  | 'games'        // Game mode achievements
  | 'secret';      // Hidden easter egg achievements

/**
 * Achievement rarity affects visual treatment.
 */
export type AchievementRarity =
  | 'common'       // Basic achievements (gray border)
  | 'rare'         // Moderate challenge (blue border)
  | 'epic'         // Significant accomplishment (purple border)
  | 'legendary';   // Ultimate achievements (gold border, particles)

/**
 * Condition types for achievement checking.
 */
export type AchievementConditionType =
  | 'lessons_completed'
  | 'stages_completed'
  | 'total_xp'
  | 'session_wpm_min'
  | 'session_accuracy_min'
  | 'average_wpm'
  | 'average_accuracy'
  | 'streak_days'
  | 'longest_streak'
  | 'total_sessions'
  | 'perfect_lessons'      // 100% accuracy lessons
  | 'three_star_lessons'
  | 'keys_mastered'
  | 'curriculum_complete'
  | 'home_key_clicks'      // Easter egg: clicking key on home page
  | 'levels_key_clicks'    // Easter egg: clicking key on levels page
  // Game mode achievements
  | 'race_best_time'       // Fastest race completion (ms)
  | 'target_high_score'    // Best target shooting score
  | 'target_max_combo'     // Longest combo streak
  | 'tower_max_height'     // Tallest tower built
  | 'daily_completed'      // Total dailies completed
  | 'daily_streak'         // Consecutive daily completions
  | 'games_played';        // Total games across all modes

/**
 * Achievement definition (static data).
 */
export interface Achievement {
  /** Unique identifier */
  id: string;
  /** Category for grouping */
  category: AchievementCategory;
  /** Rarity affects visual treatment */
  rarity: AchievementRarity;
  /** Emoji or icon identifier */
  icon: string;
  /** Localized title */
  title: {
    en: string;
    he: string;
  };
  /** Localized description */
  description: {
    en: string;
    he: string;
  };
  /** Hidden achievements don't show requirements until unlocked */
  hidden?: boolean;
  /** XP bonus when unlocked */
  xpReward: number;
  /** Condition type for checking unlock */
  conditionType: AchievementConditionType;
  /** Threshold value for the condition */
  threshold: number;
}

/**
 * User's achievement progress (persisted in store).
 */
export interface AchievementProgress {
  /** Reference to achievement ID */
  achievementId: string;
  /** Whether the achievement is unlocked */
  unlocked: boolean;
  /** ISO date string when unlocked, null if locked */
  unlockedAt: string | null;
  /** Whether user has seen the unlock notification */
  seen: boolean;
}

/**
 * Snapshot of progress data used for achievement checking.
 */
export interface ProgressSnapshot {
  completedLessons: string[];
  stagesCompleted: number;
  totalXp: number;
  averageWpm: number;
  averageAccuracy: number;
  practiceStreak: number;
  longestStreak: number;
  totalSessions: number;
  perfectLessons: number;
  threeStarLessons: number;
  weakLetters: Record<string, number>;
  homeKeyClicks: number;
  levelsKeyClicks: number;
  // Game mode stats
  raceBestTime: number | null;
  targetHighScore: number;
  targetMaxCombo: number;
  towerMaxHeight: number;
  dailiesCompleted: number;
  dailyStreak: number;
  totalGamesPlayed: number;
}
