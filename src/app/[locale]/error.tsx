'use client';

import { useTranslations } from 'next-intl';
import { ErrorFallback } from '@/components/ui/ErrorFallback';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Locale Error Boundary
 *
 * Catches errors within locale-specific pages.
 * Uses translations for localized error messages.
 */
export default function LocaleError({ error, reset }: ErrorProps) {
  const t = useTranslations('errors');

  return (
    <ErrorFallback
      error={error}
      reset={reset}
      title={t('title')}
      description={t('description')}
    />
  );
}
