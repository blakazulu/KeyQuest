import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardInput } from './useKeyboardInput';

describe('useKeyboardInput', () => {
  const dispatchKeyEvent = (key: string, options: Partial<KeyboardEventInit> = {}) => {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      ...options,
    });
    window.dispatchEvent(event);
    return event;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('character input', () => {
    it('should call onKeyPress for printable characters', () => {
      const onKeyPress = vi.fn();
      renderHook(() => useKeyboardInput({ onKeyPress, enabled: true }));

      dispatchKeyEvent('a');
      expect(onKeyPress).toHaveBeenCalledWith('a');

      dispatchKeyEvent('Z');
      expect(onKeyPress).toHaveBeenCalledWith('Z');

      dispatchKeyEvent('5');
      expect(onKeyPress).toHaveBeenCalledWith('5');
    });

    it('should call onKeyPress for space', () => {
      const onKeyPress = vi.fn();
      renderHook(() => useKeyboardInput({ onKeyPress, enabled: true }));

      dispatchKeyEvent(' ');
      expect(onKeyPress).toHaveBeenCalledWith(' ');
    });

    it('should call onKeyPress for punctuation', () => {
      const onKeyPress = vi.fn();
      renderHook(() => useKeyboardInput({ onKeyPress, enabled: true }));

      dispatchKeyEvent('.');
      expect(onKeyPress).toHaveBeenCalledWith('.');

      dispatchKeyEvent(',');
      expect(onKeyPress).toHaveBeenCalledWith(',');

      dispatchKeyEvent(';');
      expect(onKeyPress).toHaveBeenCalledWith(';');
    });
  });

  describe('control keys', () => {
    it('should call onEnter when Enter is pressed', () => {
      const onEnter = vi.fn();
      renderHook(() => useKeyboardInput({ onEnter, enabled: true }));

      dispatchKeyEvent('Enter');
      expect(onEnter).toHaveBeenCalledTimes(1);
    });

    it('should call onEscape when Escape is pressed', () => {
      const onEscape = vi.fn();
      renderHook(() => useKeyboardInput({ onEscape, enabled: true }));

      dispatchKeyEvent('Escape');
      expect(onEscape).toHaveBeenCalledTimes(1);
    });

    it('should call onBackspace when Backspace is pressed and allowed', () => {
      const onBackspace = vi.fn();
      renderHook(() =>
        useKeyboardInput({ onBackspace, allowBackspace: true, enabled: true })
      );

      dispatchKeyEvent('Backspace');
      expect(onBackspace).toHaveBeenCalledTimes(1);
    });

    it('should NOT call onBackspace when allowBackspace is false', () => {
      const onBackspace = vi.fn();
      renderHook(() =>
        useKeyboardInput({ onBackspace, allowBackspace: false, enabled: true })
      );

      dispatchKeyEvent('Backspace');
      expect(onBackspace).not.toHaveBeenCalled();
    });
  });

  describe('enabled state', () => {
    it('should not call any callbacks when disabled', () => {
      const onKeyPress = vi.fn();
      const onEnter = vi.fn();
      const onEscape = vi.fn();
      renderHook(() =>
        useKeyboardInput({
          onKeyPress,
          onEnter,
          onEscape,
          enabled: false,
        })
      );

      dispatchKeyEvent('a');
      dispatchKeyEvent('Enter');
      dispatchKeyEvent('Escape');

      expect(onKeyPress).not.toHaveBeenCalled();
      expect(onEnter).not.toHaveBeenCalled();
      expect(onEscape).not.toHaveBeenCalled();
    });

    it('should respond when re-enabled', () => {
      const onKeyPress = vi.fn();
      const { rerender } = renderHook(
        ({ enabled }) => useKeyboardInput({ onKeyPress, enabled }),
        { initialProps: { enabled: false } }
      );

      dispatchKeyEvent('a');
      expect(onKeyPress).not.toHaveBeenCalled();

      rerender({ enabled: true });
      dispatchKeyEvent('b');
      expect(onKeyPress).toHaveBeenCalledWith('b');
    });
  });

  describe('modifier key filtering', () => {
    it('should ignore characters when Ctrl is held', () => {
      const onKeyPress = vi.fn();
      renderHook(() => useKeyboardInput({ onKeyPress, enabled: true }));

      dispatchKeyEvent('c', { ctrlKey: true });
      expect(onKeyPress).not.toHaveBeenCalled();
    });

    it('should ignore characters when Alt is held', () => {
      const onKeyPress = vi.fn();
      renderHook(() => useKeyboardInput({ onKeyPress, enabled: true }));

      dispatchKeyEvent('a', { altKey: true });
      expect(onKeyPress).not.toHaveBeenCalled();
    });

    it('should ignore characters when Meta is held', () => {
      const onKeyPress = vi.fn();
      renderHook(() => useKeyboardInput({ onKeyPress, enabled: true }));

      dispatchKeyEvent('a', { metaKey: true });
      expect(onKeyPress).not.toHaveBeenCalled();
    });
  });

  describe('non-printable key filtering', () => {
    it('should ignore Shift key alone', () => {
      const onKeyPress = vi.fn();
      renderHook(() => useKeyboardInput({ onKeyPress, enabled: true }));

      dispatchKeyEvent('Shift');
      expect(onKeyPress).not.toHaveBeenCalled();
    });

    it('should ignore Tab key', () => {
      const onKeyPress = vi.fn();
      renderHook(() => useKeyboardInput({ onKeyPress, enabled: true }));

      dispatchKeyEvent('Tab');
      expect(onKeyPress).not.toHaveBeenCalled();
    });

    it('should ignore Arrow keys', () => {
      const onKeyPress = vi.fn();
      renderHook(() => useKeyboardInput({ onKeyPress, enabled: true }));

      dispatchKeyEvent('ArrowLeft');
      dispatchKeyEvent('ArrowRight');
      dispatchKeyEvent('ArrowUp');
      dispatchKeyEvent('ArrowDown');
      expect(onKeyPress).not.toHaveBeenCalled();
    });

    it('should ignore function keys', () => {
      const onKeyPress = vi.fn();
      renderHook(() => useKeyboardInput({ onKeyPress, enabled: true }));

      dispatchKeyEvent('F1');
      dispatchKeyEvent('F12');
      expect(onKeyPress).not.toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should remove event listener on unmount', () => {
      const onKeyPress = vi.fn();
      const { unmount } = renderHook(() =>
        useKeyboardInput({ onKeyPress, enabled: true })
      );

      dispatchKeyEvent('a');
      expect(onKeyPress).toHaveBeenCalledTimes(1);

      unmount();

      dispatchKeyEvent('b');
      expect(onKeyPress).toHaveBeenCalledTimes(1); // should still be 1
    });
  });
});
