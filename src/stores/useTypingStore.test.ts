import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTypingStore } from './useTypingStore';

describe('useTypingStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useTypingStore.getState().reset();
    useTypingStore.setState({ targetText: '' });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('setTargetText', () => {
    it('should set target text and reset state', () => {
      const { setTargetText } = useTypingStore.getState();

      setTargetText('Hello World');

      const state = useTypingStore.getState();
      expect(state.targetText).toBe('Hello World');
      expect(state.currentInput).toBe('');
      expect(state.currentPosition).toBe(0);
      expect(state.errors).toEqual([]);
      expect(state.isComplete).toBe(false);
      expect(state.isPaused).toBe(false);
    });
  });

  describe('handleKeyPress', () => {
    it('should advance position on correct key', () => {
      const { setTargetText, handleKeyPress } = useTypingStore.getState();
      setTargetText('abc');

      handleKeyPress('a');

      const state = useTypingStore.getState();
      expect(state.currentPosition).toBe(1);
      expect(state.currentInput).toBe('a');
      expect(state.errors).toEqual([]);
    });

    it('should record error on incorrect key', () => {
      const { setTargetText, handleKeyPress } = useTypingStore.getState();
      setTargetText('abc');

      handleKeyPress('x'); // wrong key

      const state = useTypingStore.getState();
      expect(state.currentPosition).toBe(1);
      expect(state.currentInput).toBe('x');
      expect(state.errors).toEqual([0]); // error at position 0
    });

    it('should start timer on first keypress', () => {
      const { setTargetText, handleKeyPress } = useTypingStore.getState();
      setTargetText('abc');

      vi.setSystemTime(new Date(1000));
      handleKeyPress('a');

      const state = useTypingStore.getState();
      expect(state.startTime).toBe(1000);
    });

    it('should set isComplete when reaching end', () => {
      const { setTargetText, handleKeyPress } = useTypingStore.getState();
      setTargetText('ab');

      handleKeyPress('a');
      handleKeyPress('b');

      const state = useTypingStore.getState();
      expect(state.isComplete).toBe(true);
      expect(state.endTime).not.toBeNull();
    });

    it('should not process keypresses when complete', () => {
      const { setTargetText, handleKeyPress } = useTypingStore.getState();
      setTargetText('a');

      handleKeyPress('a'); // completes
      handleKeyPress('b'); // should be ignored

      const state = useTypingStore.getState();
      expect(state.currentPosition).toBe(1);
      expect(state.currentInput).toBe('a');
    });

    it('should not process keypresses when paused', () => {
      const { setTargetText, handleKeyPress, pause, start } = useTypingStore.getState();
      setTargetText('abc');

      start();
      handleKeyPress('a');
      pause();
      handleKeyPress('b'); // should be ignored

      const state = useTypingStore.getState();
      expect(state.currentPosition).toBe(1);
      expect(state.currentInput).toBe('a');
    });
  });

  describe('handleBackspace', () => {
    it('should go back one position', () => {
      const { setTargetText, handleKeyPress, handleBackspace } = useTypingStore.getState();
      setTargetText('abc');

      handleKeyPress('a');
      handleKeyPress('b');
      handleBackspace();

      const state = useTypingStore.getState();
      expect(state.currentPosition).toBe(1);
      expect(state.currentInput).toBe('a');
    });

    it('should remove error when backspacing over it', () => {
      const { setTargetText, handleKeyPress, handleBackspace } = useTypingStore.getState();
      setTargetText('abc');

      handleKeyPress('x'); // wrong - error at 0
      handleBackspace();

      const state = useTypingStore.getState();
      expect(state.errors).toEqual([]);
    });

    it('should not go below position 0', () => {
      const { setTargetText, handleBackspace } = useTypingStore.getState();
      setTargetText('abc');

      handleBackspace();
      handleBackspace();

      const state = useTypingStore.getState();
      expect(state.currentPosition).toBe(0);
    });

    it('should not work when paused', () => {
      const { setTargetText, handleKeyPress, handleBackspace, pause, start } = useTypingStore.getState();
      setTargetText('abc');

      start();
      handleKeyPress('a');
      pause();
      handleBackspace();

      const state = useTypingStore.getState();
      expect(state.currentPosition).toBe(1);
    });
  });

  describe('pause and resume', () => {
    it('should pause the session', () => {
      const { setTargetText, start, pause } = useTypingStore.getState();
      setTargetText('abc');

      start();
      pause();

      const state = useTypingStore.getState();
      expect(state.isPaused).toBe(true);
      expect(state.pausedTime).not.toBeNull();
    });

    it('should resume the session', () => {
      const { setTargetText, start, pause, resume } = useTypingStore.getState();
      setTargetText('abc');

      vi.setSystemTime(new Date(1000));
      start();

      vi.setSystemTime(new Date(2000));
      pause();

      vi.setSystemTime(new Date(3000));
      resume();

      const state = useTypingStore.getState();
      expect(state.isPaused).toBe(false);
      expect(state.pausedTime).toBeNull();
      // Start time should be adjusted for pause duration (1000ms pause)
      expect(state.startTime).toBe(2000);
    });

    it('should not pause when already complete', () => {
      const { setTargetText, handleKeyPress, pause } = useTypingStore.getState();
      setTargetText('a');

      handleKeyPress('a'); // completes
      pause();

      const state = useTypingStore.getState();
      expect(state.isPaused).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset all session state but keep targetText', () => {
      const { setTargetText, handleKeyPress, reset } = useTypingStore.getState();
      setTargetText('abc');

      handleKeyPress('a');
      handleKeyPress('x'); // error
      reset();

      const state = useTypingStore.getState();
      expect(state.targetText).toBe('abc'); // kept
      expect(state.currentInput).toBe('');
      expect(state.currentPosition).toBe(0);
      expect(state.errors).toEqual([]);
      expect(state.startTime).toBeNull();
      expect(state.isComplete).toBe(false);
      expect(state.isPaused).toBe(false);
    });
  });

  describe('multiple errors tracking', () => {
    it('should track multiple errors at different positions', () => {
      const { setTargetText, handleKeyPress } = useTypingStore.getState();
      setTargetText('abcdef');

      handleKeyPress('a'); // correct
      handleKeyPress('x'); // error at 1
      handleKeyPress('c'); // correct
      handleKeyPress('y'); // error at 3
      handleKeyPress('e'); // correct
      handleKeyPress('z'); // error at 5

      const state = useTypingStore.getState();
      expect(state.errors).toEqual([1, 3, 5]);
    });
  });
});
