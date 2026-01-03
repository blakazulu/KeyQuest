'use client';

import type { KeyboardLayoutType } from '@/data/keyboard-layout';

interface LayoutSelectorProps {
  value: KeyboardLayoutType;
  onChange: (layout: KeyboardLayoutType) => void;
  labels: {
    qwerty: string;
    hebrew: string;
  };
}

/**
 * A button group for selecting keyboard layout (QWERTY or Hebrew).
 */
export function LayoutSelector({ value, onChange, labels }: LayoutSelectorProps) {
  const layouts: { key: KeyboardLayoutType; label: string }[] = [
    { key: 'qwerty', label: labels.qwerty },
    { key: 'hebrew', label: labels.hebrew },
  ];

  return (
    <div
      className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      role="radiogroup"
      aria-label="Keyboard layout"
    >
      {layouts.map((layout) => (
        <button
          key={layout.key}
          onClick={() => onChange(layout.key)}
          className={`
            px-4 py-2 text-sm font-medium transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
            ${
              value === layout.key
                ? 'bg-primary text-white'
                : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
          role="radio"
          aria-checked={value === layout.key}
        >
          {layout.label}
        </button>
      ))}
    </div>
  );
}
