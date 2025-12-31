import { useEffect, useCallback, useRef } from 'react';

interface UseKeyboardInputOptions {
  /** Called when a valid character key is pressed */
  onKeyPress?: (key: string) => void;
  /** Called when backspace is pressed (if enabled) */
  onBackspace?: () => void;
  /** Called when Enter is pressed */
  onEnter?: () => void;
  /** Called when Escape is pressed */
  onEscape?: () => void;
  /** Whether to capture keyboard input */
  enabled?: boolean;
  /** Whether to allow backspace for corrections */
  allowBackspace?: boolean;
  /** Element to attach listener to (defaults to window) */
  targetRef?: React.RefObject<HTMLElement>;
}

interface UseKeyboardInputReturn {
  /** Manually focus the input capture */
  focus: () => void;
}

/**
 * Hook for capturing keyboard input during typing practice.
 * Handles character keys, backspace, and control keys (Enter, Escape).
 *
 * @example
 * ```tsx
 * useKeyboardInput({
 *   onKeyPress: (key) => handleTyping(key),
 *   onBackspace: () => handleBackspace(),
 *   onEnter: () => startPractice(),
 *   onEscape: () => pausePractice(),
 *   enabled: isPracticing,
 * });
 * ```
 */
export function useKeyboardInput({
  onKeyPress,
  onBackspace,
  onEnter,
  onEscape,
  enabled = true,
  allowBackspace = false,
  targetRef,
}: UseKeyboardInputOptions = {}): UseKeyboardInputReturn {
  const callbacksRef = useRef({ onKeyPress, onBackspace, onEnter, onEscape });

  // Keep callbacks ref updated to avoid stale closures
  useEffect(() => {
    callbacksRef.current = { onKeyPress, onBackspace, onEnter, onEscape };
  }, [onKeyPress, onBackspace, onEnter, onEscape]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore if input is disabled
    if (!enabled) return;

    // Ignore if user is typing in an actual input/textarea
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    const { key, ctrlKey, altKey, metaKey } = event;
    const callbacks = callbacksRef.current;

    // Handle control keys
    if (key === 'Enter') {
      event.preventDefault();
      callbacks.onEnter?.();
      return;
    }

    if (key === 'Escape') {
      event.preventDefault();
      callbacks.onEscape?.();
      return;
    }

    if (key === 'Backspace' && allowBackspace) {
      event.preventDefault();
      callbacks.onBackspace?.();
      return;
    }

    // Ignore modifier key combinations (Ctrl+C, etc.)
    if (ctrlKey || altKey || metaKey) {
      return;
    }

    // Ignore non-printable keys
    if (key.length !== 1) {
      return;
    }

    // Valid character key - prevent default and handle
    event.preventDefault();
    callbacks.onKeyPress?.(key);
  }, [enabled, allowBackspace]);

  useEffect(() => {
    const target = targetRef?.current ?? window;

    target.addEventListener('keydown', handleKeyDown as EventListener);

    return () => {
      target.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [handleKeyDown, targetRef]);

  const focus = useCallback(() => {
    if (targetRef?.current) {
      targetRef.current.focus();
    }
  }, [targetRef]);

  return { focus };
}
