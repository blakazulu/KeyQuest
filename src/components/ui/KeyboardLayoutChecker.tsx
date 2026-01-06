'use client';

import { memo, useEffect, useCallback, useState, useRef } from 'react';
import type { KeyboardLayoutType } from '@/data/keyboard-layout';
import { isCharacterCompatibleWithLayout, detectLayoutFromChar } from '@/lib/keyboard-layout-detector';
import { KeyboardLayoutMismatchModal } from './KeyboardLayoutMismatchModal';

interface KeyboardLayoutCheckerProps {
  /** The expected keyboard layout */
  expectedLayout: KeyboardLayoutType;
  /** Current UI locale */
  locale: 'en' | 'he';
  /** Called when keyboard layout is verified */
  onReady: () => void;
  /** Optional: Called if user wants to skip the check */
  onSkip?: () => void;
  /** Custom message to display (optional) */
  customMessage?: { en: string; he: string };
}

const translations = {
  en: {
    title: 'Ready to Start?',
    instruction: 'Press any letter key to verify your keyboard',
    hint: 'Make sure your keyboard is set to the correct language',
    skip: 'Skip verification',
  },
  he: {
    title: 'מוכנים להתחיל?',
    instruction: 'לחצו על מקש אות כלשהו לאימות המקלדת',
    hint: 'וודאו שהמקלדת מוגדרת לשפה הנכונה',
    skip: 'דלג על האימות',
  },
};

/**
 * Component that verifies keyboard layout before starting a typing activity.
 * Shows a "press any key" prompt and checks if the keystroke matches the expected layout.
 */
export const KeyboardLayoutChecker = memo(function KeyboardLayoutChecker({
  expectedLayout,
  locale,
  onReady,
  onSkip,
  customMessage,
}: KeyboardLayoutCheckerProps) {
  const [showMismatch, setShowMismatch] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const hasVerifiedRef = useRef(false);
  const t = translations[locale];
  // RTL should be based on expectedLayout (what user will type), not just UI locale
  const isRTL = expectedLayout === 'hebrew';

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore if already verified or showing mismatch modal
    if (hasVerifiedRef.current || showMismatch) return;

    // Ignore modifier keys, control keys, etc.
    const { key, ctrlKey, altKey, metaKey } = event;
    if (ctrlKey || altKey || metaKey) return;
    if (key.length !== 1) return; // Only single character keys

    event.preventDefault();

    // Check if the character matches the expected layout
    const isCompatible = isCharacterCompatibleWithLayout(key, expectedLayout);
    const detectedLayout = detectLayoutFromChar(key);

    if (isCompatible || detectedLayout === null) {
      // Layout matches or neutral character (number, punctuation)
      // For neutral characters, we'll accept them and proceed
      hasVerifiedRef.current = true;
      setIsChecking(false);
      onReady();
    } else {
      // Layout mismatch detected
      setShowMismatch(true);
    }
  }, [expectedLayout, onReady, showMismatch]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleDismissMismatch = useCallback(() => {
    setShowMismatch(false);
    // User says they've switched - wait for them to press a key again
  }, []);

  const handleSkip = useCallback(() => {
    hasVerifiedRef.current = true;
    setIsChecking(false);
    onSkip?.();
  }, [onSkip]);

  if (!isChecking) {
    return null;
  }

  const layoutName = expectedLayout === 'hebrew'
    ? (locale === 'he' ? 'עברית' : 'Hebrew')
    : (locale === 'he' ? 'אנגלית' : 'English');

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-check-title"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out]">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
            <h2
              id="keyboard-check-title"
              className="text-xl font-bold text-white text-center"
            >
              {customMessage ? customMessage[locale] : t.title}
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            {/* Keyboard icon */}
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <span className="text-4xl" role="img" aria-hidden="true">⌨️</span>
            </div>

            <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              {t.instruction}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t.hint}
            </p>

            {/* Layout badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {locale === 'he' ? 'שפה נדרשת:' : 'Required:'}
              </span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {layoutName}
              </span>
            </div>

            {/* Animated keyboard hint */}
            <div className="mt-6 flex justify-center gap-1">
              {['A', 'S', 'D', 'F'].map((key, i) => (
                <div
                  key={key}
                  className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 font-mono text-sm shadow-sm animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {expectedLayout === 'hebrew' ? ['ש', 'ד', 'ג', 'כ'][i] : key}
                </div>
              ))}
            </div>
          </div>

          {/* Skip option (if available) */}
          {onSkip && (
            <div className="px-6 pb-4">
              <button
                onClick={handleSkip}
                className="w-full py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm transition-colors"
              >
                {t.skip}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mismatch modal */}
      {showMismatch && (
        <KeyboardLayoutMismatchModal
          expectedLayout={expectedLayout}
          locale={locale}
          onDismiss={handleDismissMismatch}
        />
      )}

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
    </>
  );
});

export default KeyboardLayoutChecker;
