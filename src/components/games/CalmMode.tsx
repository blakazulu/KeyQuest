'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CalmBackground } from './CalmBackground';
import { CalmTextDisplay } from './CalmTextDisplay';
import { CalmStats } from './CalmStats';
import { Keyboard } from '@/components/keyboard/Keyboard';
import { HandsWithKeyboard } from '@/components/keyboard/HandGuide';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import { useKeyboardHighlight } from '@/hooks/useKeyboardHighlight';
import { useCalmTextGenerator } from '@/hooks/useCalmTextGenerator';
import { useCalmModeStore } from '@/stores/useCalmModeStore';
import { useProgressStore } from '@/stores/useProgressStore';
import { useSettingsStore } from '@/stores/useSettingsStore';

interface CalmModeProps {
  locale?: 'en' | 'he';
}

/**
 * Calm Mode - Immersive fullscreen typing practice.
 *
 * - Enters fullscreen immediately on load
 * - Covers entire viewport (hides navbar, XP)
 * - Top controls: pause, keyboard toggle, fullscreen toggle, close
 * - Centered monitor with text
 * - Full-width keyboard with hands
 * - Stats at bottom
 */
export function CalmMode({ locale = 'en' }: CalmModeProps) {
  const t = useTranslations('calmMode');
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Stores
  const {
    status,
    start,
    pause,
    resume,
    reset: resetSession,
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
  } = useCalmTextGenerator({
    focusWeakLetters,
    onTextAppended: () => {},
  });

  // Flash refs for keyboard
  const flashCorrectRef = useRef<(key: string) => void>(() => {});
  const flashWrongRef = useRef<(key: string) => void>(() => {});

  // Handle character typed
  const handleCharacterTyped = useCallback((char: string, isCorrect: boolean) => {
    if (isCorrect) {
      flashCorrectRef.current(char);
    } else {
      flashWrongRef.current(char);
    }
  }, []);

  // Typing engine
  const {
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
    allowBackspace: false,
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

  // Fullscreen helpers
  const enterFullscreen = useCallback(async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
        await (elem as HTMLElement & { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } catch {
      // Fullscreen may be blocked - continue anyway
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if ((document as Document & { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
        await (document as Document & { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
      }
      setIsFullscreen(false);
    } catch {
      // Ignore errors
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  // Track fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Initialize: enter fullscreen and start practice immediately
  useEffect(() => {
    if (!hasInitialized && isReady && text) {
      setHasInitialized(true);
      enterFullscreen();
      setTargetText(text);
      start();
      startEngine();
      containerRef.current?.focus();
    }
  }, [hasInitialized, isReady, text, enterFullscreen, setTargetText, start, startEngine]);

  // Sync text updates to typing engine
  useEffect(() => {
    if (text && cursorPosition > 0 && cursorPosition < text.length) {
      updateTargetText(text);
    }
  }, [text, cursorPosition, updateTargetText]);

  // Check if we need more text
  useEffect(() => {
    if (status === 'running') {
      checkAndAppend(cursorPosition);
    }
  }, [cursorPosition, status, checkAndAppend]);

  // Update character count
  useEffect(() => {
    updateCharacterCount(cursorPosition);
  }, [cursorPosition, updateCharacterCount]);

  // Update weak letters periodically
  const lastWeakLetterUpdateRef = useRef(0);
  useEffect(() => {
    if (
      cursorPosition > 0 &&
      cursorPosition - lastWeakLetterUpdateRef.current >= 50 &&
      stats.letterAccuracy
    ) {
      Object.entries(stats.letterAccuracy).forEach(([letter, letterStats]) => {
        if (letterStats.total > 0) {
          const accuracy = (letterStats.correct / letterStats.total) * 100;
          updateWeakLetter(letter, accuracy);
        }
      });
      lastWeakLetterUpdateRef.current = cursorPosition;
    }
  }, [cursorPosition, stats.letterAccuracy, updateWeakLetter]);

  // Handle pause/resume
  const handlePause = useCallback(() => {
    pause();
    pauseEngine();
  }, [pause, pauseEngine]);

  const handleResume = useCallback(() => {
    resume();
    startEngine();
    containerRef.current?.focus();
  }, [resume, startEngine]);

  const togglePause = useCallback(() => {
    if (status === 'running') {
      handlePause();
    } else if (status === 'paused') {
      handleResume();
    }
  }, [status, handlePause, handleResume]);

  // Handle exit
  const handleExit = useCallback(async () => {
    // Save weak letters
    if (stats.letterAccuracy) {
      Object.entries(stats.letterAccuracy).forEach(([letter, letterStats]) => {
        if (letterStats.total > 0) {
          const accuracy = (letterStats.correct / letterStats.total) * 100;
          updateWeakLetter(letter, accuracy);
        }
      });
    }
    await exitFullscreen();
    resetSession();
    resetEngine();
    router.push(`/${locale}`);
  }, [stats.letterAccuracy, updateWeakLetter, exitFullscreen, resetSession, resetEngine, router, locale]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleExit();
      } else if (e.code === 'Space' && status === 'paused') {
        e.preventDefault();
        handleResume();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, handleExit, handleResume]);

  // Loading state
  if (!isReady || !text) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        <CalmBackground />
        <div className="text-stone-700 text-lg animate-pulse z-10">
          {t('loading')}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col overflow-hidden focus:outline-none"
      tabIndex={0}
      role="application"
      aria-label={t('ariaLabel')}
    >
      {/* Calm background */}
      <CalmBackground />

      {/* Top control bar */}
      <header className="flex-shrink-0 flex items-center justify-center gap-3 p-4 z-10">
        {/* Pause/Resume */}
        <button
          onClick={togglePause}
          className="
            flex items-center gap-2 px-4 py-2.5
            bg-white/90 hover:bg-white
            backdrop-blur-md rounded-xl
            text-stone-700 hover:text-stone-900
            font-medium text-sm
            transition-all duration-200
            shadow-md shadow-stone-900/10
            focus:outline-none focus:ring-2 focus:ring-stone-400/50
          "
          aria-label={status === 'running' ? t('controls.pause') : t('controls.resume')}
        >
          {status === 'running' ? (
            <>
              <PauseIcon />
              <span>{t('controls.pause')}</span>
            </>
          ) : (
            <>
              <PlayIcon />
              <span>{t('controls.resume')}</span>
            </>
          )}
        </button>

        {/* Keyboard toggle */}
        <button
          onClick={() => setShowKeyboard(!showKeyboard)}
          className={`
            flex items-center gap-2 px-4 py-2.5
            backdrop-blur-md rounded-xl
            font-medium text-sm
            transition-all duration-200
            shadow-md shadow-stone-900/10
            focus:outline-none focus:ring-2 focus:ring-stone-400/50
            ${showKeyboard
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-white/90 text-stone-700 hover:bg-white hover:text-stone-900'
            }
          `}
          aria-label={showKeyboard ? t('controls.hideKeyboard') : t('controls.showKeyboard')}
          aria-pressed={showKeyboard}
        >
          <KeyboardIcon />
          <span className="hidden sm:inline">
            {showKeyboard ? t('controls.hideKeyboard') : t('controls.showKeyboard')}
          </span>
        </button>

        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="
            flex items-center gap-2 px-4 py-2.5
            bg-white/90 hover:bg-white
            backdrop-blur-md rounded-xl
            text-stone-700 hover:text-stone-900
            font-medium text-sm
            transition-all duration-200
            shadow-md shadow-stone-900/10
            focus:outline-none focus:ring-2 focus:ring-stone-400/50
          "
          aria-label={isFullscreen ? t('exitFullscreen') : t('enterFullscreen')}
        >
          {isFullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
          <span className="hidden sm:inline">
            {isFullscreen ? t('exitFullscreen') : t('enterFullscreen')}
          </span>
        </button>

        {/* Close/Exit */}
        <button
          onClick={handleExit}
          className="
            flex items-center gap-2 px-4 py-2.5
            bg-rose-600 hover:bg-rose-700
            backdrop-blur-md rounded-xl
            text-white
            font-medium text-sm
            transition-all duration-200
            shadow-md shadow-rose-900/20
            focus:outline-none focus:ring-2 focus:ring-rose-400/50
          "
          aria-label={t('controls.exitAriaLabel')}
        >
          <CloseIcon />
          <span>{t('exitCalmMode')}</span>
          <span className="text-rose-200 text-xs">(ESC)</span>
        </button>
      </header>

      {/* Paused overlay */}
      {status === 'paused' && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm"
          role="dialog"
          aria-label={t('pausedAriaLabel')}
        >
          <div className="text-center space-y-6 animate-fade-in bg-white/95 backdrop-blur-md rounded-3xl p-10 shadow-2xl">
            <p className="text-4xl font-display text-stone-800">{t('paused')}</p>
            <p className="text-stone-600">{t('pausedHint')}</p>
            <button
              onClick={handleResume}
              className="
                px-8 py-4 rounded-xl
                bg-emerald-600 hover:bg-emerald-700
                text-white font-medium text-lg
                transition-all duration-200
                shadow-lg shadow-emerald-600/30
                focus:outline-none focus:ring-2 focus:ring-emerald-400
              "
            >
              {t('resume')}
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 gap-6 z-10 overflow-hidden">
        {/* Monitor with text */}
        <div className="typing-monitor w-full max-w-3xl flex-shrink-0">
          <div className="typing-monitor-screen">
            <CalmTextDisplay
              characters={characters}
              showCursor={status === 'running'}
              className="text-center text-xl sm:text-2xl leading-relaxed"
            />
          </div>
          <div className="typing-monitor-stand" />
        </div>

        {/* Keyboard with hands */}
        {showKeyboard && (
          <div className="w-full max-w-5xl flex-shrink-0 animate-fade-in">
            <HandsWithKeyboard activeFinger={activeFinger} locale={locale}>
              <Keyboard
                highlightedKey={highlightedKey}
                pressedKeys={pressedKeys}
                correctKey={correctKey}
                wrongKey={wrongKey}
                showFingerColors={true}
                showHomeRow={true}
                baseSize={48}
              />
            </HandsWithKeyboard>
          </div>
        )}
      </main>

      {/* Stats at bottom */}
      <footer className="flex-shrink-0 flex items-center justify-center p-4 sm:p-6 z-10">
        <CalmStats
          charactersTyped={cursorPosition}
          wpm={stats.wpm}
          accuracy={stats.accuracy}
        />
      </footer>
    </div>
  );
}

// Icons
function PauseIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
  );
}

function KeyboardIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function EnterFullscreenIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  );
}

function ExitFullscreenIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4m0 5H4m0 0l5-5m5 5h5m0 0V4m0 5l5-5M9 15v5m0-5H4m0 0l5 5m5-5h5m0 0v5m0-5l5 5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
