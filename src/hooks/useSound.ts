'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { soundManager, preloadSounds, type SoundName } from '@/lib/sounds';

/**
 * useSound Hook
 *
 * Provides sound playback functionality integrated with user settings.
 * Automatically syncs with soundEnabled and soundVolume from settings store.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { play, isEnabled } = useSound();
 *
 *   const handleCorrectKey = () => {
 *     play('keypress');
 *   };
 *
 *   const handleError = () => {
 *     play('keypress-wrong');
 *   };
 * }
 * ```
 */
export function useSound() {
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const soundVolume = useSettingsStore((state) => state.soundVolume);
  const hasPreloaded = useRef(false);

  // Sync settings with sound manager
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    soundManager.setVolume(soundVolume);
  }, [soundVolume]);

  // Preload sounds on first user interaction
  useEffect(() => {
    if (hasPreloaded.current) return;

    const handleInteraction = () => {
      if (!hasPreloaded.current) {
        hasPreloaded.current = true;
        preloadSounds();
        // Remove listeners after first interaction
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
      }
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  /**
   * Play a sound by name
   */
  const play = useCallback((name: SoundName) => {
    soundManager.play(name);
  }, []);

  /**
   * Play keypress sound (correct)
   */
  const playKeypress = useCallback(() => {
    soundManager.play('keypress');
  }, []);

  /**
   * Play error sound (wrong keypress)
   */
  const playError = useCallback(() => {
    soundManager.play('keypress-wrong');
  }, []);

  /**
   * Play success sound (task/exercise complete)
   */
  const playSuccess = useCallback(() => {
    soundManager.play('success');
  }, []);

  /**
   * Play achievement unlock sound
   */
  const playAchievement = useCallback(() => {
    soundManager.play('achievement');
  }, []);

  /**
   * Play combo milestone sound
   */
  const playCombo = useCallback(() => {
    soundManager.play('combo');
  }, []);

  /**
   * Play level up sound
   */
  const playLevelUp = useCallback(() => {
    soundManager.play('level-up');
  }, []);

  // === Game-specific sounds ===

  /**
   * Play engine running sound (Race game)
   */
  const playEngineRunning = useCallback(() => {
    soundManager.play('engine-running');
  }, []);

  /**
   * Play car stop sound (Race game finish)
   */
  const playCarStop = useCallback(() => {
    soundManager.play('car-stop');
  }, []);

  /**
   * Play brick drop sound (Tower game)
   */
  const playBrickDrop = useCallback(() => {
    soundManager.play('brick-drop');
  }, []);

  /**
   * Start engine loop (Race game - loops until stopped)
   */
  const startEngineLoop = useCallback(() => {
    soundManager.startLoop('engine-running');
  }, []);

  /**
   * Stop engine loop with fade out
   */
  const stopEngineLoop = useCallback((fadeOutMs = 500) => {
    soundManager.stopLoop('engine-running', fadeOutMs);
  }, []);

  /**
   * Stop all looping sounds
   */
  const stopAllLoops = useCallback(() => {
    soundManager.stopAllLoops();
  }, []);

  return {
    play,
    playKeypress,
    playError,
    playSuccess,
    playAchievement,
    playCombo,
    playLevelUp,
    // Game-specific
    playEngineRunning,
    playCarStop,
    playBrickDrop,
    // Looping
    startEngineLoop,
    stopEngineLoop,
    stopAllLoops,
    isEnabled: soundEnabled,
    volume: soundVolume,
  };
}

export type { SoundName };
