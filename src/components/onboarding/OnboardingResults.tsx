'use client';

import { useEffect, useRef } from 'react';

interface OnboardingResultsProps {
  locale: 'en' | 'he';
  wpm: number;
  accuracy: number;
  recommendedStage: number;
  onStart: () => void;
}

const translations = {
  en: {
    title: 'Great job!',
    skippedTitle: "You're all set!",
    wpm: 'Words per minute',
    accuracy: 'Accuracy',
    recommendation: 'We recommend starting at',
    stage: 'Stage',
    stageNames: {
      1: 'Keyboard Explorer',
      2: 'Home Row Hero',
      3: 'Letter Master',
      4: 'Word Wizard',
      5: 'Sentence Star',
      6: 'Typing Champion',
    },
    startJourney: 'Start Your Journey',
    note: "Don't worry, you can always go back to earlier stages anytime!",
  },
  he: {
    title: 'כל הכבוד!',
    skippedTitle: 'הכל מוכן!',
    wpm: 'מילים לדקה',
    accuracy: 'דיוק',
    recommendation: 'אנו ממליצים להתחיל ב',
    stage: 'שלב',
    stageNames: {
      1: 'חוקר המקלדת',
      2: 'גיבור השורה הביתית',
      3: 'מאסטר האותיות',
      4: 'קוסם המילים',
      5: 'כוכב המשפטים',
      6: 'אלוף ההקלדה',
    },
    startJourney: 'התחילו את המסע',
    note: 'אל דאגה, תמיד תוכלו לחזור לשלבים קודמים!',
  },
};

// Get WPM color and feedback
function getWpmFeedback(wpm: number): { color: string; label: string } {
  if (wpm >= 60) return { color: 'text-amber-500', label: 'Excellent!' };
  if (wpm >= 40) return { color: 'text-purple-500', label: 'Great!' };
  if (wpm >= 20) return { color: 'text-emerald-500', label: 'Good!' };
  return { color: 'text-blue-500', label: 'Keep practicing!' };
}

// Get accuracy color
function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 95) return 'text-emerald-500';
  if (accuracy >= 85) return 'text-blue-500';
  if (accuracy >= 70) return 'text-amber-500';
  return 'text-rose-500';
}

// Stage icon SVG
function StageIcon({ stage }: { stage: number }) {
  const colors = [
    'from-pink-400 to-pink-600',      // Stage 1
    'from-purple-400 to-purple-600',  // Stage 2
    'from-blue-400 to-blue-600',      // Stage 3
    'from-green-400 to-green-600',    // Stage 4
    'from-amber-400 to-amber-600',    // Stage 5
    'from-red-400 to-red-600',        // Stage 6
  ];

  return (
    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colors[stage - 1]} flex items-center justify-center shadow-lg`}>
      <span className="text-3xl font-bold text-white">{stage}</span>
    </div>
  );
}

export function OnboardingResults({
  locale,
  wpm,
  accuracy,
  recommendedStage,
  onStart,
}: OnboardingResultsProps) {
  const t = translations[locale];
  const buttonRef = useRef<HTMLButtonElement>(null);
  const skipped = wpm === 0 && accuracy === 0;

  // Auto-focus the start button
  useEffect(() => {
    const timer = setTimeout(() => {
      buttonRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Handle Enter key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onStart();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  const wpmFeedback = getWpmFeedback(wpm);
  const stageName = t.stageNames[recommendedStage as keyof typeof t.stageNames] || t.stageNames[1];

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {skipped ? t.skippedTitle : t.title}
      </h3>

      {/* Stats display (only if not skipped) */}
      {!skipped && (
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="text-center">
            <div className={`text-4xl font-bold ${wpmFeedback.color}`}>
              {wpm}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.wpm}</div>
          </div>
          <div className="w-px h-16 bg-gray-200 dark:bg-gray-600" />
          <div className="text-center">
            <div className={`text-4xl font-bold ${getAccuracyColor(accuracy)}`}>
              {accuracy}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.accuracy}</div>
          </div>
        </div>
      )}

      {/* Stage recommendation */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-600">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t.recommendation}
        </p>
        <div className="flex items-center justify-center gap-4">
          <StageIcon stage={recommendedStage} />
          <div className="text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.stage} {recommendedStage}
            </p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {stageName}
            </p>
          </div>
        </div>
      </div>

      {/* Note */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {t.note}
      </p>

      {/* Start button */}
      <button
        ref={buttonRef}
        onClick={onStart}
        className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {t.startJourney} →
      </button>
    </div>
  );
}

export default OnboardingResults;
