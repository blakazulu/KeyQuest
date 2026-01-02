import { create } from 'zustand';

/**
 * Calm mode session status
 */
export type CalmModeStatus = 'idle' | 'running' | 'paused';

/**
 * Calm mode session state
 * NOT persisted - resets on page refresh (intentional for stress-free experience)
 */
interface CalmModeState {
  /** Current session status */
  status: CalmModeStatus;
  /** Session start timestamp (null if not started) */
  sessionStartTime: number | null;
  /** Total time spent paused in ms */
  pausedDuration: number;
  /** When pause started (for calculating pause duration) */
  pauseStartTime: number | null;
  /** Total characters typed in this session */
  totalCharactersTyped: number;
  /** Whether the keyboard is visible (user toggle) */
  showKeyboard: boolean;

  // Actions
  /** Start or resume the session */
  start: () => void;
  /** Pause the session */
  pause: () => void;
  /** Resume from pause */
  resume: () => void;
  /** Reset the session completely */
  reset: () => void;
  /** Update the character count */
  updateCharacterCount: (count: number) => void;
  /** Toggle keyboard visibility */
  toggleKeyboard: () => void;
  /** Set keyboard visibility */
  setShowKeyboard: (show: boolean) => void;

  // Computed getters
  /** Get total session time in milliseconds (excluding paused time) */
  getSessionTime: () => number;
  /** Get formatted session time string (mm:ss) */
  getFormattedTime: () => string;
}

export const useCalmModeStore = create<CalmModeState>()((set, get) => ({
  status: 'idle',
  sessionStartTime: null,
  pausedDuration: 0,
  pauseStartTime: null,
  totalCharactersTyped: 0,
  showKeyboard: true, // Default to showing keyboard

  start: () => {
    const { status, sessionStartTime } = get();

    if (status === 'idle') {
      // Fresh start
      set({
        status: 'running',
        sessionStartTime: Date.now(),
        pausedDuration: 0,
        pauseStartTime: null,
        totalCharactersTyped: 0,
      });
    } else if (status === 'paused') {
      // Resume from pause
      get().resume();
    }
  },

  pause: () => {
    const { status } = get();
    if (status !== 'running') return;

    set({
      status: 'paused',
      pauseStartTime: Date.now(),
    });
  },

  resume: () => {
    const { status, pauseStartTime, pausedDuration } = get();
    if (status !== 'paused') return;

    // Add pause duration to total
    const pauseTime = pauseStartTime ? Date.now() - pauseStartTime : 0;

    set({
      status: 'running',
      pausedDuration: pausedDuration + pauseTime,
      pauseStartTime: null,
    });
  },

  reset: () => {
    set({
      status: 'idle',
      sessionStartTime: null,
      pausedDuration: 0,
      pauseStartTime: null,
      totalCharactersTyped: 0,
    });
  },

  updateCharacterCount: (count) => {
    set({ totalCharactersTyped: count });
  },

  toggleKeyboard: () => {
    set((state) => ({ showKeyboard: !state.showKeyboard }));
  },

  setShowKeyboard: (show) => {
    set({ showKeyboard: show });
  },

  getSessionTime: () => {
    const { sessionStartTime, pausedDuration, status, pauseStartTime } = get();

    if (!sessionStartTime) return 0;

    const now = Date.now();
    let totalTime = now - sessionStartTime - pausedDuration;

    // If currently paused, don't count the current pause time
    if (status === 'paused' && pauseStartTime) {
      totalTime -= (now - pauseStartTime);
    }

    return Math.max(0, totalTime);
  },

  getFormattedTime: () => {
    const totalMs = get().getSessionTime();
    const totalSeconds = Math.floor(totalMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },
}));
