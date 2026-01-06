import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { useTypingStore } from '@/stores/useTypingStore';
import { useKeyboardInput } from './useKeyboardInput';
import { calculateWPM, calculateAccuracy, calculateNetWPM } from '@/lib/typing-utils';
import type { KeyboardLayoutType } from '@/data/keyboard-layout';

export type TypingSessionStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface CharacterState {
  char: string;
  status: 'pending' | 'current' | 'correct' | 'incorrect';
  index: number;
}

export interface LetterStats {
  correct: number;
  total: number;
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
  /** Per-letter accuracy for weak letter tracking */
  letterAccuracy: Record<string, LetterStats>;
}

export interface UseTypingEngineOptions {
  /** Called when a character is typed (correct or incorrect) */
  onCharacterTyped?: (char: string, isCorrect: boolean) => void;
  /** Called when the session is completed */
  onComplete?: (stats: TypingStats) => void;
  /** Called when an error occurs */
  onError?: (char: string, expected: string) => void;
  /** Called when Ctrl+R is pressed to reset */
  onReset?: () => void;
  /** Whether to allow backspace corrections */
  allowBackspace?: boolean;
  /** Whether typing is case-sensitive (default: false for easier levels) */
  caseSensitive?: boolean;
  /** Expected keyboard layout - if set, will detect mismatches */
  expectedLayout?: KeyboardLayoutType;
  /** Called when user types in wrong keyboard language */
  onLayoutMismatch?: (detectedLayout: KeyboardLayoutType) => void;
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
  /** Update target text without resetting position (for endless mode) */
  updateTargetText: (text: string) => void;
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
  onReset,
  allowBackspace = false,
  caseSensitive = false,
  expectedLayout,
  onLayoutMismatch,
}: UseTypingEngineOptions = {}): UseTypingEngineReturn {
  const {
    targetText,
    currentPosition,
    errors,
    startTime,
    endTime,
    isComplete,
    isPaused,
    setTargetText,
    updateTargetText,
    handleKeyPress: storeHandleKeyPress,
    handleBackspace: storeHandleBackspace,
    reset: storeReset,
    pause: storePause,
    resume: storeResume,
    start: storeStart,
  } = useTypingStore();

  // Track per-letter accuracy for weak letter detection
  const letterAccuracyRef = useRef<Record<string, LetterStats>>({});

  // Calculate current session status
  const status: TypingSessionStatus = useMemo(() => {
    if (isComplete) return 'completed';
    if (isPaused) return 'paused';
    if (startTime !== null) return 'running';
    return 'idle';
  }, [isComplete, isPaused, startTime]);

  // Track elapsed time with state, updated via effect
  const [elapsedTime, setElapsedTime] = useState(0);

  // Update elapsed time when relevant state changes
  useEffect(() => {
    if (!startTime) {
      setElapsedTime(0);
      return;
    }

    if (isComplete && endTime) {
      // Use stored end time for completed sessions
      setElapsedTime(endTime - startTime);
      return;
    }

    if (isPaused) {
      // Don't update during pause
      return;
    }

    // For running sessions, update time periodically
    const updateTime = () => {
      setElapsedTime(Date.now() - startTime);
    };

    // Update immediately
    updateTime();

    // Then update every 100ms for smooth display
    const interval = setInterval(updateTime, 100);

    return () => clearInterval(interval);
  }, [startTime, endTime, isComplete, isPaused]);

  // Calculate statistics
  const stats: TypingStats = useMemo(() => {
    const correctCount = currentPosition - errors.length;
    const errorCount = errors.length;
    const accuracy = calculateAccuracy(correctCount, currentPosition);
    // WPM based on correct characters only (errors don't count toward speed)
    const wpm = calculateWPM(correctCount, elapsedTime);
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
      letterAccuracy: { ...letterAccuracyRef.current },
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
    const isCorrect = caseSensitive
      ? key === expected
      : key.toLowerCase() === expected.toLowerCase();

    // Track per-letter accuracy (for Latin a-z and Hebrew א-ת characters)
    const letterKey = expected.toLowerCase();
    // Match Latin letters (a-z) and Hebrew letters (U+05D0-U+05EA: Aleph to Tav)
    if (/^[a-z\u05D0-\u05EA]$/.test(letterKey)) {
      const current = letterAccuracyRef.current[letterKey] || { correct: 0, total: 0 };
      letterAccuracyRef.current[letterKey] = {
        correct: current.correct + (isCorrect ? 1 : 0),
        total: current.total + 1,
      };
    }

    storeHandleKeyPress(key, isCorrect);
    onCharacterTyped?.(key, isCorrect);

    if (!isCorrect) {
      onError?.(key, expected);
    }

    // Check if just completed
    if (currentPosition + 1 >= targetText.length) {
      // Capture the completion time immediately before setTimeout
      const completionTime = Date.now();
      const capturedStartTime = useTypingStore.getState().startTime;

      // Will trigger on next render with updated stats
      setTimeout(() => {
        const finalStats = useTypingStore.getState();

        // Guard: If store was reset (startTime is null but we had a valid start),
        // use the captured values to avoid 0 WPM/accuracy
        const startTime = finalStats.startTime ?? capturedStartTime ?? completionTime;
        const elapsed = completionTime - startTime;

        // Guard: If position is 0, the store was likely reset - skip callback
        if (finalStats.currentPosition === 0 && finalStats.targetText.length === 0) {
          return;
        }

        const correctCount = finalStats.currentPosition - finalStats.errors.length;

        // Ensure we have valid elapsed time (at least 100ms to avoid extreme WPM)
        const safeElapsed = Math.max(elapsed, 100);

        onComplete?.({
          // WPM based on correct characters only (errors don't count toward speed)
          wpm: calculateWPM(correctCount, safeElapsed),
          netWpm: calculateNetWPM(finalStats.currentPosition, finalStats.errors.length, safeElapsed),
          accuracy: calculateAccuracy(correctCount, finalStats.currentPosition),
          correctCount,
          errorCount: finalStats.errors.length,
          elapsedTime: safeElapsed,
          charactersTyped: finalStats.currentPosition,
          totalCharacters: finalStats.targetText.length,
          letterAccuracy: { ...letterAccuracyRef.current },
        });
      }, 0);
    }
  }, [isComplete, isPaused, targetText, currentPosition, storeHandleKeyPress, onCharacterTyped, onError, onComplete, caseSensitive]);

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
    onReset,
    enabled: isInputEnabled && targetText.length > 0,
    allowBackspace,
    expectedLayout,
    onLayoutMismatch,
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
    letterAccuracyRef.current = {}; // Clear per-letter tracking
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
    updateTargetText,
  };
}
