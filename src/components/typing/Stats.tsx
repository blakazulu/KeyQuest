'use client';

import { memo, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { formatTime } from '@/lib/typing-utils';
import type { TypingSessionStatus } from '@/hooks/useTypingEngine';

interface StatsProps {
  /** Words per minute */
  wpm: number;
  /** Accuracy percentage (0-100) */
  accuracy: number;
  /** Time elapsed in milliseconds */
  time: number;
  /** Number of errors */
  errors: number;
  /** Current session status */
  status: TypingSessionStatus;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Displays live typing statistics during practice.
 * Updates in real-time as the user types.
 */
export const Stats = memo(function Stats({
  wpm,
  accuracy,
  time,
  errors,
  status,
  className = '',
}: StatsProps) {
  const t = useTranslations('practice.stats');
  const [displayTime, setDisplayTime] = useState(time);

  // Update time display while running
  useEffect(() => {
    if (status !== 'running') {
      setDisplayTime(time);
      return;
    }

    // Update every 100ms for smooth timer
    const interval = setInterval(() => {
      setDisplayTime((prev) => prev + 100);
    }, 100);

    return () => clearInterval(interval);
  }, [status, time]);

  return (
    <div
      className={`grid grid-cols-2 gap-4 sm:grid-cols-4 ${className}`}
      role="region"
      aria-label={t('statsPanel')}
    >
      <StatCard
        label={t('wpm')}
        value={wpm}
        unit={t('wpmUnit')}
        icon={<SpeedIcon />}
        highlight={wpm >= 40}
        ariaLive={status === 'running' ? 'polite' : 'off'}
      />

      <StatCard
        label={t('accuracy')}
        value={accuracy}
        unit="%"
        icon={<TargetIcon />}
        highlight={accuracy >= 95}
        warning={accuracy < 80}
        ariaLive={status === 'running' ? 'polite' : 'off'}
      />

      <StatCard
        label={t('time')}
        value={formatTime(displayTime)}
        icon={<ClockIcon />}
        isTime
      />

      <StatCard
        label={t('errors')}
        value={errors}
        icon={<ErrorIcon />}
        warning={errors > 0}
      />
    </div>
  );
});

interface StatCardProps {
  label: string;
  value: number | string;
  unit?: string;
  icon: React.ReactNode;
  highlight?: boolean;
  warning?: boolean;
  isTime?: boolean;
  ariaLive?: 'polite' | 'assertive' | 'off';
}

function StatCard({
  label,
  value,
  unit,
  icon,
  highlight = false,
  warning = false,
  isTime = false,
  ariaLive = 'off',
}: StatCardProps) {
  const valueClasses = highlight
    ? 'text-success'
    : warning
      ? 'text-error'
      : 'text-foreground';

  return (
    <div
      className="card flex items-center gap-3"
      aria-live={ariaLive}
      aria-atomic="true"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-raised text-muted">
        {icon}
      </div>
      <div>
        <div className="text-caption text-muted">{label}</div>
        <div className={`text-display-sm font-semibold ${valueClasses}`}>
          {isTime ? (
            <span className="font-mono">{value}</span>
          ) : (
            <>
              <span className={highlight || warning ? 'animate-pop' : ''}>
                {value}
              </span>
              {unit && <span className="text-body-sm text-muted ms-1">{unit}</span>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Icons (inline SVG for simplicity)
function SpeedIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}
