/**
 * Achievement checking logic.
 * Evaluates conditions and determines which achievements should be unlocked.
 */

import type { Achievement, AchievementProgress, ProgressSnapshot } from '@/types/achievement';
import { achievements } from '@/data/achievements';

/**
 * Check if a single achievement condition is met.
 */
export function checkAchievementCondition(
  achievement: Achievement,
  snapshot: ProgressSnapshot
): boolean {
  switch (achievement.conditionType) {
    case 'lessons_completed':
      return snapshot.completedLessons.length >= achievement.threshold;

    case 'stages_completed':
      return snapshot.stagesCompleted >= achievement.threshold;

    case 'total_xp':
      return snapshot.totalXp >= achievement.threshold;

    case 'average_wpm':
      return snapshot.averageWpm >= achievement.threshold;

    case 'average_accuracy':
      return snapshot.averageAccuracy >= achievement.threshold;

    case 'streak_days':
      return snapshot.practiceStreak >= achievement.threshold;

    case 'longest_streak':
      return snapshot.longestStreak >= achievement.threshold;

    case 'total_sessions':
      return snapshot.totalSessions >= achievement.threshold;

    case 'perfect_lessons':
      return snapshot.perfectLessons >= achievement.threshold;

    case 'three_star_lessons':
      return snapshot.threeStarLessons >= achievement.threshold;

    case 'keys_mastered':
      const masteredCount = Object.values(snapshot.weakLetters).filter(
        (acc) => acc >= 95
      ).length;
      return masteredCount >= achievement.threshold;

    case 'curriculum_complete':
      // 37 total lessons in curriculum
      return snapshot.completedLessons.length >= 37;

    case 'home_key_clicks':
      return snapshot.homeKeyClicks >= achievement.threshold;

    case 'levels_key_clicks':
      return snapshot.levelsKeyClicks >= achievement.threshold;

    // Session-specific conditions are handled separately
    case 'session_wpm_min':
    case 'session_accuracy_min':
      return false;

    default:
      return false;
  }
}

/**
 * Check all achievements and return IDs of newly unlocked ones.
 */
export function checkAllAchievements(
  snapshot: ProgressSnapshot,
  currentAchievements: Record<string, AchievementProgress>
): string[] {
  const newlyUnlocked: string[] = [];

  for (const achievement of achievements) {
    // Skip session-specific achievements (handled by checkSessionAchievements)
    if (
      achievement.conditionType === 'session_wpm_min' ||
      achievement.conditionType === 'session_accuracy_min'
    ) {
      continue;
    }

    const existing = currentAchievements[achievement.id];

    // Skip if already unlocked
    if (existing?.unlocked) continue;

    if (checkAchievementCondition(achievement, snapshot)) {
      newlyUnlocked.push(achievement.id);
    }
  }

  return newlyUnlocked;
}

/**
 * Check session-specific achievements (called after each lesson).
 * These check the specific session's WPM/accuracy, not averages.
 */
export function checkSessionAchievements(
  sessionWpm: number,
  sessionAccuracy: number,
  currentAchievements: Record<string, AchievementProgress>
): string[] {
  const newlyUnlocked: string[] = [];

  // Lightning Fingers: 50 WPM in a session
  if (!currentAchievements['lightning-fingers']?.unlocked && sessionWpm >= 50) {
    newlyUnlocked.push('lightning-fingers');
  }

  // Turbo Typer: 70 WPM in a session
  if (!currentAchievements['turbo-typer']?.unlocked && sessionWpm >= 70) {
    newlyUnlocked.push('turbo-typer');
  }

  return newlyUnlocked;
}

/**
 * Create achievement progress record for a newly unlocked achievement.
 */
export function createAchievementProgress(achievementId: string): AchievementProgress {
  return {
    achievementId,
    unlocked: true,
    unlockedAt: new Date().toISOString(),
    seen: false,
  };
}

/**
 * Get the total XP reward for a list of achievement IDs.
 */
export function getTotalAchievementXpReward(achievementIds: string[]): number {
  return achievementIds.reduce((total, id) => {
    const achievement = achievements.find((a) => a.id === id);
    return total + (achievement?.xpReward || 0);
  }, 0);
}
