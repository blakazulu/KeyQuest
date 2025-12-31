'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function PracticePage() {
  const t = useTranslations('practice');
  const [text] = useState('The quick brown fox jumps over the lazy dog.');

  return (
    <div className="flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {t('title')}
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        {t('subtitle')}
      </p>

      <div className="mt-12 w-full max-w-3xl">
        <div
          className="rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900"
          role="textbox"
          aria-label={t('description')}
          aria-readonly="true"
        >
          <p className="typing-text text-2xl leading-relaxed text-zinc-400">
            {text}
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-8 text-center" aria-live="polite">
          <div>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">0</p>
            <p className="text-sm text-zinc-500">WPM</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">100%</p>
            <p className="text-sm text-zinc-500">Accuracy</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">0:00</p>
            <p className="text-sm text-zinc-500">Time</p>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500">
          {t('comingSoon')}
        </p>

        <div className="mt-4 text-center">
          <Link
            href="/levels"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            {t('backToLevels')}
          </Link>
        </div>
      </div>
    </div>
  );
}
