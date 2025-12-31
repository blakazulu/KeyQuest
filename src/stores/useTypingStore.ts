import { create } from 'zustand';

interface TypingState {
  // Text state
  targetText: string;
  currentInput: string;
  currentPosition: number;
  errors: number[]; // Indices of positions where errors occurred

  // Timing state
  startTime: number | null;
  pausedTime: number | null; // Accumulated paused time
  endTime: number | null;

  // Session state
  isComplete: boolean;
  isPaused: boolean;

  // Actions
  setTargetText: (text: string) => void;
  handleKeyPress: (key: string) => void;
  handleBackspace: () => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

export const useTypingStore = create<TypingState>((set, get) => ({
  // Initial state
  targetText: '',
  currentInput: '',
  currentPosition: 0,
  errors: [],
  startTime: null,
  pausedTime: null,
  endTime: null,
  isComplete: false,
  isPaused: false,

  setTargetText: (text) => set({
    targetText: text,
    currentInput: '',
    currentPosition: 0,
    errors: [],
    startTime: null,
    pausedTime: null,
    endTime: null,
    isComplete: false,
    isPaused: false,
  }),

  handleKeyPress: (key) => {
    const { targetText, currentPosition, errors, startTime, isComplete, isPaused } = get();

    // Don't process if complete or paused
    if (isComplete || isPaused) return;
    if (currentPosition >= targetText.length) return;

    // Start timer on first keypress if not already started
    const newStartTime = startTime ?? Date.now();
    const expectedChar = targetText[currentPosition];
    const isCorrect = key === expectedChar;
    const newPosition = currentPosition + 1;
    const nowComplete = newPosition >= targetText.length;

    set({
      currentInput: get().currentInput + key,
      currentPosition: newPosition,
      errors: isCorrect ? errors : [...errors, currentPosition],
      startTime: newStartTime,
      isComplete: nowComplete,
      endTime: nowComplete ? Date.now() : null,
    });
  },

  handleBackspace: () => {
    const { currentPosition, currentInput, errors, isComplete, isPaused } = get();

    // Don't process if complete, paused, or at start
    if (isComplete || isPaused || currentPosition <= 0) return;

    const newPosition = currentPosition - 1;
    const newInput = currentInput.slice(0, -1);
    // Remove error at this position if it exists
    const newErrors = errors.filter((pos) => pos !== newPosition);

    set({
      currentPosition: newPosition,
      currentInput: newInput,
      errors: newErrors,
    });
  },

  start: () => {
    const { startTime } = get();
    // Only set start time if not already started
    if (startTime === null) {
      set({ startTime: Date.now(), isPaused: false });
    }
  },

  pause: () => {
    const { isPaused, isComplete } = get();
    if (!isPaused && !isComplete) {
      set({
        isPaused: true,
        pausedTime: Date.now(),
      });
    }
  },

  resume: () => {
    const { isPaused, startTime, pausedTime } = get();
    if (isPaused && startTime && pausedTime) {
      // Adjust start time to account for paused duration
      const pauseDuration = Date.now() - pausedTime;
      set({
        isPaused: false,
        startTime: startTime + pauseDuration,
        pausedTime: null,
      });
    }
  },

  reset: () => set({
    currentInput: '',
    currentPosition: 0,
    errors: [],
    startTime: null,
    pausedTime: null,
    endTime: null,
    isComplete: false,
    isPaused: false,
  }),
}));
