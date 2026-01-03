'use client';

import { useTranslations } from 'next-intl';

interface SkipLinkProps {
  targetId?: string;
}

/**
 * Skip Link Component
 *
 * Allows keyboard users to skip directly to main content.
 * Hidden by default, becomes visible on focus.
 *
 * WCAG 2.4.1 - Bypass Blocks
 */
export function SkipLink({ targetId = 'main-content' }: SkipLinkProps) {
  const t = useTranslations('accessibility');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="
        sr-only focus:not-sr-only
        focus:fixed focus:top-4 focus:left-4 focus:z-[9999]
        focus:px-6 focus:py-3
        focus:bg-primary focus:text-white
        focus:rounded-lg focus:shadow-lg
        focus:font-semibold focus:text-sm
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary
        transition-all duration-200
      "
    >
      {t('skipToContent')}
    </a>
  );
}
