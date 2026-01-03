import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TowerGame } from '@/components/games/TowerGame';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://keyquest.app';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'games' });

  return {
    title: t('tower.title'),
    description: t('tower.description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/games/tower`,
      languages: {
        en: `${BASE_URL}/en/games/tower`,
        he: `${BASE_URL}/he/games/tower`,
      },
    },
    openGraph: {
      title: t('tower.title'),
      description: t('tower.description'),
      url: `${BASE_URL}/${locale}/games/tower`,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TowerGamePage({ params }: Props) {
  const { locale } = await params;

  return <TowerGame locale={locale as 'en' | 'he'} />;
}
