'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const navItems = [
    { href: '/' as const, label: t('home') },
    { href: '/levels' as const, label: t('levels') },
    { href: '/practice' as const, label: t('practice') },
    { href: '/dashboard' as const, label: t('dashboard') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav
        className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4"
        aria-label="Main navigation"
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            KeyQuest
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="ms-2 border-s border-zinc-200 ps-2 dark:border-zinc-700">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
}
