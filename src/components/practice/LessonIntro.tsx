'use client';

import { memo, useEffect, useRef, useMemo } from 'react';
import type { Lesson } from '@/types/lesson';
import { Keyboard } from '@/components/keyboard';
import { LeftHand, RightHand } from '@/components/keyboard/HandGuide';
import { LessonExplanation } from './LessonExplanations';

interface LessonIntroProps {
  lesson: Lesson;
  locale: 'en' | 'he';
  onStart: () => void;
  onBack: () => void;
}

// Difficulty badge colors
const difficultyColors: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  hard: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  expert: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const difficultyLabels: Record<string, { en: string; he: string }> = {
  beginner: { en: 'Beginner', he: 'מתחיל' },
  easy: { en: 'Easy', he: 'קל' },
  medium: { en: 'Medium', he: 'בינוני' },
  hard: { en: 'Hard', he: 'קשה' },
  expert: { en: 'Expert', he: 'מומחה' },
};

export const LessonIntro = memo(function LessonIntro({
  lesson,
  locale,
  onStart,
  onBack,
}: LessonIntroProps) {
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const isRTL = locale === 'he';

  // Auto-focus start button
  useEffect(() => {
    startButtonRef.current?.focus();
  }, []);

  // Handle Enter key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onStart();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  const labels = {
    stage: locale === 'he' ? 'שלב' : 'Stage',
    lesson: locale === 'he' ? 'שיעור' : 'Lesson',
    newKeys: locale === 'he' ? 'מקשים חדשים' : 'New Keys',
    targetAccuracy: locale === 'he' ? 'דיוק נדרש' : 'Target Accuracy',
    exercises: locale === 'he' ? 'תרגילים' : 'Exercises',
    minutes: locale === 'he' ? 'דקות' : 'minutes',
    startLesson: locale === 'he' ? 'התחל שיעור' : 'Start Lesson',
    pressEnter: locale === 'he' ? 'או לחץ Enter' : 'or press Enter',
    keysInThisLesson: locale === 'he' ? 'המקשים בשיעור זה' : 'Keys in this lesson',
    backToMap: locale === 'he' ? 'חזרה למפה' : 'Back to Map',
  };

  // Always show keyboard with highlighted keys
  // For lessons with new keys, highlight those; otherwise highlight all practice keys
  const homeRowKeys = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
  const isHomeRowLesson = lesson.stageId === 1;

  const highlightedKeys = useMemo(() => {
    if (lesson.newKeys.length > 0) {
      // If there are new keys, highlight them plus home row for context
      if (isHomeRowLesson) {
        const allKeys = new Set([...lesson.newKeys.map(k => k.toLowerCase()), ...homeRowKeys]);
        return Array.from(allKeys);
      }
      return lesson.newKeys.map(k => k.toLowerCase());
    }
    // For lessons without new keys, highlight practice keys (limited to avoid overwhelming)
    // Only show letters/symbols that are actively practiced, not full alphabet
    if (lesson.practiceKeys.length <= 15) {
      return lesson.practiceKeys.map(k => k.toLowerCase());
    }
    // For larger sets (like full alphabet), just highlight home row as base
    return homeRowKeys;
  }, [lesson.newKeys, lesson.practiceKeys, isHomeRowLesson]);

  return (
    <div
      className="flex items-center justify-center p-4"
      dir={isRTL ? 'rtl' : 'ltr'}
      role="region"
      aria-live="polite"
      aria-label={lesson.title[locale]}
    >
      <div className="w-full">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div
            className="p-6 text-white"
            style={{ background: 'linear-gradient(135deg, #ff9a56, #ff6f3c, #ff5722)' }}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left side - lesson info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
                  {/* Back to map button */}
                  <button
                    onClick={onBack}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                    aria-label={labels.backToMap}
                  >
                    <svg
                      className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>{labels.backToMap}</span>
                  </button>
                  <span>·</span>
                  <span>{labels.stage} {lesson.stageId}</span>
                  <span>·</span>
                  <span>{labels.lesson} {lesson.lessonNumber}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {lesson.title[locale]}
                </h1>
                <p className="text-white/90 text-lg">
                  {lesson.description[locale]}
                </p>
              </div>

              {/* Right side - start button */}
              <div className="flex-shrink-0">
                <button
                  ref={startButtonRef}
                  onClick={onStart}
                  className="px-10 py-5 text-xl bg-white hover:bg-gray-100 text-orange-600 font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  aria-label={labels.startLesson}
                >
                  {labels.startLesson} →
                </button>
                <p className="text-center text-xs text-white/70 mt-2">
                  {labels.pressEnter}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Meta info row */}
            <div className="flex flex-wrap gap-4">
              {/* Difficulty */}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[lesson.difficulty]}`}>
                {difficultyLabels[lesson.difficulty][locale]}
              </span>

              {/* Time */}
              <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                ⏱ {lesson.estimatedMinutes} {labels.minutes}
              </span>

              {/* Exercises count */}
              <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                📝 {lesson.exercises.length} {labels.exercises}
              </span>

              {/* XP */}
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium">
                ⭐ +{lesson.xpReward} XP
              </span>

              {/* Target accuracy */}
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                🎯 {lesson.passingAccuracy}%
              </span>
            </div>

            {/* Lesson-specific explanation */}
            <LessonExplanation
              stageId={lesson.stageId}
              newKeys={lesson.newKeys}
              practiceKeys={lesson.practiceKeys}
              locale={locale}
            />

            {/* Visual keyboard with highlighted keys - always shown */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-center">
                {labels.keysInThisLesson}
              </h3>

              {/* Keyboard with hands */}
              <div dir="ltr" className="flex flex-col items-center gap-4">
                {/* Hands and keyboard row */}
                <div className="flex items-start justify-center gap-4 w-full">
                  <LeftHand locale={locale} className="hidden md:flex" />
                  <Keyboard
                    highlightedKeys={highlightedKeys}
                    showFingerColors={true}
                    showHomeRow={true}
                    baseSize={36}
                    className="scale-90 md:scale-100"
                  />
                  <RightHand locale={locale} className="hidden md:flex" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
});

export default LessonIntro;
