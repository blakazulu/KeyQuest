'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCalmModeStore } from '@/stores/useCalmModeStore';

interface CalmStatsProps {
  /** Total characters typed */
  charactersTyped: number;
  /** Optional: WPM (shown on hover if enabled) */
  wpm?: number;
  /** Optional: Accuracy (shown on hover if enabled) */
  accuracy?: number;
  /** Whether to show detailed stats on hover */
  showDetailsOnHover?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Minimal, unobtrusive stats display for Calm Mode.
 * Shows only essential info: characters typed and session time.
 * Optionally reveals WPM/accuracy on hover.
 */
export function CalmStats({
  charactersTyped,
  wpm,
  accuracy,
  showDetailsOnHover = true,
  className = '',
}: CalmStatsProps) {
  const t = useTranslations('calmMode');
  const { getFormattedTime, status } = useCalmModeStore();
  const [time, setTime] = useState('0:00');
  const [isHovered, setIsHovered] = useState(false);

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

  const showDetails = showDetailsOnHover && isHovered && (wpm !== undefined || accuracy !== undefined);

  return (
    <div
      className={`
        inline-flex items-center gap-3 px-4 py-2
        bg-slate-800/40 dark:bg-slate-900/50
        backdrop-blur-sm rounded-full
        text-sm text-slate-300 dark:text-slate-400
        transition-all duration-300
        ${showDetails ? 'scale-105' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="status"
      aria-live="polite"
      aria-label={t('stats.ariaLabel', {
        characters: charactersTyped,
        time,
      })}
    >
      {/* Characters count */}
      <span className="flex items-center gap-1.5">
        <span className="text-slate-400 dark:text-slate-500">{charactersTyped}</span>
        <span className="text-slate-500 dark:text-slate-600 text-xs">
          {t('stats.characters')}
        </span>
      </span>

      {/* Divider */}
      <span className="text-slate-600 dark:text-slate-700">|</span>

      {/* Session time */}
      <span className="flex items-center gap-1.5 tabular-nums">
        <span className="text-slate-400 dark:text-slate-500">{time}</span>
      </span>

      {/* Expanded details on hover */}
      {showDetails && (
        <>
          <span className="text-slate-600 dark:text-slate-700">|</span>
          <span className="flex items-center gap-3 text-xs">
            {wpm !== undefined && (
              <span className="text-slate-400 dark:text-slate-500">
                {Math.round(wpm)} WPM
              </span>
            )}
            {accuracy !== undefined && (
              <span className="text-slate-400 dark:text-slate-500">
                {Math.round(accuracy)}%
              </span>
            )}
          </span>
        </>
      )}
    </div>
  );
}
