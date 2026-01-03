'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export interface GameHeaderProps {
  /** Game title translation key */
  gameId: 'race' | 'target' | 'tower' | 'daily';
  /** Game icon */
  icon: string;
  /** Best score to display */
  bestScore?: string;
  /** Best score label */
  bestScoreLabel?: string;
  /** Current score/status (during gameplay) */
  currentValue?: string;
  /** Current value label */
  currentLabel?: string;
  /** Whether game is paused */
  isPaused?: boolean;
  /** Pause handler */
  onPause?: () => void;
  /** Resume handler */
  onResume?: () => void;
  /** Exit handler (if not provided, uses back link) */
  onExit?: () => void;
  /** Locale */
  locale?: 'en' | 'he';
}

/**
 * Shared header for game modes.
 * Shows game title, best score, current status, and controls.
 */
export function GameHeader({
  gameId,
  icon,
  bestScore,
  bestScoreLabel,
  currentValue,
  currentLabel,
  isPaused,
  onPause,
  onResume,
  onExit,
  locale = 'en',
}: GameHeaderProps) {
  const t = useTranslations('games');
  const isRTL = locale === 'he';

  const title = t(`${gameId}.title`);
  const pauseLabel = isPaused ? t('results.playAgain') : 'Pause';
  const exitLabel = t('results.exit');

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-surface/95 backdrop-blur-sm border-b border-border
        px-4 py-3
      `}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Back + Title */}
        <div className="flex items-center gap-3">
          {onExit ? (
            <button
              onClick={onExit}
              className="p-2 rounded-lg hover:bg-surface-raised transition-colors"
              aria-label={exitLabel}
            >
              <svg
                className={`w-5 h-5 text-muted ${isRTL ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          ) : (
            <Link
              href="/games"
              className="p-2 rounded-lg hover:bg-surface-raised transition-colors"
              aria-label={t('backToLevels')}
            >
              <svg
                className={`w-5 h-5 text-muted ${isRTL ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          )}

          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <h1 className="font-display text-lg font-bold text-foreground">
              {title}
            </h1>
          </div>
        </div>

        {/* Center: Current value (if gameplay) */}
        {currentValue && (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10">
            {currentLabel && (
              <span className="text-sm text-muted">{currentLabel}:</span>
            )}
            <span className="font-bold text-primary">{currentValue}</span>
          </div>
        )}

        {/* Right: Best score + Controls */}
        <div className="flex items-center gap-3">
          {bestScore && (
            <div className="text-sm">
              <span className="text-muted">{bestScoreLabel || t('bestScore')}:</span>{' '}
              <span className="font-bold text-foreground">{bestScore}</span>
            </div>
          )}

          {/* Pause/Resume button */}
          {(onPause || onResume) && (
            <button
              onClick={isPaused ? onResume : onPause}
              className={`
                p-2 rounded-lg transition-colors
                ${isPaused
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-surface-raised hover:bg-muted/20'
                }
              `}
              aria-label={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
