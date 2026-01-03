'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useProgressStore } from '@/stores/useProgressStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { achievements, achievementCategories } from '@/data/achievements';
import { AchievementCard, RankDisplay } from '@/components/gamification';
import type { AchievementCategory } from '@/types/achievement';

// Reset confirmation modal
function ResetConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  locale,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  locale: 'en' | 'he';
}) {
  const [confirmText, setConfirmText] = useState('');
  const requiredText = locale === 'he' ? 'מחק' : 'DELETE';
  const isConfirmEnabled = confirmText === requiredText;

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset text when opening
  useEffect(() => {
    if (isOpen) setConfirmText('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-red-500 px-6 py-4">
          <h2 id="reset-modal-title" className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚠️</span>
            {locale === 'he' ? 'אזהרה: איפוס מלא' : 'Warning: Full Reset'}
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {locale === 'he'
              ? 'פעולה זו תמחק לצמיתות את כל ההתקדמות שלך:'
              : 'This action will permanently delete all your progress:'}
          </p>

          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="text-red-500">✕</span>
              {locale === 'he' ? 'כל ההישגים' : 'All achievements'}
            </li>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="text-red-500">✕</span>
              {locale === 'he' ? 'כל נקודות ה-XP' : 'All XP points'}
            </li>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="text-red-500">✕</span>
              {locale === 'he' ? 'כל השיעורים שהושלמו' : 'All completed lessons'}
            </li>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="text-red-500">✕</span>
              {locale === 'he' ? 'רצף התרגול' : 'Practice streak'}
            </li>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="text-red-500">✕</span>
              {locale === 'he' ? 'כל הסטטיסטיקות' : 'All statistics'}
            </li>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="text-red-500">✕</span>
              {locale === 'he' ? 'פרופיל המשתמש (שם ואווטר)' : 'User profile (name and avatar)'}
            </li>
          </ul>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-3">
              {locale === 'he'
                ? `הקלד "${requiredText}" כדי לאשר:`
                : `Type "${requiredText}" to confirm:`}
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-4 py-2 border-2 border-red-300 dark:border-red-700 rounded-lg
                bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              placeholder={requiredText}
              autoFocus
            />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
            {locale === 'he' ? 'לא ניתן לבטל פעולה זו!' : 'This action cannot be undone!'}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg font-medium
              bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300
              hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {locale === 'he' ? 'ביטול' : 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            disabled={!isConfirmEnabled}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all
              ${isConfirmEnabled
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
          >
            {locale === 'he' ? 'מחק הכל' : 'Delete Everything'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const t = useTranslations('gamification');
  const tNav = useTranslations('navigation');
  const locale = useLocale() as 'en' | 'he';
  const isRTL = locale === 'he';

  // Hydration state
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');
  const [showResetModal, setShowResetModal] = useState(false);

  // Progress store
  const userAchievements = useProgressStore((s) => s.achievements);
  const totalXp = useProgressStore((s) => s.totalXp);
  const checkAndUnlockAchievements = useProgressStore((s) => s.checkAndUnlockAchievements);
  const resetProgress = useProgressStore((s) => s.reset);

  // Settings store
  const resetOnboarding = useSettingsStore((s) => s.resetOnboarding);
  const setUserName = useSettingsStore((s) => s.setUserName);
  const setUserAvatar = useSettingsStore((s) => s.setUserAvatar);

  // Handle reset - resets both progress and profile
  const handleReset = useCallback(() => {
    resetProgress();
    resetOnboarding();
    setUserName('');
    setUserAvatar(1);
    setShowResetModal(false);
    // Force page refresh to show empty state
    window.location.reload();
  }, [resetProgress, resetOnboarding, setUserName, setUserAvatar]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Retroactively check and unlock achievements for existing progress
  useEffect(() => {
    if (isHydrated) {
      checkAndUnlockAchievements();
    }
  }, [isHydrated, checkAndUnlockAchievements]);

  // Calculate stats
  const stats = useMemo(() => {
    const unlocked = Object.values(userAchievements).filter((a) => a.unlocked).length;
    const total = achievements.length;
    const percent = total > 0 ? Math.round((unlocked / total) * 100) : 0;
    return { unlocked, total, percent };
  }, [userAchievements]);

  // Filter achievements by category
  const filteredAchievements = useMemo(() => {
    if (activeCategory === 'all') return achievements;
    return achievements.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  // Category labels
  const categoryLabels: Record<AchievementCategory | 'all', { en: string; he: string }> = {
    all: { en: 'All', he: 'הכל' },
    milestone: { en: 'Milestones', he: 'אבני דרך' },
    speed: { en: 'Speed', he: 'מהירות' },
    accuracy: { en: 'Accuracy', he: 'דיוק' },
    streak: { en: 'Streaks', he: 'רצף' },
    dedication: { en: 'Dedication', he: 'מסירות' },
    mastery: { en: 'Mastery', he: 'שליטה' },
    games: { en: 'Games', he: 'משחקים' },
    secret: { en: 'Secrets', he: 'סודות' },
  };

  // Loading skeleton
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('achievements.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('achievements.subtitle') || 'Track your typing milestones and earn rewards'}
          </p>
        </header>

        {/* Progress summary */}
        <div className="mb-8 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 dark:border-orange-800 dark:from-gray-800 dark:via-gray-800 dark:to-orange-900/20">
          <div className={`flex flex-col md:flex-row items-center gap-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            {/* Rank display */}
            <RankDisplay size="lg" locale={locale} />

            {/* Stats */}
            <div className="flex-1 text-center md:text-start">
              <div className="mb-2">
                <span className="text-4xl font-display font-bold text-purple-600 dark:text-purple-400">
                  {stats.unlocked}
                </span>
                <span className="text-2xl text-gray-400 dark:text-gray-500"> / {stats.total}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('achievements.progress', { percent: stats.percent }) || `${stats.percent}% complete`}
              </p>

              {/* Progress bar */}
              <div className="w-full max-w-md h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.percent}%` }}
                />
              </div>
            </div>

            {/* Total XP */}
            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t('achievements.totalXp') || 'Total XP'}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span className="font-display text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {totalXp.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(['all', ...achievementCategories] as const).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              aria-pressed={activeCategory === category}
            >
              {categoryLabels[category][locale]}
            </button>
          ))}
        </div>

        {/* Achievements grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAchievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="transition-all duration-300"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <AchievementCard
                achievement={achievement}
                progress={userAchievements[achievement.id]}
                locale={locale}
              />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {t('achievements.noAchievements') || 'No achievements in this category'}
            </p>
          </div>
        )}

        {/* Reset section */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {locale === 'he' ? 'התחל מחדש' : 'Start Fresh'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {locale === 'he'
                ? 'רוצה להתחיל את המסע מחדש? זה ימחק את כל ההתקדמות שלך.'
                : 'Want to start your journey over? This will erase all your progress.'}
            </p>
            <button
              onClick={() => setShowResetModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
                hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400
                border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700
                transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {locale === 'he' ? 'איפוס כל ההתקדמות' : 'Reset All Progress'}
            </button>
          </div>
        </div>
      </div>

      {/* Reset confirmation modal */}
      <ResetConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleReset}
        locale={locale}
      />
    </div>
  );
}
