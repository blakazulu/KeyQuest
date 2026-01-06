/**
 * Lesson Progression Logic
 * Handles unlock conditions, progression rules, and curriculum navigation
 */

import type {
  Lesson,
  Stage,
  LessonProgress,
  StageProgress,
  CurriculumProgress,
  LessonResult,
} from '@/types/lesson';
import { calculateStars, calculateXp } from '@/types/lesson';
import {
  stages,
  getStage,
  getLesson,
  getNextLesson,
  getFirstLesson,
  getStagesForLayout,
  getStageForLayout,
  getLessonForLayout,
  getFirstLessonForLayout,
} from '@/data/lessons';
import type { KeyboardLayoutType } from '@/data/keyboard-layout';

// ============================================
// Layout-aware unlock functions
// ============================================

/**
 * Check if a lesson is unlocked for a specific keyboard layout
 */
export function isLessonUnlockedForLayout(
  lessonId: string,
  completedLessons: string[],
  layout: KeyboardLayoutType
): boolean {
  const lesson = getLessonForLayout(lessonId, layout);
  if (!lesson) return false;

  // First lesson of first stage is always unlocked
  if (lesson.stageId === 1 && lesson.lessonNumber === 1) {
    return true;
  }

  // Check if previous lesson is completed
  const stage = getStageForLayout(lesson.stageId, layout);
  if (!stage) return false;

  if (lesson.lessonNumber > 1) {
    // Previous lesson in same stage must be completed
    const prevLesson = stage.lessons.find(
      (l) => l.lessonNumber === lesson.lessonNumber - 1
    );
    if (prevLesson) {
      return completedLessons.includes(prevLesson.id);
    }
  } else {
    // First lesson of a new stage - previous stage's last lesson must be completed
    const prevStage = getStageForLayout(lesson.stageId - 1, layout);
    if (prevStage && prevStage.lessons.length > 0) {
      const lastLesson = prevStage.lessons[prevStage.lessons.length - 1];
      return completedLessons.includes(lastLesson.id);
    }
  }

  return false;
}

/**
 * Check if a stage is unlocked for a specific keyboard layout
 */
export function isStageUnlockedForLayout(
  stageId: number,
  completedLessons: string[],
  layout: KeyboardLayoutType
): boolean {
  // Stage 1 is always unlocked
  if (stageId === 1) return true;

  // Previous stage's last lesson must be completed
  const prevStage = getStageForLayout(stageId - 1, layout);
  if (!prevStage || prevStage.lessons.length === 0) return false;

  const lastLesson = prevStage.lessons[prevStage.lessons.length - 1];
  return completedLessons.includes(lastLesson.id);
}

/**
 * Check if a stage is completed for a specific keyboard layout
 */
export function isStageCompletedForLayout(
  stageId: number,
  completedLessons: string[],
  layout: KeyboardLayoutType
): boolean {
  const stage = getStageForLayout(stageId, layout);
  if (!stage) return false;

  return stage.lessons.every((lesson) => completedLessons.includes(lesson.id));
}

/**
 * Check if a lesson is unlocked based on curriculum progress
 * Rules:
 * - First lesson of first stage is always unlocked
 * - Other lessons unlock when the previous lesson is completed
 * - First lesson of a stage unlocks when previous stage's last lesson is completed
 */
export function isLessonUnlocked(
  lessonId: string,
  completedLessons: string[]
): boolean {
  const lesson = getLesson(lessonId);
  if (!lesson) return false;

  // First lesson of first stage is always unlocked
  if (lesson.stageId === 1 && lesson.lessonNumber === 1) {
    return true;
  }

  // Check if previous lesson is completed
  const stage = getStage(lesson.stageId);
  if (!stage) return false;

  if (lesson.lessonNumber > 1) {
    // Previous lesson in same stage must be completed
    const prevLesson = stage.lessons.find(
      (l) => l.lessonNumber === lesson.lessonNumber - 1
    );
    if (prevLesson) {
      return completedLessons.includes(prevLesson.id);
    }
  } else {
    // First lesson of a new stage - previous stage's last lesson must be completed
    const prevStage = getStage(lesson.stageId - 1);
    if (prevStage && prevStage.lessons.length > 0) {
      const lastLesson = prevStage.lessons[prevStage.lessons.length - 1];
      return completedLessons.includes(lastLesson.id);
    }
  }

  return false;
}

/**
 * Check if a stage is unlocked
 */
export function isStageUnlocked(
  stageId: number,
  completedLessons: string[]
): boolean {
  // Stage 1 is always unlocked
  if (stageId === 1) return true;

  // Previous stage's last lesson must be completed
  const prevStage = getStage(stageId - 1);
  if (!prevStage || prevStage.lessons.length === 0) return false;

  const lastLesson = prevStage.lessons[prevStage.lessons.length - 1];
  return completedLessons.includes(lastLesson.id);
}

/**
 * Check if a stage is completed
 */
export function isStageCompleted(
  stageId: number,
  completedLessons: string[]
): boolean {
  const stage = getStage(stageId);
  if (!stage) return false;

  return stage.lessons.every((lesson) => completedLessons.includes(lesson.id));
}

/**
 * Get the current active lesson (next uncompleted lesson)
 */
export function getCurrentLesson(completedLessons: string[]): Lesson | null {
  for (const stage of stages) {
    for (const lesson of stage.lessons) {
      if (!completedLessons.includes(lesson.id)) {
        // Check if this lesson is unlocked
        if (isLessonUnlocked(lesson.id, completedLessons)) {
          return lesson;
        }
      }
    }
  }

  // All lessons completed - return last lesson
  const lastStage = stages[stages.length - 1];
  if (lastStage && lastStage.lessons.length > 0) {
    return lastStage.lessons[lastStage.lessons.length - 1];
  }

  return null;
}

/**
 * Get progress statistics for a lesson
 */
export function getLessonProgress(
  lessonId: string,
  lessonAttempts: Record<string, LessonProgress>
): LessonProgress | null {
  return lessonAttempts[lessonId] || null;
}

/**
 * Calculate stage progress
 */
export function getStageProgress(
  stageId: number,
  completedLessons: string[],
  lessonAttempts: Record<string, LessonProgress>
): StageProgress {
  const stage = getStage(stageId);
  if (!stage) {
    return {
      stageId,
      lessonsCompleted: 0,
      totalLessons: 0,
      xpEarned: 0,
      totalXpAvailable: 0,
      averageStars: 0,
      isUnlocked: false,
      isCompleted: false,
    };
  }

  const lessonsCompleted = stage.lessons.filter((l) =>
    completedLessons.includes(l.id)
  ).length;

  const xpEarned = stage.lessons.reduce((sum, lesson) => {
    const progress = lessonAttempts[lesson.id];
    return sum + (progress?.xpEarned || 0);
  }, 0);

  const starsSum = stage.lessons.reduce((sum, lesson) => {
    const progress = lessonAttempts[lesson.id];
    return sum + (progress?.stars || 0);
  }, 0);

  return {
    stageId,
    lessonsCompleted,
    totalLessons: stage.lessons.length,
    xpEarned,
    totalXpAvailable: stage.totalXp,
    averageStars: lessonsCompleted > 0 ? starsSum / lessonsCompleted : 0,
    isUnlocked: isStageUnlocked(stageId, completedLessons),
    isCompleted: isStageCompleted(stageId, completedLessons),
  };
}

/**
 * Calculate overall curriculum progress
 */
export function getCurriculumProgress(
  completedLessons: string[],
  lessonAttempts: Record<string, LessonProgress>
): CurriculumProgress {
  const stageProgress = stages.map((stage) =>
    getStageProgress(stage.id, completedLessons, lessonAttempts)
  );

  const totalLessons = stages.reduce((sum, s) => sum + s.lessons.length, 0);
  const completedCount = completedLessons.length;
  const totalXp = stages.reduce((sum, s) => sum + s.totalXp, 0);
  const earnedXp = stageProgress.reduce((sum, sp) => sum + sp.xpEarned, 0);

  const currentLesson = getCurrentLesson(completedLessons);
  const currentStageId = currentLesson?.stageId || 1;

  const stagesCompleted = stageProgress.filter((sp) => sp.isCompleted).length;

  return {
    currentStageId,
    currentLessonId: currentLesson?.id || null,
    stagesCompleted,
    totalStages: stages.length,
    lessonsCompleted: completedCount,
    totalLessons,
    totalXpEarned: earnedXp,
    totalXpAvailable: totalXp,
    overallProgress: totalLessons > 0 ? completedCount / totalLessons : 0,
    stageProgress,
  };
}

/**
 * Process a lesson result and return updated progress
 */
export function processLessonResult(
  lesson: Lesson,
  accuracy: number,
  wpm: number,
  timeSpent: number,
  existingProgress?: LessonProgress
): LessonResult {
  const passed = accuracy >= lesson.passingAccuracy;
  const stars = calculateStars(accuracy);
  const xpEarned = passed ? calculateXp(lesson.xpReward, accuracy, stars) : 0;

  const isNewBest =
    !existingProgress ||
    accuracy > existingProgress.bestAccuracy ||
    (accuracy === existingProgress.bestAccuracy &&
      wpm > existingProgress.bestWpm);

  const updatedProgress: LessonProgress = {
    lessonId: lesson.id,
    completed: passed || (existingProgress?.completed ?? false),
    bestAccuracy: Math.max(accuracy, existingProgress?.bestAccuracy ?? 0),
    bestWpm: Math.max(wpm, existingProgress?.bestWpm ?? 0),
    stars: Math.max(stars, existingProgress?.stars ?? 0),
    attempts: (existingProgress?.attempts ?? 0) + 1,
    xpEarned: Math.max(xpEarned, existingProgress?.xpEarned ?? 0),
    lastAttempt: new Date().toISOString(),
  };

  return {
    lessonId: lesson.id,
    passed,
    accuracy,
    wpm,
    timeSpent,
    stars,
    xpEarned,
    isNewBest,
    updatedProgress,
  };
}

/**
 * Get recommended lessons based on weak letters
 */
export function getRecommendedLessons(
  weakLetters: Record<string, number>,
  completedLessons: string[],
  limit: number = 3
): Lesson[] {
  // Sort weak letters by accuracy (lowest first)
  const sortedWeakLetters = Object.entries(weakLetters)
    .filter(([, accuracy]) => accuracy < 80)
    .sort((a, b) => a[1] - b[1])
    .map(([letter]) => letter);

  if (sortedWeakLetters.length === 0) {
    // No weak letters, return next uncompleted lessons
    const currentLesson = getCurrentLesson(completedLessons);
    return currentLesson ? [currentLesson] : [];
  }

  // Find lessons that practice these weak letters
  const recommendations: Lesson[] = [];

  for (const stage of stages) {
    for (const lesson of stage.lessons) {
      if (recommendations.length >= limit) break;

      // Check if lesson practices any weak letters
      const practicesWeakLetter = lesson.practiceKeys.some((key) =>
        sortedWeakLetters.includes(key.toLowerCase())
      );

      if (
        practicesWeakLetter &&
        isLessonUnlocked(lesson.id, completedLessons)
      ) {
        recommendations.push(lesson);
      }
    }
  }

  return recommendations;
}

/**
 * Get all unlocked but uncompleted lessons
 */
export function getAvailableLessons(completedLessons: string[]): Lesson[] {
  const available: Lesson[] = [];

  for (const stage of stages) {
    for (const lesson of stage.lessons) {
      if (
        !completedLessons.includes(lesson.id) &&
        isLessonUnlocked(lesson.id, completedLessons)
      ) {
        available.push(lesson);
      }
    }
  }

  return available;
}

/**
 * Calculate mastery level for keys
 */
export function getKeyMastery(
  weakLetters: Record<string, number>,
  completedLessons: string[]
): Record<string, 'mastered' | 'learning' | 'weak' | 'locked'> {
  const mastery: Record<string, 'mastered' | 'learning' | 'weak' | 'locked'> =
    {};

  // Get all keys that have been introduced
  const introducedKeys = new Set<string>();
  for (const stage of stages) {
    if (!isStageUnlocked(stage.id, completedLessons)) break;

    for (const lesson of stage.lessons) {
      if (!isLessonUnlocked(lesson.id, completedLessons)) break;
      lesson.practiceKeys.forEach((key) => introducedKeys.add(key));
    }
  }

  // All keys on keyboard
  const allKeys = 'abcdefghijklmnopqrstuvwxyz.,;/'.split('');

  for (const key of allKeys) {
    if (!introducedKeys.has(key)) {
      mastery[key] = 'locked';
    } else if (key in weakLetters) {
      const accuracy = weakLetters[key];
      if (accuracy >= 95) {
        mastery[key] = 'mastered';
      } else if (accuracy >= 70) {
        mastery[key] = 'learning';
      } else {
        mastery[key] = 'weak';
      }
    } else {
      // Key introduced but no data yet - assume learning
      mastery[key] = 'learning';
    }
  }

  return mastery;
}
