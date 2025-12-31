'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const navItems = [
    { href: '/levels' as const, label: t('levels') },
    { href: '/practice' as const, label: t('practice') },
    { href: '/dashboard' as const, label: t('dashboard') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <nav
        className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/images/logo-64.png"
            alt=""
            width={36}
            height={36}
            className="transition-transform group-hover:scale-105"
            priority
          />
          <span className="font-display text-xl font-bold text-foreground">
            KeyQuest
          </span>
        </Link>

        {/* Nav items in pill container */}
        <div className="flex items-center gap-1 bg-surface rounded-full px-2 py-1.5 shadow-sm border border-border">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-surface-raised text-foreground shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right side - Language switcher */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}
