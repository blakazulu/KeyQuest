'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useTypingEngine, type CharacterState } from '@/hooks/useTypingEngine';
import { useProgressStore } from '@/stores/useProgressStore';
import { useGameStore } from '@/stores/useGameStore';
import { GameHeader } from './GameHeader';
import { GameResults } from './GameResults';
import { Keyboard } from '@/components/keyboard/Keyboard';
import { useKeyboardHighlight } from '@/hooks/useKeyboardHighlight';

// Sample race texts (short sentences for racing)
const RACE_TEXTS = [
  'The quick brown fox jumps over the lazy dog.',
  'Speed is the essence of victory in every race.',
  'Type fast and accurate to win the championship.',
  'Racing through words like a champion driver.',
  'Every keystroke brings you closer to the finish.',
  'The fastest fingers in the west type with precision.',
  'Burning rubber on the keyboard highway today.',
  'Zoom past the competition with perfect typing.',
  'Victory awaits those who type without fear.',
  'Cross the finish line first with perfect accuracy.',
];

function getRandomText(): string {
  return RACE_TEXTS[Math.floor(Math.random() * RACE_TEXTS.length)];
}

function formatTime(ms: number): string {
  const seconds = ms / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(1);
  return `${minutes}:${remainingSeconds.padStart(4, '0')}`;
}

interface RaceGameProps {
  locale?: 'en' | 'he';
}

export function RaceGame({ locale: propLocale }: RaceGameProps) {
  const t = useTranslations('games');
  const tPractice = useTranslations('practice');
  const locale = (propLocale || useLocale()) as 'en' | 'he';
  const router = useRouter();

  // Game states
  const [gameState, setGameState] = useState<'ready' | 'racing' | 'finished'>('ready');
  const [targetText, setTargetText] = useState('');
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
    isNewBest: boolean;
  } | null>(null);

  // Stores
  const addExerciseXp = useProgressStore((s) => s.addExerciseXp);
  const raceBestTime = useGameStore((s) => s.raceBestTime);
  const recordRaceResult = useGameStore((s) => s.recordRaceResult);

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
    setTargetText: setEngineText,
    start: startEngine,
    reset: resetEngine,
  } = useTypingEngine({
    onCharacterTyped: handleCharacterTyped,
    allowBackspace: false,
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
    targetText: targetText,
    currentPosition: cursorPosition,
    trackPressedKeys: gameState === 'racing',
  });

  // Update refs with current flash functions
  flashCorrectRef.current = flashCorrect;
  flashWrongRef.current = flashWrong;

  // Timer effect
  useEffect(() => {
    if (gameState !== 'racing' || !startTime) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, startTime]);

  // Check for completion
  useEffect(() => {
    if (isComplete && gameState === 'racing') {
      const endTime = Date.now();
      const totalTime = endTime - (startTime || endTime);
      setFinishTime(totalTime);
      setGameState('finished');

      // Calculate results
      const { isNewBest, xpEarned } = recordRaceResult(totalTime, targetText.length);
      addExerciseXp(xpEarned);

      setResults({
        time: totalTime,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        xpEarned,
        isNewBest,
      });
    }
  }, [isComplete, gameState, startTime, targetText.length, stats, recordRaceResult, addExerciseXp]);

  // Initialize game
  const initGame = useCallback(() => {
    const text = getRandomText();
    setTargetText(text);
    setEngineText(text);
    setGameState('ready');
    setStartTime(null);
    setFinishTime(null);
    setCurrentTime(0);
    setResults(null);
    resetEngine();
  }, [setEngineText, resetEngine]);

  // Start racing
  const startRace = useCallback(() => {
    setGameState('racing');
    setStartTime(Date.now());
    startEngine();
  }, [startEngine]);

  // Handle key presses to start
  useEffect(() => {
    if (gameState !== 'ready') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startRace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startRace]);

  // Initialize on mount
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Calculate progress percentage - correct keys move forward, errors move back
  const baseProgress = targetText.length > 0 ? (stats.correctCount / targetText.length) * 100 : 0;
  // Each error moves the car back by 2% (but can't go below 0)
  const progress = Math.max(0, baseProgress - (stats.errorCount * 2));

  // Get next key to highlight
  const nextChar = targetText[cursorPosition]?.toLowerCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <GameHeader
        gameId="race"
        icon="🏎️"
        bestScore={raceBestTime ? formatTime(raceBestTime) : undefined}
        bestScoreLabel={t('bestTime')}
        currentValue={gameState === 'racing' ? formatTime(currentTime) : undefined}
        currentLabel={t('results.time')}
        locale={locale}
      />

      {/* Game area */}
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Race Track */}
          <div className="relative mb-8 h-48 bg-gray-700 rounded-2xl overflow-hidden shadow-xl">
            {/* Sky background */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-300 dark:from-sky-900 dark:to-sky-800" />

            {/* Hills */}
            <div className="absolute bottom-16 left-0 right-0 h-16">
              <svg viewBox="0 0 1200 100" className="w-full h-full" preserveAspectRatio="none">
                <path
                  d="M0,100 C200,20 400,80 600,40 C800,0 1000,60 1200,30 L1200,100 L0,100 Z"
                  fill="#22c55e"
                  className="dark:fill-green-800"
                />
              </svg>
            </div>

            {/* Road */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-600 dark:bg-gray-700">
              {/* Road markings - animate based on progress */}
              <div
                className="absolute top-1/2 left-0 right-0 h-1 flex gap-8"
                style={{ transform: `translateX(-${progress}%)` }}
              >
                {[...Array(30)].map((_, i) => (
                  <div key={i} className="w-12 h-1 bg-yellow-400 flex-shrink-0" />
                ))}
              </div>

              {/* Start line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-white" />

              {/* Finish line */}
              <div
                className="absolute top-0 bottom-0 w-4 transition-all duration-300"
                style={{
                  right: `${Math.max(0, 8 - progress * 0.8)}%`,
                  background: 'repeating-linear-gradient(0deg, white 0px, white 4px, black 4px, black 8px)',
                }}
              />
            </div>

            {/* Car */}
            <div
              className="absolute bottom-4 transition-all duration-150 ease-out"
              style={{
                left: `${Math.min(85, 5 + progress * 0.8)}%`,
                transform: `translateX(-50%)`,
              }}
            >
              {/* Car body - flipped to face right */}
              <div className="relative">
                <div
                  className="text-5xl filter drop-shadow-lg"
                  style={{ transform: 'scaleX(-1)' }}
                >
                  🏎️
                </div>
                {/* Speed lines behind the car (on left side) */}
                {gameState === 'racing' && stats.wpm > 30 && (
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-row-reverse gap-1 opacity-60">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-0.5 bg-white rounded-full animate-pulse"
                        style={{
                          animationDelay: `${i * 100}ms`,
                          width: `${12 + i * 4}px`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="absolute top-4 left-4 right-4 h-2 bg-black/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Speed indicator */}
            {gameState === 'racing' && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm font-bold">
                {stats.wpm} WPM
              </div>
            )}
          </div>

          {/* Text display */}
          <div className="bg-surface rounded-2xl shadow-lg p-6 mb-6">
            {gameState === 'ready' ? (
              <div className="text-center">
                <p className="text-lg text-muted mb-4">{tPractice('pressEnterToStart')}</p>
                <button
                  onClick={startRace}
                  className="btn-primary px-8 py-3 rounded-xl text-lg font-semibold"
                >
                  🏁 {t('play')}
                </button>
              </div>
            ) : (
              <div
                className="font-mono text-2xl leading-relaxed select-none"
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

            {/* Stats during race */}
            {gameState === 'racing' && (
              <div className="flex justify-center gap-8 mt-4 text-sm text-muted">
                <span>{tPractice('stats.accuracy')}: {stats.accuracy}%</span>
                <span>{tPractice('stats.errors')}: {stats.errorCount}</span>
              </div>
            )}
          </div>

          {/* Keyboard toggle - only show during racing */}
          {gameState === 'racing' && (
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setShowKeyboard(!showKeyboard)}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {showKeyboard ? '⌨️ Hide Keyboard' : '⌨️ Show Keyboard'}
              </button>
            </div>
          )}

          {/* Visual keyboard - only show during racing */}
          {showKeyboard && gameState === 'racing' && (
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
          icon="🏎️"
          score={formatTime(results.time)}
          scoreLabel={t('results.time')}
          isNewBest={results.isNewBest}
          xpEarned={results.xpEarned}
          stats={[
            { label: t('results.wpm'), value: results.wpm, icon: '⚡' },
            { label: t('results.accuracy'), value: `${results.accuracy}%`, icon: '🎯' },
          ]}
          onPlayAgain={initGame}
          onExit={() => router.push('/games')}
        />
      )}
    </div>
  );
}
