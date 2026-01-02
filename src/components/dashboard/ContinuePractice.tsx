'use client';

import { memo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Lesson } from '@/types/lesson';
import { getStage } from '@/data/lessons';

export interface ContinuePracticeProps {
  /** Next lesson to practice */
  nextLesson: Lesson | null;
  /** Whether the curriculum is complete */
  curriculumComplete: boolean;
  /** Current locale */
  locale: 'en' | 'he';
  /** Animation delay in ms */
  delay?: number;
}

export const ContinuePractice = memo(function ContinuePractice({
  nextLesson,
  curriculumComplete,
  locale,
  delay = 0,
}: ContinuePracticeProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const isRTL = locale === 'he';
  const labels = {
    continueQuest: isRTL ? 'המשך במסע שלך' : 'Continue Your Quest',
    nextLesson: isRTL ? 'השיעור הבא' : 'Next Lesson',
    startPractice: isRTL ? 'התחל לתרגל' : 'Start Practice',
    curriculumComplete: isRTL ? 'הושלם!' : 'Curriculum Complete!',
    allLessonsComplete: isRTL ? 'סיימת את כל השיעורים! המשך לתרגל כדי להשתפר.' : 'You\'ve completed all lessons! Keep practicing to improve.',
    practiceAnyLesson: isRTL ? 'תרגל שיעור' : 'Practice Any Lesson',
    stage: isRTL ? 'שלב' : 'Stage',
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  const stage = nextLesson ? getStage(nextLesson.stageId) : null;
  const stageName = stage?.name[locale] || '';
  const lessonTitle = nextLesson?.title[locale] || '';

  const handleClick = () => {
    if (nextLesson) {
      router.push(`/${locale}/practice/${nextLesson.id}`);
    } else {
      router.push(`/${locale}/levels`);
    }
  };

  if (curriculumComplete) {
    return (
      <div
        className={`
          mt-8 rounded-2xl p-6
          bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50
          dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20
          border border-emerald-200 dark:border-emerald-800
          shadow-lg shadow-emerald-500/10
          transition-all duration-500
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
        role="region"
        aria-label={labels.curriculumComplete}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-shrink-0 text-5xl">🏆</div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-display text-xl font-bold text-emerald-800 dark:text-emerald-200">
              {labels.curriculumComplete}
            </h3>
            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
              {labels.allLessonsComplete}
            </p>
          </div>
          <button
            onClick={() => router.push(`/${locale}/levels`)}
            className="
              px-6 py-3 rounded-full
              bg-gradient-to-r from-emerald-500 to-teal-500
              hover:from-emerald-600 hover:to-teal-600
              text-white font-bold
              shadow-lg shadow-emerald-500/30
              transition-all hover:scale-105 active:scale-95
            "
          >
            {labels.practiceAnyLesson}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        mt-8 rounded-2xl p-6
        bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50
        dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20
        border border-indigo-200 dark:border-indigo-800
        shadow-lg shadow-indigo-500/10
        transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      role="region"
      aria-label={labels.continueQuest}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
          <span className="text-3xl">{stage?.icon || '📚'}</span>
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            {labels.continueQuest}
          </p>
          <h3 className="font-display text-xl font-bold text-gray-800 dark:text-gray-100 mt-0.5">
            {lessonTitle}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {labels.stage} {nextLesson?.stageId}: {stageName}
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleClick}
          className="
            group relative px-8 py-4 rounded-full
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
            text-white font-bold text-lg
            shadow-lg shadow-purple-500/30
            transition-all hover:scale-105 active:scale-95
            overflow-hidden
          "
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          </div>

          <span className="relative flex items-center gap-2">
            {labels.startPractice}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </button>
      </div>
    </div>
  );
});

export default ContinuePractice;
