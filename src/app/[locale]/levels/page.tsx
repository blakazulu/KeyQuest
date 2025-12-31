import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const stages = [
  { id: 1, lessons: 5, status: 'available' },
  { id: 2, lessons: 8, status: 'locked' },
  { id: 3, lessons: 12, status: 'locked' },
  { id: 4, lessons: 10, status: 'locked' },
  { id: 5, lessons: 10, status: 'locked' },
  { id: 6, lessons: 15, status: 'locked' },
];

export default function LevelsPage() {
  const t = useTranslations('levels');

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {t('title')}
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        {t('subtitle')}
      </p>

      <div className="mt-8 space-y-4">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`rounded-2xl p-6 transition-all ${
              stage.status === 'available'
                ? 'bg-white shadow-sm hover:shadow-md dark:bg-zinc-900'
                : 'bg-zinc-100 opacity-60 dark:bg-zinc-900/50'
            }`}
            role="article"
            aria-label={`${t(`stages.${stage.id}.name`)}, ${stage.lessons} ${t('lessons')}, ${t(`status.${stage.status}`)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${
                    stage.status === 'available'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                      : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800'
                  }`}
                  aria-hidden="true"
                >
                  {stage.id}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {t(`stages.${stage.id}.name`)}
                  </h3>
                  <p className="text-sm text-zinc-500">{t(`stages.${stage.id}.description`)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-500">
                  {stage.lessons} {t('lessons')}
                </span>
                {stage.status === 'available' ? (
                  <Link
                    href="/practice"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    {t('status.available')}
                  </Link>
                ) : (
                  <span className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-500 dark:bg-zinc-800">
                    {t('status.locked')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
