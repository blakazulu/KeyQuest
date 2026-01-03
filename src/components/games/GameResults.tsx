'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export interface GameResultStat {
  label: string;
  value: string | number;
  icon?: string;
  highlight?: boolean;
}

export interface GameResultsProps {
  /** Game icon */
  icon: string;
  /** Main score display */
  score: string | number;
  /** Score label */
  scoreLabel?: string;
  /** Whether this is a new personal best */
  isNewBest?: boolean;
  /** XP earned */
  xpEarned: number;
  /** Additional stats to display */
  stats?: GameResultStat[];
  /** Play again handler */
  onPlayAgain: () => void;
  /** Exit handler (optional - defaults to /games link) */
  onExit?: () => void;
  /** Whether to show confetti animation */
  showConfetti?: boolean;
}

/**
 * Shared results screen for game modes.
 * Shows score, XP earned, stats, and action buttons.
 */
export function GameResults({
  icon,
  score,
  scoreLabel,
  isNewBest,
  xpEarned,
  stats = [],
  onPlayAgain,
  onExit,
  showConfetti = true,
}: GameResultsProps) {
  const t = useTranslations('games');
  const locale = useLocale() as 'en' | 'he';
  const isRTL = locale === 'he';
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Delay content for entrance animation
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="w-full max-w-md bg-surface rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header with icon and confetti */}
            <div className="relative bg-gradient-to-br from-primary to-purple-600 px-6 py-8 text-center overflow-hidden">
              {/* Confetti particles */}
              {showConfetti && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        x: '50%',
                        y: '50%',
                        scale: 0,
                      }}
                      animate={{
                        x: `${Math.random() * 100}%`,
                        y: `${Math.random() * 100}%`,
                        scale: [0, 1, 0.5],
                        rotate: Math.random() * 360,
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.05,
                        ease: 'easeOut',
                      }}
                      className={`absolute w-2 h-2 rounded-full ${
                        i % 3 === 0
                          ? 'bg-yellow-400'
                          : i % 3 === 1
                          ? 'bg-pink-400'
                          : 'bg-cyan-400'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-6xl mb-4"
              >
                {icon}
              </motion.div>

              {/* Title */}
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                {t('results.title')}
              </h2>

              {/* New Best badge */}
              {isNewBest && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-sm font-bold"
                >
                  <span>🏆</span>
                  {t('results.newBest')}
                </motion.div>
              )}
            </div>

            {/* Main score */}
            <div className="px-6 py-6 text-center border-b border-border">
              <div className="text-sm text-muted mb-1">
                {scoreLabel || t('results.score')}
              </div>
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="font-display text-5xl font-bold text-foreground"
              >
                {score}
              </motion.div>
            </div>

            {/* Stats grid */}
            {stats.length > 0 && (
              <div className="px-6 py-4 grid grid-cols-2 gap-4 border-b border-border">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`text-center ${stat.highlight ? 'col-span-2' : ''}`}
                  >
                    <div className="flex items-center justify-center gap-1 text-sm text-muted mb-1">
                      {stat.icon && <span>{stat.icon}</span>}
                      {stat.label}
                    </div>
                    <div
                      className={`font-bold ${
                        stat.highlight
                          ? 'text-2xl text-primary'
                          : 'text-lg text-foreground'
                      }`}
                    >
                      {stat.value}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* XP earned */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="px-6 py-4 bg-purple-50 dark:bg-purple-900/20"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    {t('results.xpEarned')}
                  </div>
                  <div className="font-display text-2xl font-bold text-purple-700 dark:text-purple-300">
                    +{xpEarned} XP
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action buttons */}
            <div className="px-6 py-6 flex gap-3">
              <button
                onClick={onPlayAgain}
                className="flex-1 btn-primary py-3 rounded-xl font-semibold"
              >
                {t('results.playAgain')}
              </button>

              {onExit ? (
                <button
                  onClick={onExit}
                  className="flex-1 btn-secondary py-3 rounded-xl font-semibold"
                >
                  {t('results.exit')}
                </button>
              ) : (
                <Link
                  href="/games"
                  className="flex-1 btn-secondary py-3 rounded-xl font-semibold text-center"
                >
                  {t('results.exit')}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
