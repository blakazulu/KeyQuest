'use client';

import { memo } from 'react';
import type { CharacterState } from '@/hooks/useTypingEngine';

interface CalmTextDisplayProps {
  /** Array of character states from useTypingEngine */
  characters: CharacterState[];
  /** Whether to show the cursor */
  showCursor?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Calm Mode text display with gentle, soothing styling.
 * Uses softer colors and no harsh feedback animations:
 * - pending: soft muted gray
 * - current: gentle highlight
 * - correct: soft green (not bright)
 * - incorrect: amber (not red), no underline or shake
 */
export const CalmTextDisplay = memo(function CalmTextDisplay({
  characters,
  showCursor = true,
  className = '',
}: CalmTextDisplayProps) {
  if (characters.length === 0) {
    return (
      <div
        className={`calm-typing-text text-center text-slate-400 ${className}`}
        role="textbox"
        aria-label="Calm mode typing area - loading text"
      >
        <span className="animate-pulse">Preparing your text...</span>
      </div>
    );
  }

  return (
    <div
      className={`calm-typing-text select-none ${className}`}
      dir="ltr"
      role="textbox"
      aria-label="Type the text shown at your own pace"
      aria-readonly="true"
    >
      {characters.map((charState, index) => (
        <CalmCharacter
          key={index}
          charState={charState}
          showCursor={showCursor && charState.status === 'current'}
        />
      ))}
    </div>
  );
});

interface CalmCharacterProps {
  charState: CharacterState;
  showCursor: boolean;
}

/**
 * Individual character with calm, gentle styling
 */
const CalmCharacter = memo(function CalmCharacter({
  charState,
  showCursor,
}: CalmCharacterProps) {
  const { char, status } = charState;

  // Handle space character display
  const displayChar = char === ' ' ? '\u00A0' : char;

  // Calm mode status classes - softer, gentler colors
  // No harsh red, no underline, no shake
  const statusClasses: Record<CharacterState['status'], string> = {
    pending: 'text-slate-400/70 dark:text-slate-500/70',
    current: 'text-white bg-indigo-400/20 dark:bg-indigo-400/25 rounded-sm',
    correct: 'text-emerald-400/90 dark:text-emerald-300/90',
    // Amber instead of red/rose - gentle, encouraging
    incorrect: 'text-amber-400/90 dark:text-amber-300/90 rounded-sm',
  };

  return (
    <span
      className={`relative inline-block transition-colors duration-150 ${statusClasses[status]}`}
      aria-current={status === 'current' ? 'true' : undefined}
      data-status={status}
    >
      {displayChar}
      {showCursor && <CalmCursor />}
    </span>
  );
});

/**
 * Gentle blinking cursor with slower animation
 */
function CalmCursor() {
  return (
    <span
      className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-indigo-300/80 dark:bg-indigo-400/80 animate-pulse"
      aria-hidden="true"
    />
  );
}
