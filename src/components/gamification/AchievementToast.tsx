'use client';

import { useEffect, useState, useCallback, memo, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/stores/useProgressStore';
import { getAchievement } from '@/data/achievements';
import { useSound } from '@/hooks/useSound';

// Individual toast for a single achievement
const Toast = memo(function Toast({
  achievementId,
  locale,
  onDismiss,
}: {
  achievementId: string;
  locale: 'en' | 'he';
  onDismiss: () => void;
}) {
  const t = useTranslations('gamification');
  const achievement = getAchievement(achievementId);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const pausedRef = useRef(false);
  const progressRef = useRef(100);

  // Keep ref in sync
  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  // Auto-dismiss timer (pauses on hover)
  useEffect(() => {
    const duration = 5000; // 5 seconds
    const tickInterval = 50;
    const decrementPerTick = (100 / duration) * tickInterval;

    const interval = setInterval(() => {
      if (pausedRef.current) return; // Skip if paused

      progressRef.current = Math.max(0, progressRef.current - decrementPerTick);
      setProgress(progressRef.current);

      if (progressRef.current <= 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, tickInterval);

    return () => clearInterval(interval);
  }, [onDismiss]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  if (!achievement) return null;

  // Rarity-based colors
  const rarityColors = {
    common: { bg: 'from-emerald-400 to-teal-500', glow: 'rgba(16, 185, 129, 0.6)' },
    rare: { bg: 'from-cyan-400 to-blue-500', glow: 'rgba(6, 182, 212, 0.6)' },
    epic: { bg: 'from-purple-400 to-indigo-500', glow: 'rgba(147, 51, 234, 0.6)' },
    legendary: { bg: 'from-amber-400 to-orange-500', glow: 'rgba(251, 146, 60, 0.6)' },
  };

  const colors = rarityColors[achievement.rarity];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      role="alert"
      aria-live="assertive"
      className="relative w-full max-w-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="relative overflow-hidden rounded-3xl border-2 border-amber-300 bg-white dark:bg-gray-900 shadow-2xl"
        style={{ boxShadow: `0 0 40px ${colors.glow}, 0 20px 60px rgba(0,0,0,0.3)` }}
      >
        {/* Animated gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-10`} />

        {/* Shine effect */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.8) 45%, rgba(255,255,255,0.8) 50%, transparent 55%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
          }}
        />

        {/* Confetti particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              initial={{
                x: '50%',
                y: '50%',
                scale: 0,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][i % 5]
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.05,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
          aria-label={t('achievements.popup.close')}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="relative p-6">
          {/* Header badge */}
          <div className="text-center mb-4">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
              className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${colors.bg} text-white text-sm font-bold uppercase tracking-wider shadow-lg`}
            >
              {t('achievements.popup.unlocked')}
            </motion.span>
          </div>

          {/* Icon with bounce */}
          <motion.div
            className="flex justify-center mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
          >
            <div
              className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${colors.bg} text-5xl shadow-xl`}
              style={{ boxShadow: `0 0 30px ${colors.glow}` }}
            >
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.5,
                  ease: 'easeInOut'
                }}
              >
                {achievement.icon}
              </motion.span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-2xl font-bold text-center text-gray-900 dark:text-white mb-2"
          >
            {achievement.title[locale]}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-600 dark:text-gray-300 mb-4"
          >
            {achievement.description[locale]}
          </motion.p>

          {/* XP Reward */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="flex justify-center"
          >
            <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r ${colors.bg} text-white font-bold shadow-lg`}>
              <span className="text-xl">+{achievement.xpReward}</span>
              <span className="text-sm">XP</span>
            </span>
          </motion.div>
        </div>

        {/* Progress bar for auto-dismiss */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200 dark:bg-gray-700">
          <motion.div
            className={`h-full bg-gradient-to-r ${colors.bg}`}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2"
      >
        {t('achievements.popup.pressEscape')}
      </motion.p>
    </motion.div>
  );
});

// Container that manages the toast queue
export function AchievementToast() {
  const locale = useLocale() as 'en' | 'he';
  const pendingAchievementIds = useProgressStore((s) => s.pendingAchievementIds);
  const markAchievementSeen = useProgressStore((s) => s.markAchievementSeen);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const { playAchievement } = useSound();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Show next achievement from queue and play sound
  useEffect(() => {
    if (!isHydrated) return;

    if (!currentId && pendingAchievementIds.length > 0) {
      setCurrentId(pendingAchievementIds[0]);
      playAchievement(); // Play achievement sound when showing new achievement
    }
  }, [pendingAchievementIds, currentId, isHydrated, playAchievement]);

  const handleDismiss = useCallback(() => {
    if (currentId) {
      markAchievementSeen(currentId);
      setCurrentId(null);
    }
  }, [currentId, markAchievementSeen]);

  if (!isHydrated) return null;

  const isRTL = locale === 'he';

  return (
    <div className={`fixed top-20 ${isRTL ? 'left-4' : 'right-4'} z-[200] pointer-events-none`}>
      <div className="pointer-events-auto">
        <AnimatePresence mode="wait">
          {currentId && (
            <Toast
              key={currentId}
              achievementId={currentId}
              locale={locale}
              onDismiss={handleDismiss}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AchievementToast;
