'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CalmBackground } from './CalmBackground';
import { CalmTextDisplay } from './CalmTextDisplay';
import { CalmStats } from './CalmStats';
import { CalmControls, CalmKeyboardHints } from './CalmControls';
import { Keyboard, CompactKeyboard } from '@/components/keyboard/Keyboard';
import { HandsWithKeyboard } from '@/components/keyboard/HandGuide';
import { useTypingEngine, type TypingStats } from '@/hooks/useTypingEngine';
import { useKeyboardInput } from '@/hooks/useKeyboardInput';
import { useKeyboardHighlight } from '@/hooks/useKeyboardHighlight';
import { useCalmTextGenerator } from '@/hooks/useCalmTextGenerator';
import { useCalmModeStore } from '@/stores/useCalmModeStore';
import { useProgressStore } from '@/stores/useProgressStore';
import { useSettingsStore } from '@/stores/useSettingsStore';

interface CalmModeProps {
  /** Locale for translations */
  locale?: 'en' | 'he';
}

/**
 * Main Calm Mode component.
 * Provides a stress-free, endless typing practice experience.
 *
 * Features:
 * - No timer pressure, no pass/fail
 * - Endless text generation
 * - Soft, gentle visual feedback
 * - Pause/resume with Space
 * - Exit with Escape
 * - Optional keyboard display
 * - Silently tracks weak letters
 */
export function CalmMode({ locale = 'en' }: CalmModeProps) {
  const t = useTranslations('calmMode');
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Stores
  const {
    status,
    start,
    pause,
    resume,
    reset: resetSession,
    showKeyboard: showKeyboardStore,
    updateCharacterCount,
  } = useCalmModeStore();

  const updateWeakLetter = useProgressStore((state) => state.updateWeakLetter);
  const { calmModeSettings } = useSettingsStore();
  const focusWeakLetters = calmModeSettings?.focusWeakLetters ?? true;

  // Text generation
  const {
    text,
    isReady,
    checkAndAppend,
    resetText,
  } = useCalmTextGenerator({
    focusWeakLetters,
    onTextAppended: () => {
      // Text was appended, update the typing engine
    },
  });

  // Track if user is actively typing (for auto-hide controls)
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Flash refs for keyboard
  const flashCorrectRef = useRef<(key: string) => void>(() => { });
  const flashWrongRef = useRef<(key: string) => void>(() => { });

  // Handle character typed
  const handleCharacterTyped = useCallback((char: string, isCorrect: boolean) => {
    if (isCorrect) {
      flashCorrectRef.current(char);
    } else {
      flashWrongRef.current(char);
    }

    // Mark as typing and reset timeout
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  }, []);

  // Typing engine
  const {
    status: engineStatus,
    characters,
    stats,
    cursorPosition,
    start: startEngine,
    pause: pauseEngine,
    reset: resetEngine,
    setTargetText,
    updateTargetText,
  } = useTypingEngine({
    onCharacterTyped: handleCharacterTyped,
    allowBackspace: false, // No corrections in calm mode - just keep going
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

  // Update flash refs
  flashCorrectRef.current = flashCorrect;
  flashWrongRef.current = flashWrong;

  // Set target text when ready
  useEffect(() => {
    if (isReady && text) {
      setTargetText(text);
    }
  }, [isReady, text, setTargetText]);

  // Sync text updates to typing engine (without resetting position)
  useEffect(() => {
    if (text && cursorPosition > 0 && cursorPosition < text.length) {
      // Use updateTargetText to preserve cursor position when text is appended
      updateTargetText(text);
    }
  }, [text, cursorPosition, updateTargetText]);

  // Check if we need more text
  useEffect(() => {
    if (status === 'running') {
      checkAndAppend(cursorPosition);
    }
  }, [cursorPosition, status, checkAndAppend]);

  // Update character count in store
  useEffect(() => {
    updateCharacterCount(cursorPosition);
  }, [cursorPosition, updateCharacterCount]);

  // Update weak letters periodically (every 50 characters)
  const lastWeakLetterUpdateRef = useRef(0);
  useEffect(() => {
    if (
      cursorPosition > 0 &&
      cursorPosition - lastWeakLetterUpdateRef.current >= 50 &&
      stats.letterAccuracy
    ) {
      // Update weak letters with current letter accuracy
      Object.entries(stats.letterAccuracy).forEach(([letter, letterStats]) => {
        if (letterStats.total > 0) {
          const accuracy = (letterStats.correct / letterStats.total) * 100;
          updateWeakLetter(letter, accuracy);
        }
      });
      lastWeakLetterUpdateRef.current = cursorPosition;
    }
  }, [cursorPosition, stats.letterAccuracy, updateWeakLetter]);

  // Handle start
  const handleStart = useCallback(() => {
    if (status === 'idle') {
      start();
      startEngine();
    } else if (status === 'paused') {
      resume();
      startEngine();
    }
  }, [status, start, startEngine, resume]);

  // Handle pause
  const handlePause = useCallback(() => {
    if (status === 'running') {
      pause();
      pauseEngine();
    }
  }, [status, pause, pauseEngine]);

  // Handle Space key for pause/resume
  const handleSpace = useCallback(() => {
    if (status === 'running') {
      handlePause();
    } else if (status === 'paused') {
      handleStart();
    }
  }, [status, handlePause, handleStart]);

  // Handle exit
  const handleExit = useCallback(() => {
    // Update final weak letters before exiting
    if (stats.letterAccuracy) {
      Object.entries(stats.letterAccuracy).forEach(([letter, letterStats]) => {
        if (letterStats.total > 0) {
          const accuracy = (letterStats.correct / letterStats.total) * 100;
          updateWeakLetter(letter, accuracy);
        }
      });
    }

    resetSession();
    resetEngine();
    router.push(`/${locale}/levels`);
  }, [stats.letterAccuracy, updateWeakLetter, resetSession, resetEngine, router, locale]);

  // Keyboard shortcuts
  useKeyboardInput({
    onEnter: handleStart,
    onEscape: status === 'running' ? handlePause : handleExit,
    enabled: true,
  });

  // Handle Space separately (not in useKeyboardInput as it's a typing key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle Space when paused (not during typing)
      if (e.code === 'Space' && status === 'paused') {
        e.preventDefault();
        handleStart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, handleStart]);

  // Focus container on mount
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col focus:outline-none"
      tabIndex={0}
      role="application"
      aria-label={t('ariaLabel')}
    >
      {/* Ambient background */}
      <CalmBackground />

      {/* Header with controls */}
      <header className="flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <h1 className="text-lg sm:text-xl font-display text-slate-700 dark:text-slate-200">
            {t('title')}
          </h1>
        </div>

        <CalmControls
          onExit={handleExit}
          showKeyboardToggle={true}
          autoHide={true}
          isTyping={isTyping}
        />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 pb-8">
        {/* Idle state - show start prompt */}
        {status === 'idle' && (
          <div className="text-center space-y-6 animate-fade-in">
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md">
              {t('intro')}
            </p>
            <button
              onClick={handleStart}
              className="
                px-8 py-4 rounded-xl
                bg-indigo-500/80 hover:bg-indigo-500
                text-white font-medium text-lg
                transition-all duration-200
                hover:scale-105 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                focus:ring-offset-transparent
              "
            >
              {t('start')}
            </button>
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              {t('startHint')}
            </p>
          </div>
        )}

        {/* Paused state overlay */}
        {status === 'paused' && (
          <div
            className="
              absolute inset-0 z-10
              flex items-center justify-center
              bg-slate-900/50 backdrop-blur-sm
            "
            role="dialog"
            aria-label={t('pausedAriaLabel')}
          >
            <div className="text-center space-y-6 animate-fade-in">
              <p className="text-2xl font-display text-white">
                {t('paused')}
              </p>
              <p className="text-slate-300">
                {t('pausedHint')}
              </p>
              <button
                onClick={handleStart}
                className="
                  px-8 py-3 rounded-xl
                  bg-indigo-500/80 hover:bg-indigo-500
                  text-white font-medium
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-indigo-400
                "
              >
                {t('resume')}
              </button>
            </div>
          </div>
        )}

        {/* Typing area - shown when running or paused */}
        {(status === 'running' || status === 'paused') && (
          <div className="w-full space-y-8">
            {/* Text display */}
            <div className="typing-monitor max-w-3xl mx-auto">
              <div className="typing-monitor-screen">
                <CalmTextDisplay
                  characters={characters}
                  showCursor={status === 'running'}
                  className="text-center text-xl sm:text-2xl leading-relaxed"
                />
              </div>
              <div className="typing-monitor-stand" />
            </div>

            {/* Visual keyboard (optional) */}
            {showKeyboardStore && (
              <div className="mt-6 opacity-80">
                <HandsWithKeyboard activeFinger={activeFinger} locale={locale}>
                  <Keyboard
                    highlightedKey={highlightedKey}
                    pressedKeys={pressedKeys}
                    correctKey={correctKey}
                    wrongKey={wrongKey}
                    showFingerColors={true}
                    showHomeRow={true}
                    baseSize={44}
                  />
                </HandsWithKeyboard>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer with stats */}
      {(status === 'running' || status === 'paused') && (
        <footer className="flex items-center justify-center p-4 sm:p-6">
          <CalmStats
            charactersTyped={cursorPosition}
            wpm={stats.wpm}
            accuracy={stats.accuracy}
            showDetailsOnHover={true}
          />
        </footer>
      )}

      {/* Keyboard hints (shown during idle) */}
      {status === 'idle' && (
        <footer className="flex items-center justify-center p-4">
          <CalmKeyboardHints />
        </footer>
      )}
    </div>
  );
}
