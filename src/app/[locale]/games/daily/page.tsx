import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { DailyChallenge } from '@/components/games/DailyChallenge';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://keyquest.app';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'games' });

  return {
    title: t('daily.title'),
    description: t('daily.description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/games/daily`,
      languages: {
        en: `${BASE_URL}/en/games/daily`,
        he: `${BASE_URL}/he/games/daily`,
      },
    },
    openGraph: {
      title: t('daily.title'),
      description: t('daily.description'),
      url: `${BASE_URL}/${locale}/games/daily`,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function DailyChallengePage({ params }: Props) {
  const { locale } = await params;

  return <DailyChallenge locale={locale as 'en' | 'he'} />;
}
