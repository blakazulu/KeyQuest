'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/stores/useProgressStore';
import { useGameStore } from '@/stores/useGameStore';
import { GameHeader } from './GameHeader';
import { GameResults } from './GameResults';
import { Keyboard } from '@/components/keyboard/Keyboard';
import { useKeyboardHighlight } from '@/hooks/useKeyboardHighlight';

// Word lists by difficulty
const SHORT_WORDS = ['cat', 'dog', 'sun', 'run', 'big', 'top', 'hat', 'red', 'box', 'cup'];
const MEDIUM_WORDS = ['house', 'water', 'green', 'happy', 'tower', 'block', 'build', 'stack', 'climb'];
const LONG_WORDS = ['building', 'elephant', 'mountain', 'keyboard', 'champion', 'practice', 'strength'];

const BLOCK_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
];

interface Block {
  id: number;
  word: string;
  color: string;
  wobble: number; // random wobble offset
}

function getRandomWord(height: number): string {
  // Increase difficulty as tower grows
  if (height < 5) {
    return SHORT_WORDS[Math.floor(Math.random() * SHORT_WORDS.length)];
  } else if (height < 15) {
    const pool = [...SHORT_WORDS, ...MEDIUM_WORDS];
    return pool[Math.floor(Math.random() * pool.length)];
  } else {
    const pool = [...MEDIUM_WORDS, ...LONG_WORDS];
    return pool[Math.floor(Math.random() * pool.length)];
  }
}

function getRandomColor(): string {
  return BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
}

interface TowerGameProps {
  locale?: 'en' | 'he';
}

export function TowerGame({ locale: propLocale }: TowerGameProps) {
  const t = useTranslations('games');
  const tPractice = useTranslations('practice');
  const locale = (propLocale || useLocale()) as 'en' | 'he';
  const router = useRouter();

  // Game states
  const [gameState, setGameState] = useState<'ready' | 'building' | 'finished'>('ready');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [typedChars, setTypedChars] = useState('');
  const [errors, setErrors] = useState(0);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [fallingBlocks, setFallingBlocks] = useState<Block[]>([]);
  const [shakeTower, setShakeTower] = useState(false);

  // Refs
  const blockIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Results
  const [results, setResults] = useState<{
    height: number;
    blocksPlaced: number;
    accuracy: number;
    xpEarned: number;
    isNewRecord: boolean;
  } | null>(null);

  // Stores
  const addExerciseXp = useProgressStore((s) => s.addExerciseXp);
  const towerMaxHeightRecord = useGameStore((s) => s.towerMaxHeight);
  const recordTowerResult = useGameStore((s) => s.recordTowerResult);

  // Refs for flash functions (defined before hook)
  const flashCorrectRef = useRef<(key: string) => void>(() => {});
  const flashWrongRef = useRef<(key: string) => void>(() => {});

  // Keyboard highlight
  const {
    pressedKeys,
    correctKey,
    wrongKey,
    flashCorrect,
    flashWrong,
  } = useKeyboardHighlight({
    targetText: currentWord,
    currentPosition: typedChars.length,
    trackPressedKeys: gameState === 'building',
  });

  // Update refs with current flash functions
  flashCorrectRef.current = flashCorrect;
  flashWrongRef.current = flashWrong;

  // Get next word - accepts height parameter to avoid stale closure
  const getNextWord = useCallback((height: number) => {
    const word = getRandomWord(height);
    setCurrentWord(word);
    setTypedChars('');
  }, []);

  // Add a block
  const addBlock = useCallback(() => {
    const newBlock: Block = {
      id: ++blockIdRef.current,
      word: currentWord,
      color: getRandomColor(),
      wobble: (Math.random() - 0.5) * 10,
    };

    setBlocks(prev => {
      const newBlocks = [...prev, newBlock];
      // Get next word with the NEW height (after adding this block)
      getNextWord(newBlocks.length);
      return newBlocks;
    });
    setTotalBlocks(t => t + 1);
    setMaxHeight(m => Math.max(m, blocks.length + 1));
  }, [currentWord, blocks.length, getNextWord]);

  // Remove top block (on error)
  const removeBlock = useCallback(() => {
    if (blocks.length === 0) return;

    const topBlock = blocks[blocks.length - 1];
    setFallingBlocks(prev => [...prev, topBlock]);
    setBlocks(prev => prev.slice(0, -1));
    setShakeTower(true);

    setTimeout(() => {
      setFallingBlocks(prev => prev.filter(b => b.id !== topBlock.id));
    }, 1000);

    setTimeout(() => {
      setShakeTower(false);
    }, 300);
  }, [blocks]);

  // Handle key press
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'building') return;
    if (e.key.length !== 1) return;

    const key = e.key.toLowerCase();
    const expectedChar = currentWord[typedChars.length]?.toLowerCase();

    if (key === expectedChar) {
      // Correct key
      flashCorrectRef.current(key);
      const newTyped = typedChars + key;
      setTypedChars(newTyped);

      // Word complete?
      if (newTyped.length === currentWord.length) {
        addBlock();
      }
    } else if (/[a-z]/i.test(key)) {
      // Wrong key
      flashWrongRef.current(key);

      // Remove a block if tower has blocks
      if (blocks.length > 0) {
        removeBlock();
      }

      // Reset current word progress
      setTypedChars('');

      // Update errors and check game over using functional update
      setErrors(prevErrors => {
        const newErrors = prevErrors + 1;
        // Check if game over (3 consecutive errors with no blocks)
        if (blocks.length === 0 && newErrors >= 3) {
          setGameState('finished');
        }
        return newErrors;
      });
    }
  }, [gameState, currentWord, typedChars, addBlock, removeBlock, blocks.length]);

  // Key press listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Handle game finish
  useEffect(() => {
    if (gameState !== 'finished' || results) return;

    const accuracy = totalBlocks + errors > 0
      ? Math.round((totalBlocks / (totalBlocks + errors)) * 100)
      : 0;

    const { isNewRecord, xpEarned } = recordTowerResult(maxHeight, totalBlocks);
    addExerciseXp(xpEarned);

    setResults({
      height: maxHeight,
      blocksPlaced: totalBlocks,
      accuracy,
      xpEarned,
      isNewRecord,
    });
  }, [gameState, results, maxHeight, totalBlocks, errors, recordTowerResult, addExerciseXp]);

  // Start game
  const startGame = useCallback(() => {
    setGameState('building');
    setBlocks([]);
    setTypedChars('');
    setErrors(0);
    setTotalBlocks(0);
    setMaxHeight(0);
    setResults(null);
    setFallingBlocks([]);
    blockIdRef.current = 0;
    getNextWord(0); // Start with height 0
  }, [getNextWord]);

  // Give up
  const giveUp = useCallback(() => {
    if (maxHeight > 0) {
      setGameState('finished');
    }
  }, [maxHeight]);

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

  // Initialize
  useEffect(() => {
    getNextWord(0);
  }, [getNextWord]);

  const nextChar = currentWord[typedChars.length]?.toLowerCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-orange-200 dark:from-gray-900 dark:to-amber-900">
      {/* Header */}
      <GameHeader
        gameId="tower"
        icon="🏗️"
        bestScore={towerMaxHeightRecord > 0 ? `${towerMaxHeightRecord} ${t('blocks')}` : undefined}
        bestScoreLabel={t('maxHeight')}
        currentValue={gameState === 'building' ? `${blocks.length}` : undefined}
        currentLabel={t('blocks')}
        locale={locale}
      />

      {/* Game area */}
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Tower display */}
          <div
            ref={containerRef}
            className="relative h-[50vh] min-h-[300px] bg-gradient-to-b from-sky-200 to-sky-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl overflow-hidden mb-6"
          >
            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-700 to-green-500" />

            {/* Tower container */}
            <div
              className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center transition-transform ${
                shakeTower ? 'animate-shake' : ''
              }`}
            >
              {/* Blocks */}
              <AnimatePresence>
                {blocks.map((block, index) => (
                  <motion.div
                    key={block.id}
                    initial={{ y: -100, opacity: 0, rotate: 0 }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      rotate: blocks.length > 10 ? Math.sin(index * 0.5) * (blocks.length - 10) * 0.3 : 0,
                    }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className={`${block.color} h-8 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-sm border-2 border-white/30`}
                    style={{
                      width: `${Math.max(60, block.word.length * 14)}px`,
                      marginTop: '-2px',
                      transform: `translateX(${block.wobble}px)`,
                    }}
                  >
                    {block.word}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Falling blocks */}
            <AnimatePresence>
              {fallingBlocks.map(block => (
                <motion.div
                  key={`falling-${block.id}`}
                  initial={{ opacity: 1 }}
                  animate={{
                    y: 300,
                    x: Math.random() > 0.5 ? 200 : -200,
                    rotate: Math.random() * 360,
                    opacity: 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeIn' }}
                  className={`absolute ${block.color} h-8 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-sm`}
                  style={{
                    width: `${Math.max(60, block.word.length * 14)}px`,
                    left: '50%',
                    bottom: `${(blocks.length + 1) * 30 + 32}px`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {block.word}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Height marker */}
            <div className="absolute right-4 bottom-8 top-4 w-8 flex flex-col justify-end items-center">
              {blocks.length > 0 && (
                <div className="bg-black/50 text-white px-2 py-1 rounded text-sm font-bold">
                  {blocks.length}
                </div>
              )}
            </div>

            {/* Ready screen */}
            {gameState === 'ready' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className="text-6xl mb-4">🏗️</div>
                <h2 className="font-display text-2xl font-bold text-white mb-2">
                  {t('tower.title')}
                </h2>
                <p className="text-white/80 max-w-sm text-center mb-6">
                  {t('tower.description')}
                </p>
                <button
                  onClick={startGame}
                  className="btn-game px-8 py-3 rounded-xl font-bold"
                >
                  ▶ {t('play')}
                </button>
              </div>
            )}
          </div>

          {/* Current word to type */}
          {gameState === 'building' && (
            <div className="bg-surface rounded-2xl shadow-lg p-6 mb-6">
              <div className="text-center mb-4">
                <span className="text-sm text-muted">Type this word:</span>
              </div>

              <div className="flex justify-center gap-1 font-mono text-4xl">
                {currentWord.split('').map((char, index) => {
                  const isTyped = index < typedChars.length;
                  const isCurrent = index === typedChars.length;

                  return (
                    <span
                      key={index}
                      className={`
                        w-12 h-14 flex items-center justify-center rounded-lg border-2 transition-all
                        ${isTyped
                          ? 'bg-green-100 border-green-400 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : isCurrent
                          ? 'bg-primary/10 border-primary text-primary animate-pulse'
                          : 'bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-600'
                        }
                      `}
                    >
                      {char.toUpperCase()}
                    </span>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-8 mt-6 text-sm text-muted">
                <span>Height: {blocks.length}</span>
                <span>Max: {maxHeight}</span>
                <span>Errors: {errors}</span>
              </div>

              {/* Give up button */}
              {maxHeight > 0 && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={giveUp}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    🏳️ Finish Building
                  </button>
                </div>
              )}
            </div>
          )}

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
          {showKeyboard && gameState === 'building' && (
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
          icon="🏗️"
          score={`${results.height}`}
          scoreLabel={`${t('maxHeight')} (${t('blocks')})`}
          isNewBest={results.isNewRecord}
          xpEarned={results.xpEarned}
          stats={[
            { label: 'Total Blocks', value: results.blocksPlaced, icon: '🧱' },
            { label: t('results.accuracy'), value: `${results.accuracy}%`, icon: '🎯' },
          ]}
          onPlayAgain={startGame}
          onExit={() => router.push('/games')}
          showConfetti={results.isNewRecord}
        />
      )}
    </div>
  );
}
