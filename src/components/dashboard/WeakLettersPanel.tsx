'use client';

import { memo, useState, useEffect } from 'react';

type MasteryLevel = 'mastered' | 'learning' | 'weak' | 'locked';

export interface WeakLettersPanelProps {
  /** Key mastery data from getKeyMastery() */
  keyMastery: Record<string, MasteryLevel>;
  /** Per-letter accuracy percentages */
  weakLetters: Record<string, number>;
  /** Current locale */
  locale: 'en' | 'he';
  /** Animation delay in ms */
  delay?: number;
  /** Callback when a key is clicked */
  onKeyClick?: (key: string) => void;
}

// QWERTY keyboard layout
const keyboardRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
];

// Mastery level colors
const masteryColors: Record<MasteryLevel, { bg: string; text: string; border: string }> = {
  mastered: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/50',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-600',
  },
  learning: {
    bg: 'bg-amber-100 dark:bg-amber-900/50',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-600',
  },
  weak: {
    bg: 'bg-rose-100 dark:bg-rose-900/50',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-300 dark:border-rose-600',
  },
  locked: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-400 dark:text-gray-600',
    border: 'border-gray-200 dark:border-gray-700',
  },
};

// Single key component
const MiniKey = memo(function MiniKey({
  keyChar,
  mastery,
  accuracy,
  isVisible,
  index,
  locale,
  onClick,
}: {
  keyChar: string;
  mastery: MasteryLevel;
  accuracy: number | undefined;
  isVisible: boolean;
  index: number;
  locale: 'en' | 'he';
  onClick?: () => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const colors = masteryColors[mastery];
  const isRTL = locale === 'he';

  const masteryLabels: Record<MasteryLevel, string> = {
    mastered: isRTL ? 'שולט' : 'Mastered',
    learning: isRTL ? 'לומד' : 'Learning',
    weak: isRTL ? 'צריך תרגול' : 'Needs practice',
    locked: isRTL ? 'נעול' : 'Locked',
  };

  const displayAccuracy = accuracy !== undefined ? `${Math.round(accuracy)}%` : '-';

  return (
    <div className="relative">
      <button
        className={`
          w-7 h-7 sm:w-8 sm:h-8 rounded-md
          flex items-center justify-center
          text-xs sm:text-sm font-medium uppercase
          border transition-all duration-300
          ${colors.bg} ${colors.text} ${colors.border}
          ${mastery !== 'locked' ? 'hover:scale-110 hover:shadow-md cursor-pointer' : 'cursor-default'}
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
        style={{ transitionDelay: `${index * 20}ms` }}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        disabled={mastery === 'locked'}
        aria-label={`${keyChar.toUpperCase()}: ${masteryLabels[mastery]}${accuracy !== undefined ? `, ${displayAccuracy}` : ''}`}
      >
        {keyChar}
      </button>

      {/* Tooltip */}
      {showTooltip && mastery !== 'locked' && (
        <div
          className={`
            absolute z-10 -top-12 left-1/2 -translate-x-1/2
            px-2 py-1 rounded-md shadow-lg
            bg-gray-900 dark:bg-gray-700 text-white text-xs
            whitespace-nowrap pointer-events-none
          `}
        >
          <div className="font-bold">{keyChar.toUpperCase()}</div>
          <div>{masteryLabels[mastery]}</div>
          {accuracy !== undefined && <div>{displayAccuracy}</div>}
          {/* Arrow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
            <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
          </div>
        </div>
      )}
    </div>
  );
});

// Legend item
const LegendItem = memo(function LegendItem({
  level,
  label,
}: {
  level: MasteryLevel;
  label: string;
}) {
  const colors = masteryColors[level];
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-3 h-3 rounded ${colors.bg} ${colors.border} border`} />
      <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
});

export const WeakLettersPanel = memo(function WeakLettersPanel({
  keyMastery,
  weakLetters,
  locale,
  delay = 0,
  onKeyClick,
}: WeakLettersPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [keysVisible, setKeysVisible] = useState(false);

  const isRTL = locale === 'he';
  const labels = {
    title: isRTL ? 'מיפוי מקשים' : 'Key Mastery',
    subtitle: isRTL ? 'ראה אילו מקשים צריכים תרגול' : 'See which keys need practice',
    mastered: isRTL ? 'שולט' : 'Mastered',
    learning: isRTL ? 'לומד' : 'Learning',
    weak: isRTL ? 'חלש' : 'Weak',
    locked: isRTL ? 'נעול' : 'Locked',
    noWeakKeys: isRTL ? 'עבודה מצוינת! אין מקשים חלשים' : 'Great job! No weak keys',
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => setKeysVisible(true), 200);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  // Count keys by mastery level
  const counts = {
    mastered: Object.values(keyMastery).filter(m => m === 'mastered').length,
    learning: Object.values(keyMastery).filter(m => m === 'learning').length,
    weak: Object.values(keyMastery).filter(m => m === 'weak').length,
    locked: Object.values(keyMastery).filter(m => m === 'locked').length,
  };

  let keyIndex = 0;

  return (
    <div
      className={`
        relative rounded-2xl p-5
        shadow-lg shadow-gray-300/20 dark:shadow-black/30
        border border-white/80 dark:border-gray-700
        backdrop-blur-sm
        bg-gradient-to-br from-white via-gray-50 to-gray-100
        dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/30
        transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      role="region"
      aria-label={labels.title}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-display text-lg font-bold text-gray-800 dark:text-gray-100">
          {labels.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {labels.subtitle}
        </p>
      </div>

      {/* Mini Keyboard */}
      <div className="flex flex-col items-center gap-1 mb-4">
        {keyboardRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-1"
            style={{ marginLeft: rowIndex === 1 ? '12px' : rowIndex === 2 ? '24px' : '0' }}
          >
            {row.map((keyChar) => {
              const mastery = keyMastery[keyChar] || 'locked';
              const accuracy = weakLetters[keyChar];
              const currentIndex = keyIndex++;

              return (
                <MiniKey
                  key={keyChar}
                  keyChar={keyChar}
                  mastery={mastery}
                  accuracy={accuracy}
                  isVisible={keysVisible}
                  index={currentIndex}
                  locale={locale}
                  onClick={onKeyClick ? () => onKeyClick(keyChar) : undefined}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
        <LegendItem level="mastered" label={`${labels.mastered} (${counts.mastered})`} />
        <LegendItem level="learning" label={`${labels.learning} (${counts.learning})`} />
        <LegendItem level="weak" label={`${labels.weak} (${counts.weak})`} />
        <LegendItem level="locked" label={`${labels.locked} (${counts.locked})`} />
      </div>

      {/* No weak keys message */}
      {counts.weak === 0 && counts.learning > 0 && (
        <p className="mt-3 text-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
          {labels.noWeakKeys}
        </p>
      )}
    </div>
  );
});

export default WeakLettersPanel;
