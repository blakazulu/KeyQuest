'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useProgressStore } from '@/stores/useProgressStore';

export default function PracticePage() {
  const router = useRouter();
  const locale = useLocale() as 'en' | 'he';

  const getCurrentLesson = useProgressStore((s) => s.getCurrentLesson);

  // Redirect to current lesson on mount
  useEffect(() => {
    const currentLesson = getCurrentLesson();
    if (currentLesson) {
      router.replace(`/${locale}/practice/${currentLesson.id}`);
    }
  }, [getCurrentLesson, router, locale]);

  const currentLesson = getCurrentLesson();

  // If we have a current lesson, show loading while redirecting
  if (currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {locale === 'he' ? 'טוען שיעור...' : 'Loading lesson...'}
          </p>
        </div>
      </div>
    );
  }

  // If no current lesson (shouldn't happen), show message to go to levels
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🎯</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          {locale === 'he' ? 'בחר שיעור' : 'Choose a Lesson'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {locale === 'he'
            ? 'עבור למפת המסע כדי לבחור שיעור להתחיל'
            : 'Go to the quest map to select a lesson to start'}
        </p>
        <Link
          href="/levels"
          className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
        >
          {locale === 'he' ? 'למפת המסע' : 'Go to Quest Map'}
        </Link>
      </div>
    </div>
  );
}
