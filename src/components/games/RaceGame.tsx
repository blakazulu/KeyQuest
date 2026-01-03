'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useTypingEngine, type CharacterState } from '@/hooks/useTypingEngine';
import { useProgressStore } from '@/stores/useProgressStore';
import { useGameStore } from '@/stores/useGameStore';
import { GameResults } from './GameResults';
import { Keyboard } from '@/components/keyboard/Keyboard';
import { HandsWithKeyboard } from '@/components/keyboard/HandGuide';
import { useKeyboardHighlight } from '@/hooks/useKeyboardHighlight';
import { RaceBackground } from './GameBackgrounds';

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
  const [showHands, setShowHands] = useState(true);

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
    highlightedKey,
    activeFinger,
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
    <div className="fixed inset-0 z-[9999] flex flex-col overflow-hidden">
      <RaceBackground />

      {/* Top control bar - pill style like CalmMode */}
      <header className="flex-shrink-0 flex items-center justify-center gap-3 p-4 z-10">
        {/* Stats pill */}
        {gameState === 'racing' && (
          <div className="flex items-center gap-4 px-5 py-2.5 bg-black/50 backdrop-blur-md rounded-xl text-white">
            <div className="flex items-center gap-2">
              <span className="text-orange-400">⏱️</span>
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

        {/* Best time pill */}
        {raceBestTime && (
          <div className="px-4 py-2.5 bg-amber-500/80 backdrop-blur-md rounded-xl text-white font-medium text-sm">
            🏆 {t('bestTime')}: {formatTime(raceBestTime)}
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
              ? 'bg-orange-500 text-white hover:bg-orange-600'
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
      <main className="flex-1 flex flex-col items-center justify-center px-4 gap-6 z-10 overflow-hidden">
        {/* Race Track Visual */}
        <div className="w-full max-w-4xl relative h-40 bg-gradient-to-b from-gray-700 to-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-600">
          {/* Road surface */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-600 to-gray-700" />

          {/* Road markings - animate based on progress */}
          <div
            className="absolute top-1/2 left-0 right-0 h-1 flex gap-8 -translate-y-1/2"
            style={{ transform: `translateX(-${progress}%)` }}
          >
            {[...Array(30)].map((_, i) => (
              <div key={i} className="w-12 h-1 bg-yellow-400 flex-shrink-0" />
            ))}
          </div>

          {/* Start line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-white opacity-50" />

          {/* Finish line */}
          <div
            className="absolute top-0 bottom-0 w-4 transition-all duration-300"
            style={{
              right: `${Math.max(4, 8 - progress * 0.08)}%`,
              background: 'repeating-linear-gradient(0deg, white 0px, white 8px, #1a1a1a 8px, #1a1a1a 16px)',
            }}
          />

          {/* Car */}
          <div
            className="absolute top-1/2 transition-all duration-150 ease-out"
            style={{
              left: `${Math.min(85, 5 + progress * 0.8)}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative">
              <div className="text-5xl filter drop-shadow-lg" style={{ transform: 'scaleX(-1)' }}>
                🏎️
              </div>
              {/* Speed lines */}
              {gameState === 'racing' && stats.wpm > 30 && (
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-row-reverse gap-1 opacity-60">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-0.5 bg-orange-400 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 100}ms`, width: `${12 + i * 4}px` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Progress bar at top */}
          <div className="absolute top-3 left-3 right-3 h-2 bg-black/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 transition-all duration-150 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Monitor with text */}
        <div className="typing-monitor w-full max-w-3xl flex-shrink-0">
          <div className="typing-monitor-screen">
            {gameState === 'ready' ? (
              <div className="text-center py-8">
                <p className="text-lg text-indigo-200 mb-6">{tPractice('pressEnterToStart')}</p>
                <button
                  onClick={startRace}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-xl font-bold shadow-lg hover:scale-105 transition-transform"
                >
                  🏁 {t('play')}
                </button>
              </div>
            ) : (
              <div className="font-mono text-2xl leading-relaxed select-none text-center">
                {characters.map((char: CharacterState, index: number) => (
                  <span
                    key={index}
                    className={`
                      transition-colors duration-100
                      ${char.status === 'correct' ? 'text-green-400' : ''}
                      ${char.status === 'incorrect' ? 'text-red-400 bg-red-900/30' : ''}
                      ${char.status === 'current' ? 'bg-orange-500/30 text-orange-300 border-b-2 border-orange-400' : ''}
                      ${char.status === 'pending' ? 'text-indigo-300/60' : ''}
                    `}
                  >
                    {char.char === ' ' ? '\u00A0' : char.char}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="typing-monitor-stand" />
        </div>

        {/* Keyboard with hands */}
        {showHands && gameState === 'racing' && (
          <div className="w-full max-w-5xl flex-shrink-0 animate-fade-in">
            <HandsWithKeyboard activeFinger={activeFinger} locale={locale}>
              <Keyboard
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
