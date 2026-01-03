'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export type GameStatus = 'locked' | 'available' | 'completed-today';

export interface GameCardProps {
  /** Game identifier */
  gameId: 'race' | 'target' | 'tower' | 'daily' | 'calm';
  /** Game icon emoji */
  icon: string;
  /** Link to game */
  href: string;
  /** Current status */
  status?: GameStatus;
  /** Best score display (e.g., "32.5s" for race, "1,250" for target) */
  bestScore?: string;
  /** Best score label */
  bestScoreLabel?: string;
  /** Secondary stat (e.g., "25 blocks" for tower) */
  secondaryStat?: string;
  /** Whether this is the daily challenge and shows today's status */
  showTodayStatus?: boolean;
  /** Whether today's challenge is completed */
  todayCompleted?: boolean;
  /** Locale */
  locale?: 'en' | 'he';
  /** Additional classes */
  className?: string;
}

/**
 * Game selection card for the games hub.
 */
export function GameCard({
  gameId,
  icon,
  href,
  status = 'available',
  bestScore,
  bestScoreLabel,
  secondaryStat,
  showTodayStatus,
  todayCompleted,
  locale = 'en',
  className = '',
}: GameCardProps) {
  const t = useTranslations('games');

  const statusClasses: Record<GameStatus, string> = {
    locked: 'opacity-50 cursor-not-allowed',
    available: 'hover:scale-[1.02] hover:shadow-lg cursor-pointer',
    'completed-today': 'ring-2 ring-success/50 hover:scale-[1.02] cursor-pointer',
  };

  const title = t(`${gameId}.title`);
  const description = t(`${gameId}.description`);
  const playLabel = t('play');
  const lockedLabel = t('locked');
  const completedLabel = t('completed');
  const bestLabel = bestScoreLabel || t('bestScore');

  const isLocked = status === 'locked';

  const cardContent = (
    <div
      className={`
        game-card relative overflow-hidden rounded-2xl p-6
        bg-surface border border-border shadow-md
        transition-all duration-200
        ${statusClasses[status]}
        ${className}
      `}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
        <span className="text-[80px]">{icon}</span>
      </div>

      {/* Today's completion badge */}
      {showTodayStatus && todayCompleted && (
        <div className="absolute top-3 right-3 bg-success text-white text-xs font-bold px-2 py-1 rounded-full">
          {completedLabel}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{icon}</span>
          <h3 className="text-display-sm font-bold text-foreground">{title}</h3>
        </div>

        {/* Description */}
        <p className="text-body-sm text-muted mb-4 line-clamp-2">{description}</p>

        {/* Stats row */}
        {(bestScore || secondaryStat) && !isLocked && (
          <div className="flex items-center gap-4 mb-4 text-sm">
            {bestScore && (
              <div className="flex items-center gap-1.5">
                <span className="text-muted">{bestLabel}:</span>
                <span className="font-bold text-foreground">{bestScore}</span>
              </div>
            )}
            {secondaryStat && (
              <div className="text-muted">{secondaryStat}</div>
            )}
          </div>
        )}

        {/* Action button */}
        <div className="flex items-center justify-between">
          <span
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
              transition-colors
              ${isLocked
                ? 'bg-muted/20 text-muted'
                : 'bg-primary text-white hover:bg-primary-dark'
              }
            `}
          >
            {isLocked ? (
              <>
                <span>🔒</span>
                {lockedLabel}
              </>
            ) : (
              <>
                <span>▶</span>
                {playLabel}
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );

  if (isLocked) {
    return (
      <div aria-disabled="true" aria-label={`${title} - ${lockedLabel}`}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={href} aria-label={`${title} - ${playLabel}`}>
      {cardContent}
    </Link>
  );
}
