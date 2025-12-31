import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'he'],
  defaultLocale: 'en',
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
export const LOCALE_COOKIE = 'NEXT_LOCALE';
