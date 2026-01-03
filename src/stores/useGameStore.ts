import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GameStats {
  // Race Game
  raceBestTime: number | null; // milliseconds, null if never played
  raceGamesPlayed: number;
  raceTotalDistance: number; // cumulative characters typed

  // Target Shooting
  targetHighScore: number;
  targetMaxCombo: number;
  targetTotalHits: number;
  targetGamesPlayed: number;

  // Tower Builder
  towerMaxHeight: number;
  towerTotalBlocks: number;
  towerGamesPlayed: number;

  // Daily Challenge
  dailyStreak: number;
  dailyBestStreak: number;
  lastDailyDate: string | null; // ISO date string (YYYY-MM-DD)
  dailiesCompleted: number;
  todayCompleted: boolean;
  todayStats: {
    wpm: number;
    accuracy: number;
    time: number;
  } | null;

  // Aggregate
  totalGamesPlayed: number;
  gamesPlayedByType: {
    race: boolean;
    target: boolean;
    tower: boolean;
    daily: boolean;
  };
}

interface GameState extends GameStats {
  // Race Game Actions
  recordRaceResult: (timeMs: number, distance: number) => {
    isNewBest: boolean;
    xpEarned: number;
  };

  // Target Shooting Actions
  recordTargetResult: (score: number, maxCombo: number, hits: number) => {
    isNewHighScore: boolean;
    isNewComboRecord: boolean;
    xpEarned: number;
  };

  // Tower Builder Actions
  recordTowerResult: (height: number, blocksPlaced: number) => {
    isNewRecord: boolean;
    xpEarned: number;
  };

  // Daily Challenge Actions
  recordDailyResult: (wpm: number, accuracy: number, timeMs: number) => {
    alreadyCompleted: boolean;
    xpEarned: number;
    streakIncreased: boolean;
  };
  checkDailyReset: () => void;

  // Utility
  hasPlayedAllGames: () => boolean;
  reset: () => void;
}

// Get today's date in local timezone as YYYY-MM-DD
const getTodayDateString = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const calculateBaseXp = (
  accuracy: number,
  wpmBonus: number = 0
): { baseXp: number; accuracyBonus: number; speedBonus: number; total: number } => {
  const baseXp = 20;
  const accuracyBonus = accuracy >= 90 ? 10 : accuracy >= 80 ? 5 : 0;
  const speedBonus = Math.min(10, Math.floor(wpmBonus / 10) * 2); // +2 XP per 10 WPM above threshold

  return {
    baseXp,
    accuracyBonus,
    speedBonus,
    total: baseXp + accuracyBonus + speedBonus,
  };
};

const initialState: GameStats = {
  // Race
  raceBestTime: null,
  raceGamesPlayed: 0,
  raceTotalDistance: 0,

  // Target
  targetHighScore: 0,
  targetMaxCombo: 0,
  targetTotalHits: 0,
  targetGamesPlayed: 0,

  // Tower
  towerMaxHeight: 0,
  towerTotalBlocks: 0,
  towerGamesPlayed: 0,

  // Daily
  dailyStreak: 0,
  dailyBestStreak: 0,
  lastDailyDate: null,
  dailiesCompleted: 0,
  todayCompleted: false,
  todayStats: null,

  // Aggregate
  totalGamesPlayed: 0,
  gamesPlayedByType: {
    race: false,
    target: false,
    tower: false,
    daily: false,
  },
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      recordRaceResult: (timeMs, distance) => {
        const currentBest = get().raceBestTime;
        const isNewBest = currentBest === null || timeMs < currentBest;

        // Calculate XP based on time (faster = more bonus)
        // Assume 60 seconds is baseline, faster times get bonus
        const timeSeconds = timeMs / 1000;
        const speedBonus = Math.max(0, 60 - timeSeconds); // bonus for being under 60s
        const xpCalc = calculateBaseXp(100, speedBonus);

        set((state) => ({
          raceBestTime: isNewBest ? timeMs : state.raceBestTime,
          raceGamesPlayed: state.raceGamesPlayed + 1,
          raceTotalDistance: state.raceTotalDistance + distance,
          totalGamesPlayed: state.totalGamesPlayed + 1,
          gamesPlayedByType: {
            ...state.gamesPlayedByType,
            race: true,
          },
        }));

        return { isNewBest, xpEarned: xpCalc.total };
      },

      recordTargetResult: (score, maxCombo, hits) => {
        const state = get();
        const isNewHighScore = score > state.targetHighScore;
        const isNewComboRecord = maxCombo > state.targetMaxCombo;

        // XP based on score (100 points = baseline)
        const scoreBonus = Math.floor(score / 50);
        const xpCalc = calculateBaseXp(Math.min(100, (hits / Math.max(1, hits + 5)) * 100), scoreBonus);

        set((prev) => ({
          targetHighScore: isNewHighScore ? score : prev.targetHighScore,
          targetMaxCombo: isNewComboRecord ? maxCombo : prev.targetMaxCombo,
          targetTotalHits: prev.targetTotalHits + hits,
          targetGamesPlayed: prev.targetGamesPlayed + 1,
          totalGamesPlayed: prev.totalGamesPlayed + 1,
          gamesPlayedByType: {
            ...prev.gamesPlayedByType,
            target: true,
          },
        }));

        return { isNewHighScore, isNewComboRecord, xpEarned: xpCalc.total };
      },

      recordTowerResult: (height, blocksPlaced) => {
        const isNewRecord = height > get().towerMaxHeight;

        // XP based on height (10 blocks = baseline)
        const heightBonus = height * 2;
        const xpCalc = calculateBaseXp(Math.min(100, (height / 50) * 100), heightBonus);

        set((state) => ({
          towerMaxHeight: isNewRecord ? height : state.towerMaxHeight,
          towerTotalBlocks: state.towerTotalBlocks + blocksPlaced,
          towerGamesPlayed: state.towerGamesPlayed + 1,
          totalGamesPlayed: state.totalGamesPlayed + 1,
          gamesPlayedByType: {
            ...state.gamesPlayedByType,
            tower: true,
          },
        }));

        return { isNewRecord, xpEarned: xpCalc.total };
      },

      recordDailyResult: (wpm, accuracy, timeMs) => {
        const state = get();
        const today = getTodayDateString();

        // Check if already completed today
        if (state.todayCompleted && state.lastDailyDate === today) {
          return { alreadyCompleted: true, xpEarned: 0, streakIncreased: false };
        }

        // Calculate streak
        let newStreak = state.dailyStreak;
        let streakIncreased = false;

        if (state.lastDailyDate) {
          const lastDate = new Date(state.lastDailyDate);
          const todayDate = new Date(today);
          const diffDays = Math.floor(
            (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diffDays === 1) {
            // Consecutive day
            newStreak = state.dailyStreak + 1;
            streakIncreased = true;
          } else if (diffDays > 1) {
            // Streak broken
            newStreak = 1;
            streakIncreased = true;
          }
          // diffDays === 0 means same day, shouldn't happen due to check above
        } else {
          // First daily ever
          newStreak = 1;
          streakIncreased = true;
        }

        // Daily gives 1.5x XP
        const xpCalc = calculateBaseXp(accuracy, Math.max(0, wpm - 30));
        const dailyXp = Math.floor(xpCalc.total * 1.5);

        set((prev) => ({
          dailyStreak: newStreak,
          dailyBestStreak: Math.max(prev.dailyBestStreak, newStreak),
          lastDailyDate: today,
          dailiesCompleted: prev.dailiesCompleted + 1,
          todayCompleted: true,
          todayStats: { wpm, accuracy, time: timeMs },
          totalGamesPlayed: prev.totalGamesPlayed + 1,
          gamesPlayedByType: {
            ...prev.gamesPlayedByType,
            daily: true,
          },
        }));

        return { alreadyCompleted: false, xpEarned: dailyXp, streakIncreased };
      },

      checkDailyReset: () => {
        const today = getTodayDateString();
        const { lastDailyDate, todayCompleted } = get();

        // If last practice was not today, reset today's status
        if (todayCompleted && lastDailyDate !== today) {
          set({
            todayCompleted: false,
            todayStats: null,
          });
        }
      },

      hasPlayedAllGames: () => {
        const { gamesPlayedByType } = get();
        return (
          gamesPlayedByType.race &&
          gamesPlayedByType.target &&
          gamesPlayedByType.tower &&
          gamesPlayedByType.daily
        );
      },

      reset: () => set(initialState),
    }),
    {
      name: 'keyquest-games',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          // Future migrations can be added here
          return persistedState as GameState;
        }
        return persistedState as GameState;
      },
    }
  )
);
