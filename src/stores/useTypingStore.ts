import { create } from 'zustand';

interface TypingState {
  targetText: string;
  currentInput: string;
  currentPosition: number;
  errors: number[];
  startTime: number | null;
  isComplete: boolean;

  // Actions
  setTargetText: (text: string) => void;
  handleKeyPress: (key: string) => void;
  reset: () => void;
}

export const useTypingStore = create<TypingState>((set, get) => ({
  targetText: '',
  currentInput: '',
  currentPosition: 0,
  errors: [],
  startTime: null,
  isComplete: false,

  setTargetText: (text) => set({
    targetText: text,
    currentInput: '',
    currentPosition: 0,
    errors: [],
    startTime: null,
    isComplete: false
  }),

  handleKeyPress: (key) => {
    const { targetText, currentPosition, errors, startTime } = get();

    if (currentPosition >= targetText.length) return;

    const newStartTime = startTime ?? Date.now();
    const expectedChar = targetText[currentPosition];
    const isCorrect = key === expectedChar;

    set({
      currentInput: get().currentInput + key,
      currentPosition: currentPosition + 1,
      errors: isCorrect ? errors : [...errors, currentPosition],
      startTime: newStartTime,
      isComplete: currentPosition + 1 >= targetText.length,
    });
  },

  reset: () => set({
    currentInput: '',
    currentPosition: 0,
    errors: [],
    startTime: null,
    isComplete: false,
  }),
}));
