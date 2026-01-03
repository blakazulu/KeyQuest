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
import { TowerBackground } from './GameBackgrounds';

// Word lists by difficulty - English
const SHORT_WORDS_EN = ['cat', 'dog', 'sun', 'run', 'big', 'top', 'hat', 'red', 'box', 'cup'];
const MEDIUM_WORDS_EN = ['house', 'water', 'green', 'happy', 'tower', 'block', 'build', 'stack', 'climb'];
const LONG_WORDS_EN = ['building', 'elephant', 'mountain', 'keyboard', 'champion', 'practice', 'strength'];

// Word lists by difficulty - Hebrew
const SHORT_WORDS_HE = ['אם', 'אב', 'יד', 'גב', 'זה', 'כן', 'לא', 'מה', 'כי', 'דג'];
const MEDIUM_WORDS_HE = ['בית', 'ספר', 'ילד', 'שמש', 'מים', 'לחם', 'שלום', 'תודה', 'בקר'];
const LONG_WORDS_HE = ['מחשב', 'מקלדת', 'הקלדה', 'כתיבה', 'לימוד', 'תרגול', 'ניצחון'];

const BLOCK_COLORS = [
  'from-red-400 to-red-600',
  'from-orange-400 to-orange-600',
  'from-yellow-400 to-yellow-600',
  'from-green-400 to-green-600',
  'from-blue-400 to-blue-600',
  'from-indigo-400 to-indigo-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
];

interface Block {
  id: number;
  word: string;
  color: string;
  wobble: number; // random wobble offset
}

function getRandomWord(height: number, layout: 'qwerty' | 'hebrew'): string {
  // Select word pools based on layout
  const SHORT_WORDS = layout === 'hebrew' ? SHORT_WORDS_HE : SHORT_WORDS_EN;
  const MEDIUM_WORDS = layout === 'hebrew' ? MEDIUM_WORDS_HE : MEDIUM_WORDS_EN;
  const LONG_WORDS = layout === 'hebrew' ? LONG_WORDS_HE : LONG_WORDS_EN;

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
  const hookLocale = useLocale() as 'en' | 'he';
  const locale = propLocale || hookLocale;
  const router = useRouter();
  const { playKeypress, playError, playBrickDrop, playSuccess } = useSound();

  // Game states
  const [gameState, setGameState] = useState<'ready' | 'building' | 'finished'>('ready');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [typedChars, setTypedChars] = useState('');
  const [errors, setErrors] = useState(0);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const [showHands, setShowHands] = useState(true);
  const [fallingBlocks, setFallingBlocks] = useState<Block[]>([]);
  const [shakeTower, setShakeTower] = useState(false);

  // Refs
  const blockIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const towerRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const flashCorrectRef = useRef<(key: string) => void>(() => {});
  const flashWrongRef = useRef<(key: string) => void>(() => {});

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
  const keyboardLayout = useSettingsStore((s) => s.keyboardLayout);

  // Keyboard highlight
  const {
    pressedKeys,
    correctKey,
    wrongKey,
    flashCorrect,
    flashWrong,
    highlightedKey,
    activeFinger,
  } = useKeyboardHighlight({
    targetText: currentWord,
    currentPosition: typedChars.length,
    trackPressedKeys: gameState === 'building',
    layout: keyboardLayout,
  });

  // Update refs with current flash functions
  flashCorrectRef.current = flashCorrect;
  flashWrongRef.current = flashWrong;

  // Get next word - accepts height parameter to avoid stale closure
  const getNextWord = useCallback((height: number) => {
    const word = getRandomWord(height, keyboardLayout);
    setCurrentWord(word);
    setTypedChars('');
  }, [keyboardLayout]);

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
    playBrickDrop();
  }, [currentWord, blocks.length, getNextWord, playBrickDrop]);

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
      playKeypress();
      const newTyped = typedChars + key;
      setTypedChars(newTyped);

      // Word complete?
      if (newTyped.length === currentWord.length) {
        addBlock();
      }
    } else if (/[a-z\u05D0-\u05EA]/i.test(key)) {
      // Wrong key (Latin or Hebrew letter)
      flashWrongRef.current(key);
      playError();

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
  }, [gameState, currentWord, typedChars, addBlock, removeBlock, blocks.length, playKeypress, playError]);

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

    // Play success sound if player built at least 5 blocks
    if (maxHeight >= 5) {
      playSuccess();
    }

    setResults({
      height: maxHeight,
      blocksPlaced: totalBlocks,
      accuracy,
      xpEarned,
      isNewRecord,
    });
  }, [gameState, results, maxHeight, totalBlocks, errors, recordTowerResult, addExerciseXp, playSuccess]);

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

  // Scroll to keep top of tower visible, or show ground when short
  useEffect(() => {
    if (!containerRef.current || !towerRef.current) return;

    const container = containerRef.current;
    const blockHeight = 30; // Approximate height per block
    const groundHeight = 32;
    const towerHeight = blocks.length * blockHeight + groundHeight;
    const containerHeight = container.clientHeight;

    if (towerHeight > containerHeight) {
      // Tower overflows - scroll to show top (newest blocks)
      container.scrollTop = 0;
    } else {
      // Tower fits - scroll to show ground at bottom
      groundRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [blocks.length]);

  const nextChar = currentWord[typedChars.length]?.toLowerCase();

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col overflow-hidden">
      <TowerBackground />

      {/* Top control bar */}
      <header className="flex-shrink-0 flex items-center justify-center gap-3 p-4 z-10">
        {/* Stats pill */}
        {gameState === 'building' && (
          <div className="flex items-center gap-4 px-5 py-2.5 bg-black/50 backdrop-blur-md rounded-xl text-white">
            <div className="flex items-center gap-2">
              <span className="text-amber-400">🏗️</span>
              <span className="font-bold">{blocks.length}</span>
              <span className="text-white/60 text-sm">{t('blocks')}</span>
            </div>
            <div className="w-px h-5 bg-white/30" />
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">⭐</span>
              <span>Max: {maxHeight}</span>
            </div>
            <div className="w-px h-5 bg-white/30" />
            <div className="flex items-center gap-2 text-red-400">
              <span>❌</span>
              <span>{errors}</span>
            </div>
          </div>
        )}

        {/* Best height pill */}
        {towerMaxHeightRecord > 0 && (
          <div className="px-4 py-2.5 bg-amber-500/80 backdrop-blur-md rounded-xl text-white font-medium text-sm">
            🏆 {t('maxHeight')}: {towerMaxHeightRecord}
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
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : 'bg-white/20 text-white hover:bg-white/30'
            }
          `}
        >
          ✋
          <span className="hidden sm:inline">
            {showHands ? 'Hide Hands' : 'Show Hands'}
          </span>
        </button>

        {/* Give up button */}
        {gameState === 'building' && maxHeight > 0 && (
          <button
            onClick={giveUp}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white font-medium text-sm transition-all shadow-md"
          >
            🏳️
            <span>Finish</span>
          </button>
        )}

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
        {/* Tower display */}
        <div
          className="relative w-full max-w-3xl h-[40vh] min-h-[250px] bg-gradient-to-b from-sky-300/20 to-sky-100/10 backdrop-blur-sm rounded-3xl border-2 border-white/20 overflow-hidden"
        >
          {/* Scrollable tower area - includes ground */}
          <div
            ref={containerRef}
            className="absolute inset-0 overflow-y-auto overflow-x-hidden"
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* Tower container - flex-col-reverse so blocks stack from bottom */}
            <div className="min-h-full flex flex-col-reverse">
              {/* Ground - scrolls with tower */}
              <div ref={groundRef} className="w-full h-8 bg-gradient-to-t from-amber-800 to-amber-600 flex-shrink-0" />

              <div
                ref={towerRef}
                className={`flex flex-col-reverse items-center mx-auto pt-4 ${
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
                      className={`bg-gradient-to-r ${block.color} h-8 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-sm border-2 border-white/30`}
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
            </div>
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
                className={`absolute bg-gradient-to-r ${block.color} h-8 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-sm z-20`}
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
          <div className="absolute right-4 bottom-4 top-4 w-8 flex flex-col justify-end items-center z-10 pointer-events-none">
            {blocks.length > 0 && (
              <div className="bg-black/50 text-white px-2 py-1 rounded text-sm font-bold">
                {blocks.length}
              </div>
            )}
          </div>

          {/* Ready screen */}
          {gameState === 'ready' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm z-30">
              <div className="text-7xl mb-4">🏗️</div>
              <h2 className="font-display text-3xl font-bold text-white mb-2">
                {t('tower.title')}
              </h2>
              <p className="text-white/80 max-w-sm text-center mb-6">
                {t('tower.description')}
              </p>
              <button
                onClick={startGame}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xl font-bold shadow-lg hover:scale-105 transition-transform"
              >
                ▶ {t('play')}
              </button>
            </div>
          )}
        </div>

        {/* Current word to type - Monitor style */}
        {gameState === 'building' && (
          <div className="typing-monitor w-full max-w-2xl flex-shrink-0">
            <div className="typing-monitor-screen">
              <div className="text-center mb-2">
                <span className="text-sm text-indigo-300">Type this word:</span>
              </div>

              <div className="flex justify-center gap-1 font-mono text-3xl">
                {currentWord.split('').map((char, index) => {
                  const isTyped = index < typedChars.length;
                  const isCurrent = index === typedChars.length;

                  return (
                    <span
                      key={index}
                      className={`
                        w-10 h-12 flex items-center justify-center rounded-lg border-2 transition-all
                        ${isTyped
                          ? 'bg-green-500/30 border-green-400 text-green-400'
                          : isCurrent
                          ? 'bg-amber-500/30 border-amber-400 text-amber-300 animate-pulse'
                          : 'bg-white/5 border-white/20 text-indigo-300/50'
                        }
                      `}
                    >
                      {char.toUpperCase()}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="typing-monitor-stand" />
          </div>
        )}

        {/* Keyboard with hands */}
        {showHands && gameState === 'building' && (
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
                baseSize={40}
              />
            </HandsWithKeyboard>
          </div>
        )}
      </main>

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
