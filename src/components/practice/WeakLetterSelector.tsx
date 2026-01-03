'use client';

/**
 * WeakLetterSelector Component
 * Displays weak letters with trend information for selection
 */

import { useState, useMemo, useCallback } from 'react';
import { useProgressStore } from '@/stores/useProgressStore';
import { getWeakLettersRanked, getLetterStats } from '@/lib/letterAnalytics';
import { MASTERY_LABELS } from '@/types/progress';
import type { WeakLetterInfo } from '@/types/progress';

interface WeakLetterSelectorProps {
  locale: 'en' | 'he';
  onStartPractice: (letters: string[]) => void;
}

const translations = {
  en: {
    title: 'Problem Letters',
    subtitle: 'Select letters to practice or practice all weak letters',
    noWeakLetters: 'Great job! No problem letters detected.',
    noWeakLettersHint: 'Complete more lessons to identify areas for improvement.',
    practiceSelected: 'Practice Selected',
    practiceAll: 'Practice All Weak',
    selected: 'selected',
    accuracy: 'Accuracy',
    trend: 'Trend',
    improving: 'Improving',
    declining: 'Declining',
    stable: 'Stable',
    stats: {
      mastered: 'Mastered',
      learning: 'Learning',
      weak: 'Weak',
    },
  },
  he: {
    title: 'אותיות בעייתיות',
    subtitle: 'בחר/י אותיות לתרגול או תרגל/י את כל האותיות החלשות',
    noWeakLetters: 'כל הכבוד! לא זוהו אותיות בעייתיות.',
    noWeakLettersHint: 'השלם/י עוד שיעורים כדי לזהות תחומים לשיפור.',
    practiceSelected: 'תרגל נבחרות',
    practiceAll: 'תרגל את הכל',
    selected: 'נבחרו',
    accuracy: 'דיוק',
    trend: 'מגמה',
    improving: 'משתפר',
    declining: 'יורד',
    stable: 'יציב',
    stats: {
      mastered: 'נשלט',
      learning: 'בלמידה',
      weak: 'חלש',
    },
  },
};

// Trend arrow icons
const trendIcons = {
  improving: '↗',
  declining: '↘',
  stable: '→',
};

// Trend colors
const trendColors = {
  improving: 'text-emerald-600 dark:text-emerald-400',
  declining: 'text-rose-600 dark:text-rose-400',
  stable: 'text-amber-600 dark:text-amber-400',
};

export function WeakLetterSelector({
  locale,
  onStartPractice,
}: WeakLetterSelectorProps) {
  const t = translations[locale];
  const isRTL = locale === 'he';

  const [selectedLetters, setSelectedLetters] = useState<Set<string>>(new Set());

  const weakLetters = useProgressStore((s) => s.weakLetters);
  const letterHistory = useProgressStore((s) => s.letterHistory);

  // Get ranked weak letters with analytics
  const rankedWeakLetters = useMemo(
    () => getWeakLettersRanked(weakLetters, letterHistory),
    [weakLetters, letterHistory]
  );

  // Get overall stats
  const stats = useMemo(
    () => getLetterStats(weakLetters, letterHistory),
    [weakLetters, letterHistory]
  );

  // Toggle letter selection
  const toggleLetter = useCallback((letter: string) => {
    setSelectedLetters((prev) => {
      const next = new Set(prev);
      if (next.has(letter)) {
        next.delete(letter);
      } else {
        next.add(letter);
      }
      return next;
    });
  }, []);

  // Handle practice selected
  const handlePracticeSelected = useCallback(() => {
    if (selectedLetters.size > 0) {
      onStartPractice(Array.from(selectedLetters));
    }
  }, [selectedLetters, onStartPractice]);

  // Handle practice all
  const handlePracticeAll = useCallback(() => {
    const allWeakLetters = rankedWeakLetters.map((info) => info.letter);
    onStartPractice(allWeakLetters);
  }, [rankedWeakLetters, onStartPractice]);

  // No weak letters
  if (rankedWeakLetters.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t.noWeakLetters}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{t.noWeakLettersHint}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {t.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
      </div>

      {/* Stats summary */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-emerald-700 dark:text-emerald-300">
            {stats.mastered} {t.stats.mastered}
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full text-sm">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span className="text-amber-700 dark:text-amber-300">
            {stats.learning} {t.stats.learning}
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-100 dark:bg-rose-900/30 rounded-full text-sm">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span className="text-rose-700 dark:text-rose-300">
            {stats.weak} {t.stats.weak}
          </span>
        </div>
      </div>

      {/* Letter grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {rankedWeakLetters.map((info) => (
          <LetterCard
            key={info.letter}
            info={info}
            locale={locale}
            isSelected={selectedLetters.has(info.letter)}
            onToggle={() => toggleLetter(info.letter)}
          />
        ))}
      </div>

      {/* Action buttons */}
      <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button
          onClick={handlePracticeSelected}
          disabled={selectedLetters.size === 0}
          className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold rounded-xl transition-colors disabled:cursor-not-allowed"
          aria-label={`${t.practiceSelected} (${selectedLetters.size} ${t.selected})`}
        >
          {t.practiceSelected}
          {selectedLetters.size > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-sm">
              {selectedLetters.size}
            </span>
          )}
        </button>
        <button
          onClick={handlePracticeAll}
          className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-colors"
          aria-label={t.practiceAll}
        >
          {t.practiceAll}
        </button>
      </div>
    </div>
  );
}

// Individual letter card
interface LetterCardProps {
  info: WeakLetterInfo;
  locale: 'en' | 'he';
  isSelected: boolean;
  onToggle: () => void;
}

function LetterCard({ info, locale, isSelected, onToggle }: LetterCardProps) {
  const t = translations[locale];
  const trendLabel = t[info.trend as keyof typeof t] as string;

  return (
    <button
      onClick={onToggle}
      className={`
        relative p-4 rounded-xl border-2 transition-all
        ${
          isSelected
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
        }
      `}
      aria-pressed={isSelected}
      aria-label={`${info.letter.toUpperCase()}: ${Math.round(info.accuracy)}% ${t.accuracy}, ${trendLabel}`}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}

      {/* Letter */}
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {info.letter.toUpperCase()}
      </div>

      {/* Accuracy */}
      <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        {Math.round(info.accuracy)}%
      </div>

      {/* Trend */}
      <div
        className={`flex items-center gap-1 text-sm ${trendColors[info.trend]}`}
      >
        <span>{trendIcons[info.trend]}</span>
        <span>{trendLabel}</span>
      </div>
    </button>
  );
}

export default WeakLetterSelector;
