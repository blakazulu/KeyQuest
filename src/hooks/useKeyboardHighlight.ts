import { useState, useEffect, useCallback } from 'react';
import { getKeyData, getFingerForKey, type Finger } from '@/data/keyboard-layout';

interface UseKeyboardHighlightOptions {
  /** The target text being typed */
  targetText: string;
  /** Current position in the text */
  currentPosition: number;
  /** Whether to track pressed keys */
  trackPressedKeys?: boolean;
}

interface UseKeyboardHighlightReturn {
  /** Character that should be highlighted */
  highlightedKey: string | undefined;
  /** The finger that should be used */
  activeFinger: Finger | undefined;
  /** Set of currently pressed keys */
  pressedKeys: Set<string>;
  /** Key that was just typed correctly (clears after animation) */
  correctKey: string | undefined;
  /** Key that was just typed incorrectly (clears after animation) */
  wrongKey: string | undefined;
  /** Trigger correct key flash */
  flashCorrect: (key: string) => void;
  /** Trigger wrong key flash */
  flashWrong: (key: string) => void;
}

/**
 * Hook for managing keyboard highlight state during typing practice.
 * Tracks which key should be highlighted, pressed keys, and flash effects.
 */
export function useKeyboardHighlight({
  targetText,
  currentPosition,
  trackPressedKeys = true,
}: UseKeyboardHighlightOptions): UseKeyboardHighlightReturn {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [correctKey, setCorrectKey] = useState<string | undefined>();
  const [wrongKey, setWrongKey] = useState<string | undefined>();

  // Get the current character to highlight
  const highlightedKey = currentPosition < targetText.length
    ? targetText[currentPosition]
    : undefined;

  // Get the finger for the highlighted key
  const activeFinger = highlightedKey
    ? getFingerForKey(highlightedKey)
    : undefined;

  // Track key presses
  useEffect(() => {
    if (!trackPressedKeys) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setPressedKeys((prev) => new Set(prev).add(key));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [trackPressedKeys]);

  // Flash correct key
  const flashCorrect = useCallback((key: string) => {
    setCorrectKey(key);
    setTimeout(() => setCorrectKey(undefined), 150);
  }, []);

  // Flash wrong key
  const flashWrong = useCallback((key: string) => {
    setWrongKey(key);
    setTimeout(() => setWrongKey(undefined), 200);
  }, []);

  return {
    highlightedKey,
    activeFinger,
    pressedKeys,
    correctKey,
    wrongKey,
    flashCorrect,
    flashWrong,
  };
}
