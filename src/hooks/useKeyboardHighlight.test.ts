import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardHighlight } from './useKeyboardHighlight';

describe('useKeyboardHighlight', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('highlightedKey', () => {
    it('returns the character at current position', () => {
      const { result } = renderHook(() =>
        useKeyboardHighlight({
          targetText: 'hello',
          currentPosition: 0,
        })
      );

      expect(result.current.highlightedKey).toBe('h');
    });

    it('updates when position changes', () => {
      const { result, rerender } = renderHook(
        ({ position }) =>
          useKeyboardHighlight({
            targetText: 'hello',
            currentPosition: position,
          }),
        { initialProps: { position: 0 } }
      );

      expect(result.current.highlightedKey).toBe('h');

      rerender({ position: 1 });
      expect(result.current.highlightedKey).toBe('e');

      rerender({ position: 2 });
      expect(result.current.highlightedKey).toBe('l');
    });

    it('returns undefined when position exceeds text length', () => {
      const { result } = renderHook(() =>
        useKeyboardHighlight({
          targetText: 'hi',
          currentPosition: 5,
        })
      );

      expect(result.current.highlightedKey).toBeUndefined();
    });

    it('handles empty text', () => {
      const { result } = renderHook(() =>
        useKeyboardHighlight({
          targetText: '',
          currentPosition: 0,
        })
      );

      expect(result.current.highlightedKey).toBeUndefined();
    });
  });

  describe('activeFinger', () => {
    it('returns correct finger for home row keys', () => {
      const { result } = renderHook(() =>
        useKeyboardHighlight({
          targetText: 'fj',
          currentPosition: 0,
        })
      );

      expect(result.current.activeFinger).toBe('left-index');
    });

    it('returns thumb for space', () => {
      const { result } = renderHook(() =>
        useKeyboardHighlight({
          targetText: ' ',
          currentPosition: 0,
        })
      );

      expect(result.current.activeFinger).toBe('thumb');
    });

    it('returns undefined when no key is highlighted', () => {
      const { result } = renderHook(() =>
        useKeyboardHighlight({
          targetText: 'hi',
          currentPosition: 10,
        })
      );

      expect(result.current.activeFinger).toBeUndefined();
    });
  });

  describe('flashCorrect', () => {
    it('sets correctKey and clears after timeout', () => {
      const { result } = renderHook(() =>
        useKeyboardHighlight({
          targetText: 'hello',
          currentPosition: 0,
        })
      );

      expect(result.current.correctKey).toBeUndefined();

      act(() => {
        result.current.flashCorrect('h');
      });

      expect(result.current.correctKey).toBe('h');

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(result.current.correctKey).toBeUndefined();
    });
  });

  describe('flashWrong', () => {
    it('sets wrongKey and clears after timeout', () => {
      const { result } = renderHook(() =>
        useKeyboardHighlight({
          targetText: 'hello',
          currentPosition: 0,
        })
      );

      expect(result.current.wrongKey).toBeUndefined();

      act(() => {
        result.current.flashWrong('x');
      });

      expect(result.current.wrongKey).toBe('x');

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(result.current.wrongKey).toBeUndefined();
    });
  });

  describe('pressedKeys tracking', () => {
    it('initializes with empty set', () => {
      const { result } = renderHook(() =>
        useKeyboardHighlight({
          targetText: 'hello',
          currentPosition: 0,
          trackPressedKeys: true,
        })
      );

      expect(result.current.pressedKeys.size).toBe(0);
    });

    it('tracks keydown events when enabled', () => {
      const { result } = renderHook(() =>
        useKeyboardHighlight({
          targetText: 'hello',
          currentPosition: 0,
          trackPressedKeys: true,
        })
      );

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      });

      expect(result.current.pressedKeys.has('a')).toBe(true);
    });

    it('removes key on keyup', () => {
      const { result } = renderHook(() =>
        useKeyboardHighlight({
          targetText: 'hello',
          currentPosition: 0,
          trackPressedKeys: true,
        })
      );

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      });

      expect(result.current.pressedKeys.has('a')).toBe(true);

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
      });

      expect(result.current.pressedKeys.has('a')).toBe(false);
    });

    it('does not track keys when disabled', () => {
      const { result } = renderHook(() =>
        useKeyboardHighlight({
          targetText: 'hello',
          currentPosition: 0,
          trackPressedKeys: false,
        })
      );

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      });

      expect(result.current.pressedKeys.has('a')).toBe(false);
    });

    it('normalizes keys to lowercase', () => {
      const { result } = renderHook(() =>
        useKeyboardHighlight({
          targetText: 'hello',
          currentPosition: 0,
          trackPressedKeys: true,
        })
      );

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'A' }));
      });

      expect(result.current.pressedKeys.has('a')).toBe(true);
      expect(result.current.pressedKeys.has('A')).toBe(false);
    });
  });
});
