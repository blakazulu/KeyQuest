import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { RaceGame } from '@/components/games/RaceGame';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://keyquest.app';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'games' });

  return {
    title: t('race.title'),
    description: t('race.description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/games/race`,
      languages: {
        en: `${BASE_URL}/en/games/race`,
        he: `${BASE_URL}/he/games/race`,
      },
    },
    openGraph: {
      title: t('race.title'),
      description: t('race.description'),
      url: `${BASE_URL}/${locale}/games/race`,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RaceGamePage({ params }: Props) {
  const { locale } = await params;

  return <RaceGame locale={locale as 'en' | 'he'} />;
}
