'use client';

import { memo, useEffect, useState } from 'react';

export interface StreakCardProps {
  /** Current streak count */
  currentStreak: number;
  /** Longest streak achieved */
  longestStreak: number;
  /** Last practice date (ISO string or null) */
  lastPracticeDate: string | null;
  /** Current locale */
  locale: 'en' | 'he';
  /** Animation delay in ms */
  delay?: number;
}

// Check if user practiced today
function isPracticedToday(lastPracticeDate: string | null): boolean {
  if (!lastPracticeDate) return false;
  const last = new Date(lastPracticeDate).toDateString();
  const today = new Date().toDateString();
  return last === today;
}

// Check if streak is at risk (practiced yesterday but not today)
function isStreakAtRisk(lastPracticeDate: string | null): boolean {
  if (!lastPracticeDate) return false;
  const last = new Date(lastPracticeDate);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return last.toDateString() === yesterday.toDateString();
}

export const StreakCard = memo(function StreakCard({
  currentStreak,
  longestStreak,
  lastPracticeDate,
  locale,
  delay = 0,
}: StreakCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayStreak, setDisplayStreak] = useState(0);

  const practicedToday = isPracticedToday(lastPracticeDate);
  const atRisk = !practicedToday && isStreakAtRisk(lastPracticeDate);
  const isActive = currentStreak > 0 && (practicedToday || atRisk);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  // Animate streak count
  useEffect(() => {
    if (!isVisible) return;

    const animationDelay = setTimeout(() => {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / 800, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setDisplayStreak(Math.round(easeOut * currentStreak));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, 200);

    return () => clearTimeout(animationDelay);
  }, [isVisible, currentStreak]);

  const isRTL = locale === 'he';
  const labels = {
    streak: isRTL ? 'רצף תרגול' : 'Practice Streak',
    days: isRTL ? 'ימים' : 'days',
    day: isRTL ? 'יום' : 'day',
    best: isRTL ? 'השיא' : 'Best',
    atRisk: isRTL ? 'בסכנה!' : 'At risk!',
    keepGoing: isRTL ? 'המשך היום!' : 'Practice today!',
    noPractice: isRTL ? 'התחל לתרגל!' : 'Start practicing!',
  };

  const dayLabel = currentStreak === 1 ? labels.day : labels.days;

  return (
    <div
      className={`
        relative rounded-2xl p-5
        shadow-lg shadow-gray-300/20 dark:shadow-black/30
        border border-white/80 dark:border-gray-700
        backdrop-blur-sm
        transition-all duration-500
        ${atRisk
          ? 'bg-gradient-to-br from-white via-amber-50 to-orange-100 dark:from-gray-800 dark:via-gray-800 dark:to-amber-900/30'
          : isActive
            ? 'bg-gradient-to-br from-white via-orange-50 to-amber-100 dark:from-gray-800 dark:via-gray-800 dark:to-orange-900/30'
            : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/30'
        }
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      role="region"
      aria-label={`${labels.streak}: ${currentStreak} ${dayLabel}${atRisk ? `, ${labels.atRisk}` : ''}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        {/* Flame Icon */}
        <div
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            ${isActive
              ? 'bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg shadow-orange-500/30'
              : 'bg-gray-200 dark:bg-gray-700'
            }
          `}
        >
          <span
            className={`text-2xl ${isActive ? 'animate-flame' : 'grayscale opacity-50'}`}
            aria-hidden="true"
          >
            🔥
          </span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {labels.streak}
        </span>
      </div>

      {/* Streak Value */}
      <div className="flex items-baseline gap-2">
        <p
          className={`
            font-display text-4xl font-bold
            ${isActive
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-gray-400 dark:text-gray-500'
            }
          `}
        >
          {displayStreak}
        </p>
        <span className={`text-lg ${isActive ? 'text-orange-500 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500'}`}>
          {dayLabel}
        </span>
      </div>

      {/* Status Message */}
      {atRisk && (
        <div className="mt-2 flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
          <span className="animate-pulse">⚠️</span>
          <span className="text-sm font-medium">{labels.atRisk} {labels.keepGoing}</span>
        </div>
      )}

      {currentStreak === 0 && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {labels.noPractice}
        </p>
      )}

      {/* Best Streak Badge */}
      {longestStreak > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">{labels.best}</span>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {longestStreak} {longestStreak === 1 ? labels.day : labels.days}
          </span>
        </div>
      )}

      {/* CSS Animation for flame */}
      <style jsx>{`
        @keyframes flame-flicker {
          0%, 100% {
            transform: scaleY(1) rotate(0deg);
          }
          25% {
            transform: scaleY(1.1) rotate(-2deg);
          }
          50% {
            transform: scaleY(0.95) rotate(2deg);
          }
          75% {
            transform: scaleY(1.15) rotate(-1deg);
          }
        }

        .animate-flame {
          animation: flame-flicker 0.4s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
});

export default StreakCard;
