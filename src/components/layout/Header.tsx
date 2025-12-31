'use client';

import Image from 'next/image';
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4"
        aria-label="Main navigation"
      >
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/images/logo-64.png"
            alt=""
            width={40}
            height={40}
            className="transition-transform group-hover:scale-110 group-hover:rotate-6"
            priority
          />
          <span className="font-display text-2xl font-bold text-foreground">
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
                    ? 'bg-surface-raised text-foreground'
                    : 'text-muted hover:bg-surface-raised hover:text-foreground'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="ms-2 border-s border-border ps-2">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
}
