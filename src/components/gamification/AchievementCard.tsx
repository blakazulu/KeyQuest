'use client';

import { useTranslations } from 'next-intl';
import type { Achievement, AchievementProgress } from '@/types/achievement';

interface AchievementCardProps {
  /** Achievement definition */
  achievement: Achievement;
  /** User's progress on this achievement (undefined if not started) */
  progress?: AchievementProgress;
  /** Locale for translations */
  locale?: 'en' | 'he';
  /** Additional CSS classes */
  className?: string;
}

const rarityConfig = {
  common: {
    border: 'border-emerald-400 dark:border-emerald-500',
    bg: 'from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/40 dark:via-green-900/30 dark:to-teal-900/40',
    iconBg: 'from-emerald-100 to-green-200 dark:from-emerald-800 dark:to-green-700',
    glow: '0 0 20px rgba(52, 211, 153, 0.4), 0 0 40px rgba(52, 211, 153, 0.2)',
    shimmer: 'from-transparent via-emerald-200/40 to-transparent',
    badgeBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200',
  },
  rare: {
    border: 'border-cyan-400 dark:border-cyan-400',
    bg: 'from-cyan-50 via-sky-50 to-blue-50 dark:from-cyan-900/40 dark:via-sky-900/30 dark:to-blue-900/40',
    iconBg: 'from-cyan-100 to-sky-200 dark:from-cyan-800 dark:to-sky-700',
    glow: '0 0 24px rgba(34, 211, 238, 0.5), 0 0 48px rgba(34, 211, 238, 0.25)',
    shimmer: 'from-transparent via-cyan-200/50 to-transparent',
    badgeBg: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-800 dark:text-cyan-200',
  },
  epic: {
    border: 'border-purple-400 dark:border-purple-400',
    bg: 'from-purple-50 via-violet-50 to-fuchsia-50 dark:from-purple-900/40 dark:via-violet-900/30 dark:to-fuchsia-900/40',
    iconBg: 'from-purple-100 to-violet-200 dark:from-purple-800 dark:to-violet-700',
    glow: '0 0 28px rgba(168, 85, 247, 0.5), 0 0 56px rgba(168, 85, 247, 0.25)',
    shimmer: 'from-transparent via-purple-200/60 to-transparent',
    badgeBg: 'bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200',
  },
  legendary: {
    border: 'border-amber-400 dark:border-amber-400',
    bg: 'from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/40 dark:via-yellow-900/30 dark:to-orange-900/40',
    iconBg: 'from-amber-100 to-yellow-200 dark:from-amber-800 dark:to-yellow-700',
    glow: '0 0 32px rgba(251, 191, 36, 0.6), 0 0 64px rgba(251, 191, 36, 0.3)',
    shimmer: 'from-transparent via-amber-200/70 to-transparent',
    badgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-200',
  },
};

const rarityLabels = {
  common: { en: 'Common', he: 'רגיל' },
  rare: { en: 'Rare', he: 'נדיר' },
  epic: { en: 'Epic', he: 'אפי' },
  legendary: { en: 'Legendary', he: 'אגדי' },
};

export function AchievementCard({
  achievement,
  progress,
  locale = 'en',
  className = '',
}: AchievementCardProps) {
  const t = useTranslations('gamification');
  const isUnlocked = progress?.unlocked ?? false;
  const config = rarityConfig[achievement.rarity];

  return (
    <div
      className={`group relative rounded-2xl border-2 p-4 transition-all duration-300 ${
        isUnlocked
          ? `bg-gradient-to-br ${config.bg} ${config.border} hover:scale-[1.02] hover:-translate-y-1`
          : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 opacity-60'
      } ${className}`}
      style={{
        boxShadow: isUnlocked ? config.glow : 'none',
      }}
      aria-label={`${achievement.title[locale]} - ${
        isUnlocked ? t('achievements.unlocked') : t('achievements.locked')
      }: ${achievement.description[locale]}`}
    >
      {/* Shimmer effect for unlocked */}
      {isUnlocked && (
        <div
          className={`absolute inset-0 rounded-2xl overflow-hidden pointer-events-none`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r ${config.shimmer} animate-shimmer`}
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s ease-in-out infinite',
            }}
          />
        </div>
      )}

      {/* Rarity badge */}
      <div
        className={`absolute top-2 right-2 text-xs font-bold rounded-full px-2.5 py-1 ${
          isUnlocked
            ? config.badgeBg
            : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
        }`}
      >
        {rarityLabels[achievement.rarity][locale]}
      </div>

      {/* Unlocked checkmark */}
      {isUnlocked && (
        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm shadow-lg">
          ✓
        </div>
      )}

      {/* Icon */}
      <div
        className={`relative mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full text-4xl transition-all duration-300 ${
          isUnlocked
            ? `bg-gradient-to-br ${config.iconBg} shadow-xl group-hover:scale-110`
            : 'bg-gray-200 dark:bg-gray-700 grayscale'
        }`}
        style={{
          boxShadow: isUnlocked ? config.glow : 'none',
        }}
      >
        {isUnlocked ? (
          <span className="animate-bounce-subtle">{achievement.icon}</span>
        ) : (
          <span className="text-3xl">🔒</span>
        )}
      </div>

      {/* Title */}
      <h3
        className={`text-center font-display font-semibold mb-1 ${
          isUnlocked
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        {achievement.title[locale]}
      </h3>

      {/* Description */}
      <p
        className={`text-center text-sm ${
          isUnlocked
            ? 'text-gray-600 dark:text-gray-300'
            : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        {achievement.hidden && !isUnlocked
          ? '???'
          : achievement.description[locale]}
      </p>

      {/* XP reward */}
      <div
        className={`mt-3 text-center text-sm font-medium ${
          isUnlocked ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
        }`}
      >
        +{achievement.xpReward} XP
      </div>

      {/* Unlock date */}
      {isUnlocked && progress?.unlockedAt && (
        <div className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
          {new Date(progress.unlockedAt).toLocaleDateString(
            locale === 'he' ? 'he-IL' : 'en-US',
            { year: 'numeric', month: 'short', day: 'numeric' }
          )}
        </div>
      )}
    </div>
  );
}
