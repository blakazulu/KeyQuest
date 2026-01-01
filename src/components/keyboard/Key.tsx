'use client';

import { memo } from 'react';
import { type KeyData, fingerToClass } from '@/data/keyboard-layout';

export type KeyState = 'default' | 'highlighted' | 'pressed' | 'correct' | 'wrong';

interface KeyProps {
  /** Key data from layout */
  keyData: KeyData;
  /** Current state of the key */
  state?: KeyState;
  /** Whether to show finger color coding */
  showFingerColors?: boolean;
  /** Whether to show the home row indicator */
  showHomeRow?: boolean;
  /** Base size in pixels (default 48) */
  baseSize?: number;
  /** Click handler (for touch/click support) */
  onClick?: (key: string) => void;
}

/**
 * Individual keyboard key component.
 * Displays a single key with various states and optional finger color coding.
 */
export const Key = memo(function Key({
  keyData,
  state = 'default',
  showFingerColors = false,
  showHomeRow = true,
  baseSize = 48,
  onClick,
}: KeyProps) {
  const { key, label, shiftLabel, finger, width = 1, isHomeRow } = keyData;

  // Check if this is a non-typing key (modifier keys, function keys, etc.)
  const isModifierKey = key.length > 1 && key !== ' ';

  // Build class names based on state
  const stateClasses: Record<KeyState, string> = {
    default: 'bg-surface-raised border-border text-foreground',
    highlighted: `${fingerToClass[finger]} keyboard-key-highlighted`,
    pressed: 'keyboard-key-pressed bg-surface border-border',
    correct: 'keyboard-key-correct',
    wrong: 'keyboard-key-wrong animate-shake',
  };

  // Determine if we should show finger color
  const showFingerColor = showFingerColors && state === 'highlighted';
  const fingerClass = showFingerColor ? fingerToClass[finger] : '';

  // Width class for special keys
  const getWidthClass = () => {
    if (key === ' ') return 'keyboard-key-space';
    if (width >= 2.75) return 'keyboard-key-w275';
    if (width >= 2.25) return 'keyboard-key-w225';
    if (width >= 2) return 'keyboard-key-wide';
    if (width >= 1.75) return 'keyboard-key-w175';
    if (width >= 1.5) return 'keyboard-key-w150';
    if (width >= 1.25) return 'keyboard-key-w125';
    return '';
  };
  const widthClass = getWidthClass();

  // Combine all classes
  const className = [
    'keyboard-key',
    widthClass,
    'relative',
    'flex flex-col items-center justify-center',
    'select-none',
    'transition-all duration-75',
    isModifierKey && state === 'default' ? 'keyboard-key-muted' : (state === 'default' && showFingerColors ? '' : stateClasses[state]),
    state === 'highlighted' ? fingerClass : '',
    onClick ? 'cursor-pointer hover:brightness-95 active:scale-95' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (onClick && key.length === 1) {
      onClick(key);
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      disabled={!onClick}
      aria-label={`Key ${label || key}`}
      aria-pressed={state === 'pressed'}
      data-key={key}
      data-state={state}
      data-finger={finger}
    >
      {/* Shift label (top-left for symbols) */}
      {shiftLabel && (
        <span className="absolute top-1 left-2 text-[10px] text-muted opacity-60">
          {shiftLabel}
        </span>
      )}

      {/* Main label */}
      <span className={`text-sm font-medium ${key === ' ' ? 'sr-only' : ''}`}>
        {label || (key === ' ' ? 'Space' : key)}
      </span>

      {/* Home row indicator dot */}
      {isHomeRow && showHomeRow && (
        <span
          className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-current opacity-40"
          aria-hidden="true"
        />
      )}
    </button>
  );
});
