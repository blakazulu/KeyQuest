/**
 * TypeScript types for the lesson and progression system.
 * Defines the structure of stages, lessons, and exercises.
 */

import type { Finger } from '@/data/keyboard-layout';

/**
 * Exercise types define different kinds of typing practice.
 */
export type ExerciseType =
  | 'key-intro'      // Stage 1: Learn where keys are (no typing)
  | 'key-practice'   // Practice single keys repeatedly
  | 'letter-combo'   // Practice letter combinations
  | 'words'          // Type complete words
  | 'sentences'      // Type full sentences
  | 'paragraph'      // Type longer passages
  | 'timed'          // Timed challenge
  | 'accuracy'       // Focus on accuracy over speed

/**
 * Difficulty levels for exercises.
 */
export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

/**
 * An individual exercise within a lesson.
 */
export interface Exercise {
  /** Unique ID for this exercise */
  id: string;
  /** Type of exercise */
  type: ExerciseType;
  /** The text content to type */
  content: string;
  /** Instructions shown before the exercise */
  instructions: {
    en: string;
    he: string;
  };
  /** Target accuracy percentage to pass (0-100) */
  targetAccuracy?: number;
  /** Target WPM to achieve (optional) */
  targetWpm?: number;
  /** Time limit in seconds (for timed exercises) */
  timeLimit?: number;
  /** Keys being practiced in this exercise */
  focusKeys?: string[];
  /** Fingers being practiced */
  focusFingers?: Finger[];
}

/**
 * A lesson contains multiple exercises focused on specific keys/skills.
 */
export interface Lesson {
  /** Unique ID (format: "stage-X-lesson-Y") */
  id: string;
  /** Stage this lesson belongs to (1-6) */
  stageId: number;
  /** Lesson number within the stage */
  lessonNumber: number;
  /** Display title */
  title: {
    en: string;
    he: string;
  };
  /** Short description */
  description: {
    en: string;
    he: string;
  };
  /** New keys introduced in this lesson */
  newKeys: string[];
  /** All keys practiced (including previously learned) */
  practiceKeys: string[];
  /** Difficulty level */
  difficulty: Difficulty;
  /** Exercises in order */
  exercises: Exercise[];
  /** XP reward for completing this lesson */
  xpReward: number;
  /** Required accuracy to pass (0-100) */
  passingAccuracy: number;
  /** Estimated time to complete in minutes */
  estimatedMinutes: number;
}

/**
 * A stage (world) contains multiple lessons with a theme.
 */
export interface Stage {
  /** Stage number (1-6) */
  id: number;
  /** Display name */
  name: {
    en: string;
    he: string;
  };
  /** Theme description */
  description: {
    en: string;
    he: string;
  };
  /** Theme icon/emoji */
  icon: string;
  /** Theme color (CSS variable or hex) */
  themeColor: string;
  /** All lessons in this stage */
  lessons: Lesson[];
  /** Keys mastered by completing this stage */
  masteredKeys: string[];
  /** Total XP available in this stage */
  totalXp: number;
  /** Required passing accuracy for the stage */
  passingAccuracy: number;
}

/**
 * User progress for a specific lesson.
 */
export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  bestAccuracy: number;
  bestWpm: number;
  attempts: number;
  lastAttempt: string | null;
  xpEarned: number;
  /** Star rating (1-3 based on performance) */
  stars: number;
}

/**
 * User progress for a specific stage.
 */
export interface StageProgress {
  stageId: number;
  lessonsCompleted: number;
  totalLessons: number;
  xpEarned: number;
  totalXpAvailable: number;
  averageStars: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}

/**
 * Overall user curriculum progress.
 */
export interface CurriculumProgress {
  currentStageId: number;
  currentLessonId: string | null;
  stagesCompleted: number;
  totalStages: number;
  lessonsCompleted: number;
  totalLessons: number;
  totalXpEarned: number;
  totalXpAvailable: number;
  overallProgress: number;
  stageProgress: StageProgress[];
}

/**
 * Result of completing an exercise.
 */
export interface ExerciseResult {
  exerciseId: string;
  accuracy: number;
  wpm: number;
  timeSpent: number;
  errors: number;
  totalCharacters: number;
  passed: boolean;
}

/**
 * Result of completing a lesson.
 */
export interface LessonResult {
  lessonId: string;
  passed: boolean;
  accuracy: number;
  wpm: number;
  timeSpent: number;
  stars: number;
  xpEarned: number;
  isNewBest: boolean;
  updatedProgress: LessonProgress;
}

/**
 * Calculate star rating based on accuracy.
 * 0 stars: Failed (below passing threshold)
 * 1 star: Passed (accuracy >= passing threshold)
 * 2 stars: Good (accuracy >= 90%)
 * 3 stars: Excellent (accuracy >= 98%)
 */
export function calculateStars(accuracy: number, passingThreshold: number = 70): number {
  if (accuracy < passingThreshold) return 0;
  if (accuracy >= 98) return 3;
  if (accuracy >= 90) return 2;
  return 1;
}

/**
 * Calculate XP based on performance.
 */
export function calculateXp(
  baseXp: number,
  accuracy: number,
  stars: number
): number {
  // Base XP multiplied by star bonus
  const starMultiplier = 1 + (stars - 1) * 0.25; // 1x, 1.25x, 1.5x
  const accuracyBonus = accuracy >= 100 ? 1.2 : 1;

  return Math.round(baseXp * starMultiplier * accuracyBonus);
}
