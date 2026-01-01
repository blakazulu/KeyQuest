import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LessonProgress, CurriculumProgress } from '@/types/lesson';
import {
  getCurriculumProgress,
  processLessonResult,
  isLessonUnlocked,
  isStageUnlocked,
  isStageCompleted,
  getCurrentLesson,
  getRecommendedLessons,
  getKeyMastery,
} from '@/lib/lessonProgression';
import { getLesson } from '@/data/lessons';

interface SessionResult {
  lessonId: string;
  accuracy: number;
  wpm: number;
  date: string;
  xpEarned: number;
  stars: number;
}

interface ProgressState {
  // Core progress data
  completedLessons: string[];
  lessonProgress: Record<string, LessonProgress>;
  totalXp: number;
  averageAccuracy: number;
  averageWpm: number;
  practiceStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  sessionHistory: SessionResult[];
  weakLetters: Record<string, number>;

  // Computed getters (not persisted, computed from state)
  // These are exposed as methods

  // Actions
  completeLesson: (
    lessonId: string,
    accuracy: number,
    wpm: number,
    timeSpent: number
  ) => {
    passed: boolean;
    xpEarned: number;
    stars: number;
    isNewBest: boolean;
  };
  updateWeakLetter: (letter: string, accuracy: number) => void;
  updateStreak: () => void;
  reset: () => void;

  // Getters for curriculum progress
  getCurriculumProgress: () => CurriculumProgress;
  isLessonUnlocked: (lessonId: string) => boolean;
  isStageUnlocked: (stageId: number) => boolean;
  isStageCompleted: (stageId: number) => boolean;
  getCurrentLesson: () => ReturnType<typeof getCurrentLesson>;
  getRecommendedLessons: (limit?: number) => ReturnType<typeof getRecommendedLessons>;
  getKeyMastery: () => ReturnType<typeof getKeyMastery>;
  getLessonProgress: (lessonId: string) => LessonProgress | null;
}

const initialState = {
  completedLessons: [],
  lessonProgress: {},
  totalXp: 0,
  averageAccuracy: 0,
  averageWpm: 0,
  practiceStreak: 0,
  longestStreak: 0,
  lastPracticeDate: null,
  sessionHistory: [],
  weakLetters: {},
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,

      completeLesson: (lessonId, accuracy, wpm, timeSpent) => {
        const lesson = getLesson(lessonId);
        if (!lesson) {
          return { passed: false, xpEarned: 0, stars: 0, isNewBest: false };
        }

        const existingProgress = get().lessonProgress[lessonId];
        const result = processLessonResult(
          lesson,
          accuracy,
          wpm,
          timeSpent,
          existingProgress
        );

        const { completedLessons, sessionHistory, averageAccuracy, averageWpm, totalXp } =
          get();

        // Add to session history
        const newSession: SessionResult = {
          lessonId,
          accuracy,
          wpm,
          date: new Date().toISOString(),
          xpEarned: result.xpEarned,
          stars: result.stars,
        };
        const newHistory = [...sessionHistory, newSession];

        // Calculate new averages
        const totalSessions = newHistory.length;
        const newAvgAccuracy =
          (averageAccuracy * (totalSessions - 1) + accuracy) / totalSessions;
        const newAvgWpm =
          (averageWpm * (totalSessions - 1) + wpm) / totalSessions;

        // Only add XP if this is a new high score or first completion
        const xpToAdd = result.xpEarned > (existingProgress?.xpEarned || 0)
          ? result.xpEarned - (existingProgress?.xpEarned || 0)
          : 0;

        set({
          completedLessons:
            result.passed && !completedLessons.includes(lessonId)
              ? [...completedLessons, lessonId]
              : completedLessons,
          lessonProgress: {
            ...get().lessonProgress,
            [lessonId]: result.updatedProgress,
          },
          totalXp: totalXp + xpToAdd,
          averageAccuracy: newAvgAccuracy,
          averageWpm: newAvgWpm,
          sessionHistory: newHistory,
          lastPracticeDate: new Date().toISOString(),
        });

        // Update streak
        get().updateStreak();

        return {
          passed: result.passed,
          xpEarned: result.xpEarned,
          stars: result.stars,
          isNewBest: result.isNewBest,
        };
      },

      updateWeakLetter: (letter, accuracy) => {
        const currentAccuracy = get().weakLetters[letter];
        // Use exponential moving average for smoothing
        const newAccuracy = currentAccuracy !== undefined
          ? currentAccuracy * 0.7 + accuracy * 0.3
          : accuracy;

        set({
          weakLetters: {
            ...get().weakLetters,
            [letter]: Math.round(newAccuracy * 100) / 100,
          },
        });
      },

      updateStreak: () => {
        const { lastPracticeDate, practiceStreak, longestStreak } = get();
        const today = new Date().toDateString();
        const lastDate = lastPracticeDate
          ? new Date(lastPracticeDate).toDateString()
          : null;

        if (lastDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let newStreak: number;
        if (lastDate === yesterday.toDateString()) {
          newStreak = practiceStreak + 1;
        } else if (lastDate !== today) {
          newStreak = 1;
        } else {
          newStreak = practiceStreak;
        }

        set({
          practiceStreak: newStreak,
          longestStreak: Math.max(longestStreak, newStreak),
        });
      },

      reset: () => set(initialState),

      // Curriculum progress getters
      getCurriculumProgress: () => {
        const { completedLessons, lessonProgress } = get();
        return getCurriculumProgress(completedLessons, lessonProgress);
      },

      isLessonUnlocked: (lessonId: string) => {
        return isLessonUnlocked(lessonId, get().completedLessons);
      },

      isStageUnlocked: (stageId: number) => {
        return isStageUnlocked(stageId, get().completedLessons);
      },

      isStageCompleted: (stageId: number) => {
        return isStageCompleted(stageId, get().completedLessons);
      },

      getCurrentLesson: () => {
        return getCurrentLesson(get().completedLessons);
      },

      getRecommendedLessons: (limit = 3) => {
        const { weakLetters, completedLessons } = get();
        return getRecommendedLessons(weakLetters, completedLessons, limit);
      },

      getKeyMastery: () => {
        const { weakLetters, completedLessons } = get();
        return getKeyMastery(weakLetters, completedLessons);
      },

      getLessonProgress: (lessonId: string) => {
        return get().lessonProgress[lessonId] || null;
      },
    }),
    {
      name: 'keyquest-progress',
      version: 2, // Increment version to handle migration
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0 || version === 1) {
          // Migrate from old format to new format
          const oldState = persistedState as {
            currentStage?: number;
            currentLesson?: number;
            completedLessons?: string[];
            totalPoints?: number;
            averageAccuracy?: number;
            averageWpm?: number;
            practiceStreak?: number;
            lastPracticeDate?: string | null;
            sessionHistory?: Array<{
              lessonId: string;
              accuracy: number;
              wpm: number;
              date: string;
            }>;
            weakLetters?: Record<string, number>;
          };

          // Convert old session history format if needed
          const migratedHistory = (oldState.sessionHistory || []).map((session) => ({
            ...session,
            xpEarned: 0,
            stars: 0,
          }));

          return {
            ...initialState,
            completedLessons: oldState.completedLessons || [],
            totalXp: oldState.totalPoints || 0,
            averageAccuracy: oldState.averageAccuracy || 0,
            averageWpm: oldState.averageWpm || 0,
            practiceStreak: oldState.practiceStreak || 0,
            longestStreak: oldState.practiceStreak || 0,
            lastPracticeDate: oldState.lastPracticeDate || null,
            sessionHistory: migratedHistory,
            weakLetters: oldState.weakLetters || {},
            lessonProgress: {},
          };
        }
        return persistedState as ProgressState;
      },
    }
  )
);
