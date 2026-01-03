'use client';

import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const MIN_WIDTH = 1028;

// Custom hook for window width using useSyncExternalStore
function useWindowWidth() {
  const subscribe = (callback: () => void) => {
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback);
  };

  const getSnapshot = () => window.innerWidth;
  const getServerSnapshot = () => MIN_WIDTH + 1; // Return above minimum for SSR

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * MinWidthGuard Component
 *
 * Shows a friendly overlay when the screen width is below the minimum required (1028px).
 * KeyQuest is designed for desktop use with a physical keyboard.
 */
export function MinWidthGuard() {
  const t = useTranslations('accessibility');
  const windowWidth = useWindowWidth();
  const isTooNarrow = windowWidth < MIN_WIDTH;

  // Don't render the overlay if width is sufficient
  if (!isTooNarrow) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="min-width-title"
      aria-describedby="min-width-description"
    >
      <div className="max-w-md text-center">
        {/* Keyboard Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-32 h-20">
            <Image
              src="/images/logo-64.png"
              alt=""
              width={64}
              height={64}
              className="mx-auto opacity-80"
            />
          </div>
        </div>

        {/* Title */}
        <h1
          id="min-width-title"
          className="font-display text-2xl font-bold text-foreground mb-4"
        >
          {t('keyboardRequired')}
        </h1>

        {/* Description */}
        <p
          id="min-width-description"
          className="text-muted text-lg leading-relaxed mb-6"
        >
          {t('keyboardRequiredDesc')}
        </p>

        {/* Visual indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span>1028px+</span>
        </div>
      </div>
    </div>
  );
}
