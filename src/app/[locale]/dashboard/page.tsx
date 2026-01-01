'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useProgressStore } from '@/stores/useProgressStore';
import {
  StatCard,
  LevelCard,
  StreakCard,
  ProgressChart,
  WeakLettersPanel,
  ContinuePractice,
  type TrendDirection,
} from '@/components/dashboard';

// Calculate trend from session history
function calculateTrend(
  sessions: Array<{ accuracy: number; wpm: number }>,
  metric: 'accuracy' | 'wpm'
): TrendDirection {
  if (sessions.length < 3) return 'same';

  const recentCount = Math.min(5, Math.floor(sessions.length / 2));
  const recentSessions = sessions.slice(-recentCount);
  const olderSessions = sessions.slice(-recentCount * 2, -recentCount);

  if (olderSessions.length === 0) return 'same';

  const recentAvg = recentSessions.reduce((sum, s) => sum + s[metric], 0) / recentSessions.length;
  const olderAvg = olderSessions.reduce((sum, s) => sum + s[metric], 0) / olderSessions.length;

  const diff = recentAvg - olderAvg;
  const threshold = metric === 'accuracy' ? 2 : 3; // 2% for accuracy, 3 WPM for speed

  if (diff > threshold) return 'up';
  if (diff < -threshold) return 'down';
  return 'same';
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const locale = useLocale() as 'en' | 'he';
  const isRTL = locale === 'he';

  // Hydration state - wait for client-side store data
  const [isHydrated, setIsHydrated] = useState(false);

  // Progress store selectors
  const averageAccuracy = useProgressStore((s) => s.averageAccuracy);
  const averageWpm = useProgressStore((s) => s.averageWpm);
  const practiceStreak = useProgressStore((s) => s.practiceStreak);
  const longestStreak = useProgressStore((s) => s.longestStreak);
  const lastPracticeDate = useProgressStore((s) => s.lastPracticeDate);
  const totalXp = useProgressStore((s) => s.totalXp);
  const sessionHistory = useProgressStore((s) => s.sessionHistory);
  const weakLetters = useProgressStore((s) => s.weakLetters);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const getCurriculumProgress = useProgressStore((s) => s.getCurriculumProgress);
  const getCurrentLesson = useProgressStore((s) => s.getCurrentLesson);
  const getKeyMastery = useProgressStore((s) => s.getKeyMastery);

  // Mark as hydrated after first render
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Compute derived data
  const curriculumProgress = useMemo(() => getCurriculumProgress(), [getCurriculumProgress, completedLessons]);
  const currentLesson = useMemo(() => getCurrentLesson(), [getCurrentLesson, completedLessons]);
  const keyMastery = useMemo(() => getKeyMastery(), [getKeyMastery, weakLetters, completedLessons]);

  // Calculate trends
  const accuracyTrend = useMemo(
    () => calculateTrend(sessionHistory, 'accuracy'),
    [sessionHistory]
  );
  const wpmTrend = useMemo(
    () => calculateTrend(sessionHistory, 'wpm'),
    [sessionHistory]
  );

  // Trend labels
  const trendLabels = {
    up: isRTL ? 'משתפר' : 'Improving',
    down: isRTL ? 'צריך תרגול' : 'Needs practice',
    same: isRTL ? 'יציב' : 'Steady',
  };

  // Check if curriculum is complete
  const curriculumComplete = curriculumProgress.lessonsCompleted === curriculumProgress.totalLessons && curriculumProgress.totalLessons > 0;

  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <div className="relative z-10 py-8 max-w-5xl mx-auto px-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-gray-800 dark:text-gray-100">
            {t('title')}
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {t('subtitle')}
          </p>
        </div>

        {/* Loading skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
          <div className="col-span-2 h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          <div className="h-36 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          <div className="h-36 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 py-8 max-w-5xl mx-auto px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-gray-800 dark:text-gray-100">
          {t('title')}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {t('subtitle')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Level Card - spans 2 columns */}
        <LevelCard
          progress={curriculumProgress}
          locale={locale}
          totalXp={totalXp}
          delay={0}
        />

        {/* Accuracy */}
        <StatCard
          icon="🎯"
          value={sessionHistory.length > 0 ? Math.round(averageAccuracy) : '--'}
          unit={sessionHistory.length > 0 ? '%' : ''}
          label={t('stats.averageAccuracy')}
          sublabel={sessionHistory.length > 0 ? trendLabels[accuracyTrend] : (isRTL ? 'התחל לתרגל!' : 'Start practicing!')}
          trend={sessionHistory.length > 0 ? accuracyTrend : undefined}
          colorTheme="cyan"
          delay={100}
          animateValue={sessionHistory.length > 0}
        />

        {/* WPM */}
        <StatCard
          icon="⚡"
          value={sessionHistory.length > 0 ? Math.round(averageWpm) : '--'}
          unit={sessionHistory.length > 0 ? '' : ''}
          label={t('stats.averageWpm')}
          sublabel={sessionHistory.length > 0 ? trendLabels[wpmTrend] : (isRTL ? 'מילים לדקה' : 'Words per minute')}
          trend={sessionHistory.length > 0 ? wpmTrend : undefined}
          colorTheme="orange"
          delay={200}
          animateValue={sessionHistory.length > 0}
        />
      </div>

      {/* Second row - Streak */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StreakCard
          currentStreak={practiceStreak}
          longestStreak={longestStreak}
          lastPracticeDate={lastPracticeDate}
          locale={locale}
          delay={300}
        />
      </div>

      {/* Continue Practice CTA */}
      <ContinuePractice
        nextLesson={currentLesson}
        curriculumComplete={curriculumComplete}
        locale={locale}
        delay={400}
      />

      {/* Progress & Weak Letters Row */}
      <div className="grid gap-6 lg:grid-cols-2 mt-10">
        <ProgressChart
          sessions={sessionHistory}
          locale={locale}
          maxSessions={10}
          delay={500}
        />

        <WeakLettersPanel
          keyMastery={keyMastery}
          weakLetters={weakLetters}
          locale={locale}
          delay={600}
        />
      </div>

      {/* Achievement Preview - keep for now, will be enhanced in Phase 9 */}
      <div className="mt-16">
        <h2 className="font-display text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          {isRTL ? 'הישגים' : 'Achievements'}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* First Steps */}
          <div className={`
            bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700
            p-5 text-center transition-all
            ${completedLessons.length > 0 ? 'opacity-100' : 'opacity-50'}
          `}>
            <div className={`
              w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center
              ${completedLessons.length > 0
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30'
                : 'bg-gray-200 dark:bg-gray-700'
              }
            `}>
              <span className="text-2xl">{completedLessons.length > 0 ? '🎯' : '🔒'}</span>
            </div>
            <p className="font-bold text-gray-800 dark:text-gray-100">
              {isRTL ? 'צעדים ראשונים' : 'First Steps'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isRTL ? 'השלם את השיעור הראשון' : 'Complete your first lesson'}
            </p>
          </div>

          {/* Speed Demon */}
          <div className={`
            bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700
            p-5 text-center transition-all
            ${averageWpm >= 30 ? 'opacity-100' : 'opacity-50'}
          `}>
            <div className={`
              w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center
              ${averageWpm >= 30
                ? 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/30'
                : 'bg-gray-200 dark:bg-gray-700'
              }
            `}>
              <span className="text-2xl">{averageWpm >= 30 ? '⚡' : '🔒'}</span>
            </div>
            <p className="font-bold text-gray-800 dark:text-gray-100">
              {isRTL ? 'שד מהירות' : 'Speed Demon'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isRTL ? 'הגע ל-30 מילים לדקה' : 'Reach 30 WPM'}
            </p>
          </div>

          {/* On Fire */}
          <div className={`
            bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700
            p-5 text-center transition-all
            ${longestStreak >= 7 ? 'opacity-100' : 'opacity-50'}
          `}>
            <div className={`
              w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center
              ${longestStreak >= 7
                ? 'bg-gradient-to-br from-orange-400 to-red-500 shadow-lg shadow-orange-500/30'
                : 'bg-gray-200 dark:bg-gray-700'
              }
            `}>
              <span className="text-2xl">{longestStreak >= 7 ? '🔥' : '🔒'}</span>
            </div>
            <p className="font-bold text-gray-800 dark:text-gray-100">
              {isRTL ? 'בוער!' : 'On Fire!'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isRTL ? 'רצף של 7 ימים' : '7 day streak'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
