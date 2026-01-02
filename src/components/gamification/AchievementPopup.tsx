'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { getAchievement } from '@/data/achievements';

interface AchievementPopupProps {
  /** Achievement ID to display (null to hide) */
  achievementId: string | null;
  /** Called when popup is dismissed */
  onDismiss: () => void;
  /** Locale for translations */
  locale?: 'en' | 'he';
  /** Auto-dismiss delay in ms (0 to disable) */
  autoDismissDelay?: number;
}

export function AchievementPopup({
  achievementId,
  onDismiss,
  locale = 'en',
  autoDismissDelay = 5000,
}: AchievementPopupProps) {
  const t = useTranslations('gamification');
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const achievement = achievementId ? getAchievement(achievementId) : null;

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for exit animation
  }, [onDismiss]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleDismiss]);

  // Show/hide animation
  useEffect(() => {
    if (achievementId) {
      setIsVisible(true);
      setProgress(0);
    }
  }, [achievementId]);

  // Auto-dismiss timer with progress
  useEffect(() => {
    if (!isVisible || autoDismissDelay === 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / autoDismissDelay) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        handleDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible, autoDismissDelay, handleDismiss]);

  if (!achievement) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-4 right-4 z-[100] max-w-sm transition-all duration-300 ${
        prefersReducedMotion ? '' : 'transform'
      } ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-white to-yellow-50 p-4 shadow-2xl dark:from-gray-800 dark:via-gray-800 dark:to-amber-900/30">
        {/* Shine effect */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        )}

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label={t('achievements.popup.close') || 'Close'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-2xl shadow-lg"
            style={{
              boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
            }}
          >
            {achievement.icon}
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400">
              {t('achievements.popup.unlocked')}
            </div>
            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
              {achievement.title[locale]}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {achievement.description[locale]}
        </p>

        {/* XP reward */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            {t('achievements.popup.xpBonus', { xp: achievement.xpReward })}
          </span>
          <span className="text-xs text-gray-400">
            {t('achievements.popup.pressEscape') || 'Press Esc to close'}
          </span>
        </div>

        {/* Progress bar for auto-dismiss */}
        {autoDismissDelay > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-amber-400 transition-all duration-100 ease-linear"
              style={{ width: `${100 - progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
