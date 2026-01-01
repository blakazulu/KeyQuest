'use client';

import { memo, useEffect, useRef, useMemo } from 'react';
import type { Lesson } from '@/types/lesson';
import { Keyboard } from '@/components/keyboard';
import { LeftHand, RightHand } from '@/components/keyboard/HandGuide';

interface LessonIntroProps {
  lesson: Lesson;
  locale: 'en' | 'he';
  onStart: () => void;
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

// Visual key component for home row display
const HomeKey = memo(function HomeKey({
  letter,
  finger,
  hasBump,
}: {
  letter: string;
  finger: 'pinky' | 'ring' | 'middle' | 'index';
  hasBump?: boolean;
}) {
  const fingerColors = {
    pinky: 'bg-rose-500',
    ring: 'bg-orange-500',
    middle: 'bg-emerald-500',
    index: 'bg-sky-500',
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={`
          w-10 h-10 rounded-lg flex items-center justify-center
          font-mono font-bold text-white text-base
          shadow-md ${fingerColors[finger]}
          ${hasBump ? 'ring-2 ring-white ring-offset-2 ring-offset-amber-50 dark:ring-offset-amber-900/20' : ''}
        `}
      >
        {letter}
      </div>
      {hasBump && (
        <div className="w-4 h-1 bg-gray-400 dark:bg-gray-500 rounded-full" title="Bump indicator" />
      )}
    </div>
  );
});

// Home row explanation component
const HomeRowExplanation = memo(function HomeRowExplanation({
  locale,
  newKeys,
}: {
  locale: 'en' | 'he';
  newKeys: string[];
}) {
  const isHomeRowLesson = newKeys.some((k) => 'asdfghjkl;'.includes(k.toLowerCase()));

  if (!isHomeRowLesson) return null;

  const content = locale === 'he' ? {
    title: 'שורת הבית',
    subtitle: 'כאן האצבעות שלך נחות',
    bumpTip: 'מקשי F ו-J יש להם בליטות קטנות - מצא אותן בלי להסתכל!',
    leftHand: 'יד שמאל',
    rightHand: 'יד ימין',
    fingerNames: {
      pinky: 'זרת',
      ring: 'קמיצה',
      middle: 'אמה',
      index: 'אצבע',
    },
    tip: 'תמיד תחזור לשורת הבית אחרי כל הקשה!',
  } : {
    title: 'The Home Row',
    subtitle: 'This is where your fingers rest',
    bumpTip: 'F and J have small bumps — find them without looking!',
    leftHand: 'Left Hand',
    rightHand: 'Right Hand',
    fingerNames: {
      pinky: 'Pinky',
      ring: 'Ring',
      middle: 'Middle',
      index: 'Index',
    },
    tip: 'Always return here after pressing other keys!',
  };

  return (
    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
      <div className="flex items-center gap-6">
        {/* Left side - Text content */}
        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-base text-amber-900 dark:text-amber-100 flex items-center gap-1.5">
            <span>🏠</span>
            {content.title}
          </h3>
          <p className="text-amber-700 dark:text-amber-300 text-sm">
            {content.subtitle}
          </p>
          <p className="text-amber-700 dark:text-amber-300 text-sm flex items-center gap-1">
            <span>👆</span>
            <span>{content.bumpTip}</span>
          </p>
          <p className="text-amber-600 dark:text-amber-400 text-sm font-medium flex items-center gap-1">
            <span>💡</span>
            <span>{content.tip}</span>
          </p>
        </div>

        {/* Right side - Visual keys */}
        <div dir="ltr" className="flex-shrink-0 flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            {/* Left hand keys */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium text-green-600 dark:text-green-400 mb-1.5">
                {content.leftHand}
              </span>
              <div className="flex gap-1">
                <HomeKey letter="A" finger="pinky" />
                <HomeKey letter="S" finger="ring" />
                <HomeKey letter="D" finger="middle" />
                <HomeKey letter="F" finger="index" hasBump />
              </div>
            </div>

            {/* Right hand keys */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400 mb-1.5">
                {content.rightHand}
              </span>
              <div className="flex gap-1">
                <HomeKey letter="J" finger="index" hasBump />
                <HomeKey letter="K" finger="middle" />
                <HomeKey letter="L" finger="ring" />
                <HomeKey letter=";" finger="pinky" />
              </div>
            </div>
          </div>

          {/* Finger color legend */}
          <div className="flex gap-4 text-xs">
            {(['pinky', 'ring', 'middle', 'index'] as const).map((finger) => {
              const colors = {
                pinky: 'bg-rose-500',
                ring: 'bg-orange-500',
                middle: 'bg-emerald-500',
                index: 'bg-sky-500',
              };
              return (
                <span key={finger} className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded-full ${colors[finger]}`} />
                  <span className="text-amber-700 dark:text-amber-300">{content.fingerNames[finger]}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

export const LessonIntro = memo(function LessonIntro({
  lesson,
  locale,
  onStart,
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
    findTheKeys: locale === 'he' ? 'מצא את המקשים המודגשים על המקלדת' : 'Find the highlighted keys on the keyboard',
  };

  const showKeyboard = lesson.newKeys.length > 0;

  // For home row lessons, highlight all home row keys
  const homeRowKeys = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
  const isHomeRowLesson = lesson.newKeys.some((k) => homeRowKeys.includes(k.toLowerCase()));
  const highlightedKeys = useMemo(() => {
    if (isHomeRowLesson) {
      // Combine lesson's new keys with all home row keys (deduplicated)
      const allKeys = new Set([...lesson.newKeys.map(k => k.toLowerCase()), ...homeRowKeys]);
      return Array.from(allKeys);
    }
    return lesson.newKeys;
  }, [lesson.newKeys, isHomeRowLesson]);

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
                  className="px-8 py-4 text-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 border border-white/30"
                  aria-label={labels.startLesson}
                >
                  {labels.startLesson} →
                </button>
                <p className="text-center text-xs text-white/60 mt-2">
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

            {/* Home row explanation for relevant lessons */}
            <HomeRowExplanation locale={locale} newKeys={lesson.newKeys} />

            {/* Visual keyboard with highlighted keys */}
            {showKeyboard && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-center">
                  {labels.findTheKeys}
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
            )}
          </div>

        </div>
      </div>
    </div>
  );
});

export default LessonIntro;
