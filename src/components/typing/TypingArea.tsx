'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { TextDisplay } from './TextDisplay';
import { Stats } from './Stats';
import { useTypingEngine, type TypingStats } from '@/hooks/useTypingEngine';
import { useKeyboardInput } from '@/hooks/useKeyboardInput';
import { calculateProgress } from '@/lib/typing-utils';

interface TypingAreaProps {
  /** The text to type */
  text: string;
  /** Called when the session is completed */
  onComplete?: (stats: TypingStats) => void;
  /** Called when an error occurs */
  onError?: (char: string, expected: string) => void;
  /** Whether to show the stats panel */
  showStats?: boolean;
  /** Whether to allow backspace corrections */
  allowBackspace?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Main typing practice area component.
 * Combines TextDisplay, Stats, and keyboard input handling.
 *
 * @example
 * ```tsx
 * <TypingArea
 *   text="The quick brown fox jumps over the lazy dog."
 *   onComplete={(stats) => console.log('Done!', stats)}
 *   showStats={true}
 * />
 * ```
 */
export function TypingArea({
  text,
  onComplete,
  onError,
  showStats = true,
  allowBackspace = false,
  className = '',
}: TypingAreaProps) {
  const t = useTranslations('practice');
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    status,
    characters,
    stats,
    cursorPosition,
    start,
    pause,
    reset,
    setTargetText,
  } = useTypingEngine({
    onComplete,
    onError,
    allowBackspace,
  });

  // Set target text on mount or when text prop changes
  useEffect(() => {
    if (text) {
      setTargetText(text);
    }
  }, [text, setTargetText]);

  // Handle Enter to start/resume and Escape to pause
  const handleEnter = useCallback(() => {
    if (status === 'idle' || status === 'paused') {
      start();
    }
  }, [status, start]);

  const handleEscape = useCallback(() => {
    if (status === 'running') {
      pause();
    }
  }, [status, pause]);

  // Setup Enter/Escape keyboard shortcuts
  useKeyboardInput({
    onEnter: handleEnter,
    onEscape: handleEscape,
    enabled: true,
  });

  // Focus container on mount for immediate keyboard capture
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const progress = calculateProgress(cursorPosition, text.length);

  return (
    <div
      ref={containerRef}
      className={`card-raised focus:outline-none ${className}`}
      tabIndex={0}
      role="application"
      aria-label={t('typingArea')}
    >
      {/* Progress bar */}
      <div className="mb-6">
        <div className="progress-bar h-2">
          <div
            className="progress-bar-fill progress-bar-primary"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t('progress', { percent: progress })}
          />
        </div>
      </div>

      {/* Status message */}
      {status === 'idle' && (
        <div
          className="mb-4 text-center text-body-sm text-muted"
          role="status"
          aria-live="polite"
        >
          {t('pressEnterToStart')}
        </div>
      )}

      {status === 'paused' && (
        <div
          className="mb-4 text-center text-body-sm text-warning"
          role="status"
          aria-live="polite"
        >
          {t('paused')} - {t('pressEnterToResume')}
        </div>
      )}

      {status === 'completed' && (
        <div
          className="mb-4 text-center text-body-sm text-success"
          role="status"
          aria-live="assertive"
        >
          {t('completed')}
        </div>
      )}

      {/* Text display */}
      <div className="mb-6 rounded-lg bg-surface-raised p-6">
        <TextDisplay
          characters={characters}
          showCursor={status === 'running' || status === 'idle'}
          className="text-center leading-relaxed"
        />
      </div>

      {/* Stats panel */}
      {showStats && (
        <Stats
          wpm={stats.wpm}
          accuracy={stats.accuracy}
          time={stats.elapsedTime}
          errors={stats.errorCount}
          status={status}
        />
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {status === 'completed' && (
          <span>
            {t('completedAnnouncement', {
              wpm: stats.wpm,
              accuracy: stats.accuracy,
            })}
          </span>
        )}
      </div>
    </div>
  );
}
