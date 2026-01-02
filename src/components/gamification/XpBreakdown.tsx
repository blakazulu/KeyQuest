'use client';

import { useTranslations } from 'next-intl';
import type { XpBreakdown as XpBreakdownType } from '@/lib/xpCalculation';

interface XpBreakdownProps {
  /** XP breakdown data */
  breakdown: XpBreakdownType;
  /** Locale for translations */
  locale?: 'en' | 'he';
  /** Whether to show the compact version */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function XpBreakdown({
  breakdown,
  locale = 'en',
  compact = false,
  className = '',
}: XpBreakdownProps) {
  const t = useTranslations('gamification');

  const items = [
    { key: 'base', value: breakdown.baseXp, show: true },
    { key: 'stars', value: breakdown.starBonus, show: breakdown.starBonus > 0 },
    { key: 'accuracy', value: breakdown.accuracyBonus, show: breakdown.accuracyBonus > 0 },
    { key: 'speed', value: breakdown.speedBonus, show: breakdown.speedBonus > 0 },
    { key: 'streak', value: breakdown.streakBonus, show: breakdown.streakBonus > 0 },
  ];

  const hasBonuses = items.filter((i) => i.show && i.key !== 'base').length > 0;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className="font-display text-lg font-bold text-purple-600 dark:text-purple-400">
          +{breakdown.total} XP
        </span>
        {hasBonuses && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({breakdown.baseXp} + {t('xp.breakdown.bonuses') || 'bonuses'})
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4 dark:border-purple-800 dark:from-purple-900/20 dark:to-gray-800 ${className}`}
    >
      <h4 className="mb-3 font-display font-semibold text-gray-900 dark:text-white">
        {t('xp.breakdown.title') || 'XP Earned'}
      </h4>

      <div className="space-y-2">
        {items.map(
          (item) =>
            item.show && (
              <div
                key={item.key}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {t(`xp.breakdown.${item.key}`) || item.key}
                </span>
                <span
                  className={`font-medium ${
                    item.key === 'base'
                      ? 'text-gray-900 dark:text-white'
                      : 'text-green-600 dark:text-green-400'
                  }`}
                >
                  {item.key === 'base' ? '' : '+'}
                  {item.value}
                </span>
              </div>
            )
        )}

        {/* Divider */}
        <div className="my-2 border-t border-purple-200 dark:border-purple-800" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="font-display font-semibold text-gray-900 dark:text-white">
            {t('xp.breakdown.total') || 'Total'}
          </span>
          <span className="font-display text-xl font-bold text-purple-600 dark:text-purple-400">
            +{breakdown.total} XP
          </span>
        </div>
      </div>
    </div>
  );
}
