'use client';

import { memo, useEffect, useRef } from 'react';
import type { KeyboardLayoutType } from '@/data/keyboard-layout';
import { getLayoutSwitchInstructions } from '@/lib/keyboard-layout-detector';

interface KeyboardLayoutMismatchModalProps {
  /** The layout that should be used */
  expectedLayout: KeyboardLayoutType;
  /** Current UI locale */
  locale: 'en' | 'he';
  /** Called when user dismisses the modal */
  onDismiss: () => void;
}

/**
 * Modal shown when user types in wrong keyboard language
 * Provides instructions on how to switch keyboard layout
 */
export const KeyboardLayoutMismatchModal = memo(function KeyboardLayoutMismatchModal({
  expectedLayout,
  locale,
  onDismiss,
}: KeyboardLayoutMismatchModalProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isRTL = locale === 'he';
  const { title, instructions, dismissLabel } = getLayoutSwitchInstructions(expectedLayout, locale);

  // Focus the button on mount for accessibility
  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        onDismiss();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="layout-mismatch-title"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out]"
      >
        {/* Warning icon header */}
        <div className="bg-amber-50 dark:bg-amber-900/30 px-6 py-4 flex items-center gap-3 border-b border-amber-200 dark:border-amber-800">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl" role="img" aria-hidden="true">⌨️</span>
          </div>
          <h2
            id="layout-mismatch-title"
            className="text-lg font-semibold text-amber-800 dark:text-amber-200"
          >
            {title}
          </h2>
        </div>

        {/* Instructions */}
        <div className="p-6">
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            {instructions.map((instruction, index) => (
              <li
                key={index}
                className={index === 0 ? 'font-medium text-gray-900 dark:text-white' : ''}
              >
                {instruction}
              </li>
            ))}
          </ul>
        </div>

        {/* Dismiss button */}
        <div className="px-6 pb-6">
          <button
            ref={buttonRef}
            onClick={onDismiss}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {dismissLabel}
          </button>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
});

export default KeyboardLayoutMismatchModal;
