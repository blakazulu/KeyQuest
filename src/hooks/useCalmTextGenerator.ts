'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useProgressStore } from '@/stores/useProgressStore';
import {
  generateCalmText,
  generateMoreText,
  shouldGenerateMore,
  type TextGeneratorConfig,
} from '@/lib/calmTextGenerator';

/**
 * Options for the calm text generator hook
 */
export interface UseCalmTextGeneratorOptions {
  /** Initial chunk size in characters (default: 60) */
  initialChunkSize?: number;
  /** Additional chunk size when appending (default: 40) */
  appendChunkSize?: number;
  /** Whether to focus on weak letters (default: true) */
  focusWeakLetters?: boolean;
  /** Threshold for generating more text (default: 0.8 = 80%) */
  appendThreshold?: number;
  /** Callback when text is appended */
  onTextAppended?: (newText: string) => void;
}

/**
 * Return type for the calm text generator hook
 */
export interface UseCalmTextGeneratorReturn {
  /** Current text to type */
  text: string;
  /** Whether text has been initialized */
  isReady: boolean;
  /** Manual trigger to append more text */
  appendMoreText: () => void;
  /** Reset and generate fresh text */
  resetText: () => void;
  /** Check position and auto-append if needed */
  checkAndAppend: (currentPosition: number) => void;
  /** Update the current position (for tracking) */
  updatePosition: (position: number) => void;
  /** Current typing position */
  currentPosition: number;
}

/**
 * Hook for managing endless text generation in Calm Mode
 *
 * Features:
 * - Generates initial text chunk on mount
 * - Auto-appends more text when user reaches threshold
 * - Optionally weights word selection toward weak letters
 * - Seamless concatenation for endless experience
 *
 * @example
 * ```tsx
 * const { text, checkAndAppend, resetText } = useCalmTextGenerator({
 *   focusWeakLetters: true,
 * });
 *
 * // In typing handler:
 * checkAndAppend(cursorPosition);
 * ```
 */
export function useCalmTextGenerator(
  options: UseCalmTextGeneratorOptions = {}
): UseCalmTextGeneratorReturn {
  const {
    initialChunkSize = 60,
    appendChunkSize = 40,
    focusWeakLetters = true,
    appendThreshold = 0.8,
    onTextAppended,
  } = options;

  // Get weak letters from progress store
  const weakLetters = useProgressStore((state) => state.weakLetters);

  // State
  const [text, setText] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  // Track if we've already appended at this threshold
  const lastAppendPositionRef = useRef(0);

  // Build generator config
  const getConfig = useCallback(
    (chunkSize: number): TextGeneratorConfig => ({
      chunkSize,
      weakLetters: focusWeakLetters ? weakLetters : {},
      focusWeakLetters,
    }),
    [focusWeakLetters, weakLetters]
  );

  // Generate initial text on mount
  useEffect(() => {
    const initialText = generateCalmText(getConfig(initialChunkSize));
    setText(initialText);
    setIsReady(true);
    lastAppendPositionRef.current = 0;
  }, [getConfig, initialChunkSize]);

  // Append more text
  const appendMoreText = useCallback(() => {
    const newText = generateMoreText(text, getConfig(appendChunkSize));
    setText((prev) => prev + newText);
    lastAppendPositionRef.current = text.length;
    onTextAppended?.(newText);
  }, [text, getConfig, appendChunkSize, onTextAppended]);

  // Check position and auto-append if threshold reached
  const checkAndAppend = useCallback(
    (position: number) => {
      // Only append if we haven't already at this threshold
      if (
        position > lastAppendPositionRef.current &&
        shouldGenerateMore(position, text.length, appendThreshold)
      ) {
        appendMoreText();
      }
    },
    [text.length, appendThreshold, appendMoreText]
  );

  // Update position tracking
  const updatePosition = useCallback((position: number) => {
    setCurrentPosition(position);
  }, []);

  // Reset and generate fresh text
  const resetText = useCallback(() => {
    const freshText = generateCalmText(getConfig(initialChunkSize));
    setText(freshText);
    setCurrentPosition(0);
    lastAppendPositionRef.current = 0;
  }, [getConfig, initialChunkSize]);

  return {
    text,
    isReady,
    appendMoreText,
    resetText,
    checkAndAppend,
    updatePosition,
    currentPosition,
  };
}
