import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LessonProgress, CurriculumProgress } from '@/types/lesson';
import type { AchievementProgress, ProgressSnapshot } from '@/types/achievement';
import type { RankProgress } from '@/types/rank';
import type { LetterHistoryEntry } from '@/types/progress';
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
import { getLesson, getFirstLesson } from '@/data/lessons';
import { useSettingsStore } from './useSettingsStore';
import { getRankProgress, checkRankUp } from '@/data/ranks';
import { calculateXpEnhanced, type XpBreakdown } from '@/lib/xpCalculation';
import {
  checkAllAchievements,
  checkSessionAchievements,
  createAchievementProgress,
  getTotalAchievementXpReward,
} from '@/lib/achievementChecker';
import { getAchievement } from '@/data/achievements';

interface SessionResult {
  lessonId: string;
  accuracy: number;
  wpm: number;
  date: string;
  xpEarned: number;
  stars: number;
}

// XP event types for history tracking
export interface XpEvent {
  type: 'lesson' | 'achievement';
  id: string; // lessonId or achievementId
  xp: number;
  date: string;
  // Extra data for lessons
  accuracy?: number;
  wpm?: number;
  stars?: number;
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

  // Gamification data (Phase 9)
  achievements: Record<string, AchievementProgress>;
  perfectLessons: number;
  threeStarLessons: number;
  pendingAchievementIds: string[];

  // Easter egg counters
  homeKeyClicks: number;
  levelsKeyClicks: number;

  // XP history (all XP gains)
  xpHistory: XpEvent[];

  // Letter accuracy history for analytics (Phase 11)
  letterHistory: Record<string, LetterHistoryEntry[]>;

  // Actions
  completeLesson: (
    lessonId: string,
    accuracy: number,
    wpm: number,
    timeSpent: number
  ) => {
    passed: boolean;
    xpEarned: number;
    xpBreakdown: XpBreakdown;
    stars: number;
    isNewBest: boolean;
    newAchievements: string[];
    rankUp: string | null;
  };
  addExerciseXp: (xpAmount: number) => void;
  updateWeakLetter: (letter: string, accuracy: number) => void;
  recordLetterHistory: (
    letterAccuracy: Record<string, { correct: number; total: number }>,
    sessionId: string
  ) => void;
  updateStreak: () => void;
  reset: () => void;

  // Achievement actions
  checkAndUnlockAchievements: () => string[];
  markAchievementSeen: (id: string) => void;
  clearPendingAchievements: () => void;

  // Easter egg actions
  incrementHomeKeyClicks: () => string[];
  incrementLevelsKeyClicks: () => string[];

  // Getters for curriculum progress
  getCurriculumProgress: () => CurriculumProgress;
  isLessonUnlocked: (lessonId: string) => boolean;
  isStageUnlocked: (stageId: number) => boolean;
  isStageCompleted: (stageId: number) => boolean;
  getCurrentLesson: () => ReturnType<typeof getCurrentLesson>;
  getRecommendedLessons: (limit?: number) => ReturnType<typeof getRecommendedLessons>;
  getKeyMastery: () => ReturnType<typeof getKeyMastery>;
  getLessonProgress: (lessonId: string) => LessonProgress | null;

  // Rank getter
  getRankProgress: () => RankProgress;

  // Progress snapshot for achievement checking
  getProgressSnapshot: () => ProgressSnapshot;

  // Letter history getter (Phase 11)
  getLetterHistory: (letter: string) => LetterHistoryEntry[];
}

const initialState = {
  completedLessons: [] as string[],
  lessonProgress: {} as Record<string, LessonProgress>,
  totalXp: 0,
  averageAccuracy: 0,
  averageWpm: 0,
  practiceStreak: 0,
  longestStreak: 0,
  lastPracticeDate: null as string | null,
  sessionHistory: [] as SessionResult[],
  weakLetters: {} as Record<string, number>,
  // Gamification
  achievements: {} as Record<string, AchievementProgress>,
  perfectLessons: 0,
  threeStarLessons: 0,
  pendingAchievementIds: [] as string[],
  // Easter eggs
  homeKeyClicks: 0,
  levelsKeyClicks: 0,
  // XP history
  xpHistory: [] as XpEvent[],
  // Letter history (Phase 11)
  letterHistory: {} as Record<string, LetterHistoryEntry[]>,
};

/**
 * Calculate days missed since last practice.
 */
function getDaysMissed(lastPracticeDate: string | null): number {
  if (!lastPracticeDate) return Infinity;

  const last = new Date(lastPracticeDate);
  const today = new Date();

  // Reset time components for accurate day comparison
  last.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // -1 because we count days BETWEEN (yesterday = 0 days missed)
  return Math.max(0, diffDays - 1);
}

/**
 * Calculate new streak after absence using graceful degradation.
 * - 1 day missed: streak - 1
 * - 2 days missed: streak / 2
 * - 3+ days missed: reset to 0
 */
function calculateStreakAfterAbsence(lastStreak: number, daysMissed: number): number {
  if (daysMissed === 0) {
    return lastStreak;
  }

  if (daysMissed === 1) {
    return Math.max(0, lastStreak - 1);
  }

  if (daysMissed === 2) {
    return Math.floor(lastStreak / 2);
  }

  // 3+ days missed
  return 0;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,

      completeLesson: (lessonId, accuracy, wpm, timeSpent) => {
        const lesson = getLesson(lessonId);
        if (!lesson) {
          return {
            passed: false,
            xpEarned: 0,
            xpBreakdown: {
              baseXp: 0,
              starBonus: 0,
              accuracyBonus: 0,
              speedBonus: 0,
              streakBonus: 0,
              total: 0,
            },
            stars: 0,
            isNewBest: false,
            newAchievements: [],
            rankUp: null,
          };
        }

        const existingProgress = get().lessonProgress[lessonId];
        const result = processLessonResult(
          lesson,
          accuracy,
          wpm,
          timeSpent,
          existingProgress
        );

        const {
          completedLessons,
          sessionHistory,
          averageAccuracy,
          averageWpm,
          totalXp,
          practiceStreak,
          perfectLessons,
          threeStarLessons,
          achievements,
        } = get();

        // Calculate enhanced XP with bonuses
        const xpBreakdown = calculateXpEnhanced(
          lesson.xpReward,
          accuracy,
          wpm,
          result.stars,
          practiceStreak
        );

        // Add to session history
        const newSession: SessionResult = {
          lessonId,
          accuracy,
          wpm,
          date: new Date().toISOString(),
          xpEarned: xpBreakdown.total,
          stars: result.stars,
        };
        const newHistory = [...sessionHistory, newSession];

        // Calculate new averages
        const totalSessions = newHistory.length;
        const newAvgAccuracy =
          (averageAccuracy * (totalSessions - 1) + accuracy) / totalSessions;
        const newAvgWpm = (averageWpm * (totalSessions - 1) + wpm) / totalSessions;

        // Only add XP if this is a new high score or first completion
        const previousXpEarned = existingProgress?.xpEarned || 0;
        const xpToAdd =
          xpBreakdown.total > previousXpEarned
            ? xpBreakdown.total - previousXpEarned
            : 0;

        // Track perfect lessons and 3-star lessons
        let newPerfectLessons = perfectLessons;
        let newThreeStarLessons = threeStarLessons;

        if (accuracy >= 100 && (!existingProgress || existingProgress.bestAccuracy < 100)) {
          newPerfectLessons += 1;
        }

        if (result.stars === 3 && (!existingProgress || existingProgress.stars < 3)) {
          newThreeStarLessons += 1;
        }

        // Check for rank up before adding XP
        const newTotalXp = totalXp + xpToAdd;
        const rankUp = checkRankUp(totalXp, newTotalXp);

        // Update lesson progress with enhanced XP
        const updatedLessonProgress = {
          ...result.updatedProgress,
          xpEarned: Math.max(result.updatedProgress.xpEarned, xpBreakdown.total),
        };

        // Add XP event to history
        const xpEvent: XpEvent = {
          type: 'lesson',
          id: lessonId,
          xp: xpBreakdown.total,
          date: new Date().toISOString(),
          accuracy,
          wpm,
          stars: result.stars,
        };

        set({
          completedLessons:
            result.passed && !completedLessons.includes(lessonId)
              ? [...completedLessons, lessonId]
              : completedLessons,
          lessonProgress: {
            ...get().lessonProgress,
            [lessonId]: updatedLessonProgress,
          },
          totalXp: newTotalXp,
          averageAccuracy: newAvgAccuracy,
          averageWpm: newAvgWpm,
          sessionHistory: newHistory,
          lastPracticeDate: new Date().toISOString(),
          perfectLessons: newPerfectLessons,
          threeStarLessons: newThreeStarLessons,
          xpHistory: [...get().xpHistory, xpEvent],
        });

        // Update streak
        get().updateStreak();

        // Check for new achievements
        const sessionAchievements = checkSessionAchievements(wpm, accuracy, achievements);
        const allNewAchievements = get().checkAndUnlockAchievements();
        const newAchievements = [...new Set([...sessionAchievements, ...allNewAchievements])];

        // Unlock session achievements
        if (sessionAchievements.length > 0) {
          const updatedAchievements = { ...get().achievements };
          let achievementXp = 0;
          const achievementXpEvents: XpEvent[] = [];

          for (const id of sessionAchievements) {
            if (!updatedAchievements[id]?.unlocked) {
              updatedAchievements[id] = createAchievementProgress(id);
              const achievement = getAchievement(id);
              if (achievement) {
                achievementXp += achievement.xpReward;
                achievementXpEvents.push({
                  type: 'achievement',
                  id,
                  xp: achievement.xpReward,
                  date: new Date().toISOString(),
                });
              }
            }
          }

          set({
            achievements: updatedAchievements,
            totalXp: get().totalXp + achievementXp,
            pendingAchievementIds: [
              ...get().pendingAchievementIds,
              ...sessionAchievements.filter(
                (id) => !get().pendingAchievementIds.includes(id)
              ),
            ],
            xpHistory: [...get().xpHistory, ...achievementXpEvents],
          });
        }

        return {
          passed: result.passed,
          xpEarned: xpBreakdown.total,
          xpBreakdown,
          stars: result.stars,
          isNewBest: result.isNewBest,
          newAchievements,
          rankUp,
        };
      },

      addExerciseXp: (xpAmount) => {
        set((state) => ({
          totalXp: state.totalXp + xpAmount,
        }));
      },

      updateWeakLetter: (letter, accuracy) => {
        const currentAccuracy = get().weakLetters[letter];
        // Use exponential moving average for smoothing
        const newAccuracy =
          currentAccuracy !== undefined
            ? currentAccuracy * 0.7 + accuracy * 0.3
            : accuracy;

        set({
          weakLetters: {
            ...get().weakLetters,
            [letter]: Math.round(newAccuracy * 100) / 100,
          },
        });
      },

      recordLetterHistory: (letterAccuracy, sessionId) => {
        const currentHistory = get().letterHistory;
        const updatedHistory = { ...currentHistory };
        const now = new Date().toISOString();
        const MAX_HISTORY_PER_LETTER = 20;

        for (const [letter, stats] of Object.entries(letterAccuracy)) {
          if (stats.total > 0) {
            const accuracy = Math.round((stats.correct / stats.total) * 100);
            const entry: LetterHistoryEntry = {
              accuracy,
              date: now,
              sessionId,
            };

            // Get existing history for this letter or start fresh
            const letterEntries = updatedHistory[letter] || [];

            // Add new entry and keep only the last MAX_HISTORY_PER_LETTER entries
            updatedHistory[letter] = [...letterEntries, entry].slice(
              -MAX_HISTORY_PER_LETTER
            );
          }
        }

        set({ letterHistory: updatedHistory });
      },

      updateStreak: () => {
        const { lastPracticeDate, practiceStreak, longestStreak } = get();
        const today = new Date().toDateString();
        const lastDate = lastPracticeDate
          ? new Date(lastPracticeDate).toDateString()
          : null;

        // Already practiced today
        if (lastDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let newStreak: number;

        if (lastDate === yesterday.toDateString()) {
          // Practiced yesterday - increment streak
          newStreak = practiceStreak + 1;
        } else if (lastDate === null) {
          // First practice ever
          newStreak = 1;
        } else {
          // Missed days - apply graceful degradation
          const daysMissed = getDaysMissed(lastPracticeDate);
          const degradedStreak = calculateStreakAfterAbsence(practiceStreak, daysMissed);
          // Start new streak from degraded value + 1
          newStreak = degradedStreak + 1;
        }

        set({
          practiceStreak: newStreak,
          longestStreak: Math.max(longestStreak, newStreak),
        });
      },

      reset: () =>
        set({
          ...initialState,
          achievements: {},
          perfectLessons: 0,
          threeStarLessons: 0,
          pendingAchievementIds: [],
        }),

      // Achievement actions
      checkAndUnlockAchievements: () => {
        const snapshot = get().getProgressSnapshot();
        const currentAchievements = get().achievements;

        const newlyUnlocked = checkAllAchievements(snapshot, currentAchievements);

        if (newlyUnlocked.length > 0) {
          const updatedAchievements = { ...currentAchievements };
          const achievementXpEvents: XpEvent[] = [];
          let achievementXp = 0;

          for (const id of newlyUnlocked) {
            updatedAchievements[id] = createAchievementProgress(id);
            const achievement = getAchievement(id);
            if (achievement) {
              achievementXp += achievement.xpReward;
              achievementXpEvents.push({
                type: 'achievement',
                id,
                xp: achievement.xpReward,
                date: new Date().toISOString(),
              });
            }
          }

          set({
            achievements: updatedAchievements,
            totalXp: get().totalXp + achievementXp,
            pendingAchievementIds: [...get().pendingAchievementIds, ...newlyUnlocked],
            xpHistory: [...get().xpHistory, ...achievementXpEvents],
          });
        }

        return newlyUnlocked;
      },

      markAchievementSeen: (id) => {
        const achievement = get().achievements[id];
        if (achievement) {
          set({
            achievements: {
              ...get().achievements,
              [id]: { ...achievement, seen: true },
            },
            pendingAchievementIds: get().pendingAchievementIds.filter((aid) => aid !== id),
          });
        }
      },

      clearPendingAchievements: () => {
        const updatedAchievements = { ...get().achievements };
        for (const id of get().pendingAchievementIds) {
          if (updatedAchievements[id]) {
            updatedAchievements[id] = { ...updatedAchievements[id], seen: true };
          }
        }
        set({
          achievements: updatedAchievements,
          pendingAchievementIds: [],
        });
      },

      // Easter egg actions
      incrementHomeKeyClicks: () => {
        const newCount = get().homeKeyClicks + 1;
        set({ homeKeyClicks: newCount });
        return get().checkAndUnlockAchievements();
      },

      incrementLevelsKeyClicks: () => {
        const newCount = get().levelsKeyClicks + 1;
        set({ levelsKeyClicks: newCount });
        return get().checkAndUnlockAchievements();
      },

      // Curriculum progress getters
      getCurriculumProgress: () => {
        const { completedLessons, lessonProgress } = get();
        return getCurriculumProgress(completedLessons, lessonProgress);
      },

      isLessonUnlocked: (lessonId: string) => {
        // Check if unlocked via normal progression
        if (isLessonUnlocked(lessonId, get().completedLessons)) {
          return true;
        }

        // Check if unlocked via assessment - first lesson of each stage up to recommended
        const { initialAssessment } = useSettingsStore.getState();
        if (initialAssessment?.recommendedStage) {
          const lesson = getLesson(lessonId);
          if (lesson && lesson.stageId <= initialAssessment.recommendedStage) {
            // First lesson of unlocked stages is always available
            const firstLesson = getFirstLesson(lesson.stageId);
            if (firstLesson && firstLesson.id === lessonId) {
              return true;
            }
          }
        }

        return false;
      },

      isStageUnlocked: (stageId: number) => {
        // Check if unlocked via normal progression
        if (isStageUnlocked(stageId, get().completedLessons)) {
          return true;
        }

        // Check if unlocked via assessment
        const { initialAssessment } = useSettingsStore.getState();
        if (initialAssessment?.recommendedStage) {
          return stageId <= initialAssessment.recommendedStage;
        }

        return false;
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

      // Rank getter
      getRankProgress: () => {
        return getRankProgress(get().totalXp);
      },

      // Letter history getter (Phase 11)
      getLetterHistory: (letter: string) => {
        return get().letterHistory[letter] || [];
      },

      // Progress snapshot for achievement checking
      getProgressSnapshot: (): ProgressSnapshot => {
        const state = get();
        const curriculum = state.getCurriculumProgress();

        return {
          completedLessons: state.completedLessons,
          stagesCompleted: curriculum.stagesCompleted,
          totalXp: state.totalXp,
          averageWpm: state.averageWpm,
          averageAccuracy: state.averageAccuracy,
          practiceStreak: state.practiceStreak,
          longestStreak: state.longestStreak,
          totalSessions: state.sessionHistory.length,
          perfectLessons: state.perfectLessons,
          threeStarLessons: state.threeStarLessons,
          weakLetters: state.weakLetters,
          homeKeyClicks: state.homeKeyClicks,
          levelsKeyClicks: state.levelsKeyClicks,
        };
      },
    }),
    {
      name: 'keyquest-progress',
      version: 6, // Increment version for letter history tracking (Phase 11)
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0 || version === 1) {
          // Migrate from old format to v2 format
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
            // Add gamification fields
            achievements: {},
            perfectLessons: 0,
            threeStarLessons: 0,
            pendingAchievementIds: [],
          };
        }

        if (version === 2) {
          // Migrate from v2 to v3 - add gamification fields
          const v2State = persistedState as {
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
          };

          // Calculate perfectLessons and threeStarLessons from existing data
          let perfectLessons = 0;
          let threeStarLessons = 0;

          for (const progress of Object.values(v2State.lessonProgress || {})) {
            if (progress.bestAccuracy >= 100) {
              perfectLessons += 1;
            }
            if (progress.stars === 3) {
              threeStarLessons += 1;
            }
          }

          return {
            ...v2State,
            achievements: {},
            perfectLessons,
            threeStarLessons,
            pendingAchievementIds: [],
            homeKeyClicks: 0,
            levelsKeyClicks: 0,
          };
        }

        if (version === 3) {
          // Migrate from v3 to v4 - add easter egg tracking
          const v3State = persistedState as Omit<ProgressState, 'homeKeyClicks' | 'levelsKeyClicks' | 'xpHistory'>;
          return {
            ...v3State,
            homeKeyClicks: 0,
            levelsKeyClicks: 0,
            xpHistory: [],
          };
        }

        if (version === 4) {
          // Migrate from v4 to v5 - add XP history tracking
          const v4State = persistedState as Omit<ProgressState, 'xpHistory'>;
          return {
            ...v4State,
            xpHistory: [],
          };
        }

        if (version === 5) {
          // Migrate from v5 to v6 - add letter history tracking (Phase 11)
          const v5State = persistedState as Omit<ProgressState, 'letterHistory'>;
          return {
            ...v5State,
            letterHistory: {},
          };
        }

        return persistedState as ProgressState;
      },
    }
  )
);
