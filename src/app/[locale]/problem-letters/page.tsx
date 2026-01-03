'use client';

/**
 * Problem Letters Page
 * Dedicated practice mode for weak letters (Phase 11)
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { WeakLetterSelector } from '@/components/practice/WeakLetterSelector';
import { TargetedPractice } from '@/components/practice/TargetedPractice';

type PagePhase = 'select' | 'practice' | 'complete';

const translations = {
  en: {
    back: 'Back',
    title: 'Problem Letters',
    sessionComplete: 'Practice Complete!',
    xpEarned: 'XP Earned',
    improvement: 'Keep practicing to improve your weak letters.',
    practiceMore: 'Practice More',
    backToDashboard: 'Back to Dashboard',
  },
  he: {
    back: 'חזרה',
    title: 'אותיות בעייתיות',
    sessionComplete: 'התרגול הושלם!',
    xpEarned: 'XP שהורווח',
    improvement: 'המשיכו לתרגל כדי לשפר את האותיות החלשות.',
    practiceMore: 'תרגלו עוד',
    backToDashboard: 'חזרה ללוח בקרה',
  },
};

export default function ProblemLettersPage() {
  const router = useRouter();
  const locale = useLocale() as 'en' | 'he';
  const t = translations[locale];
  const isRTL = locale === 'he';

  const [phase, setPhase] = useState<PagePhase>('select');
  const [targetLetters, setTargetLetters] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);

  // Handle starting practice
  const handleStartPractice = useCallback((letters: string[]) => {
    setTargetLetters(letters);
    setPhase('practice');
  }, []);

  // Handle practice complete
  const handlePracticeComplete = useCallback((earned: number) => {
    setXpEarned(earned);
    setPhase('complete');
  }, []);

  // Handle exit
  const handleExit = useCallback(() => {
    router.push(`/${locale}/dashboard`);
  }, [router, locale]);

  // Handle practice more
  const handlePracticeMore = useCallback(() => {
    setPhase('select');
    setTargetLetters([]);
    setXpEarned(0);
  }, []);

  // Handle back button
  const handleBack = useCallback(() => {
    if (phase === 'select') {
      router.push(`/${locale}/dashboard`);
    } else {
      setPhase('select');
    }
  }, [phase, router, locale]);

  // Render based on phase
  if (phase === 'practice') {
    return (
      <TargetedPractice
        locale={locale}
        targetLetters={targetLetters}
        onExit={handleExit}
        onComplete={handlePracticeComplete}
      />
    );
  }

  if (phase === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t.sessionComplete}
          </h1>

          {xpEarned > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
              <span className="text-2xl">⚡</span>
              <span className="text-xl font-bold text-purple-700 dark:text-purple-300">
                +{xpEarned} {t.xpEarned}
              </span>
            </div>
          )}

          <p className="text-gray-600 dark:text-gray-400 mb-8">{t.improvement}</p>

          <div className={`flex gap-4 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={handlePracticeMore}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              {t.practiceMore}
            </button>
            <button
              onClick={handleExit}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-colors"
            >
              {t.backToDashboard}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Selection phase
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            aria-label={t.back}
          >
            <svg
              className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>{t.back}</span>
          </button>

          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>

          {/* Spacer for centering */}
          <div className="w-16"></div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <WeakLetterSelector locale={locale} onStartPractice={handleStartPractice} />
      </main>
    </div>
  );
}
