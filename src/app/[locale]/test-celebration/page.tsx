'use client';

import { LessonSummary } from '@/components/practice';
import { useLocale } from 'next-intl';

// Test page to preview the celebration screen
export default function TestCelebrationPage() {
  const locale = useLocale() as 'en' | 'he';

  const mockLesson = {
    id: 'test-lesson',
    stageId: 1,
    lessonNumber: 1,
    title: { en: 'Home Row Basics', he: 'יסודות שורת הבית' },
    description: { en: 'Learn the home row keys', he: 'למד את מקשי שורת הבית' },
    newKeys: ['a', 's', 'd', 'f'],
    practiceKeys: ['a', 's', 'd', 'f'],
    difficulty: 'beginner' as const,
    xpReward: 50,
    estimatedMinutes: 5,
    passingAccuracy: 70,
    exercises: [],
  };

  const mockResult = {
    lessonId: 'test-lesson',
    passed: true,
    accuracy: 92,
    wpm: 45,
    timeSpent: 120,
    stars: 3,
    xpEarned: 50,
    isNewBest: true,
    updatedProgress: {
      lessonId: 'test-lesson',
      completed: true,
      bestAccuracy: 92,
      bestWpm: 45,
      attempts: 1,
      lastAttempt: new Date().toISOString(),
      xpEarned: 50,
      stars: 3,
    },
  };

  return (
    <LessonSummary
      lesson={mockLesson}
      result={mockResult}
      locale={locale}
      nextLessonId="stage-1-lesson-2"
      onRestart={() => window.location.reload()}
    />
  );
}
