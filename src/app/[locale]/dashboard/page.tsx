'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <div className="py-8 max-w-5xl mx-auto px-4">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-foreground">
          {t('title')}
        </h1>
        <p className="mt-2 text-muted">
          {t('subtitle')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Current Level */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-accent-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm text-muted">{t('stats.currentLevel')}</span>
          </div>
          <p className="font-display text-3xl font-bold text-foreground">
            {t('stats.stage')} 1
          </p>
          <p className="text-xs text-muted mt-1">Home Row Haven</p>
        </div>

        {/* Accuracy */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <span className="text-sm text-muted">{t('stats.averageAccuracy')}</span>
          </div>
          <p className="font-display text-3xl font-bold text-foreground">--</p>
          <p className="text-xs text-muted mt-1">Keep practicing!</p>
        </div>

        {/* WPM */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent-blue/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-accent-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm text-muted">{t('stats.averageWpm')}</span>
          </div>
          <p className="font-display text-3xl font-bold text-foreground">--</p>
          <p className="text-xs text-muted mt-1">Words per minute</p>
        </div>

        {/* Streak */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c.5 0 1.5 1.5 1.5 3.5 0 1.5-1 2.5-1 4 0 1.5 1.5 2.5 2.5 3.5s1.5 2.5 1.5 4c0 2.5-2 4.5-4.5 4.5S7.5 19.5 7.5 17c0-1.5.5-2.5 1.5-3.5s2.5-2 2.5-3.5c0-1.5-.5-2.5-1-4C10.5 4 11.5 2 12 2z" />
              </svg>
            </div>
            <span className="text-sm text-muted">{t('stats.practiceStreak')}</span>
          </div>
          <p className="font-display text-3xl font-bold text-foreground">0</p>
          <p className="text-xs text-muted mt-1">{t('stats.days')}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/practice">
          <Button variant="game" size="lg">
            {t('startPractice')}
          </Button>
        </Link>
        <Link href="/levels">
          <Button variant="secondary" size="lg">
            View All Levels
          </Button>
        </Link>
      </div>

      {/* Achievement Preview */}
      <div className="mt-16">
        <h2 className="font-display text-xl font-bold text-foreground mb-6">
          Achievements
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-surface rounded-2xl border border-border p-5 text-center opacity-60">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-raised flex items-center justify-center">
              <svg className="w-6 h-6 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <p className="font-bold text-foreground">First Steps</p>
            <p className="text-xs text-muted mt-1">Complete your first lesson</p>
          </div>
          <div className="bg-surface rounded-2xl border border-border p-5 text-center opacity-60">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-raised flex items-center justify-center">
              <svg className="w-6 h-6 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-bold text-foreground">Speed Demon</p>
            <p className="text-xs text-muted mt-1">Reach 30 WPM</p>
          </div>
          <div className="bg-surface rounded-2xl border border-border p-5 text-center opacity-60">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-raised flex items-center justify-center">
              <svg className="w-6 h-6 text-muted" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c.5 0 1.5 1.5 1.5 3.5 0 1.5-1 2.5-1 4 0 1.5 1.5 2.5 2.5 3.5s1.5 2.5 1.5 4c0 2.5-2 4.5-4.5 4.5S7.5 19.5 7.5 17c0-1.5.5-2.5 1.5-3.5s2.5-2 2.5-3.5c0-1.5-.5-2.5-1-4C10.5 4 11.5 2 12 2z" />
              </svg>
            </div>
            <p className="font-bold text-foreground">On Fire!</p>
            <p className="text-xs text-muted mt-1">7 day streak</p>
          </div>
        </div>
      </div>
    </div>
  );
}
