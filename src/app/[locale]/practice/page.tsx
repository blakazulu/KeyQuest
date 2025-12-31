'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { TypingArea } from '@/components/typing';
import type { TypingStats } from '@/hooks/useTypingEngine';

// Sample practice texts - will be replaced with lesson content in Phase 4
const PRACTICE_TEXTS = [
  'The quick brown fox jumps over the lazy dog.',
  'Pack my box with five dozen liquor jugs.',
  'How vexingly quick daft zebras jump!',
  'The five boxing wizards jump quickly.',
  'Sphinx of black quartz, judge my vow.',
];

export default function PracticePage() {
  const t = useTranslations('practice');
  const tFeedback = useTranslations('practice.feedback');
  const tActions = useTranslations('practice.actions');

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [completedStats, setCompletedStats] = useState<TypingStats | null>(null);
  const [key, setKey] = useState(0); // Used to force remount of TypingArea

  const currentText = PRACTICE_TEXTS[currentTextIndex];

  const handleComplete = useCallback((stats: TypingStats) => {
    setCompletedStats(stats);
  }, []);

  const handleRestart = useCallback(() => {
    setCompletedStats(null);
    setKey((k) => k + 1); // Force remount to reset state
  }, []);

  const handleNext = useCallback(() => {
    setCompletedStats(null);
    setCurrentTextIndex((i) => (i + 1) % PRACTICE_TEXTS.length);
    setKey((k) => k + 1);
  }, []);

  // Determine feedback based on performance
  const getFeedbackKey = (accuracy: number, wpm: number): string => {
    if (accuracy >= 98 && wpm >= 40) return 'excellent';
    if (accuracy >= 95 && wpm >= 30) return 'great';
    if (accuracy >= 90) return 'good';
    if (accuracy >= 80) return 'keepPracticing';
    return 'needsWork';
  };

  return (
    <div className="flex flex-col items-center py-8">
      <header className="text-center">
        <h1 className="text-display-lg">{t('title')}</h1>
        <p className="mt-2 text-body-md text-muted">{t('subtitle')}</p>
      </header>

      <main className="mt-8 w-full max-w-3xl">
        <TypingArea
          key={key}
          text={currentText}
          onComplete={handleComplete}
          showStats={true}
          allowBackspace={false}
        />

        {/* Completion Summary */}
        {completedStats && (
          <div className="mt-8 card-raised text-center">
            <div className="text-display-md text-success mb-2">
              {tFeedback(getFeedbackKey(completedStats.accuracy, completedStats.wpm))}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 mb-6">
              <div>
                <div className="score-display text-primary">{completedStats.wpm}</div>
                <div className="text-caption text-muted">WPM</div>
              </div>
              <div>
                <div className="score-display text-success">{completedStats.accuracy}%</div>
                <div className="text-caption text-muted">{t('stats.accuracy')}</div>
              </div>
              <div>
                <div className="score-display">
                  {completedStats.errorCount}
                </div>
                <div className="text-caption text-muted">{t('stats.errors')}</div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleRestart}
                className="btn btn-secondary"
                aria-label={tActions('restart')}
              >
                {tActions('restart')}
              </button>
              <button
                onClick={handleNext}
                className="btn btn-primary"
                aria-label={tActions('next')}
              >
                {tActions('next')}
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link
            href="/levels"
            className="text-body-sm text-primary hover:underline"
          >
            {tActions('backToLevels')}
          </Link>
        </div>
      </main>
    </div>
  );
}
