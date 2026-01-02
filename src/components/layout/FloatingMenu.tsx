'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';

export function FloatingMenu() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const navItems = [
    { href: '/' as const, label: t('home'), icon: '🏠' },
    { href: '/levels' as const, label: t('levels'), icon: '🗺️' },
    { href: '/practice/calm' as const, label: t('calmMode'), icon: '🧘' },
    { href: '/dashboard' as const, label: t('dashboard'), icon: '📊' },
    { href: '/achievements' as const, label: t('achievements'), icon: '🏆' },
    { href: '/profile' as const, label: t('profile'), icon: '👤' },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <div className="floating-menu-container">
      {/* Main floating button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="floating-menu-button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={isOpen ? t('closeMenu') : t('openMenu')}
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
          className={`floating-menu-arrow ${isOpen ? 'floating-menu-arrow-open' : ''}`}
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
      {isOpen && (
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
                onClick={() => setIsOpen(false)}
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
  );
}
