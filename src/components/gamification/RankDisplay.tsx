'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useProgressStore } from '@/stores/useProgressStore';
import { getRankByTier, getRankProgress } from '@/data/ranks';

interface RankDisplayProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show progress ring */
  showProgress?: boolean;
  /** Locale for translations */
  locale?: 'en' | 'he';
}

const sizeConfig = {
  sm: {
    container: 'w-16 h-16',
    icon: 'text-2xl',
    ring: 60,
    strokeWidth: 4,
  },
  md: {
    container: 'w-24 h-24',
    icon: 'text-4xl',
    ring: 88,
    strokeWidth: 5,
  },
  lg: {
    container: 'w-32 h-32',
    icon: 'text-5xl',
    ring: 120,
    strokeWidth: 6,
  },
};

export function RankDisplay({
  size = 'md',
  showProgress = true,
  locale = 'en',
}: RankDisplayProps) {
  const t = useTranslations('gamification');
  // Select primitive value to avoid infinite loop
  const totalXp = useProgressStore((state) => state.totalXp);

  // Compute rank progress from XP value (memoized)
  const rankProgress = useMemo(() => getRankProgress(totalXp), [totalXp]);
  const rank = getRankByTier(rankProgress.currentRank);

  const config = sizeConfig[size];
  const radius = (config.ring - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (rankProgress.progressPercent / 100) * circumference;

  // Get rank color from CSS variable
  const colorVar = rank.colorVar.replace('--', '');

  return (
    <div
      className={`relative flex items-center justify-center ${config.container}`}
      role="progressbar"
      aria-valuenow={rankProgress.currentXp}
      aria-valuemin={rank.minXp}
      aria-valuemax={rank.nextRankXp ?? rankProgress.currentXp}
      aria-label={`${rank.title[locale]} - ${rankProgress.progressPercent}% ${t('rank.progress')}`}
    >
      {/* Progress ring */}
      {showProgress && (
        <svg
          className="absolute inset-0 -rotate-90 transform"
          width={config.ring}
          height={config.ring}
          viewBox={`0 0 ${config.ring} ${config.ring}`}
        >
          {/* Background ring */}
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress ring */}
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke={`var(${rank.colorVar})`}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px var(${rank.colorVar}))`,
            }}
          />
        </svg>
      )}

      {/* Rank icon */}
      <div
        className={`relative z-10 flex items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-800 shadow-lg ${
          size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-16 h-16' : 'w-20 h-20'
        }`}
      >
        <span
          className={config.icon}
          style={{
            filter:
              rankProgress.currentRank === 'master'
                ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))'
                : undefined,
          }}
        >
          {rank.icon}
        </span>
      </div>
    </div>
  );
}
