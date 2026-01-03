'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useTypingEngine, type CharacterState } from '@/hooks/useTypingEngine';
import { useProgressStore } from '@/stores/useProgressStore';
import { useGameStore } from '@/stores/useGameStore';
import { getDailyChallenge, type DailyChallenge as DailyChallengeData } from '@/lib/dailyGenerator';
import { GameHeader } from './GameHeader';
import { GameResults } from './GameResults';
import { Keyboard } from '@/components/keyboard/Keyboard';
import { useKeyboardHighlight } from '@/hooks/useKeyboardHighlight';

interface DailyChallengeProps {
  locale?: 'en' | 'he';
}

export function DailyChallenge({ locale: propLocale }: DailyChallengeProps) {
  const t = useTranslations('games');
  const tPractice = useTranslations('practice');
  const locale = (propLocale || useLocale()) as 'en' | 'he';
  const router = useRouter();

  // Daily challenge data
  const challenge = useMemo(() => getDailyChallenge(), []);

  // Game states
  const [gameState, setGameState] = useState<'ready' | 'typing' | 'finished'>('ready');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finishTime, setFinishTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(true);

  // Results
  const [results, setResults] = useState<{
    time: number;
    wpm: number;
    accuracy: number;
    xpEarned: number;
    alreadyCompleted: boolean;
    streakIncreased: boolean;
  } | null>(null);

  // Stores
  const addExerciseXp = useProgressStore((s) => s.addExerciseXp);
  const dailyStreak = useGameStore((s) => s.dailyStreak);
  const todayCompleted = useGameStore((s) => s.todayCompleted);
  const todayStats = useGameStore((s) => s.todayStats);
  const recordDailyResult = useGameStore((s) => s.recordDailyResult);
  const checkDailyReset = useGameStore((s) => s.checkDailyReset);

  // Check for daily reset on mount
  useEffect(() => {
    checkDailyReset();
  }, [checkDailyReset]);

  // Refs for flash functions (defined before hooks that use them)
  const flashCorrectRef = useRef<(key: string) => void>(() => {});
  const flashWrongRef = useRef<(key: string) => void>(() => {});

  // Typing engine - must be called before useKeyboardHighlight to get cursorPosition
  const handleCharacterTyped = useCallback((char: string, isCorrect: boolean) => {
    if (isCorrect) {
      flashCorrectRef.current(char);
    } else {
      flashWrongRef.current(char);
    }
  }, []);

  const {
    status,
    characters,
    stats,
    cursorPosition,
    setTargetText,
    start: startEngine,
    reset: resetEngine,
  } = useTypingEngine({
    onCharacterTyped: handleCharacterTyped,
    allowBackspace: true, // Allow backspace in daily challenge
  });

  // Check if typing is complete
  const isComplete = status === 'completed';

  // Keyboard highlight - now has access to cursorPosition
  const {
    pressedKeys,
    correctKey,
    wrongKey,
    flashCorrect,
    flashWrong,
  } = useKeyboardHighlight({
    targetText: challenge.text,
    currentPosition: cursorPosition,
    trackPressedKeys: gameState === 'typing',
  });

  // Update refs with current flash functions
  flashCorrectRef.current = flashCorrect;
  flashWrongRef.current = flashWrong;

  // Timer effect
  useEffect(() => {
    if (gameState !== 'typing' || !startTime) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, startTime]);

  // Check for completion
  useEffect(() => {
    if (isComplete && gameState === 'typing') {
      const endTime = Date.now();
      const totalTime = endTime - (startTime || endTime);
      setFinishTime(totalTime);
      setGameState('finished');

      // Record result
      const { alreadyCompleted, xpEarned, streakIncreased } = recordDailyResult(
        stats.wpm,
        stats.accuracy,
        totalTime
      );

      if (!alreadyCompleted) {
        addExerciseXp(xpEarned);
      }

      setResults({
        time: totalTime,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        xpEarned: alreadyCompleted ? 0 : xpEarned,
        alreadyCompleted,
        streakIncreased,
      });
    }
  }, [isComplete, gameState, startTime, stats, recordDailyResult, addExerciseXp]);

  // Initialize game
  const initGame = useCallback(() => {
    setTargetText(challenge.text);
    setGameState('ready');
    setStartTime(null);
    setFinishTime(null);
    setCurrentTime(0);
    setResults(null);
    resetEngine();
  }, [setTargetText, resetEngine, challenge.text]);

  // Start typing
  const startTyping = useCallback(() => {
    setGameState('typing');
    setStartTime(Date.now());
    startEngine();
  }, [startEngine]);

  // Handle key presses to start
  useEffect(() => {
    if (gameState !== 'ready') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startTyping();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startTyping]);

  // Initialize on mount
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Format time
  const formatTime = (ms: number): string => {
    const seconds = ms / 1000;
    if (seconds < 60) {
      return `${seconds.toFixed(1)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(0);
    return `${minutes}:${remainingSeconds.padStart(2, '0')}`;
  };

  // Progress percentage
  const progress = challenge.characterCount > 0
    ? (cursorPosition / challenge.characterCount) * 100
    : 0;

  // Next key to highlight
  const nextChar = challenge.text[cursorPosition]?.toLowerCase();

  // Format today's date
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString(locale === 'he' ? 'he-IL' : 'en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 dark:from-gray-900 dark:to-purple-900">
      {/* Header */}
      <GameHeader
        gameId="daily"
        icon="📅"
        currentValue={gameState === 'typing' ? formatTime(currentTime) : undefined}
        currentLabel={t('results.time')}
        locale={locale}
      />

      {/* Game area */}
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Daily info card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl">{challenge.theme.emoji}</span>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    {challenge.theme.name}
                  </h2>
                </div>
                <p className="text-sm text-muted">
                  {formatDate(challenge.date)}
                </p>
              </div>

              {/* Streak display */}
              {dailyStreak > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30">
                  <span className="text-2xl">🔥</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {dailyStreak} {t('dayStreak')}
                  </span>
                </div>
              )}
            </div>

            {/* Challenge stats */}
            <div className="flex gap-4 text-sm text-muted">
              <span>📝 {challenge.wordCount} words</span>
              <span>📊 {challenge.characterCount} characters</span>
            </div>

            {/* Already completed badge */}
            {todayCompleted && gameState === 'ready' && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <div className="font-semibold text-green-700 dark:text-green-400">
                      {t('completed')} Today!
                    </div>
                    {todayStats && (
                      <div className="text-sm text-green-600 dark:text-green-500">
                        {todayStats.wpm} WPM • {todayStats.accuracy}% accuracy • {formatTime(todayStats.time)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* XP bonus info */}
            {!todayCompleted && gameState === 'ready' && (
              <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center gap-2">
                <span className="text-xl">💎</span>
                <span className="text-sm text-purple-700 dark:text-purple-300">
                  Complete for <strong>1.5x XP bonus</strong>!
                </span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {gameState === 'typing' && (
            <div className="mb-4">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted mt-1">
                <span>{Math.round(progress)}%</span>
                <span>{stats.wpm} WPM</span>
              </div>
            </div>
          )}

          {/* Text display */}
          <div className="bg-surface rounded-2xl shadow-lg p-6 mb-6">
            {gameState === 'ready' ? (
              <div className="text-center">
                <p className="text-lg text-muted mb-4">
                  {todayCompleted
                    ? 'Practice again or come back tomorrow!'
                    : tPractice('pressEnterToStart')
                  }
                </p>
                <button
                  onClick={startTyping}
                  className="btn-primary px-8 py-3 rounded-xl text-lg font-semibold"
                >
                  {todayCompleted ? '🔄 Practice Again' : `🎯 ${t('play')}`}
                </button>
              </div>
            ) : (
              <div
                className="font-mono text-xl leading-relaxed select-none"
                role="textbox"
                aria-label={tPractice('typingArea')}
              >
                {characters.map((char: CharacterState, index: number) => (
                  <span
                    key={index}
                    className={`
                      transition-colors duration-100
                      ${char.status === 'correct' ? 'text-green-600 dark:text-green-400' : ''}
                      ${char.status === 'incorrect' ? 'text-red-500 bg-red-100 dark:bg-red-900/30' : ''}
                      ${char.status === 'current' ? 'bg-primary/20 text-primary border-b-2 border-primary' : ''}
                      ${char.status === 'pending' ? 'text-muted' : ''}
                    `}
                  >
                    {char.char === ' ' ? '\u00A0' : char.char}
                  </span>
                ))}
              </div>
            )}

            {/* Stats during typing */}
            {gameState === 'typing' && (
              <div className="flex justify-center gap-8 mt-4 text-sm text-muted">
                <span>{tPractice('stats.accuracy')}: {stats.accuracy}%</span>
                <span>{tPractice('stats.errors')}: {stats.errorCount}</span>
              </div>
            )}
          </div>

          {/* Keyboard toggle */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowKeyboard(!showKeyboard)}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              {showKeyboard ? '⌨️ Hide Keyboard' : '⌨️ Show Keyboard'}
            </button>
          </div>

          {/* Visual keyboard */}
          {showKeyboard && gameState !== 'ready' && (
            <div className="flex justify-center">
              <Keyboard
                highlightedKey={nextChar}
                pressedKeys={pressedKeys}
                correctKey={correctKey}
                wrongKey={wrongKey}
                showFingerColors
                baseSize={44}
              />
            </div>
          )}
        </div>
      </div>

      {/* Results modal */}
      {results && (
        <GameResults
          icon="📅"
          score={formatTime(results.time)}
          scoreLabel={t('results.time')}
          isNewBest={!results.alreadyCompleted && results.streakIncreased}
          xpEarned={results.xpEarned}
          stats={[
            { label: t('results.wpm'), value: results.wpm, icon: '⚡' },
            { label: t('results.accuracy'), value: `${results.accuracy}%`, icon: '🎯' },
            ...(results.streakIncreased
              ? [{ label: t('dayStreak'), value: `${dailyStreak} 🔥`, icon: '', highlight: true }]
              : []
            ),
          ]}
          onPlayAgain={initGame}
          onExit={() => router.push('/games')}
          showConfetti={!results.alreadyCompleted}
        />
      )}
    </div>
  );
}
