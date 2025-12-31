'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <div className="py-8">
      <h1 className="font-display text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {t('title')}
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        {t('subtitle')}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500">{t('stats.currentLevel')}</p>
          <p className="font-display mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{t('stats.stage')} 1</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500">{t('stats.averageAccuracy')}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">--</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500">{t('stats.averageWpm')}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">--</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500">{t('stats.practiceStreak')}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">0 {t('stats.days')}</p>
        </div>
      </div>

      <div className="mt-12">
        <Link
          href="/practice"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          {t('startPractice')}
        </Link>
      </div>
    </div>
  );
}
