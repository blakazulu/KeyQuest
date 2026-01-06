'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useTypingEngine, type CharacterState } from '@/hooks/useTypingEngine';
import { useProgressStore } from '@/stores/useProgressStore';
import { useGameStore } from '@/stores/useGameStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { getDailyChallenge, type DailyChallenge as DailyChallengeData } from '@/lib/dailyGenerator';
import { GameResults } from './GameResults';
import { Keyboard } from '@/components/keyboard/Keyboard';
import { HandsWithKeyboard } from '@/components/keyboard/HandGuide';
import { useKeyboardHighlight } from '@/hooks/useKeyboardHighlight';
import { DailyBackground } from './GameBackgrounds';
import { KeyboardLayoutChecker } from '@/components/ui/KeyboardLayoutChecker';

interface DailyChallengeProps {
  locale?: 'en' | 'he';
}

export function DailyChallenge({ locale: propLocale }: DailyChallengeProps) {
  const t = useTranslations('games');
  const tPractice = useTranslations('practice');
  const hookLocale = useLocale() as 'en' | 'he';
  const locale = propLocale || hookLocale;
  const router = useRouter();

  // Get keyboard layout first (needed for challenge generation)
  const keyboardLayout = useSettingsStore((s) => s.keyboardLayout);

  // Daily challenge data
  const challenge = useMemo(() => getDailyChallenge(new Date(), keyboardLayout), [keyboardLayout]);

  // Game states
  const [gameState, setGameState] = useState<'verifying' | 'ready' | 'typing' | 'finished'>('verifying');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finishTime, setFinishTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showHands, setShowHands] = useState(true);

  // Handle keyboard verification complete
  const handleKeyboardReady = useCallback(() => {
    setGameState('ready');
  }, []);

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
    highlightedKey,
    activeFinger,
  } = useKeyboardHighlight({
    targetText: challenge.text,
    currentPosition: cursorPosition,
    trackPressedKeys: gameState === 'typing',
    layout: keyboardLayout,
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
    <div className="fixed inset-0 z-[9999] flex flex-col overflow-hidden">
      <DailyBackground />

      {/* Keyboard layout verification */}
      {gameState === 'verifying' && (
        <KeyboardLayoutChecker
          expectedLayout={keyboardLayout}
          locale={locale}
          onReady={handleKeyboardReady}
        />
      )}

      {/* Top control bar */}
      <header className="flex-shrink-0 flex items-center justify-center gap-3 p-4 z-10">
        {/* Daily info pill */}
        <div className="flex items-center gap-3 px-5 py-2.5 bg-black/50 backdrop-blur-md rounded-xl text-white">
          <span className="text-2xl">{challenge.theme.emoji}</span>
          <div>
            <div className="font-bold text-sm">{challenge.theme.name}</div>
            <div className="text-xs text-white/60">{formatDate(challenge.date)}</div>
          </div>
        </div>

        {/* Stats pill (during typing) */}
        {gameState === 'typing' && (
          <div className="flex items-center gap-4 px-5 py-2.5 bg-black/50 backdrop-blur-md rounded-xl text-white">
            <div className="flex items-center gap-2">
              <span className="text-pink-400">⏱️</span>
              <span className="font-bold">{formatTime(currentTime)}</span>
            </div>
            <div className="w-px h-5 bg-white/30" />
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">⚡</span>
              <span>{stats.wpm} WPM</span>
            </div>
            <div className="w-px h-5 bg-white/30" />
            <div className="flex items-center gap-2">
              <span className="text-green-400">🎯</span>
              <span>{stats.accuracy}%</span>
            </div>
          </div>
        )}

        {/* Streak pill */}
        {dailyStreak > 0 && (
          <div className="px-4 py-2.5 bg-orange-500/80 backdrop-blur-md rounded-xl text-white font-medium text-sm">
            🔥 {dailyStreak} {t('dayStreak')}
          </div>
        )}

        {/* Completed badge */}
        {todayCompleted && gameState === 'ready' && (
          <div className="px-4 py-2.5 bg-green-500/80 backdrop-blur-md rounded-xl text-white font-medium text-sm">
            ✅ {t('completed')}
          </div>
        )}

        {/* Hands toggle */}
        <button
          onClick={() => setShowHands(!showHands)}
          className={`
            flex items-center gap-2 px-4 py-2.5
            backdrop-blur-md rounded-xl
            font-medium text-sm
            transition-all duration-200
            shadow-md
            ${showHands
              ? 'bg-pink-500 text-white hover:bg-pink-600'
              : 'bg-white/20 text-white hover:bg-white/30'
            }
          `}
        >
          ✋
          <span className="hidden sm:inline">
            {showHands ? 'Hide Hands' : 'Show Hands'}
          </span>
        </button>

        {/* Exit */}
        <button
          onClick={() => router.push('/games')}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 backdrop-blur-md rounded-xl text-white font-medium text-sm transition-all shadow-md"
        >
          ✕
          <span>Exit</span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 gap-4 z-10 overflow-hidden">
        {/* Progress bar (during typing) */}
        {gameState === 'typing' && (
          <div className="w-full max-w-3xl">
            <div className="h-3 bg-black/30 backdrop-blur-sm rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 transition-all duration-150 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-white/70 mt-1">
              <span>{Math.round(progress)}%</span>
              <span>{challenge.wordCount} words • {challenge.characterCount} chars</span>
            </div>
          </div>
        )}

        {/* Monitor with text */}
        <div className="typing-monitor w-full max-w-3xl flex-shrink-0">
          <div className="typing-monitor-screen">
            {gameState === 'ready' ? (
              <div className="text-center py-6">
                {/* XP bonus info */}
                {!todayCompleted && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/30 rounded-full mb-6">
                    <span className="text-xl">💎</span>
                    <span className="text-sm text-purple-200">
                      Complete for <strong>1.5x XP bonus</strong>!
                    </span>
                  </div>
                )}

                {/* Already completed info */}
                {todayCompleted && todayStats && (
                  <div className="mb-6 p-4 bg-green-500/20 rounded-xl">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className="text-2xl">✅</span>
                      <span className="font-semibold text-green-300">{t('completed')} Today!</span>
                    </div>
                    <div className="text-sm text-green-200/70">
                      {todayStats.wpm} WPM • {todayStats.accuracy}% accuracy • {formatTime(todayStats.time)}
                    </div>
                  </div>
                )}

                <p className="text-lg text-indigo-200 mb-6">
                  {todayCompleted
                    ? 'Practice again or come back tomorrow!'
                    : tPractice('pressEnterToStart')
                  }
                </p>
                <button
                  onClick={startTyping}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold shadow-lg hover:scale-105 transition-transform"
                >
                  {todayCompleted ? '🔄 Practice Again' : `📅 ${t('play')}`}
                </button>
              </div>
            ) : (
              <div className="typing-text text-xl leading-relaxed select-none text-center">
                {/* Group characters into words to prevent mid-word line breaks */}
                {(() => {
                  const words: CharacterState[][] = [];
                  let currentWord: CharacterState[] = [];
                  characters.forEach((charState: CharacterState) => {
                    if (charState.char === ' ') {
                      if (currentWord.length > 0) {
                        words.push(currentWord);
                        currentWord = [];
                      }
                      words.push([charState]);
                    } else {
                      currentWord.push(charState);
                    }
                  });
                  if (currentWord.length > 0) {
                    words.push(currentWord);
                  }
                  return words.map((word, wordIndex) => (
                    <span key={wordIndex} className="inline-block whitespace-nowrap">
                      {word.map((char: CharacterState) => (
                        <span
                          key={char.index}
                          className={`
                            transition-colors duration-100
                            ${char.status === 'correct' ? 'text-green-400' : ''}
                            ${char.status === 'incorrect' ? 'text-red-400 bg-red-900/30' : ''}
                            ${char.status === 'current' ? 'bg-pink-500/30 text-pink-300 border-b-2 border-pink-400' : ''}
                            ${char.status === 'pending' ? 'text-indigo-300/60' : ''}
                          `}
                        >
                          {char.char === ' ' ? '\u00A0' : char.char}
                        </span>
                      ))}
                    </span>
                  ));
                })()}
              </div>
            )}
          </div>
          <div className="typing-monitor-stand" />
        </div>

        {/* Keyboard with hands */}
        {showHands && gameState === 'typing' && (
          <div className="w-full max-w-5xl flex-shrink-0 animate-fade-in">
            <HandsWithKeyboard activeFinger={activeFinger} locale={locale}>
              <Keyboard
                layout={keyboardLayout}
                highlightedKey={highlightedKey || nextChar}
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
      </main>

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
