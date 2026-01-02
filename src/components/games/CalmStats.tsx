'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCalmModeStore } from '@/stores/useCalmModeStore';

interface CalmStatsProps {
  /** Total characters typed */
  charactersTyped: number;
  /** WPM */
  wpm?: number;
  /** Accuracy */
  accuracy?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Stats display for Calm Mode - always visible, clear and readable.
 */
export function CalmStats({
  charactersTyped,
  wpm,
  accuracy,
  className = '',
}: CalmStatsProps) {
  const t = useTranslations('calmMode');
  const { getFormattedTime, status } = useCalmModeStore();
  const [time, setTime] = useState('0:00');

  // Update time display every second
  useEffect(() => {
    if (status !== 'running') {
      setTime(getFormattedTime());
      return;
    }

    const interval = setInterval(() => {
      setTime(getFormattedTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [status, getFormattedTime]);

  return (
    <div
      className={`
        inline-flex items-center gap-6 px-6 py-3
        bg-white/90 backdrop-blur-md rounded-2xl
        border border-stone-300/50
        shadow-lg shadow-stone-900/10
        ${className}
      `}
      role="status"
      aria-live="polite"
      aria-label={t('stats.ariaLabel', {
        characters: charactersTyped,
        time,
      })}
    >
      {/* WPM - Primary stat */}
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-emerald-600 tabular-nums">
          {Math.round(wpm || 0)}
        </span>
        <span className="text-xs text-stone-500 uppercase tracking-wide">
          {t('stats.wpm')}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-stone-300/70" />

      {/* Accuracy */}
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-amber-600 tabular-nums">
          {Math.round(accuracy || 0)}%
        </span>
        <span className="text-xs text-stone-500 uppercase tracking-wide">
          {t('stats.accuracy')}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-stone-300/70" />

      {/* Time */}
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-stone-700 tabular-nums">
          {time}
        </span>
        <span className="text-xs text-stone-500 uppercase tracking-wide">
          {t('stats.time')}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-stone-300/70" />

      {/* Characters */}
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-stone-700 tabular-nums">
          {charactersTyped}
        </span>
        <span className="text-xs text-stone-500 uppercase tracking-wide">
          {t('stats.characters')}
        </span>
      </div>
    </div>
  );
}
