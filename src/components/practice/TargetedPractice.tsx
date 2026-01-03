'use client';

/**
 * TargetedPractice Component
 * Practice session for Problem Letters mode
 */

import { useRef, useEffect, useCallback } from 'react';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import { useTargetedPractice } from '@/hooks/useTargetedPractice';
import { TextDisplay } from '@/components/typing/TextDisplay';
import { Keyboard } from '@/components/keyboard/Keyboard';
import { useSettingsStore } from '@/stores/useSettingsStore';

interface TargetedPracticeProps {
  locale: 'en' | 'he';
  targetLetters: string[];
  onExit: () => void;
  onComplete: (xpEarned: number) => void;
}

const translations = {
  en: {
    title: 'Problem Letters Practice',
    practicing: 'Practicing',
    pause: 'Pause',
    resume: 'Resume',
    exit: 'Exit',
    finish: 'Finish',
    chars: 'chars',
    accuracy: 'Accuracy',
    wpm: 'WPM',
    hideKeyboard: 'Hide keyboard',
    showKeyboard: 'Show keyboard',
    paused: 'Paused',
    pressToResume: 'Press Space or click Resume to continue',
  },
  he: {
    title: 'תרגול אותיות בעייתיות',
    practicing: 'מתרגל',
    pause: 'השהה',
    resume: 'המשך',
    exit: 'יציאה',
    finish: 'סיים',
    chars: 'תווים',
    accuracy: 'דיוק',
    wpm: 'מ״ש',
    hideKeyboard: 'הסתר מקלדת',
    showKeyboard: 'הצג מקלדת',
    paused: 'מושהה',
    pressToResume: 'לחץ/י רווח או לחץ/י המשך כדי להמשיך',
  },
};

export function TargetedPractice({
  locale,
  targetLetters,
  onExit,
  onComplete,
}: TargetedPracticeProps) {
  const t = translations[locale];
  const isRTL = locale === 'he';
  const containerRef = useRef<HTMLDivElement>(null);

  // Settings
  const showKeyboard = useSettingsStore((s) => s.showKeyboard);
  const toggleKeyboard = useSettingsStore((s) => s.toggleKeyboard);

  // Targeted practice hook
  const practice = useTargetedPractice();

  // Typing engine
  const {
    characters,
    stats,
    cursorPosition,
    status: engineStatus,
    start: startEngine,
    pause: pauseEngine,
    reset: resetEngine,
    setTargetText,
    updateTargetText,
  } = useTypingEngine({
    onComplete: () => {
      // In endless mode, we never really "complete"
    },
    allowBackspace: false,
  });

  // Initialize practice session
  useEffect(() => {
    practice.startSession(targetLetters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set target text when practice text is ready
  useEffect(() => {
    if (practice.text && practice.status === 'ready') {
      setTargetText(practice.text);
    }
  }, [practice.text, practice.status, setTargetText]);

  // Update target text when more is appended (for endless mode)
  useEffect(() => {
    if (practice.text && cursorPosition > 0 && cursorPosition < practice.text.length) {
      updateTargetText(practice.text);
    }
  }, [practice.text, cursorPosition, updateTargetText]);

  // Sync stats to practice state
  useEffect(() => {
    if (stats) {
      practice.updateStats({
        accuracy: stats.accuracy,
        wpm: stats.wpm,
        letterAccuracy: stats.letterAccuracy,
      });
    }
  }, [stats, practice]);

  // Update progress
  useEffect(() => {
    practice.updateProgress(cursorPosition);
  }, [cursorPosition, practice]);

  // Check and append more text
  useEffect(() => {
    if (practice.status === 'running') {
      practice.checkAndAppend(cursorPosition);
    }
  }, [cursorPosition, practice]);

  // Handle key events (special keys only - typing engine handles character input)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Start on first key if ready
      if (practice.status === 'ready' && e.key.length === 1) {
        startEngine();
        practice.resume();
        return;
      }

      // Handle pause/resume with Escape
      if (e.key === 'Escape') {
        if (practice.status === 'running') {
          pauseEngine();
          practice.pause();
        }
        return;
      }

      // Resume on Space when paused
      if (e.key === ' ' && practice.status === 'paused') {
        e.preventDefault();
        startEngine();
        practice.resume();
        containerRef.current?.focus();
        return;
      }
    },
    [practice, startEngine, pauseEngine]
  );

  // Handle pause button
  const handlePauseClick = useCallback(() => {
    if (practice.status === 'running') {
      pauseEngine();
      practice.pause();
    } else if (practice.status === 'paused') {
      startEngine();
      practice.resume();
      containerRef.current?.focus();
    }
  }, [practice, pauseEngine, startEngine]);

  // Handle finish
  const handleFinish = useCallback(() => {
    practice.endSession();
    onComplete(practice.xpEarned);
  }, [practice, onComplete]);

  // Handle exit
  const handleExit = useCallback(() => {
    practice.endSession();
    onExit();
  }, [practice, onExit]);

  // Toggle keyboard visibility
  const handleToggleKeyboard = useCallback(() => {
    toggleKeyboard();
  }, [toggleKeyboard]);

  // Focus container on mount
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Get current key to highlight
  const currentKey =
    practice.text && cursorPosition < practice.text.length
      ? practice.text[cursorPosition]
      : null;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 outline-none"
      role="application"
      aria-label={t.title}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Title and letters */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t.title}
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t.practicing}:{' '}
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {targetLetters.map((l) => l.toUpperCase()).join(', ')}
              </span>
            </div>
          </div>

          {/* Right: Controls */}
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={handleToggleKeyboard}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label={showKeyboard ? t.hideKeyboard : t.showKeyboard}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              onClick={handlePauseClick}
              className="px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {practice.status === 'paused' ? t.resume : t.pause}
            </button>
            <button
              onClick={handleFinish}
              className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              {t.finish}
            </button>
            <button
              onClick={handleExit}
              className="px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {t.exit}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats bar */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {practice.charactersTyped}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t.chars}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {Math.round(practice.sessionStats.accuracy)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t.accuracy}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {Math.round(practice.sessionStats.wpm)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t.wpm}</div>
          </div>
        </div>

        {/* Paused overlay */}
        {practice.status === 'paused' && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-xl">
              <div className="text-4xl mb-4">⏸️</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t.paused}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{t.pressToResume}</p>
              <button
                onClick={handlePauseClick}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
              >
                {t.resume}
              </button>
            </div>
          </div>
        )}

        {/* Text display */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <TextDisplay
            characters={characters}
            showCursor={true}
          />
        </div>

        {/* Keyboard */}
        {showKeyboard && (
          <div className="flex justify-center">
            <Keyboard
              highlightedKey={currentKey || undefined}
              highlightedKeys={targetLetters.map((l) => l.toLowerCase())}
              showFingerColors={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TargetedPractice;
