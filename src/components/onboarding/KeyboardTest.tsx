'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTypingEngine, type TypingStats } from '@/hooks/useTypingEngine';

interface KeyboardTestProps {
  locale: 'en' | 'he';
  onComplete: (results: { wpm: number; accuracy: number }) => void;
  onSkip: () => void;
}

const translations = {
  en: {
    title: 'Quick Typing Test',
    subtitle: "Let's see your current level",
    instruction: 'Type as fast and accurately as you can',
    timeRemaining: 'Time',
    seconds: 's',
    skip: 'Skip test',
    wpm: 'WPM',
    accuracy: 'Accuracy',
    clickToStart: 'Click here to start typing',
    typing: 'Keep typing...',
  },
  he: {
    title: 'מבחן הקלדה מהיר',
    subtitle: 'בואו נראה את הרמה הנוכחית שלכם',
    instruction: 'הקלידו כמה שיותר מהר ומדויק',
    timeRemaining: 'זמן',
    seconds: 'ש׳',
    skip: 'דלג על המבחן',
    wpm: 'מילים/דקה',
    accuracy: 'דיוק',
    clickToStart: 'לחצו כאן להתחיל להקליד',
    typing: 'המשיכו להקליד...',
  },
};

// Test text - pangrams
const TEST_TEXT = "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.";

const TEST_DURATION = 30; // seconds

export function KeyboardTest({ locale, onComplete, onSkip }: KeyboardTestProps) {
  const t = translations[locale];

  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const statsRef = useRef({ wpm: 0, accuracy: 100 });

  const handleComplete = useCallback((stats: TypingStats) => {
    setIsFinished(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onComplete({ wpm: stats.wpm, accuracy: stats.accuracy });
  }, [onComplete]);

  const {
    characters,
    stats,
    start,
    setTargetText,
  } = useTypingEngine({
    onComplete: handleComplete,
    allowBackspace: false,
    caseSensitive: false,
  });

  // Track stats for time-up completion
  useEffect(() => {
    statsRef.current = { wpm: stats.wpm, accuracy: stats.accuracy || 100 };
  }, [stats.wpm, stats.accuracy]);

  // Initialize with test text on mount
  useEffect(() => {
    setTargetText(TEST_TEXT);
  }, [setTargetText]);

  // Timer countdown
  useEffect(() => {
    if (isStarted && !isFinished && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up!
            setIsFinished(true);
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            // Complete with current stats from ref (to avoid stale closure)
            onComplete(statsRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isStarted, isFinished, onComplete, timeRemaining]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (!isStarted && !isFinished) {
      setIsStarted(true);
      start();
    }
  }, [isStarted, isFinished, start]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Time display color based on remaining time
  const getTimeColor = () => {
    if (timeRemaining <= 5) return 'text-red-400';
    if (timeRemaining <= 10) return 'text-amber-400';
    return 'text-emerald-400';
  };

  // Progress percentage based on time
  const progressPercent = ((TEST_DURATION - timeRemaining) / TEST_DURATION) * 100;

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
        {t.title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
        {t.subtitle}
      </p>

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-500">{stats.wpm}</span>
          <span className="text-xs text-gray-500">{t.wpm}</span>
        </div>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-emerald-500">{stats.accuracy || 100}%</span>
          <span className="text-xs text-gray-500">{t.accuracy}</span>
        </div>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold font-mono ${getTimeColor()}`}>{timeRemaining}</span>
          <span className="text-xs text-gray-500">{t.timeRemaining}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200 dark:bg-gray-600 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Monitor-style typing area */}
      <div className="typing-monitor mb-4">
        <div
          onClick={handleContainerClick}
          className={`typing-monitor-screen cursor-text transition-all ${
            isFocused ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-800' : ''
          }`}
        >
          {/* Hidden input for keyboard capture */}
          <input
            ref={inputRef}
            type="text"
            className="sr-only"
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-label={t.instruction}
            disabled={isFinished}
          />

          {/* Text display */}
          <div
            className="font-mono text-lg leading-relaxed text-left break-words"
            dir="ltr"
            aria-live="polite"
            style={{ wordBreak: 'break-word' }}
          >
            {characters.length > 0 ? (
              characters.map((char, index) => (
                <span
                  key={index}
                  className={`
                    relative inline
                    ${char.status === 'correct' ? 'text-emerald-400' : ''}
                    ${char.status === 'incorrect' ? 'text-red-400 bg-red-900/40' : ''}
                    ${char.status === 'current' ? 'text-white bg-amber-500/50' : ''}
                    ${char.status === 'pending' ? 'text-gray-500' : ''}
                  `}
                >
                  {char.status === 'current' && !isStarted && (
                    <span className="absolute left-0 top-0 h-full w-0.5 bg-amber-400 animate-pulse" />
                  )}
                  {char.char === ' ' ? '\u00A0' : char.char}
                </span>
              ))
            ) : (
              // Show the test text before engine initializes
              TEST_TEXT.split('').map((char, index) => (
                <span
                  key={index}
                  className={index === 0 ? 'text-white bg-amber-500/50' : 'text-gray-500'}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))
            )}
          </div>

          {/* Click to start hint - positioned at bottom */}
          {!isFocused && !isFinished && (
            <div className="mt-4 pt-3 border-t border-gray-700/50">
              <p className="text-amber-400 text-sm font-medium animate-pulse">
                ⌨️ {t.clickToStart}
              </p>
            </div>
          )}

          {/* Typing indicator when active */}
          {isFocused && isStarted && !isFinished && (
            <div className="mt-4 pt-3 border-t border-gray-700/50">
              <p className="text-emerald-400 text-sm font-medium">
                ✨ {t.typing}
              </p>
            </div>
          )}
        </div>
        <div className="typing-monitor-stand" />
      </div>

      {/* Skip button */}
      <button
        onClick={onSkip}
        className="px-6 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
      >
        {t.skip}
      </button>
    </div>
  );
}

export default KeyboardTest;
