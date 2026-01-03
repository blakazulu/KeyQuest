'use client';

import { memo, useMemo } from 'react';
import type { CharacterState } from '@/hooks/useTypingEngine';
import { isHebrewChar } from '@/data/keyboard-layout';

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

  // Group characters into words to prevent mid-word line breaks
  const words: CharacterState[][] = [];
  let currentWord: CharacterState[] = [];

  characters.forEach((charState) => {
    if (charState.char === ' ') {
      if (currentWord.length > 0) {
        words.push(currentWord);
        currentWord = [];
      }
      // Add space as its own "word" to preserve spacing
      words.push([charState]);
    } else {
      currentWord.push(charState);
    }
  });
  // Don't forget the last word
  if (currentWord.length > 0) {
    words.push(currentWord);
  }

  // Detect if text is primarily Hebrew for RTL support
  const isRTL = useMemo(() => {
    const letterChars = characters.filter((c) => /\S/.test(c.char));
    if (letterChars.length === 0) return false;
    const hebrewCount = letterChars.filter((c) => isHebrewChar(c.char)).length;
    return hebrewCount > letterChars.length / 2;
  }, [characters]);

  return (
    <div
      className={`typing-text select-none ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      role="textbox"
      aria-label="Type the text shown"
      aria-readonly="true"
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.map((charState) => (
            <Character
              key={charState.index}
              charState={charState}
              showCursor={showCursor && charState.status === 'current'}
            />
          ))}
        </span>
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

  // Build class names based on status (optimized for dark monitor screen)
  const statusClasses: Record<CharacterState['status'], string> = {
    pending: 'text-slate-400',
    current: 'text-white bg-indigo-500/30 rounded-sm',
    correct: 'text-emerald-400',
    incorrect: 'text-rose-400 bg-rose-500/20 rounded-sm underline decoration-2 decoration-rose-400',
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
 * Uses logical properties (start-0) for RTL support.
 */
function Cursor() {
  return (
    <span
      className="cursor-blink absolute -bottom-0.5 start-0 h-0.5 w-full bg-white"
      aria-hidden="true"
    />
  );
}
