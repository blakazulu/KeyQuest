'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useProgressStore } from '@/stores/useProgressStore';
import { getRankByTier, getRankProgress } from '@/data/ranks';

interface RankBadgeProps {
  /** Whether to show the rank title text */
  showTitle?: boolean;
  /** Locale for translations */
  locale?: 'en' | 'he';
  /** Additional CSS classes */
  className?: string;
}

export function RankBadge({
  showTitle = true,
  locale = 'en',
  className = '',
}: RankBadgeProps) {
  const t = useTranslations('gamification');
  // Select primitive value to avoid infinite loop
  const totalXp = useProgressStore((state) => state.totalXp);

  // Compute rank progress from XP value (memoized)
  const rankProgress = useMemo(() => getRankProgress(totalXp), [totalXp]);
  const rank = getRankByTier(rankProgress.currentRank);

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium transition-all duration-200 hover:scale-105 ${className}`}
      style={{
        backgroundColor: `color-mix(in srgb, var(${rank.colorVar}) 15%, transparent)`,
        borderColor: `var(${rank.colorVar})`,
        borderWidth: '1.5px',
        borderStyle: 'solid',
      }}
      aria-label={`${t('rank.title')}: ${rank.title[locale]}`}
    >
      <span className="text-base">{rank.icon}</span>
      {showTitle && (
        <span
          className={`rank-${rankProgress.currentRank} font-display`}
          style={{ color: `var(${rank.colorVar})` }}
        >
          {rank.title[locale]}
        </span>
      )}
    </div>
  );
}
