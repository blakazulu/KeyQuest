'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useCalmModeStore, type CalmModeStatus } from '@/stores/useCalmModeStore';

interface CalmControlsProps {
  /** Callback when exit is clicked */
  onExit: () => void;
  /** Whether to show keyboard toggle */
  showKeyboardToggle?: boolean;
  /** Whether controls should auto-hide during typing */
  autoHide?: boolean;
  /** Whether currently typing (for auto-hide) */
  isTyping?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Floating control buttons for Calm Mode.
 * Provides pause/resume, exit, and optional keyboard toggle.
 * Semi-transparent and can auto-hide during active typing.
 */
export function CalmControls({
  onExit,
  showKeyboardToggle = true,
  autoHide = true,
  isTyping = false,
  className = '',
}: CalmControlsProps) {
  const t = useTranslations('calmMode');
  const { status, pause, resume, showKeyboard, toggleKeyboard } = useCalmModeStore();

  const handlePauseResume = useCallback(() => {
    if (status === 'running') {
      pause();
    } else if (status === 'paused') {
      resume();
    }
  }, [status, pause, resume]);

  // Auto-hide logic: fade out during active typing
  const shouldHide = autoHide && isTyping && status === 'running';

  return (
    <div
      className={`
        flex items-center gap-2
        transition-all duration-300
        ${shouldHide ? 'opacity-30 hover:opacity-100' : 'opacity-100'}
        ${className}
      `}
      role="toolbar"
      aria-label={t('controls.toolbar')}
    >
      {/* Pause/Resume button */}
      {status !== 'idle' && (
        <button
          onClick={handlePauseResume}
          className="
            flex items-center gap-2 px-4 py-2
            bg-slate-800/50 dark:bg-slate-900/60
            hover:bg-slate-700/60 dark:hover:bg-slate-800/70
            backdrop-blur-sm rounded-lg
            text-sm text-slate-300 dark:text-slate-400
            hover:text-white dark:hover:text-slate-200
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-indigo-400/50
          "
          aria-label={status === 'running' ? t('controls.pause') : t('controls.resume')}
        >
          {status === 'running' ? (
            <>
              <PauseIcon />
              <span className="hidden sm:inline">{t('controls.pause')}</span>
            </>
          ) : (
            <>
              <PlayIcon />
              <span className="hidden sm:inline">{t('controls.resume')}</span>
            </>
          )}
        </button>
      )}

      {/* Keyboard toggle */}
      {showKeyboardToggle && (
        <button
          onClick={toggleKeyboard}
          className={`
            flex items-center gap-2 px-3 py-2
            backdrop-blur-sm rounded-lg
            text-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-indigo-400/50
            ${
              showKeyboard
                ? 'bg-indigo-600/40 text-indigo-200 hover:bg-indigo-500/50'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/60 hover:text-slate-300'
            }
          `}
          aria-label={showKeyboard ? t('controls.hideKeyboard') : t('controls.showKeyboard')}
          aria-pressed={showKeyboard}
        >
          <KeyboardIcon />
        </button>
      )}

      {/* Exit button */}
      <button
        onClick={onExit}
        className="
          flex items-center gap-2 px-4 py-2
          bg-slate-800/50 dark:bg-slate-900/60
          hover:bg-rose-600/40 dark:hover:bg-rose-600/30
          backdrop-blur-sm rounded-lg
          text-sm text-slate-300 dark:text-slate-400
          hover:text-rose-200 dark:hover:text-rose-200
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-rose-400/50
        "
        aria-label={t('controls.exit')}
      >
        <ExitIcon />
        <span className="hidden sm:inline">{t('controls.exit')}</span>
      </button>
    </div>
  );
}

// Icon components
function PauseIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function KeyboardIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function ExitIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );
}

/**
 * Keyboard shortcut hints displayed below controls
 */
export function CalmKeyboardHints({ className = '' }: { className?: string }) {
  const t = useTranslations('calmMode');

  return (
    <div
      className={`
        text-xs text-slate-500 dark:text-slate-600
        ${className}
      `}
      aria-hidden="true"
    >
      <span>{t('hints.shortcuts')}</span>
    </div>
  );
}
