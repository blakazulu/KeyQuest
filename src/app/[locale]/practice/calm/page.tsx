import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CalmMode } from '@/components/games/CalmMode';

type Props = {
  params: Promise<{ locale: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://keyquest-app.netlify.app';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'calmMode' });

  const title = t('meta.title');
  const description = t('meta.description');

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/practice/calm`,
      languages: {
        en: `${BASE_URL}/en/practice/calm`,
        he: `${BASE_URL}/he/practice/calm`,
      },
    },
    openGraph: {
      title,
      description,
      locale: locale === 'he' ? 'he_IL' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CalmModePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CalmMode locale={locale as 'en' | 'he'} />;
}
