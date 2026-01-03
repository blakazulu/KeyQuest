/**
 * useTargetedPractice Hook
 * Manages state and logic for Problem Letters practice mode
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useProgressStore } from '@/stores/useProgressStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import {
  generateInitialTargetedText,
  generateMoreTargetedText,
  shouldGenerateMoreTargeted,
  type TargetedTextConfig,
} from '@/lib/targetedTextGenerator';
import type { LetterStats } from './useTypingEngine';

export type PracticeStatus = 'idle' | 'ready' | 'running' | 'paused' | 'completed';

interface TargetedPracticeState {
  /** Current practice status */
  status: PracticeStatus;
  /** Text to type */
  text: string;
  /** Characters typed in this session */
  charactersTyped: number;
  /** Current session stats */
  sessionStats: {
    accuracy: number;
    wpm: number;
    letterAccuracy: Record<string, LetterStats>;
  };
  /** Letters being targeted */
  targetLetters: string[];
  /** XP earned (50% rate) */
  xpEarned: number;
}

interface UseTargetedPracticeReturn extends TargetedPracticeState {
  /** Start a new practice session */
  startSession: (letters: string[]) => void;
  /** Pause the session */
  pause: () => void;
  /** Resume the session */
  resume: () => void;
  /** End the session and save progress */
  endSession: () => void;
  /** Reset for a new session */
  reset: () => void;
  /** Update stats from typing engine */
  updateStats: (stats: {
    accuracy: number;
    wpm: number;
    letterAccuracy: Record<string, LetterStats>;
  }) => void;
  /** Update character count and check for text append */
  updateProgress: (cursorPosition: number) => void;
  /** Check and append more text if needed */
  checkAndAppend: (cursorPosition: number) => void;
}

/**
 * XP rate for Problem Letters practice (50% of normal)
 */
const XP_RATE = 0.5;

/**
 * Base XP per 100 characters
 */
const BASE_XP_PER_100_CHARS = 5;

/**
 * Update weak letters every N characters
 */
const WEAK_LETTER_UPDATE_INTERVAL = 50;

export function useTargetedPractice(): UseTargetedPracticeReturn {
  const [state, setState] = useState<TargetedPracticeState>({
    status: 'idle',
    text: '',
    charactersTyped: 0,
    sessionStats: {
      accuracy: 0,
      wpm: 0,
      letterAccuracy: {},
    },
    targetLetters: [],
    xpEarned: 0,
  });

  // Store refs
  const weakLetters = useProgressStore((s) => s.weakLetters);
  const updateWeakLetter = useProgressStore((s) => s.updateWeakLetter);
  const recordLetterHistory = useProgressStore((s) => s.recordLetterHistory);
  const addExerciseXp = useProgressStore((s) => s.addExerciseXp);
  const ageGroup = useSettingsStore((s) => s.ageGroup);

  // Track last weak letter update position
  const lastWeakLetterUpdateRef = useRef(0);

  // Generate config for text generation
  const getConfig = useCallback(
    (targetLetters: string[]): TargetedTextConfig => ({
      weakLetters,
      ageGroup,
      targetLetters: targetLetters.length > 0 ? targetLetters : undefined,
      chunkSize: 60,
      weakLetterWeight: 0.7,
    }),
    [weakLetters, ageGroup]
  );

  // Start a new practice session
  const startSession = useCallback(
    (letters: string[]) => {
      const config = getConfig(letters);
      const initialText = generateInitialTargetedText(config, 3);

      setState({
        status: 'ready',
        text: initialText,
        charactersTyped: 0,
        sessionStats: {
          accuracy: 0,
          wpm: 0,
          letterAccuracy: {},
        },
        targetLetters: letters,
        xpEarned: 0,
      });

      lastWeakLetterUpdateRef.current = 0;
    },
    [getConfig]
  );

  // Pause the session
  const pause = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'paused',
    }));
  }, []);

  // Resume the session
  const resume = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'running',
    }));
  }, []);

  // End the session and save progress
  const endSession = useCallback(() => {
    const { sessionStats, charactersTyped, targetLetters } = state;

    // Record letter history
    if (Object.keys(sessionStats.letterAccuracy).length > 0) {
      recordLetterHistory(sessionStats.letterAccuracy, 'problem-letters');

      // Update weak letters one final time
      for (const [letter, stats] of Object.entries(sessionStats.letterAccuracy)) {
        if (stats.total > 0) {
          const accuracy = (stats.correct / stats.total) * 100;
          updateWeakLetter(letter, accuracy);
        }
      }
    }

    // Calculate and award XP (50% rate)
    const baseXp = Math.floor((charactersTyped / 100) * BASE_XP_PER_100_CHARS);
    const xpToAward = Math.floor(baseXp * XP_RATE);

    if (xpToAward > 0) {
      addExerciseXp(xpToAward);
    }

    setState((prev) => ({
      ...prev,
      status: 'completed',
      xpEarned: xpToAward,
    }));
  }, [state, recordLetterHistory, updateWeakLetter, addExerciseXp]);

  // Reset for a new session
  const reset = useCallback(() => {
    setState({
      status: 'idle',
      text: '',
      charactersTyped: 0,
      sessionStats: {
        accuracy: 0,
        wpm: 0,
        letterAccuracy: {},
      },
      targetLetters: [],
      xpEarned: 0,
    });
    lastWeakLetterUpdateRef.current = 0;
  }, []);

  // Update stats from typing engine
  const updateStats = useCallback(
    (stats: {
      accuracy: number;
      wpm: number;
      letterAccuracy: Record<string, LetterStats>;
    }) => {
      setState((prev) => ({
        ...prev,
        status: prev.status === 'ready' ? 'running' : prev.status,
        sessionStats: stats,
      }));
    },
    []
  );

  // Update progress and check for text append
  const updateProgress = useCallback((cursorPosition: number) => {
    setState((prev) => ({
      ...prev,
      charactersTyped: cursorPosition,
    }));
  }, []);

  // Check and append more text if needed
  const checkAndAppend = useCallback(
    (cursorPosition: number) => {
      const { text, targetLetters, status } = state;

      if (status !== 'running') return;

      if (shouldGenerateMoreTargeted(cursorPosition, text.length, 0.8)) {
        const config = getConfig(targetLetters);
        const moreText = generateMoreTargetedText(text, config);

        setState((prev) => ({
          ...prev,
          text: prev.text + moreText,
        }));
      }
    },
    [state, getConfig]
  );

  // Periodically update weak letters during practice
  useEffect(() => {
    const { status, charactersTyped, sessionStats } = state;

    if (
      status === 'running' &&
      charactersTyped - lastWeakLetterUpdateRef.current >= WEAK_LETTER_UPDATE_INTERVAL &&
      Object.keys(sessionStats.letterAccuracy).length > 0
    ) {
      for (const [letter, stats] of Object.entries(sessionStats.letterAccuracy)) {
        if (stats.total > 0) {
          const accuracy = (stats.correct / stats.total) * 100;
          updateWeakLetter(letter, accuracy);
        }
      }
      lastWeakLetterUpdateRef.current = charactersTyped;
    }
  }, [state, updateWeakLetter]);

  return {
    ...state,
    startSession,
    pause,
    resume,
    endSession,
    reset,
    updateStats,
    updateProgress,
    checkAndAppend,
  };
}
