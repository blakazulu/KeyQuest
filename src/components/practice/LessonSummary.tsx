'use client';

import { memo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Lesson, LessonResult } from '@/types/lesson';

interface LessonSummaryProps {
  lesson: Lesson;
  result: LessonResult;
  locale: 'en' | 'he';
  nextLessonId: string | null;
  onRestart: () => void;
}

// Star display component with animation
const Stars = memo(function Stars({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <div className="flex gap-2 justify-center" aria-label={`${count} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`
            text-4xl md:text-5xl transform transition-all duration-500
            ${i < count
              ? 'text-amber-400 scale-100 animate-[star-pop_0.3s_ease-out_forwards]'
              : 'text-gray-300 dark:text-gray-600 scale-75'
            }
          `}
          style={{ animationDelay: `${i * 0.15}s` }}
        >
          ★
        </span>
      ))}
    </div>
  );
});

// Stat card component
const StatCard = memo(function StatCard({
  icon,
  label,
  value,
  highlight,
  className = '',
}: {
  icon: string;
  label: string;
  value: string | number;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div className={`p-4 rounded-xl text-center ${className}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-2xl md:text-3xl font-bold ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-200'}`}>
        {value}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
});

export const LessonSummary = memo(function LessonSummary({
  lesson,
  result,
  locale,
  nextLessonId,
  onRestart,
}: LessonSummaryProps) {
  const router = useRouter();
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const isRTL = locale === 'he';

  // Auto-focus next button
  useEffect(() => {
    const timer = setTimeout(() => {
      nextButtonRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          window.scrollTo({ top: 0, behavior: 'instant' });
          if (nextLessonId) {
            router.push(`/${locale}/practice/${nextLessonId}`);
          } else {
            router.push(`/${locale}/levels`);
          }
          break;
        case 'r':
        case 'R':
          onRestart();
          break;
        case 'Escape':
          window.scrollTo({ top: 0, behavior: 'instant' });
          router.push(`/${locale}/levels`);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router, locale, nextLessonId, onRestart]);

  const labels = {
    lessonComplete: locale === 'he' ? 'שיעור הושלם!' : 'Lesson Complete!',
    tryAgain: locale === 'he' ? 'נסה שוב' : 'Try Again',
    passed: locale === 'he' ? 'עברת!' : 'Passed!',
    failed: locale === 'he' ? 'לא עברת' : 'Not quite...',
    wpm: locale === 'he' ? 'מילים לדקה' : 'WPM',
    accuracy: locale === 'he' ? 'דיוק' : 'Accuracy',
    time: locale === 'he' ? 'זמן' : 'Time',
    xpEarned: locale === 'he' ? 'XP שהרווחת' : 'XP Earned',
    newBest: locale === 'he' ? 'שיא חדש!' : 'New Best!',
    restart: locale === 'he' ? 'נסה שוב' : 'Try Again',
    nextLesson: locale === 'he' ? 'שיעור הבא' : 'Next Lesson',
    backToMap: locale === 'he' ? 'חזרה למפה' : 'Back to Map',
    shortcuts: locale === 'he'
      ? 'R = נסה שוב · Enter = הבא · Esc = מפה'
      : 'R = Restart · Enter = Next · Esc = Map',
  };

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950"
      dir={isRTL ? 'rtl' : 'ltr'}
      role="region"
      aria-live="assertive"
      aria-label={result.passed ? labels.lessonComplete : labels.tryAgain}
    >
      <div className="w-full max-w-lg">
        {/* Main card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className={`p-6 text-center ${result.passed
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
            : 'bg-gradient-to-r from-amber-500 to-orange-500'
          }`}>
            {/* Pass/Fail indicator */}
            <div className="text-6xl mb-2">
              {result.passed ? '🎉' : '💪'}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {result.passed ? labels.passed : labels.failed}
            </h1>
            <p className="text-white/80">
              {lesson.title[locale]}
            </p>
          </div>

          {/* Stars section */}
          <div className="py-6 border-b border-gray-200 dark:border-gray-700">
            <Stars count={result.stars} />

            {/* New best badge */}
            {result.isNewBest && result.passed && (
              <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium mx-auto">
                <span>🏆</span>
                <span>{labels.newBest}</span>
              </div>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 p-6">
            <StatCard
              icon="⚡"
              label={labels.wpm}
              value={result.wpm}
              highlight={result.wpm >= 40}
              className="bg-indigo-50 dark:bg-indigo-900/20"
            />
            <StatCard
              icon="🎯"
              label={labels.accuracy}
              value={`${result.accuracy}%`}
              highlight={result.accuracy >= 95}
              className="bg-emerald-50 dark:bg-emerald-900/20"
            />
            <StatCard
              icon="⏱️"
              label={labels.time}
              value={formatTime(result.timeSpent)}
              className="bg-gray-50 dark:bg-gray-700/30"
            />
            <StatCard
              icon="⭐"
              label={labels.xpEarned}
              value={`+${result.xpEarned}`}
              highlight={result.xpEarned > 0}
              className="bg-purple-50 dark:bg-purple-900/20"
            />
          </div>

          {/* Action buttons */}
          <div className="p-6 pt-0 space-y-3">
            {/* Primary action: Next or Restart */}
            {result.passed && nextLessonId ? (
              <button
                ref={nextButtonRef}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  router.push(`/${locale}/practice/${nextLessonId}`);
                }}
                className="w-full py-4 btn-rainbow text-white text-lg font-bold rounded-xl transition-all transform hover:scale-[1.02]"
              >
                {labels.nextLesson}
              </button>
            ) : result.passed ? (
              <button
                ref={nextButtonRef}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  router.push(`/${locale}/levels`);
                }}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-[1.02]"
              >
                {labels.backToMap}
              </button>
            ) : (
              <button
                ref={nextButtonRef}
                onClick={onRestart}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-amber-500/30 transition-all transform hover:scale-[1.02]"
              >
                {labels.restart}
              </button>
            )}

            {/* Secondary actions */}
            <div className="flex gap-3">
              {result.passed && (
                <button
                  onClick={onRestart}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
                >
                  {labels.restart}
                </button>
              )}
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  router.push(`/${locale}/levels`);
                }}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
              >
                {labels.backToMap}
              </button>
            </div>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="px-6 pb-4 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {labels.shortcuts}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default LessonSummary;
