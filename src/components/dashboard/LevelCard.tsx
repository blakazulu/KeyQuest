'use client';

import { memo, useEffect, useState } from 'react';
import type { CurriculumProgress } from '@/types/lesson';
import { getStage } from '@/data/lessons';

export interface LevelCardProps {
  /** Curriculum progress data */
  progress: CurriculumProgress;
  /** Current locale */
  locale: 'en' | 'he';
  /** Total XP earned */
  totalXp: number;
  /** Animation delay in ms */
  delay?: number;
}

export const LevelCard = memo(function LevelCard({
  progress,
  locale,
  totalXp,
  delay = 0,
}: LevelCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  const currentStage = getStage(progress.currentStageId);
  const stageName = currentStage?.name[locale] || 'Unknown Stage';
  const stageIcon = currentStage?.icon || '🎯';

  // Calculate progress percentage for current stage
  const currentStageProgress = progress.stageProgress.find(
    (sp) => sp.stageId === progress.currentStageId
  );
  const stageProgressPercent = currentStageProgress
    ? Math.round((currentStageProgress.lessonsCompleted / currentStageProgress.totalLessons) * 100)
    : 0;

  const isRTL = locale === 'he';
  const labels = {
    currentLevel: isRTL ? 'השלב הנוכחי' : 'Current Level',
    stage: isRTL ? 'שלב' : 'Stage',
    lessons: isRTL ? 'שיעורים' : 'lessons',
    xp: 'XP',
    of: isRTL ? 'מתוך' : 'of',
  };

  return (
    <div
      className={`
        relative rounded-2xl p-5 col-span-1 sm:col-span-2 lg:col-span-2
        shadow-lg shadow-gray-300/20 dark:shadow-black/30
        border border-white/80 dark:border-gray-700
        backdrop-blur-sm
        bg-gradient-to-br from-white via-purple-50 to-indigo-100
        dark:from-gray-800 dark:via-gray-800 dark:to-purple-900/30
        transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      role="region"
      aria-label={`${labels.currentLevel}: ${labels.stage} ${progress.currentStageId} - ${stageName}`}
    >
      <div className="flex items-start gap-4">
        {/* Stage Icon */}
        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <span className="text-3xl">{stageIcon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Label */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {labels.currentLevel}
          </p>

          {/* Stage Name */}
          <h3 className="font-display text-xl font-bold text-gray-800 dark:text-gray-100 truncate">
            {labels.stage} {progress.currentStageId}: {stageName}
          </h3>

          {/* Lesson Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-gray-600 dark:text-gray-400">
                {currentStageProgress?.lessonsCompleted || 0} {labels.of}{' '}
                {currentStageProgress?.totalLessons || 0} {labels.lessons}
              </span>
              <span className="font-medium text-purple-600 dark:text-purple-400">
                {stageProgressPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${stageProgressPercent}%` }}
                role="progressbar"
                aria-valuenow={stageProgressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </div>
      </div>

      {/* XP Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-700 rounded-full">
        <span className="text-purple-600 dark:text-purple-400">⭐</span>
        <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
          {totalXp.toLocaleString()} {labels.xp}
        </span>
      </div>

      {/* Overall Progress Badge */}
      <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {isRTL ? 'התקדמות כוללת' : 'Overall Progress'}
          </span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {progress.lessonsCompleted} / {progress.totalLessons} {labels.lessons}
          </span>
        </div>
        <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.round(progress.overallProgress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
});

export default LevelCard;
