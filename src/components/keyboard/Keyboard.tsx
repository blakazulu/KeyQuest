'use client';

import { memo, useMemo } from 'react';
import { Key, type KeyState } from './Key';
import { qwertyLayout, getKeyData, type KeyData } from '@/data/keyboard-layout';

interface KeyboardProps {
  /** Character that should be highlighted as the next key to press */
  highlightedKey?: string;
  /** Multiple keys to highlight (for lesson intros) */
  highlightedKeys?: string[];
  /** Set of keys currently being pressed */
  pressedKeys?: Set<string>;
  /** Key that was just typed correctly (for flash effect) */
  correctKey?: string;
  /** Key that was just typed incorrectly (for error effect) */
  wrongKey?: string;
  /** Whether to show finger color coding on highlighted key */
  showFingerColors?: boolean;
  /** Whether to show home row indicators */
  showHomeRow?: boolean;
  /** Base key size in pixels */
  baseSize?: number;
  /** Click handler for keys (for touch/accessibility) */
  onKeyClick?: (key: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Visual keyboard component showing QWERTY layout.
 * Displays key states and finger color coding for typing practice.
 */
export const Keyboard = memo(function Keyboard({
  highlightedKey,
  highlightedKeys = [],
  pressedKeys = new Set(),
  correctKey,
  wrongKey,
  showFingerColors = true,
  showHomeRow = true,
  baseSize = 48,
  onKeyClick,
  className = '',
}: KeyboardProps) {
  // Build set of highlighted keys for efficient lookup
  const highlightedSet = useMemo(() => {
    const set = new Set<string>();
    if (highlightedKey) set.add(highlightedKey.toLowerCase());
    highlightedKeys.forEach((k) => set.add(k.toLowerCase()));
    return set;
  }, [highlightedKey, highlightedKeys]);

  // Determine state for each key
  const getKeyState = (keyData: KeyData): KeyState => {
    const keyLower = keyData.key.toLowerCase();

    // Check for wrong key (highest priority for visual feedback)
    if (wrongKey && keyLower === wrongKey.toLowerCase()) {
      return 'wrong';
    }

    // Check for correct key
    if (correctKey && keyLower === correctKey.toLowerCase()) {
      return 'correct';
    }

    // Check for pressed keys
    if (pressedKeys.has(keyLower) || pressedKeys.has(keyData.key)) {
      return 'pressed';
    }

    // Check for highlighted (next key to press or intro keys)
    if (highlightedSet.has(keyLower)) {
      return 'highlighted';
    }
    // Check shift label for symbols
    if (keyData.shiftLabel && highlightedSet.has(keyData.shiftLabel.toLowerCase())) {
      return 'highlighted';
    }
    // Space bar
    if (keyData.key === ' ' && highlightedSet.has(' ')) {
      return 'highlighted';
    }

    return 'default';
  };

  return (
    <div
      className={`keyboard-container ${className}`}
      dir="ltr"
      role="img"
      aria-label="Visual keyboard showing finger placement"
      aria-hidden="true"
    >
      {qwertyLayout.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center mb-1 last:mb-0"
          style={{ paddingLeft: rowIndex === 2 ? 8 : rowIndex === 3 ? 16 : 0 }}
        >
          {row.keys.map((keyData, keyIndex) => (
            <Key
              key={`${rowIndex}-${keyIndex}-${keyData.key}`}
              keyData={keyData}
              state={getKeyState(keyData)}
              showFingerColors={showFingerColors}
              showHomeRow={showHomeRow}
              baseSize={baseSize}
              onClick={onKeyClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

/**
 * Compact keyboard showing only letter keys (for smaller displays).
 */
export const CompactKeyboard = memo(function CompactKeyboard({
  highlightedKey,
  pressedKeys = new Set(),
  correctKey,
  wrongKey,
  showFingerColors = true,
  baseSize = 40,
  onKeyClick,
  className = '',
}: Omit<KeyboardProps, 'showHomeRow'>) {
  // Only show letter rows (index 1, 2, 3) and space bar
  const letterRows = useMemo(() => {
    return qwertyLayout.slice(1, 4).map((row) => ({
      ...row,
      keys: row.keys.filter(
        (k) =>
          k.key.length === 1 &&
          k.key.match(/[a-z]/i)
      ),
    }));
  }, []);

  const getKeyState = (keyData: KeyData): KeyState => {
    const keyLower = keyData.key.toLowerCase();
    const highlightedLower = highlightedKey?.toLowerCase();

    if (wrongKey && keyLower === wrongKey.toLowerCase()) return 'wrong';
    if (correctKey && keyLower === correctKey.toLowerCase()) return 'correct';
    if (pressedKeys.has(keyLower)) return 'pressed';
    if (highlightedLower && keyLower === highlightedLower) return 'highlighted';

    return 'default';
  };

  return (
    <div
      className={`keyboard-container p-3 ${className}`}
      dir="ltr"
      role="img"
      aria-label="Compact visual keyboard"
      aria-hidden="true"
    >
      {letterRows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center mb-1 last:mb-0"
          style={{ paddingLeft: rowIndex * 12 }}
        >
          {row.keys.map((keyData, keyIndex) => (
            <Key
              key={`${rowIndex}-${keyIndex}-${keyData.key}`}
              keyData={keyData}
              state={getKeyState(keyData)}
              showFingerColors={showFingerColors}
              showHomeRow={true}
              baseSize={baseSize}
              onClick={onKeyClick}
            />
          ))}
        </div>
      ))}

      {/* Space bar */}
      {highlightedKey === ' ' && (
        <div className="flex justify-center mt-2">
          <Key
            keyData={{ key: ' ', label: 'Space', finger: 'thumb', width: 6 }}
            state={highlightedKey === ' ' ? 'highlighted' : 'default'}
            showFingerColors={showFingerColors}
            baseSize={baseSize}
            onClick={onKeyClick}
          />
        </div>
      )}
    </div>
  );
});
