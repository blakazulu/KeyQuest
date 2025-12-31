import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

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
    <div lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <NextIntlClientProvider messages={messages}>
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8">
          {children}
        </main>
      </NextIntlClientProvider>
    </div>
  );
}
