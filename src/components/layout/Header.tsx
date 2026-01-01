'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Check if we're on a lesson practice page (hide full header, show only pill)
  const isLessonPage = pathname.match(/\/practice\/[^/]+$/);

  const navItems = [
    { href: '/' as const, label: t('home'), icon: '🏠' },
    { href: '/levels' as const, label: t('levels'), icon: '🗺️' },
    { href: '/practice' as const, label: t('practice'), icon: '⌨️' },
    { href: '/dashboard' as const, label: t('dashboard'), icon: '📊' },
  ];

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        buttonRef.current?.focus();
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMenuOpen]);

  // Close menu when scrolling back to top
  useEffect(() => {
    if (!isScrolled) {
      setIsMenuOpen(false);
    }
  }, [isScrolled]);

  return (
    <>
      {/* Full header (hidden on lesson pages, fades out when scrolled) */}
      {!isLessonPage && (
      <header
        className={`sticky top-0 z-50 w-full bg-transparent transition-all duration-300 ${
          isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
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
            {navItems.slice(1).map((item) => {
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
      )}

      {/* Floating pill (always visible on lesson pages, fades in when scrolled otherwise) */}
      <div
        className={`floating-menu-container transition-all duration-300 ${
          isLessonPage || isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        {/* Main floating button */}
        <button
          ref={buttonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="floating-menu-button"
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
        >
          <Image
            src="/images/logo-64.png"
            alt=""
            width={32}
            height={32}
            className="floating-menu-logo"
          />
          <span className="floating-menu-text">{t('menu')}</span>
          <svg
            className={`floating-menu-arrow ${isMenuOpen ? 'floating-menu-arrow-open' : ''}`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="floating-menu-dropdown"
            role="menu"
            aria-orientation="vertical"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`floating-menu-item ${isActive ? 'floating-menu-item-active' : ''}`}
                  role="menuitem"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="floating-menu-item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="floating-menu-divider" />

            <div className="floating-menu-footer">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
