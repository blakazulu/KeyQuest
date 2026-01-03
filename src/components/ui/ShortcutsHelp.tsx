'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { getShortcutsList } from '@/hooks/useGlobalShortcuts';

interface ShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ShortcutsHelp Modal
 *
 * Displays available keyboard shortcuts.
 * Opened by pressing ? key.
 */
export function ShortcutsHelp({ isOpen, onClose }: ShortcutsHelpProps) {
  const t = useTranslations('accessibility.shortcuts');
  const modalRef = useRef<HTMLDivElement>(null);
  const shortcuts = getShortcutsList();

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (modal) {
      modal.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative bg-surface rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-auto outline-none"
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
          <h2
            id="shortcuts-title"
            className="font-display text-xl font-bold text-foreground"
          >
            {t('title')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-raised transition-colors"
            aria-label={t('closeModal')}
          >
            <svg
              className="w-5 h-5 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-muted text-sm">{t('description')}</p>

          {shortcuts.map((category) => (
            <div key={category.category}>
              <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                {t(category.category as 'navigation')}
              </h3>
              <div className="space-y-2">
                {category.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.keys}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-raised"
                  >
                    <span className="text-sm text-foreground">
                      {t(shortcut.description as 'goToHome')}
                    </span>
                    <div className="flex gap-1">
                      {shortcut.keys.split(' ').map((key, i) => (
                        <span key={i}>
                          <kbd className="px-2 py-1 text-xs font-mono bg-surface border border-border rounded shadow-sm">
                            {key}
                          </kbd>
                          {i < shortcut.keys.split(' ').length - 1 && (
                            <span className="mx-1 text-muted">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface border-t border-border px-6 py-4">
          <p className="text-xs text-muted text-center">
            Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-surface-raised border border-border rounded">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
}
