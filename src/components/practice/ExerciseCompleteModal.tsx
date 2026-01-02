'use client';

import { memo, useEffect, useRef } from 'react';
import type { ExerciseResult } from '@/types/lesson';

interface ExerciseCompleteModalProps {
  result: ExerciseResult;
  exerciseNumber: number;
  totalExercises: number;
  xpEarned: number;
  locale: 'en' | 'he';
  isLastExercise: boolean;
  onContinue: () => void;
  onExit: () => void;
}

// Calculate stars based on accuracy
function getStars(accuracy: number): number {
  if (accuracy >= 95) return 3;
  if (accuracy >= 85) return 2;
  if (accuracy >= 70) return 1;
  return 0;
}

// Get performance emoji based on accuracy
function getPerformanceEmoji(accuracy: number): string {
  if (accuracy >= 95) return '🎉';
  if (accuracy >= 85) return '👏';
  if (accuracy >= 70) return '👍';
  return '💪';
}

// Get WPM color class based on speed
function getWpmColor(wpm: number): string {
  if (wpm >= 60) return 'text-amber-500 dark:text-amber-400'; // Excellent
  if (wpm >= 40) return 'text-purple-600 dark:text-purple-400'; // Good
  if (wpm >= 20) return 'text-emerald-600 dark:text-emerald-400'; // Improving
  return 'text-blue-600 dark:text-blue-400'; // Learning
}

// Get accuracy color class
function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 95) return 'text-emerald-600 dark:text-emerald-400';
  if (accuracy >= 85) return 'text-blue-600 dark:text-blue-400';
  if (accuracy >= 70) return 'text-amber-600 dark:text-amber-400';
  return 'text-rose-600 dark:text-rose-400';
}

// Star display component
const Stars = memo(function Stars({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <div className="flex gap-1 justify-center" aria-label={`${count} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`
            text-2xl transform transition-all duration-300
            ${i < count
              ? 'text-amber-400 scale-100 animate-[star-pop_0.3s_ease-out_forwards]'
              : 'text-gray-300 dark:text-gray-600 scale-75 opacity-50'
            }
          `}
          style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
        >
          ★
        </span>
      ))}
    </div>
  );
});

export const ExerciseCompleteModal = memo(function ExerciseCompleteModal({
  result,
  exerciseNumber,
  totalExercises,
  xpEarned,
  locale,
  isLastExercise,
  onContinue,
  onExit,
}: ExerciseCompleteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const isRTL = locale === 'he';

  // Auto-focus continue button
  useEffect(() => {
    const timer = setTimeout(() => {
      continueButtonRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          onContinue();
          break;
        case 'Escape':
          e.preventDefault();
          onExit();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onContinue, onExit]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const labels = {
    exerciseComplete: locale === 'he' ? 'תרגיל הושלם!' : 'Exercise Complete!',
    exerciseOf: locale === 'he' ? 'תרגיל' : 'Exercise',
    of: locale === 'he' ? 'מתוך' : 'of',
    wpm: 'WPM',
    accuracy: locale === 'he' ? 'דיוק' : 'Accuracy',
    time: locale === 'he' ? 'זמן' : 'Time',
    continue: isLastExercise
      ? (locale === 'he' ? 'סיום' : 'Finish')
      : (locale === 'he' ? 'המשך' : 'Continue'),
    backToMap: locale === 'he' ? 'חזרה למפה' : 'Back to Map',
    shortcuts: locale === 'he'
      ? 'Enter = המשך · Esc = יציאה'
      : 'Enter = Continue · Esc = Exit',
  };

  // Format time as seconds
  const formatTime = (seconds: number) => {
    const secs = Math.floor(seconds);
    return `${secs}s`;
  };

  const stars = getStars(result.accuracy);
  const emoji = getPerformanceEmoji(result.accuracy);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-complete-title"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onContinue}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        ref={modalRef}
        className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.3s_ease-out]"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="p-5 text-center border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-left">
              <h2 id="exercise-complete-title" className="font-semibold text-gray-800 dark:text-gray-200">
                {labels.exerciseComplete}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {labels.exerciseOf} {exerciseNumber} {labels.of} {totalExercises}
              </p>
            </div>
            <div className="text-3xl ml-auto" aria-hidden="true">
              {emoji}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="px-5 py-4 flex items-center justify-center gap-6 border-b border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getWpmColor(result.wpm)}`}>
              {result.wpm}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{labels.wpm}</div>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <div className={`text-2xl font-bold ${getAccuracyColor(result.accuracy)}`}>
              {result.accuracy}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{labels.accuracy}</div>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {formatTime(result.timeSpent)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{labels.time}</div>
          </div>
        </div>

        {/* XP and Stars section */}
        <div className="px-5 py-4 flex items-center justify-between">
          {/* Stars */}
          <Stars count={stars} />

          {/* XP Badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-bold shadow-lg shadow-orange-500/30 animate-[bounceIn_0.4s_ease-out_0.3s_both]"
            aria-label={`Earned ${xpEarned} XP`}
          >
            <span className="text-base">⭐</span>
            <span>+{xpEarned} XP</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-5 pt-2 flex gap-3">
          <button
            onClick={onExit}
            onKeyDown={(e) => {
              if (e.key === ' ') {
                e.preventDefault(); // Prevent Space from triggering button
              }
            }}
            className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors text-sm"
          >
            {labels.backToMap}
          </button>
          <button
            ref={continueButtonRef}
            onClick={onContinue}
            onKeyDown={(e) => {
              if (e.key === ' ') {
                e.preventDefault(); // Prevent Space from triggering button
              }
            }}
            className="flex-[2] py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {labels.continue} →
          </button>
        </div>

        {/* Keyboard hint */}
        <div className="px-5 pb-3 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {labels.shortcuts}
          </p>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
});

export default ExerciseCompleteModal;
