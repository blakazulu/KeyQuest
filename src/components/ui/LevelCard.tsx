'use client';

import { forwardRef } from 'react';
import Link from 'next/link';

export type LevelStatus = 'locked' | 'available' | 'current' | 'completed';

export interface LevelCardProps {
  /** Stage number (1-6) */
  stageNumber: number;
  /** Stage name */
  name: string;
  /** Stage description */
  description: string;
  /** Total number of lessons in this stage */
  lessonCount: number;
  /** Current status of the stage */
  status: LevelStatus;
  /** Number of completed lessons (for progress display) */
  completedLessons?: number;
  /** Link to navigate to when clicked */
  href?: string;
  /** Click handler (alternative to href) */
  onSelect?: () => void;
  /** Locale for translations */
  locale?: 'en' | 'he';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Level/Stage card component showing progress and status.
 *
 * @example
 * ```tsx
 * <LevelCard
 *   stageNumber={1}
 *   name="Home Row Mastery"
 *   description="Learn ASDF and JKL; - your foundation"
 *   lessonCount={8}
 *   status="current"
 *   completedLessons={3}
 *   href="/levels/1"
 * />
 * ```
 */
// Stage icons for each level (playful themes!)
const stageIcons: Record<number, string> = {
  1: '🏠', // Home Row Haven
  2: '🌊', // Letter Lagoon
  3: '⛰️', // Word Mountain
  4: '🌲', // Sentence Safari
  5: '🏔️', // Paragraph Peak
  6: '🏆', // Master's Summit
};

export const LevelCard = forwardRef<HTMLDivElement, LevelCardProps>(
  function LevelCard(
    {
      stageNumber,
      name,
      description,
      lessonCount,
      status,
      completedLessons = 0,
      href,
      onSelect,
      locale = 'en',
      className = '',
    },
    ref
  ) {
    const statusClasses: Record<LevelStatus, string> = {
      locked: 'level-card level-card-locked',
      available: 'level-card level-card-available',
      current: 'level-card level-card-current',
      completed: 'level-card level-card-completed',
    };

    const numberClasses: Record<LevelStatus, string> = {
      locked: 'level-number level-number-locked',
      available: 'level-number level-number-available',
      current: 'level-number level-number-current',
      completed: 'level-number level-number-completed',
    };

    const statusLabels: Record<LevelStatus, { en: string; he: string }> = {
      locked: { en: '🔒 Locked', he: '🔒 נעול' },
      available: { en: '✨ Ready!', he: '✨ מוכן!' },
      current: { en: '🎮 Playing', he: '🎮 משחק' },
      completed: { en: '⭐ Done!', he: '⭐ הושלם!' },
    };

    const lessonsLabel = locale === 'he' ? 'שיעורים' : 'lessons';
    const statusLabel = statusLabels[status][locale];
    const stageIcon = stageIcons[stageNumber] || '🎯';

    const isInteractive = status !== 'locked' && (href || onSelect);

    const handleClick = () => {
      if (isInteractive && onSelect) {
        onSelect();
      }
    };

    // Generate stars for completed lessons
    const renderStars = () => {
      if (status !== 'completed') return null;
      const stars = Math.min(3, Math.ceil((completedLessons / lessonCount) * 3));
      return (
        <div className="flex gap-1 mt-2">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className={`text-lg ${i < stars ? 'opacity-100' : 'opacity-30'}`}
            >
              ⭐
            </span>
          ))}
        </div>
      );
    };

    const content = (
      <>
        <div className="flex items-start gap-5">
          {/* Stage number badge with icon */}
          <div className="flex flex-col items-center gap-2">
            <div className={numberClasses[status]}>
              {status === 'completed' ? (
                <span className="text-2xl">✓</span>
              ) : status === 'locked' ? (
                <span className="text-xl">🔒</span>
              ) : (
                <span className="text-2xl font-bold">{stageNumber}</span>
              )}
            </div>
            <span className="text-2xl" aria-hidden="true">{stageIcon}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-display-sm text-foreground font-bold truncate">
                {name}
              </h3>
              <span
                className={`badge text-sm ${
                  status === 'completed'
                    ? 'badge-success'
                    : status === 'current'
                    ? 'badge-primary'
                    : status === 'locked'
                    ? 'badge-default'
                    : 'badge-info'
                }`}
              >
                {statusLabel}
              </span>
            </div>

            <p className="text-body-sm text-muted mb-3">{description}</p>

            {/* Progress bar for current stage */}
            {status === 'current' && (
              <div className="mb-2">
                <div className="progress-bar h-3 rounded-full">
                  <div
                    className="progress-bar-fill progress-bar-primary rounded-full"
                    style={{
                      width: `${Math.max(5, (completedLessons / lessonCount) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-caption text-muted font-medium">
                {status === 'current' || status === 'completed'
                  ? `${completedLessons}/${lessonCount} ${lessonsLabel}`
                  : `${lessonCount} ${lessonsLabel}`}
              </p>
              {renderStars()}
            </div>
          </div>
        </div>
      </>
    );

    const cardClasses = `${statusClasses[status]} ${className}`;

    const ariaLabel = `${locale === 'he' ? 'שלב' : 'Stage'} ${stageNumber}: ${name}, ${lessonCount} ${lessonsLabel}, ${statusLabel}`;

    if (isInteractive && href) {
      return (
        <Link
          href={href}
          className={cardClasses}
          aria-label={ariaLabel}
        >
          {content}
        </Link>
      );
    }

    return (
      <div
        ref={ref}
        className={cardClasses}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={handleClick}
        onKeyDown={
          isInteractive
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick();
                }
              }
            : undefined
        }
        aria-label={ariaLabel}
        aria-disabled={status === 'locked'}
      >
        {content}
      </div>
    );
  }
);
