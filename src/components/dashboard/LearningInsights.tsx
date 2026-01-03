'use client';

/**
 * LearningInsights Component
 * Shows improvement trends, focus areas, and recently mastered letters
 * Phase 11: Adaptive Learning
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useProgressStore } from '@/stores/useProgressStore';
import {
  getWeakLettersRanked,
  getImprovingLetters,
  getDecliningLetters,
  getRecentlyMastered,
  getLetterStats,
} from '@/lib/letterAnalytics';
import { MASTERY_LABELS } from '@/types/progress';
import type { WeakLetterInfo, LetterTrend } from '@/types/progress';

interface LearningInsightsProps {
  locale: 'en' | 'he';
}

const translations = {
  en: {
    title: 'Learning Insights',
    improving: 'Improving',
    needsWork: 'Needs Work',
    recentlyMastered: 'Recently Mastered',
    focusAreas: 'Focus Areas',
    noData: 'Complete more lessons to see your insights',
    practiceNow: 'Practice Problem Letters',
    greatJob: 'Great job!',
    allGood: 'No problem letters detected.',
    letters: 'letters',
    mastered: 'Mastered',
    gettingBetter: 'Getting Better',
    needsPractice: 'Needs Practice',
    accuracy: 'accuracy',
  },
  he: {
    title: 'תובנות למידה',
    improving: 'משתפרים',
    needsWork: 'דורשים עבודה',
    recentlyMastered: 'נשלטו לאחרונה',
    focusAreas: 'תחומי מיקוד',
    noData: 'השלם/י עוד שיעורים כדי לראות תובנות',
    practiceNow: 'תרגלו אותיות בעייתיות',
    greatJob: 'כל הכבוד!',
    allGood: 'לא זוהו אותיות בעייתיות.',
    letters: 'אותיות',
    mastered: 'נשלט',
    gettingBetter: 'משתפר',
    needsPractice: 'דורש תרגול',
    accuracy: 'דיוק',
  },
};

// Get friendly mastery label
function getMasteryLabel(accuracy: number, locale: 'en' | 'he'): string {
  const t = translations[locale];
  if (accuracy >= 95) return t.mastered;
  if (accuracy >= 70) return t.gettingBetter;
  return t.needsPractice;
}

export function LearningInsights({ locale }: LearningInsightsProps) {
  const t = translations[locale];
  const isRTL = locale === 'he';

  const weakLetters = useProgressStore((s) => s.weakLetters);
  const letterHistory = useProgressStore((s) => s.letterHistory);

  // Compute insights
  const insights = useMemo(() => {
    const improving = getImprovingLetters(weakLetters, letterHistory);
    const declining = getDecliningLetters(weakLetters, letterHistory);
    const mastered = getRecentlyMastered(weakLetters, letterHistory, 7);
    const focusAreas = getWeakLettersRanked(weakLetters, letterHistory).slice(0, 3);
    const stats = getLetterStats(weakLetters, letterHistory);

    return { improving, declining, mastered, focusAreas, stats };
  }, [weakLetters, letterHistory]);

  const hasData = Object.keys(weakLetters).length > 0;

  // No data state
  if (!hasData) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm ${isRTL ? 'text-right' : 'text-left'}`}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t.title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">{t.noData}</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm ${isRTL ? 'text-right' : 'text-left'}`}
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t.title}
      </h2>

      <div className="space-y-4">
        {/* Recently mastered */}
        {insights.mastered.length > 0 && (
          <InsightSection
            title={t.recentlyMastered}
            icon="🎉"
            letters={insights.mastered}
            weakLetters={weakLetters}
            locale={locale}
            colorClass="text-emerald-600 dark:text-emerald-400"
            bgClass="bg-emerald-50 dark:bg-emerald-900/20"
          />
        )}

        {/* Improving letters */}
        {insights.improving.length > 0 && (
          <InsightSection
            title={t.improving}
            icon="↗"
            letters={insights.improving}
            weakLetters={weakLetters}
            locale={locale}
            colorClass="text-emerald-600 dark:text-emerald-400"
            bgClass="bg-emerald-50 dark:bg-emerald-900/20"
          />
        )}

        {/* Declining letters */}
        {insights.declining.length > 0 && (
          <InsightSection
            title={t.needsWork}
            icon="↘"
            letters={insights.declining}
            weakLetters={weakLetters}
            locale={locale}
            colorClass="text-rose-600 dark:text-rose-400"
            bgClass="bg-rose-50 dark:bg-rose-900/20"
          />
        )}

        {/* Focus areas */}
        {insights.focusAreas.length > 0 ? (
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.focusAreas}
            </h3>
            <div className="flex flex-wrap gap-2">
              {insights.focusAreas.map((info) => (
                <FocusLetterBadge
                  key={info.letter}
                  info={info}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <span className="text-2xl mb-2 block">✨</span>
            <p className="text-gray-600 dark:text-gray-400">{t.allGood}</p>
          </div>
        )}

        {/* CTA to Problem Letters */}
        {insights.focusAreas.length > 0 && (
          <Link
            href={`/${locale}/problem-letters`}
            className={`block w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-center transition-colors ${isRTL ? 'text-right' : ''}`}
          >
            {t.practiceNow}
          </Link>
        )}
      </div>
    </div>
  );
}

// Section for grouped letters
interface InsightSectionProps {
  title: string;
  icon: string;
  letters: string[];
  weakLetters: Record<string, number>;
  locale: 'en' | 'he';
  colorClass: string;
  bgClass: string;
}

function InsightSection({
  title,
  icon,
  letters,
  weakLetters,
  locale,
  colorClass,
  bgClass,
}: InsightSectionProps) {
  const t = translations[locale];

  if (letters.length === 0) return null;

  return (
    <div className={`rounded-xl p-3 ${bgClass}`}>
      <div className={`flex items-center gap-2 mb-2 ${colorClass}`}>
        <span>{icon}</span>
        <span className="font-medium">{title}</span>
        <span className="text-sm opacity-75">
          ({letters.length} {t.letters})
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {letters.slice(0, 8).map((letter) => (
          <LetterBadge
            key={letter}
            letter={letter}
            accuracy={weakLetters[letter]}
            locale={locale}
          />
        ))}
        {letters.length > 8 && (
          <span className="px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
            +{letters.length - 8}
          </span>
        )}
      </div>
    </div>
  );
}

// Single letter badge with tooltip
interface LetterBadgeProps {
  letter: string;
  accuracy: number;
  locale: 'en' | 'he';
}

function LetterBadge({ letter, accuracy, locale }: LetterBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const t = translations[locale];
  const masteryLabel = getMasteryLabel(accuracy, locale);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      <button
        className="px-2 py-1 bg-white dark:bg-gray-700 rounded text-sm font-mono font-bold text-gray-800 dark:text-gray-200 shadow-sm hover:shadow transition-shadow"
        aria-label={`${letter.toUpperCase()}: ${Math.round(accuracy)}% ${t.accuracy}`}
      >
        {letter.toUpperCase()}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded whitespace-nowrap">
          <div className="font-medium">{masteryLabel}</div>
          <div className="opacity-75">{Math.round(accuracy)}%</div>
        </div>
      )}
    </div>
  );
}

// Focus letter with priority indicator
interface FocusLetterBadgeProps {
  info: WeakLetterInfo;
  locale: 'en' | 'he';
}

function FocusLetterBadge({ info, locale }: FocusLetterBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const t = translations[locale];
  const masteryLabel = getMasteryLabel(info.accuracy, locale);

  // Priority color based on priority score
  const priorityColor =
    info.priority >= 50
      ? 'border-rose-400 bg-rose-50 dark:bg-rose-900/20'
      : info.priority >= 30
        ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20'
        : 'border-gray-300 bg-gray-50 dark:bg-gray-800';

  const trendIcon = info.trend === 'improving' ? '↗' : info.trend === 'declining' ? '↘' : '→';
  const trendColor =
    info.trend === 'improving'
      ? 'text-emerald-500'
      : info.trend === 'declining'
        ? 'text-rose-500'
        : 'text-gray-400';

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      <button
        className={`px-3 py-2 rounded-lg border-2 ${priorityColor} flex items-center gap-2 transition-shadow hover:shadow`}
        aria-label={`${info.letter.toUpperCase()}: ${Math.round(info.accuracy)}% ${t.accuracy}`}
      >
        <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {info.letter.toUpperCase()}
        </span>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(info.accuracy)}%
          </div>
          <div className={`text-xs ${trendColor}`}>{trendIcon}</div>
        </div>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg whitespace-nowrap shadow-lg">
          <div className="font-medium text-sm">{masteryLabel}</div>
          <div className="opacity-75 mt-1">
            {t.accuracy}: {Math.round(info.accuracy)}%
          </div>
        </div>
      )}
    </div>
  );
}

export default LearningInsights;
