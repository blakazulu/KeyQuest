'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/stores/useProgressStore';
import { useGameStore } from '@/stores/useGameStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useSound } from '@/hooks/useSound';
import { GameResults } from './GameResults';
import { Keyboard } from '@/components/keyboard/Keyboard';
import { HandsWithKeyboard } from '@/components/keyboard/HandGuide';
import { useKeyboardHighlight } from '@/hooks/useKeyboardHighlight';
import { TargetBackground } from './GameBackgrounds';

const GAME_DURATION = 60000; // 60 seconds
const TARGET_LIFETIME = 3000; // 3 seconds before target disappears
const TARGET_SPAWN_INTERVAL = 800; // New target every 800ms
const MAX_TARGETS = 8; // Maximum targets on screen

const LETTERS_ENGLISH = 'abcdefghijklmnopqrstuvwxyz'.split('');
const LETTERS_HEBREW = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');

function getLettersForLayout(layout: 'qwerty' | 'hebrew'): string[] {
  return layout === 'hebrew' ? LETTERS_HEBREW : LETTERS_ENGLISH;
}

interface Target {
  id: number;
  letter: string;
  x: number; // percentage
  y: number; // percentage
  size: 'small' | 'medium' | 'large';
  createdAt: number;
}

function getRandomLetter(layout: 'qwerty' | 'hebrew'): string {
  const letters = getLettersForLayout(layout);
  return letters[Math.floor(Math.random() * letters.length)];
}

function getRandomPosition(): { x: number; y: number } {
  return {
    x: 10 + Math.random() * 80, // 10-90%
    y: 10 + Math.random() * 70, // 10-80%
  };
}

function getRandomSize(): 'small' | 'medium' | 'large' {
  const rand = Math.random();
  if (rand < 0.3) return 'small';
  if (rand < 0.7) return 'medium';
  return 'large';
}

const SIZE_POINTS: Record<string, number> = {
  small: 30,
  medium: 20,
  large: 10,
};

interface TargetGameProps {
  locale?: 'en' | 'he';
}

export function TargetGame({ locale: propLocale }: TargetGameProps) {
  const t = useTranslations('games');
  const hookLocale = useLocale() as 'en' | 'he';
  const locale = propLocale || hookLocale;
  const router = useRouter();
  const { playKeypress, playError, playCombo, playSuccess } = useSound();

  // Game states
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [hitEffects, setHitEffects] = useState<{ id: number; x: number; y: number; points: number }[]>([]);
  const [showHands, setShowHands] = useState(true);
  const [lastHitLetter, setLastHitLetter] = useState<string | null>(null);

  // Refs
  const targetIdRef = useRef(0);
  const effectIdRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Results
  const [results, setResults] = useState<{
    score: number;
    maxCombo: number;
    hits: number;
    accuracy: number;
    xpEarned: number;
    isNewHighScore: boolean;
    isNewComboRecord: boolean;
  } | null>(null);

  // Stores
  const addExerciseXp = useProgressStore((s) => s.addExerciseXp);
  const targetHighScore = useGameStore((s) => s.targetHighScore);
  const targetMaxComboRecord = useGameStore((s) => s.targetMaxCombo);
  const recordTargetResult = useGameStore((s) => s.recordTargetResult);
  const keyboardLayout = useSettingsStore((s) => s.keyboardLayout);

  // Keyboard highlight for hands display
  const {
    activeFinger,
  } = useKeyboardHighlight({
    targetText: lastHitLetter || '',
    currentPosition: 0,
    trackPressedKeys: gameState === 'playing',
    layout: keyboardLayout,
  });

  // Spawn a new target
  const spawnTarget = useCallback(() => {
    setTargets(prev => {
      // Check max targets inside the setter to avoid stale closure
      if (prev.length >= MAX_TARGETS) return prev;

      const pos = getRandomPosition();
      const newTarget: Target = {
        id: ++targetIdRef.current,
        letter: getRandomLetter(keyboardLayout),
        x: pos.x,
        y: pos.y,
        size: getRandomSize(),
        createdAt: Date.now(),
      };

      return [...prev, newTarget];
    });
  }, [keyboardLayout]);

  // Remove expired targets
  const removeExpiredTargets = useCallback(() => {
    const now = Date.now();
    setTargets(prev => {
      const expired = prev.filter(t => now - t.createdAt > TARGET_LIFETIME);
      if (expired.length > 0) {
        setMisses(m => m + expired.length);
        setCombo(0); // Break combo on miss
      }
      return prev.filter(t => now - t.createdAt <= TARGET_LIFETIME);
    });
  }, []);

  // Handle key press
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    // Match Latin letters (a-z) or Hebrew letters (U+05D0-U+05EA)
    if (e.key.length !== 1 || !/[a-z\u05D0-\u05EA]/i.test(e.key)) return;

    const key = e.key.toLowerCase();
    const targetIndex = targets.findIndex(t => t.letter === key);

    if (targetIndex !== -1) {
      const target = targets[targetIndex];
      const newCombo = combo + 1;
      const multiplier = Math.min(5, 1 + Math.floor(newCombo / 5) * 0.5);
      const points = Math.round(SIZE_POINTS[target.size] * multiplier);

      // Play sounds
      playKeypress();
      // Play combo sound on milestone (every 5 hits)
      if (newCombo % 5 === 0) {
        playCombo();
      }

      // Update last hit letter for hands
      setLastHitLetter(key);

      // Add hit effect - capture the ID immediately
      const effectId = ++effectIdRef.current;
      setHitEffects(prev => [...prev, {
        id: effectId,
        x: target.x,
        y: target.y,
        points,
      }]);

      // Update state
      setTargets(prev => prev.filter(t => t.id !== target.id));
      setScore(s => s + points);
      setCombo(newCombo);
      setMaxCombo(m => Math.max(m, newCombo));
      setHits(h => h + 1);

      // Remove effect after animation - use captured ID
      setTimeout(() => {
        setHitEffects(prev => prev.filter(e => e.id !== effectId));
      }, 500);
    } else {
      // Wrong key - break combo
      playError();
      setCombo(0);
      setMisses(m => m + 1);
    }
  }, [gameState, targets, combo, playKeypress, playError, playCombo]);

  // Game timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current || Date.now());
      const remaining = Math.max(0, GAME_DURATION - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setGameState('finished');
      }
    }, 100);

    return () => clearInterval(interval);
  }, [gameState]);

  // Target spawning
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(spawnTarget, TARGET_SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [gameState, spawnTarget]);

  // Remove expired targets
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(removeExpiredTargets, 100);
    return () => clearInterval(interval);
  }, [gameState, removeExpiredTargets]);

  // Key press listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Handle game finish
  useEffect(() => {
    if (gameState !== 'finished' || results) return;

    const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;
    const { isNewHighScore, isNewComboRecord, xpEarned } = recordTargetResult(score, maxCombo, hits);
    addExerciseXp(xpEarned);

    // Play success sound if player scored well
    if (hits >= 10) {
      playSuccess();
    }

    setResults({
      score,
      maxCombo,
      hits,
      accuracy,
      xpEarned,
      isNewHighScore,
      isNewComboRecord,
    });
  }, [gameState, results, score, maxCombo, hits, misses, recordTargetResult, addExerciseXp, playSuccess]);

  // Start game
  const startGame = useCallback(() => {
    setGameState('playing');
    startTimeRef.current = Date.now();
    setTargets([]);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHits(0);
    setMisses(0);
    setTimeLeft(GAME_DURATION);
    setResults(null);
  }, []);

  // Start on Enter/Space
  useEffect(() => {
    if (gameState !== 'ready') return;

    const handleStart = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startGame();
      }
    };

    window.addEventListener('keydown', handleStart);
    return () => window.removeEventListener('keydown', handleStart);
  }, [gameState, startGame]);

  const formatTimeLeft = (ms: number): string => {
    const seconds = Math.ceil(ms / 1000);
    return `${seconds}s`;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col overflow-hidden">
      <TargetBackground />

      {/* Top control bar */}
      <header className="flex-shrink-0 flex items-center justify-center gap-3 p-4 z-10">
        {/* Timer */}
        {gameState === 'playing' && (
          <div className={`px-5 py-2.5 rounded-xl font-bold text-lg ${
            timeLeft < 10000 ? 'bg-red-500 text-white animate-pulse' : 'bg-white/20 backdrop-blur-md text-white'
          }`}>
            ⏱️ {formatTimeLeft(timeLeft)}
          </div>
        )}

        {/* Stats pill */}
        {gameState === 'playing' && (
          <div className="flex items-center gap-4 px-5 py-2.5 bg-black/50 backdrop-blur-md rounded-xl text-white">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">⭐</span>
              <span className="font-bold">{score.toLocaleString()}</span>
            </div>
            {combo > 0 && (
              <>
                <div className="w-px h-5 bg-white/30" />
                <div className="flex items-center gap-2 text-orange-400">
                  <span>🔥</span>
                  <span className="font-bold">{combo}x</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* High score pill */}
        {targetHighScore > 0 && (
          <div className="px-4 py-2.5 bg-purple-500/80 backdrop-blur-md rounded-xl text-white font-medium text-sm">
            🏆 Best: {targetHighScore.toLocaleString()}
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
              ? 'bg-purple-500 text-white hover:bg-purple-600'
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
        {/* Target area */}
        <div
          ref={containerRef}
          className="relative w-full max-w-4xl h-[45vh] min-h-[300px] bg-black/30 backdrop-blur-sm rounded-3xl overflow-hidden border-2 border-white/20"
        >
          {/* Crosshair decoration */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white" />
          </div>

          {/* Ready screen */}
          {gameState === 'ready' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="text-7xl mb-6">🎯</div>
              <h2 className="font-display text-3xl font-bold mb-4">{t('target.title')}</h2>
              <p className="text-lg text-white/70 mb-6 max-w-md text-center">
                {t('target.description')}
              </p>
              <button
                onClick={startGame}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xl font-bold shadow-lg hover:scale-105 transition-transform"
              >
                ▶ {t('play')}
              </button>
              <p className="mt-4 text-sm text-white/50">
                Press Enter or Space to start
              </p>
            </div>
          )}

          {/* Targets */}
          <AnimatePresence>
            {targets.map(target => {
              const lifetime = Date.now() - target.createdAt;
              const opacity = 1 - (lifetime / TARGET_LIFETIME) * 0.5;
              const sizeClass = {
                small: 'w-12 h-12 text-2xl',
                medium: 'w-16 h-16 text-3xl',
                large: 'w-20 h-20 text-4xl',
              }[target.size];

              return (
                <motion.div
                  key={target.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0, opacity }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className={`absolute ${sizeClass} rounded-full bg-gradient-to-br from-red-500 to-red-600 border-4 border-white shadow-lg flex items-center justify-center font-bold text-white uppercase`}
                  style={{
                    left: `${target.x}%`,
                    top: `${target.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {target.letter}

                  {/* Countdown ring */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeDasharray={`${(1 - lifetime / TARGET_LIFETIME) * 283} 283`}
                      opacity={0.5}
                    />
                  </svg>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Hit effects */}
          <AnimatePresence>
            {hitEffects.map(effect => (
              <motion.div
                key={effect.id}
                initial={{ scale: 0.5, opacity: 1, y: 0 }}
                animate={{ scale: 1.5, opacity: 0, y: -50 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute text-2xl font-bold text-yellow-400 pointer-events-none"
                style={{
                  left: `${effect.x}%`,
                  top: `${effect.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                +{effect.points}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Game over overlay */}
          {gameState === 'finished' && !results && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-4xl font-bold text-white animate-pulse">
                Time&apos;s Up!
              </div>
            </div>
          )}
        </div>

        {/* Stats during game */}
        {gameState === 'playing' && (
          <div className="flex justify-center gap-8 text-white/70 text-sm">
            <span>Hits: {hits}</span>
            <span>Misses: {misses}</span>
            <span>Best Combo: {maxCombo}</span>
          </div>
        )}

        {/* Keyboard with hands */}
        {showHands && gameState === 'playing' && (
          <div className="w-full max-w-5xl flex-shrink-0 animate-fade-in">
            <HandsWithKeyboard activeFinger={activeFinger} locale={locale}>
              <Keyboard
                layout={keyboardLayout}
                highlightedKey={lastHitLetter || undefined}
                pressedKeys={new Set()}
                showFingerColors={true}
                showHomeRow={true}
                baseSize={40}
              />
            </HandsWithKeyboard>
          </div>
        )}
      </main>

      {/* Results modal */}
      {results && (
        <GameResults
          icon="🎯"
          score={results.score.toLocaleString()}
          scoreLabel={t('results.score')}
          isNewBest={results.isNewHighScore}
          xpEarned={results.xpEarned}
          stats={[
            { label: 'Hits', value: results.hits, icon: '🎯' },
            { label: t('results.accuracy'), value: `${results.accuracy}%`, icon: '📊' },
            { label: t('maxCombo'), value: `${results.maxCombo}x`, icon: '🔥', highlight: results.isNewComboRecord },
          ]}
          onPlayAgain={startGame}
          onExit={() => router.push('/games')}
          showConfetti={results.isNewHighScore || results.isNewComboRecord}
        />
      )}
    </div>
  );
}
