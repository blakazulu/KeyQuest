'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useGameStore } from '@/stores/useGameStore';
import { GameCard } from '@/components/games/GameCard';

function formatTime(ms: number | null): string {
  if (ms === null) return '-';
  const seconds = ms / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(0);
  return `${minutes}:${remainingSeconds.padStart(2, '0')}`;
}

export default function GamesPage() {
  const t = useTranslations('games');
  const locale = useLocale() as 'en' | 'he';
  const isRTL = locale === 'he';

  // Hydration state
  const [isHydrated, setIsHydrated] = useState(false);

  // Game store
  const raceBestTime = useGameStore((s) => s.raceBestTime);
  const raceGamesPlayed = useGameStore((s) => s.raceGamesPlayed);
  const targetHighScore = useGameStore((s) => s.targetHighScore);
  const targetMaxCombo = useGameStore((s) => s.targetMaxCombo);
  const towerMaxHeight = useGameStore((s) => s.towerMaxHeight);
  const dailyStreak = useGameStore((s) => s.dailyStreak);
  const todayCompleted = useGameStore((s) => s.todayCompleted);
  const checkDailyReset = useGameStore((s) => s.checkDailyReset);

  useEffect(() => {
    setIsHydrated(true);
    // Check if daily needs to be reset (new day)
    checkDailyReset();
  }, [checkDailyReset]);

  // Loading skeleton
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('subtitle')}
          </p>
        </header>

        {/* Games grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Race Game */}
          <GameCard
            gameId="race"
            icon="🏎️"
            href="/games/race"
            bestScore={formatTime(raceBestTime)}
            bestScoreLabel={t('bestTime')}
            secondaryStat={raceGamesPlayed > 0 ? `${raceGamesPlayed} ${t('gamesPlayed')}` : undefined}
            locale={locale}
          />

          {/* Target Shooting */}
          <GameCard
            gameId="target"
            icon="🎯"
            href="/games/target"
            bestScore={targetHighScore > 0 ? targetHighScore.toLocaleString() : undefined}
            secondaryStat={targetMaxCombo > 0 ? `${t('maxCombo')}: ${targetMaxCombo}x` : undefined}
            locale={locale}
          />

          {/* Tower Builder */}
          <GameCard
            gameId="tower"
            icon="🏗️"
            href="/games/tower"
            bestScore={towerMaxHeight > 0 ? `${towerMaxHeight} ${t('blocks')}` : undefined}
            bestScoreLabel={t('maxHeight')}
            locale={locale}
          />

          {/* Daily Challenge */}
          <GameCard
            gameId="daily"
            icon="📅"
            href="/games/daily"
            showTodayStatus
            todayCompleted={todayCompleted}
            status={todayCompleted ? 'completed-today' : 'available'}
            secondaryStat={dailyStreak > 0 ? `🔥 ${dailyStreak} ${t('dayStreak')}` : undefined}
            locale={locale}
          />

          {/* Calm Mode - link to existing */}
          <GameCard
            gameId="calm"
            icon="🧘"
            href="/practice/calm"
            locale={locale}
          />
        </div>

        {/* XP Info */}
        <div className={`mt-10 p-6 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="flex items-start gap-4">
            <span className="text-3xl">💡</span>
            <div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                {t('xpInfo.title')}
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                {t('xpInfo.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Back to levels */}
        <div className="mt-8 text-center">
          <Link
            href="/levels"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          >
            <span>←</span>
            {t('backToLevels')}
          </Link>
        </div>
      </div>
    </div>
  );
}
