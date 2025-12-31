'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, Button } from '@/components/ui';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <div className="py-8">
      <h1 className="font-display text-4xl font-bold text-foreground">
        👋 {t('title')}
      </h1>
      <p className="mt-2 text-lg text-muted">
        {t('subtitle')} ✨
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Current Level */}
        <Card className="card-purple overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-2 right-2 text-3xl opacity-20">🏠</div>
            <p className="text-sm font-medium text-muted">{t('stats.currentLevel')}</p>
            <p className="font-display mt-2 text-4xl font-bold text-foreground">
              {t('stats.stage')} 1
            </p>
            <p className="text-xs text-accent-purple font-medium mt-1">Home Row Haven</p>
          </CardContent>
        </Card>

        {/* Accuracy */}
        <Card className="card-success overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-2 right-2 text-3xl opacity-20">🎯</div>
            <p className="text-sm font-medium text-muted">{t('stats.averageAccuracy')}</p>
            <p className="mt-2 text-4xl font-bold text-success">--</p>
            <p className="text-xs text-muted mt-1">Keep practicing!</p>
          </CardContent>
        </Card>

        {/* WPM */}
        <Card className="card-info overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-2 right-2 text-3xl opacity-20">⚡</div>
            <p className="text-sm font-medium text-muted">{t('stats.averageWpm')}</p>
            <p className="mt-2 text-4xl font-bold text-info">--</p>
            <p className="text-xs text-muted mt-1">Words per minute</p>
          </CardContent>
        </Card>

        {/* Streak */}
        <Card className="overflow-hidden" style={{ borderLeftColor: 'var(--color-streak)' }}>
          <CardContent className="p-6 relative">
            <div className="absolute top-2 right-2 text-3xl opacity-30 animate-flame">🔥</div>
            <p className="text-sm font-medium text-muted">{t('stats.practiceStreak')}</p>
            <p className="mt-2 text-4xl font-bold text-streak">0</p>
            <p className="text-xs text-muted mt-1">{t('stats.days')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-12 flex flex-wrap gap-4">
        <Link href="/practice">
          <Button variant="game" size="lg">
            🎮 {t('startPractice')}
          </Button>
        </Link>
        <Link href="/levels">
          <Button variant="secondary" size="lg">
            📚 View All Levels
          </Button>
        </Link>
      </div>

      {/* Achievement Preview */}
      <div className="mt-16">
        <h2 className="font-display text-2xl font-bold text-foreground mb-6">
          🏆 Achievements
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="opacity-50">
            <CardContent className="p-5 text-center">
              <div className="text-4xl mb-2 grayscale">🎯</div>
              <p className="font-bold text-foreground">First Steps</p>
              <p className="text-xs text-muted">Complete your first lesson</p>
            </CardContent>
          </Card>
          <Card className="opacity-50">
            <CardContent className="p-5 text-center">
              <div className="text-4xl mb-2 grayscale">⚡</div>
              <p className="font-bold text-foreground">Speed Demon</p>
              <p className="text-xs text-muted">Reach 30 WPM</p>
            </CardContent>
          </Card>
          <Card className="opacity-50">
            <CardContent className="p-5 text-center">
              <div className="text-4xl mb-2 grayscale">🔥</div>
              <p className="font-bold text-foreground">On Fire!</p>
              <p className="text-xs text-muted">7 day streak</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
