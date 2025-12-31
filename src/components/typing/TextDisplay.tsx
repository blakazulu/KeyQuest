'use client';

import { memo } from 'react';
import type { CharacterState } from '@/hooks/useTypingEngine';

interface TextDisplayProps {
  /** Array of character states from useTypingEngine */
  characters: CharacterState[];
  /** Whether to show the cursor */
  showCursor?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Displays the target text with character-level styling.
 * Each character is colored based on its typing state:
 * - pending: muted color
 * - current: highlighted with cursor
 * - correct: success color
 * - incorrect: error color with underline
 */
export const TextDisplay = memo(function TextDisplay({
  characters,
  showCursor = true,
  className = '',
}: TextDisplayProps) {
  if (characters.length === 0) {
    return (
      <div
        className={`typing-text text-center text-muted ${className}`}
        role="textbox"
        aria-label="Typing area - no text loaded"
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`typing-text select-none ${className}`}
      dir="ltr"
      role="textbox"
      aria-label="Type the text shown"
      aria-readonly="true"
    >
      {characters.map((charState, index) => (
        <Character
          key={index}
          charState={charState}
          showCursor={showCursor && charState.status === 'current'}
        />
      ))}
    </div>
  );
});

interface CharacterProps {
  charState: CharacterState;
  showCursor: boolean;
}

const Character = memo(function Character({ charState, showCursor }: CharacterProps) {
  const { char, status } = charState;

  // Handle space character display
  const displayChar = char === ' ' ? '\u00A0' : char; // Non-breaking space for visibility

  // Build class names based on status
  const statusClasses: Record<CharacterState['status'], string> = {
    pending: 'text-muted',
    current: 'text-primary bg-primary-soft rounded-sm',
    correct: 'text-success',
    incorrect: 'text-error bg-error-soft rounded-sm underline decoration-2 decoration-error',
  };

  return (
    <span
      className={`relative inline-block transition-colors duration-75 ${statusClasses[status]}`}
      aria-current={status === 'current' ? 'true' : undefined}
      data-status={status}
    >
      {displayChar}
      {showCursor && <Cursor />}
    </span>
  );
});

/**
 * Blinking cursor indicator shown at the current typing position.
 */
function Cursor() {
  return (
    <span
      className="cursor-blink absolute -bottom-0.5 left-0 h-0.5 w-full bg-primary"
      aria-hidden="true"
    />
  );
}
