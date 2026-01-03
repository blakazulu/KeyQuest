/**
 * Hebrew Curriculum Index
 * Exports all Hebrew stages for the typing tutor.
 */

import { stage1Hebrew } from './stage1-he';
import { stage2Hebrew } from './stage2-he';
import { stage3Hebrew } from './stage3-he';
import { stage4Hebrew } from './stage4-he';
import { stage5Hebrew } from './stage5-he';
import { stage6Hebrew } from './stage6-he';
import type { Stage, Lesson } from '@/types/lesson';

/**
 * All Hebrew stages in order.
 */
export const hebrewStages: Stage[] = [
  stage1Hebrew,
  stage2Hebrew,
  stage3Hebrew,
  stage4Hebrew,
  stage5Hebrew,
  stage6Hebrew,
];

/**
 * Get a Hebrew stage by ID.
 */
export function getHebrewStage(stageId: number): Stage | undefined {
  return hebrewStages.find((s) => s.id === stageId);
}

/**
 * Get a Hebrew lesson by ID.
 */
export function getHebrewLesson(lessonId: string): Lesson | undefined {
  for (const stage of hebrewStages) {
    const lesson = stage.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}

/**
 * Get all Hebrew lessons as a flat array.
 */
export function getAllHebrewLessons(): Lesson[] {
  return hebrewStages.flatMap((stage) => stage.lessons);
}

/**
 * Get the total number of Hebrew lessons.
 */
export function getHebrewLessonCount(): number {
  return hebrewStages.reduce((sum, stage) => sum + stage.lessons.length, 0);
}

/**
 * Get the total XP available in the Hebrew curriculum.
 */
export function getTotalHebrewXp(): number {
  return hebrewStages.reduce((sum, stage) => sum + stage.totalXp, 0);
}

/**
 * Get the next Hebrew lesson after the given one.
 */
export function getNextHebrewLesson(currentLessonId: string): Lesson | undefined {
  const allLessons = getAllHebrewLessons();
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  if (currentIndex === -1 || currentIndex >= allLessons.length - 1) {
    return undefined;
  }
  return allLessons[currentIndex + 1];
}

/**
 * Get the first Hebrew lesson of a stage.
 */
export function getFirstHebrewLesson(stageId: number): Lesson | undefined {
  const stage = getHebrewStage(stageId);
  return stage?.lessons[0];
}

// Re-export individual stages for direct access
export {
  stage1Hebrew,
  stage2Hebrew,
  stage3Hebrew,
  stage4Hebrew,
  stage5Hebrew,
  stage6Hebrew,
};
