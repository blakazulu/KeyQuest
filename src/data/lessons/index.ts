/**
 * Lesson Content Index
 * Exports all stages and provides curriculum utilities
 */

import { stage1 } from './stage1';
import { stage2 } from './stage2';
import { stage3 } from './stage3';
import { stage4 } from './stage4';
import { stage5 } from './stage5';
import { stage6 } from './stage6';
import type { Stage, Lesson, Exercise } from '@/types/lesson';

/**
 * All stages in order
 */
export const stages: Stage[] = [stage1, stage2, stage3, stage4, stage5, stage6];

/**
 * Get a stage by ID
 */
export function getStage(stageId: number): Stage | undefined {
  return stages.find((s) => s.id === stageId);
}

/**
 * Get a lesson by its ID
 */
export function getLesson(lessonId: string): Lesson | undefined {
  for (const stage of stages) {
    const lesson = stage.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}

/**
 * Get a lesson by stage and lesson number
 */
export function getLessonByNumber(
  stageId: number,
  lessonNumber: number
): Lesson | undefined {
  const stage = getStage(stageId);
  if (!stage) return undefined;
  return stage.lessons.find((l) => l.lessonNumber === lessonNumber);
}

/**
 * Get an exercise by its ID
 */
export function getExercise(exerciseId: string): Exercise | undefined {
  for (const stage of stages) {
    for (const lesson of stage.lessons) {
      const exercise = lesson.exercises.find((e) => e.id === exerciseId);
      if (exercise) return exercise;
    }
  }
  return undefined;
}

/**
 * Get the next lesson in sequence
 * Returns undefined if the current lesson is the last one
 */
export function getNextLesson(currentLessonId: string): Lesson | undefined {
  const currentLesson = getLesson(currentLessonId);
  if (!currentLesson) return undefined;

  const stage = getStage(currentLesson.stageId);
  if (!stage) return undefined;

  // Try to find next lesson in same stage
  const nextInStage = stage.lessons.find(
    (l) => l.lessonNumber === currentLesson.lessonNumber + 1
  );
  if (nextInStage) return nextInStage;

  // Try to find first lesson in next stage
  const nextStage = getStage(currentLesson.stageId + 1);
  if (nextStage && nextStage.lessons.length > 0) {
    return nextStage.lessons.find((l) => l.lessonNumber === 1);
  }

  return undefined;
}

/**
 * Get the previous lesson in sequence
 * Returns undefined if the current lesson is the first one
 */
export function getPreviousLesson(currentLessonId: string): Lesson | undefined {
  const currentLesson = getLesson(currentLessonId);
  if (!currentLesson) return undefined;

  const stage = getStage(currentLesson.stageId);
  if (!stage) return undefined;

  // Try to find previous lesson in same stage
  if (currentLesson.lessonNumber > 1) {
    return stage.lessons.find(
      (l) => l.lessonNumber === currentLesson.lessonNumber - 1
    );
  }

  // Try to find last lesson in previous stage
  const prevStage = getStage(currentLesson.stageId - 1);
  if (prevStage && prevStage.lessons.length > 0) {
    return prevStage.lessons[prevStage.lessons.length - 1];
  }

  return undefined;
}

/**
 * Get the first lesson of a stage
 */
export function getFirstLesson(stageId: number): Lesson | undefined {
  const stage = getStage(stageId);
  if (!stage || stage.lessons.length === 0) return undefined;
  return stage.lessons.find((l) => l.lessonNumber === 1);
}

/**
 * Get all lessons as a flat array
 */
export function getAllLessons(): Lesson[] {
  return stages.flatMap((s) => s.lessons);
}

/**
 * Get total lesson count
 */
export function getTotalLessonCount(): number {
  return stages.reduce((sum, stage) => sum + stage.lessons.length, 0);
}

/**
 * Get total XP available in curriculum
 */
export function getTotalCurriculumXp(): number {
  return stages.reduce((sum, stage) => sum + stage.totalXp, 0);
}

/**
 * Curriculum statistics
 */
export const curriculumStats = {
  totalStages: stages.length,
  totalLessons: getTotalLessonCount(),
  totalXp: getTotalCurriculumXp(),
  stageNames: stages.map((s) => ({ id: s.id, name: s.name, icon: s.icon })),
};

// Re-export individual stages for direct import
export { stage1, stage2, stage3, stage4, stage5, stage6 };
