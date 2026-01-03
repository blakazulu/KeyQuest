import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TargetGame } from '@/components/games/TargetGame';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://keyquest.app';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'games' });

  return {
    title: t('target.title'),
    description: t('target.description'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/games/target`,
      languages: {
        en: `${BASE_URL}/en/games/target`,
        he: `${BASE_URL}/he/games/target`,
      },
    },
    openGraph: {
      title: t('target.title'),
      description: t('target.description'),
      url: `${BASE_URL}/${locale}/games/target`,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TargetGamePage({ params }: Props) {
  const { locale } = await params;

  return <TargetGame locale={locale as 'en' | 'he'} />;
}
