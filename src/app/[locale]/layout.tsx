import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Clouds } from '@/components/layout/Clouds';
import { AchievementToast } from '@/components/gamification/AchievementToast';
import { SkipLink, MinWidthGuard } from '@/components/ui';
import { GlobalShortcutsProvider } from '@/components/layout/GlobalShortcutsProvider';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://keyquest-app.netlify.app';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: 'KeyQuest - Learn Touch Typing the Fun Way',
    he: 'KeyQuest - למד הקלדה עיוורת בדרך כיפית',
  };

  const descriptions: Record<string, string> = {
    en: 'A fun, game-driven way to learn touch typing from the ground up. Master the keyboard through engaging lessons and games.',
    he: 'דרך כיפית ומבוססת משחק ללמוד הקלדה עיוורת מהיסוד. שלוט במקלדת דרך שיעורים ומשחקים מרתקים.',
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        he: `${BASE_URL}/he`,
      },
    },
    openGraph: {
      locale: locale === 'he' ? 'he_IL' : 'en_US',
      alternateLocale: locale === 'he' ? 'en_US' : 'he_IL',
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const isRTL = locale === 'he';

  return (
    <div lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className="relative">
      <Clouds />
      <NextIntlClientProvider messages={messages}>
        <SkipLink />
        <MinWidthGuard />
        <GlobalShortcutsProvider />
        <Header />
        <AchievementToast />
        <main
          id="main-content"
          tabIndex={-1}
          className="relative z-10 mx-auto max-w-7xl px-4 py-8 pt-0 outline-none"
        >
          {children}
        </main>
      </NextIntlClientProvider>
    </div>
  );
}
