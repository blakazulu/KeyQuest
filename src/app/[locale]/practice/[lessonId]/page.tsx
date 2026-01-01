'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { getLesson, getNextLesson } from '@/data/lessons';
import { useProgressStore } from '@/stores/useProgressStore';
import { LessonIntro, ExerciseRunner, LessonSummary } from '@/components/practice';
import type { ExerciseResult, LessonResult } from '@/types/lesson';

type FlowPhase = 'intro' | 'practice' | 'summary';

export default function LessonPracticePage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale() as 'en' | 'he';
  const lessonId = params.lessonId as string;

  const [phase, setPhase] = useState<FlowPhase>('intro');
  const [lessonResult, setLessonResult] = useState<LessonResult | null>(null);
  const [flowKey, setFlowKey] = useState(0); // Used to reset the flow

  // Get lesson data
  const lesson = getLesson(lessonId);
  const nextLesson = lesson ? getNextLesson(lessonId) : null;

  // Progress store actions
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const isLessonUnlocked = useProgressStore((s) => s.isLessonUnlocked);

  // Redirect if lesson not found or locked
  useEffect(() => {
    if (!lesson) {
      router.replace(`/${locale}/levels`);
      return;
    }

    if (!isLessonUnlocked(lessonId)) {
      router.replace(`/${locale}/levels`);
    }
  }, [lesson, lessonId, isLessonUnlocked, router, locale]);

  // Handle starting the lesson
  const handleStart = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setPhase('practice');
  }, []);

  // Handle lesson completion
  const handleComplete = useCallback(
    (results: ExerciseResult[], totalStats: { accuracy: number; wpm: number; timeSpent: number; errors: number }) => {
      if (!lesson) return;

      // Save to progress store
      const result = completeLesson(
        lessonId,
        totalStats.accuracy,
        totalStats.wpm,
        totalStats.timeSpent
      );

      // Create full lesson result
      const fullResult: LessonResult = {
        lessonId,
        passed: result.passed,
        accuracy: totalStats.accuracy,
        wpm: totalStats.wpm,
        timeSpent: totalStats.timeSpent,
        stars: result.stars,
        xpEarned: result.xpEarned,
        isNewBest: result.isNewBest,
        updatedProgress: {
          lessonId,
          completed: result.passed,
          bestAccuracy: totalStats.accuracy,
          bestWpm: totalStats.wpm,
          attempts: 1,
          lastAttempt: new Date().toISOString(),
          xpEarned: result.xpEarned,
          stars: result.stars,
        },
      };

      setLessonResult(fullResult);
      window.scrollTo({ top: 0, behavior: 'instant' });
      setPhase('summary');
    },
    [lesson, lessonId, completeLesson]
  );

  // Handle restart
  const handleRestart = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setPhase('intro');
    setLessonResult(null);
    setFlowKey((k) => k + 1);
  }, []);

  // Show loading while redirecting or if lesson not found
  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">
          {locale === 'he' ? 'טוען...' : 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div key={flowKey}>
      {phase === 'intro' && (
        <LessonIntro
          lesson={lesson}
          locale={locale}
          onStart={handleStart}
        />
      )}

      {phase === 'practice' && (
        <ExerciseRunner
          lesson={lesson}
          locale={locale}
          onComplete={handleComplete}
        />
      )}

      {phase === 'summary' && lessonResult && (
        <LessonSummary
          lesson={lesson}
          result={lessonResult}
          locale={locale}
          nextLessonId={nextLesson?.id ?? null}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
