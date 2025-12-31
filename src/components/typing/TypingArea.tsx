'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { TextDisplay } from './TextDisplay';
import { Stats } from './Stats';
import { Keyboard, CompactKeyboard } from '@/components/keyboard/Keyboard';
import { FingerGuide, FingerIndicator } from '@/components/keyboard/FingerGuide';
import { useTypingEngine, type TypingStats } from '@/hooks/useTypingEngine';
import { useKeyboardInput } from '@/hooks/useKeyboardInput';
import { useKeyboardHighlight } from '@/hooks/useKeyboardHighlight';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { calculateProgress } from '@/lib/typing-utils';

interface TypingAreaProps {
  /** The text to type */
  text: string;
  /** Called when the session is completed */
  onComplete?: (stats: TypingStats) => void;
  /** Called when an error occurs */
  onError?: (char: string, expected: string) => void;
  /** Whether to show the stats panel */
  showStats?: boolean;
  /** Whether to allow backspace corrections */
  allowBackspace?: boolean;
  /** Whether to show the visual keyboard (overrides settings) */
  showKeyboard?: boolean;
  /** Whether to show the finger guide (overrides settings) */
  showFingerGuide?: boolean;
  /** Use compact keyboard for smaller displays */
  compactKeyboard?: boolean;
  /** Locale for finger guide labels */
  locale?: 'en' | 'he';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Main typing practice area component.
 * Combines TextDisplay, Stats, and keyboard input handling.
 *
 * @example
 * ```tsx
 * <TypingArea
 *   text="The quick brown fox jumps over the lazy dog."
 *   onComplete={(stats) => console.log('Done!', stats)}
 *   showStats={true}
 * />
 * ```
 */
export function TypingArea({
  text,
  onComplete,
  onError,
  showStats = true,
  allowBackspace = false,
  showKeyboard: showKeyboardProp,
  showFingerGuide: showFingerGuideProp,
  compactKeyboard = false,
  locale = 'en',
  className = '',
}: TypingAreaProps) {
  const t = useTranslations('practice');
  const containerRef = useRef<HTMLDivElement>(null);

  // Get keyboard visibility settings (props override store settings)
  const {
    showKeyboard: showKeyboardSetting,
    showFingerGuide: showFingerGuideSetting
  } = useSettingsStore();

  const shouldShowKeyboard = showKeyboardProp ?? showKeyboardSetting;
  const shouldShowFingerGuide = showFingerGuideProp ?? showFingerGuideSetting;

  // Refs for flash functions to break circular dependency
  const flashCorrectRef = useRef<(key: string) => void>(() => {});
  const flashWrongRef = useRef<(key: string) => void>(() => {});

  // Handler for character typed - triggers keyboard flash effects via refs
  const handleCharacterTyped = useCallback((char: string, isCorrect: boolean) => {
    if (isCorrect) {
      flashCorrectRef.current(char);
    } else {
      flashWrongRef.current(char);
    }
  }, []);

  // Handler for errors - calls the prop callback
  const handleError = useCallback((char: string, expected: string) => {
    onError?.(char, expected);
  }, [onError]);

  const {
    status,
    characters,
    stats,
    cursorPosition,
    start,
    pause,
    reset,
    setTargetText,
  } = useTypingEngine({
    onComplete,
    onError: handleError,
    onCharacterTyped: handleCharacterTyped,
    allowBackspace,
  });

  // Keyboard highlighting
  const {
    highlightedKey,
    activeFinger,
    pressedKeys,
    correctKey,
    wrongKey,
    flashCorrect,
    flashWrong,
  } = useKeyboardHighlight({
    targetText: text,
    currentPosition: cursorPosition,
    trackPressedKeys: status === 'running',
  });

  // Update refs after hooks are called
  flashCorrectRef.current = flashCorrect;
  flashWrongRef.current = flashWrong;

  // Set target text on mount or when text prop changes
  useEffect(() => {
    if (text) {
      setTargetText(text);
    }
  }, [text, setTargetText]);

  // Handle Enter to start/resume and Escape to pause
  const handleEnter = useCallback(() => {
    if (status === 'idle' || status === 'paused') {
      start();
    }
  }, [status, start]);

  const handleEscape = useCallback(() => {
    if (status === 'running') {
      pause();
    }
  }, [status, pause]);

  // Setup Enter/Escape keyboard shortcuts
  useKeyboardInput({
    onEnter: handleEnter,
    onEscape: handleEscape,
    enabled: true,
  });

  // Focus container on mount for immediate keyboard capture
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const progress = calculateProgress(cursorPosition, text.length);

  return (
    <div
      ref={containerRef}
      className={`card-raised focus:outline-none ${className}`}
      tabIndex={0}
      role="application"
      aria-label={t('typingArea')}
    >
      {/* Progress bar */}
      <div className="mb-6">
        <div className="progress-bar h-2">
          <div
            className="progress-bar-fill progress-bar-primary"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t('progress', { percent: progress })}
          />
        </div>
      </div>

      {/* Status message */}
      {status === 'idle' && (
        <div
          className="mb-4 text-center text-body-sm text-muted"
          role="status"
          aria-live="polite"
        >
          {t('pressEnterToStart')}
        </div>
      )}

      {status === 'paused' && (
        <div
          className="mb-4 text-center text-body-sm text-warning"
          role="status"
          aria-live="polite"
        >
          {t('paused')} - {t('pressEnterToResume')}
        </div>
      )}

      {status === 'completed' && (
        <div
          className="mb-4 text-center text-body-sm text-success"
          role="status"
          aria-live="assertive"
        >
          {t('completed')}
        </div>
      )}

      {/* Text display */}
      <div className="mb-6 rounded-lg bg-surface-raised p-6">
        <TextDisplay
          characters={characters}
          showCursor={status === 'running' || status === 'idle'}
          className="text-center leading-relaxed"
        />
      </div>

      {/* Stats panel */}
      {showStats && (
        <Stats
          wpm={stats.wpm}
          accuracy={stats.accuracy}
          time={stats.elapsedTime}
          errors={stats.errorCount}
          status={status}
        />
      )}

      {/* Visual keyboard and finger guide */}
      {shouldShowKeyboard && (
        <div className="mt-6 space-y-4">
          {/* Finger indicator (compact) */}
          {shouldShowFingerGuide && (
            <div className="flex justify-center">
              <FingerIndicator
                activeFinger={activeFinger}
                locale={locale}
              />
            </div>
          )}

          {/* Keyboard display */}
          <div className="flex justify-center">
            {compactKeyboard ? (
              <CompactKeyboard
                highlightedKey={highlightedKey}
                pressedKeys={pressedKeys}
                correctKey={correctKey}
                wrongKey={wrongKey}
                showFingerColors={true}
                baseSize={36}
              />
            ) : (
              <Keyboard
                highlightedKey={highlightedKey}
                pressedKeys={pressedKeys}
                correctKey={correctKey}
                wrongKey={wrongKey}
                showFingerColors={true}
                showHomeRow={true}
                baseSize={44}
              />
            )}
          </div>

          {/* Full finger guide (for learning mode) */}
          {shouldShowFingerGuide && status === 'idle' && (
            <FingerGuide
              activeFinger={activeFinger}
              locale={locale}
              size="md"
              className="mx-auto"
            />
          )}
        </div>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {status === 'completed' && (
          <span>
            {t('completedAnnouncement', {
              wpm: stats.wpm,
              accuracy: stats.accuracy,
            })}
          </span>
        )}
      </div>
    </div>
  );
}
