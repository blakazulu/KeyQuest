import { useTranslations, useLocale } from 'next-intl';
import { LevelCard, type LevelStatus } from '@/components/ui';

const stages: { id: number; lessons: number; status: LevelStatus }[] = [
  { id: 1, lessons: 5, status: 'available' },
  { id: 2, lessons: 8, status: 'locked' },
  { id: 3, lessons: 12, status: 'locked' },
  { id: 4, lessons: 10, status: 'locked' },
  { id: 5, lessons: 10, status: 'locked' },
  { id: 6, lessons: 15, status: 'locked' },
];

export default function LevelsPage() {
  const t = useTranslations('levels');
  const locale = useLocale() as 'en' | 'he';

  return (
    <div className="py-8">
      <h1 className="font-display text-3xl font-bold text-foreground">
        {t('title')}
      </h1>
      <p className="mt-2 text-muted">
        {t('subtitle')}
      </p>

      <div className="mt-8 space-y-4">
        {stages.map((stage) => (
          <LevelCard
            key={stage.id}
            stageNumber={stage.id}
            name={t(`stages.${stage.id}.name`)}
            description={t(`stages.${stage.id}.description`)}
            lessonCount={stage.lessons}
            status={stage.status}
            href={stage.status !== 'locked' ? '/practice' : undefined}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
