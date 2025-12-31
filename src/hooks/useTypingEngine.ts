import { useCallback, useMemo } from 'react';
import { useTypingStore } from '@/stores/useTypingStore';
import { useKeyboardInput } from './useKeyboardInput';
import { calculateWPM, calculateAccuracy, calculateNetWPM } from '@/lib/typing-utils';

export type TypingSessionStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface CharacterState {
  char: string;
  status: 'pending' | 'current' | 'correct' | 'incorrect';
  index: number;
}

export interface TypingStats {
  /** Gross words per minute (total characters / 5 / minutes) */
  wpm: number;
  /** Net WPM (accounts for errors) */
  netWpm: number;
  /** Accuracy percentage (0-100) */
  accuracy: number;
  /** Total correct keystrokes */
  correctCount: number;
  /** Total incorrect keystrokes */
  errorCount: number;
  /** Time elapsed in milliseconds */
  elapsedTime: number;
  /** Characters typed */
  charactersTyped: number;
  /** Total characters in target */
  totalCharacters: number;
}

export interface UseTypingEngineOptions {
  /** Called when a character is typed (correct or incorrect) */
  onCharacterTyped?: (char: string, isCorrect: boolean) => void;
  /** Called when the session is completed */
  onComplete?: (stats: TypingStats) => void;
  /** Called when an error occurs */
  onError?: (char: string, expected: string) => void;
  /** Whether to allow backspace corrections */
  allowBackspace?: boolean;
}

export interface UseTypingEngineReturn {
  /** Current session status */
  status: TypingSessionStatus;
  /** Array of character states for rendering */
  characters: CharacterState[];
  /** Current typing statistics */
  stats: TypingStats;
  /** Current cursor position */
  cursorPosition: number;
  /** Whether input is currently enabled */
  isInputEnabled: boolean;
  /** Start or resume the typing session */
  start: () => void;
  /** Pause the typing session */
  pause: () => void;
  /** Reset the session with optional new text */
  reset: (newText?: string) => void;
  /** Set the target text */
  setTargetText: (text: string) => void;
}

/**
 * Core typing engine hook that manages the entire typing session.
 * Handles keystroke processing, statistics calculation, and session state.
 *
 * @example
 * ```tsx
 * const { characters, stats, status, start, reset } = useTypingEngine({
 *   onComplete: (stats) => console.log('Finished!', stats),
 *   onError: (char, expected) => playErrorSound(),
 * });
 * ```
 */
export function useTypingEngine({
  onCharacterTyped,
  onComplete,
  onError,
  allowBackspace = false,
}: UseTypingEngineOptions = {}): UseTypingEngineReturn {
  const {
    targetText,
    currentPosition,
    errors,
    startTime,
    isComplete,
    isPaused,
    setTargetText,
    handleKeyPress: storeHandleKeyPress,
    handleBackspace: storeHandleBackspace,
    reset: storeReset,
    pause: storePause,
    resume: storeResume,
    start: storeStart,
  } = useTypingStore();

  // Calculate current session status
  const status: TypingSessionStatus = useMemo(() => {
    if (isComplete) return 'completed';
    if (isPaused) return 'paused';
    if (startTime !== null) return 'running';
    return 'idle';
  }, [isComplete, isPaused, startTime]);

  // Calculate elapsed time
  const elapsedTime = useMemo(() => {
    if (!startTime) return 0;
    if (isComplete) {
      // Use the stored end time or calculate from now
      return Date.now() - startTime;
    }
    return Date.now() - startTime;
  }, [startTime, isComplete]);

  // Calculate statistics
  const stats: TypingStats = useMemo(() => {
    const correctCount = currentPosition - errors.length;
    const errorCount = errors.length;
    const accuracy = calculateAccuracy(correctCount, currentPosition);
    const wpm = calculateWPM(currentPosition, elapsedTime);
    const netWpm = calculateNetWPM(currentPosition, errorCount, elapsedTime);

    return {
      wpm,
      netWpm,
      accuracy,
      correctCount,
      errorCount,
      elapsedTime,
      charactersTyped: currentPosition,
      totalCharacters: targetText.length,
    };
  }, [currentPosition, errors.length, elapsedTime, targetText.length]);

  // Build character states for rendering
  const characters: CharacterState[] = useMemo(() => {
    return targetText.split('').map((char, index) => {
      let charStatus: CharacterState['status'];

      if (index < currentPosition) {
        charStatus = errors.includes(index) ? 'incorrect' : 'correct';
      } else if (index === currentPosition) {
        charStatus = 'current';
      } else {
        charStatus = 'pending';
      }

      return { char, status: charStatus, index };
    });
  }, [targetText, currentPosition, errors]);

  // Handle character input
  const handleKeyPress = useCallback((key: string) => {
    if (isComplete || isPaused) return;

    const expected = targetText[currentPosition];
    const isCorrect = key === expected;

    storeHandleKeyPress(key);
    onCharacterTyped?.(key, isCorrect);

    if (!isCorrect) {
      onError?.(key, expected);
    }

    // Check if just completed
    if (currentPosition + 1 >= targetText.length) {
      // Will trigger on next render with updated stats
      setTimeout(() => {
        const finalStats = useTypingStore.getState();
        const correctCount = finalStats.currentPosition - finalStats.errors.length;
        const elapsed = Date.now() - (finalStats.startTime ?? Date.now());

        onComplete?.({
          wpm: calculateWPM(finalStats.currentPosition, elapsed),
          netWpm: calculateNetWPM(finalStats.currentPosition, finalStats.errors.length, elapsed),
          accuracy: calculateAccuracy(correctCount, finalStats.currentPosition),
          correctCount,
          errorCount: finalStats.errors.length,
          elapsedTime: elapsed,
          charactersTyped: finalStats.currentPosition,
          totalCharacters: finalStats.targetText.length,
        });
      }, 0);
    }
  }, [isComplete, isPaused, targetText, currentPosition, storeHandleKeyPress, onCharacterTyped, onError, onComplete]);

  // Handle backspace
  const handleBackspace = useCallback(() => {
    if (isComplete || isPaused || !allowBackspace) return;
    storeHandleBackspace();
  }, [isComplete, isPaused, allowBackspace, storeHandleBackspace]);

  // Determine if input should be enabled
  const isInputEnabled = status === 'running' || status === 'idle';

  // Setup keyboard input
  useKeyboardInput({
    onKeyPress: handleKeyPress,
    onBackspace: handleBackspace,
    enabled: isInputEnabled && targetText.length > 0,
    allowBackspace,
  });

  // Control functions
  const start = useCallback(() => {
    if (status === 'paused') {
      storeResume();
    } else if (status === 'idle') {
      storeStart();
    }
  }, [status, storeResume, storeStart]);

  const pause = useCallback(() => {
    if (status === 'running') {
      storePause();
    }
  }, [status, storePause]);

  const reset = useCallback((newText?: string) => {
    storeReset();
    if (newText !== undefined) {
      setTargetText(newText);
    }
  }, [storeReset, setTargetText]);

  return {
    status,
    characters,
    stats,
    cursorPosition: currentPosition,
    isInputEnabled,
    start,
    pause,
    reset,
    setTargetText,
  };
}
