'use client';

import { useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { QuestMapImage } from '@/components/levels/QuestMapImage';
import { FloatingMenu } from '@/components/layout/FloatingMenu';
import type { LevelStatus } from '@/components/ui/LevelCard';

// Stage data - will be connected to useProgressStore in Phase 5
const getStages = (t: ReturnType<typeof useTranslations>) => [
  {
    id: 1,
    name: t('stages.1.name'),
    description: t('stages.1.description'),
    lessons: 5,
    completedLessons: 2,
    status: 'current' as LevelStatus,
    href: '/practice',
  },
  {
    id: 2,
    name: t('stages.2.name'),
    description: t('stages.2.description'),
    lessons: 6,
    status: 'locked' as LevelStatus,
  },
  {
    id: 3,
    name: t('stages.3.name'),
    description: t('stages.3.description'),
    lessons: 8,
    status: 'locked' as LevelStatus,
  },
  {
    id: 4,
    name: t('stages.4.name'),
    description: t('stages.4.description'),
    lessons: 6,
    status: 'locked' as LevelStatus,
  },
  {
    id: 5,
    name: t('stages.5.name'),
    description: t('stages.5.description'),
    lessons: 6,
    status: 'locked' as LevelStatus,
  },
  {
    id: 6,
    name: t('stages.6.name'),
    description: t('stages.6.description'),
    lessons: 6,
    status: 'locked' as LevelStatus,
  },
];

export default function LevelsPage() {
  const t = useTranslations('levels');
  const locale = useLocale() as 'en' | 'he';

  const stages = getStages(t);

  // Enable fullscreen mode for this page
  useEffect(() => {
    document.body.classList.add('fullscreen-mode');
    return () => {
      document.body.classList.remove('fullscreen-mode');
    };
  }, []);

  return (
    <>
      {/* Floating menu for navigation */}
      <FloatingMenu />

      {/* Full-screen Quest Map with Background Image */}
      <QuestMapImage stages={stages} locale={locale} />
    </>
  );
}
