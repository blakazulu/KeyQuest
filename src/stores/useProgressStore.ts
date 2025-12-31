import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionResult {
  lessonId: string;
  accuracy: number;
  wpm: number;
  date: string;
}

interface ProgressState {
  currentStage: number;
  currentLesson: number;
  completedLessons: string[];
  totalPoints: number;
  averageAccuracy: number;
  averageWpm: number;
  practiceStreak: number;
  lastPracticeDate: string | null;
  sessionHistory: SessionResult[];
  weakLetters: Record<string, number>;

  // Actions
  completeLesson: (lessonId: string, accuracy: number, wpm: number, points: number) => void;
  updateWeakLetter: (letter: string, accuracy: number) => void;
  updateStreak: () => void;
  reset: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      currentStage: 1,
      currentLesson: 1,
      completedLessons: [],
      totalPoints: 0,
      averageAccuracy: 0,
      averageWpm: 0,
      practiceStreak: 0,
      lastPracticeDate: null,
      sessionHistory: [],
      weakLetters: {},

      completeLesson: (lessonId, accuracy, wpm, points) => {
        const { completedLessons, sessionHistory, averageAccuracy, averageWpm } = get();
        const newHistory = [...sessionHistory, {
          lessonId,
          accuracy,
          wpm,
          date: new Date().toISOString()
        }];

        const totalSessions = newHistory.length;
        const newAvgAccuracy = ((averageAccuracy * (totalSessions - 1)) + accuracy) / totalSessions;
        const newAvgWpm = ((averageWpm * (totalSessions - 1)) + wpm) / totalSessions;

        set({
          completedLessons: completedLessons.includes(lessonId)
            ? completedLessons
            : [...completedLessons, lessonId],
          totalPoints: get().totalPoints + points,
          averageAccuracy: newAvgAccuracy,
          averageWpm: newAvgWpm,
          sessionHistory: newHistory,
          lastPracticeDate: new Date().toISOString(),
        });
      },

      updateWeakLetter: (letter, accuracy) => {
        set({
          weakLetters: {
            ...get().weakLetters,
            [letter]: accuracy,
          },
        });
      },

      updateStreak: () => {
        const { lastPracticeDate, practiceStreak } = get();
        const today = new Date().toDateString();
        const lastDate = lastPracticeDate ? new Date(lastPracticeDate).toDateString() : null;

        if (lastDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastDate === yesterday.toDateString()) {
          set({ practiceStreak: practiceStreak + 1 });
        } else if (lastDate !== today) {
          set({ practiceStreak: 1 });
        }
      },

      reset: () => set({
        currentStage: 1,
        currentLesson: 1,
        completedLessons: [],
        totalPoints: 0,
        averageAccuracy: 0,
        averageWpm: 0,
        practiceStreak: 0,
        lastPracticeDate: null,
        sessionHistory: [],
        weakLetters: {},
      }),
    }),
    {
      name: 'keyquest-progress',
    }
  )
);
