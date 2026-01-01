'use client';

import { memo, useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Stage, Lesson, LessonProgress } from '@/types/lesson';

interface LessonSelectionModalProps {
  stage: Stage;
  locale: 'en' | 'he';
  isOpen: boolean;
  onClose: () => void;
  isLessonUnlocked: (lessonId: string) => boolean;
  getLessonProgress: (lessonId: string) => LessonProgress | null;
}

// Difficulty badge colors
const difficultyColors: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  hard: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  expert: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

// Difficulty labels
const difficultyLabels: Record<string, { en: string; he: string }> = {
  beginner: { en: 'Beginner', he: 'מתחיל' },
  easy: { en: 'Easy', he: 'קל' },
  medium: { en: 'Medium', he: 'בינוני' },
  hard: { en: 'Hard', he: 'קשה' },
  expert: { en: 'Expert', he: 'מומחה' },
};

// Star display component
const Stars = memo(function Stars({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`text-sm ${i < count ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
});

// Lesson item component
const LessonItem = memo(function LessonItem({
  lesson,
  locale,
  isUnlocked,
  progress,
  isSelected,
  onSelect,
  onStart,
}: {
  lesson: Lesson;
  locale: 'en' | 'he';
  isUnlocked: boolean;
  progress: LessonProgress | null;
  isSelected: boolean;
  onSelect: () => void;
  onStart: () => void;
}) {
  const isCompleted = progress?.completed ?? false;
  const stars = progress?.stars ?? 0;
  const bestWpm = progress?.bestWpm ?? 0;
  const bestAccuracy = progress?.bestAccuracy ?? 0;

  const statusLabel = !isUnlocked
    ? (locale === 'he' ? 'נעול' : 'Locked')
    : isCompleted
    ? (locale === 'he' ? 'הושלם' : 'Completed')
    : (locale === 'he' ? 'זמין' : 'Available');

  return (
    <button
      onClick={isUnlocked ? onSelect : undefined}
      onDoubleClick={isUnlocked ? onStart : undefined}
      disabled={!isUnlocked}
      className={`
        w-full text-left p-4 rounded-xl border-2 transition-all
        ${!isUnlocked
          ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          : isSelected
          ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-400/50'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
        }
      `}
      aria-label={`${lesson.title[locale]}, ${statusLabel}, ${lesson.estimatedMinutes} ${locale === 'he' ? 'דקות' : 'minutes'}`}
      aria-selected={isSelected}
      role="option"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left side: Lesson info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {/* Lesson number */}
            <span className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${isCompleted
                ? 'bg-emerald-500 text-white'
                : isUnlocked
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }
            `}>
              {isCompleted ? '✓' : lesson.lessonNumber}
            </span>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {lesson.title[locale]}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
            {lesson.description[locale]}
          </p>

          {/* Meta info row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Difficulty badge */}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[lesson.difficulty]}`}>
              {difficultyLabels[lesson.difficulty][locale]}
            </span>

            {/* Time */}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ⏱ {lesson.estimatedMinutes} {locale === 'he' ? 'דק׳' : 'min'}
            </span>

            {/* XP */}
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              +{lesson.xpReward} XP
            </span>

            {/* New keys */}
            {lesson.newKeys.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {locale === 'he' ? 'מקשים חדשים:' : 'New:'} {lesson.newKeys.join(', ').toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Right side: Status/Stars */}
        <div className="flex flex-col items-end gap-1">
          {!isUnlocked ? (
            <span className="text-2xl">🔒</span>
          ) : isCompleted ? (
            <>
              <Stars count={stars} />
              {bestWpm > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {bestWpm} WPM · {bestAccuracy}%
                </span>
              )}
            </>
          ) : (
            <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full font-medium">
              {locale === 'he' ? 'התחל' : 'Start'}
            </span>
          )}
        </div>
      </div>
    </button>
  );
});

export const LessonSelectionModal = memo(function LessonSelectionModal({
  stage,
  locale,
  isOpen,
  onClose,
  isLessonUnlocked,
  getLessonProgress,
}: LessonSelectionModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isRTL = locale === 'he';

  // Find first available (unlocked but not completed) lesson
  useEffect(() => {
    if (isOpen) {
      const firstAvailableIndex = stage.lessons.findIndex(
        (l) => isLessonUnlocked(l.id) && !getLessonProgress(l.id)?.completed
      );
      setSelectedIndex(firstAvailableIndex >= 0 ? firstAvailableIndex : 0);
    }
  }, [isOpen, stage.lessons, isLessonUnlocked, getLessonProgress]);

  // Focus trap and keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, stage.lessons.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          const selectedLesson = stage.lessons[selectedIndex];
          if (selectedLesson && isLessonUnlocked(selectedLesson.id)) {
            window.scrollTo({ top: 0, behavior: 'instant' });
            router.push(`/${locale}/practice/${selectedLesson.id}`);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, stage.lessons, isLessonUnlocked, router, locale, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLessonStart = useCallback((lessonId: string) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    router.push(`/${locale}/practice/${lessonId}`);
  }, [router, locale]);

  if (!isOpen) return null;

  // Count completed lessons
  const completedCount = stage.lessons.filter(
    (l) => getLessonProgress(l.id)?.completed
  ).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`
          relative w-full max-w-lg max-h-[85vh] overflow-hidden
          bg-white dark:bg-gray-900 rounded-2xl shadow-2xl
          flex flex-col
        `}
        dir={isRTL ? 'rtl' : 'ltr'}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{stage.icon}</span>
              <div>
                <h2 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
                  {stage.name[locale]}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {completedCount}/{stage.lessons.length} {locale === 'he' ? 'שיעורים הושלמו' : 'lessons completed'}
                </p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={locale === 'he' ? 'סגור' : 'Close'}
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(completedCount / stage.lessons.length) * 100}%`,
                backgroundColor: stage.themeColor,
              }}
            />
          </div>
        </div>

        {/* Lesson list */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3"
          role="listbox"
          aria-label={locale === 'he' ? 'רשימת שיעורים' : 'Lesson list'}
        >
          {stage.lessons.map((lesson, index) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              locale={locale}
              isUnlocked={isLessonUnlocked(lesson.id)}
              progress={getLessonProgress(lesson.id)}
              isSelected={index === selectedIndex}
              onSelect={() => setSelectedIndex(index)}
              onStart={() => handleLessonStart(lesson.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {locale === 'he'
                ? 'השתמש ב-↑↓ לניווט, Enter להתחלה'
                : 'Use ↑↓ to navigate, Enter to start'}
            </p>

            <button
              onClick={() => {
                const selectedLesson = stage.lessons[selectedIndex];
                if (selectedLesson && isLessonUnlocked(selectedLesson.id)) {
                  handleLessonStart(selectedLesson.id);
                }
              }}
              disabled={!isLessonUnlocked(stage.lessons[selectedIndex]?.id)}
              className={`
                px-5 py-2.5 rounded-xl font-semibold transition-all
                ${isLessonUnlocked(stage.lessons[selectedIndex]?.id)
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {locale === 'he' ? 'התחל שיעור' : 'Start Lesson'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default LessonSelectionModal;
