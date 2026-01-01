'use client';

import { memo, useState, useCallback, useRef } from 'react';
import { TypingArea } from '@/components/typing';
import type { Lesson, ExerciseResult } from '@/types/lesson';
import type { TypingStats, LetterStats } from '@/hooks/useTypingEngine';

interface ExerciseRunnerProps {
  lesson: Lesson;
  locale: 'en' | 'he';
  onComplete: (results: ExerciseResult[], totalStats: {
    accuracy: number;
    wpm: number;
    timeSpent: number;
    errors: number;
    letterAccuracy: Record<string, LetterStats>;
  }) => void;
}

// Exercise result mini-display
const ExerciseResultMini = memo(function ExerciseResultMini({
  result,
  locale,
}: {
  result: ExerciseResult;
  locale: 'en' | 'he';
}) {
  const labels = {
    wpm: 'WPM',
    accuracy: locale === 'he' ? 'דיוק' : 'Accuracy',
    continue: locale === 'he' ? 'ממשיך...' : 'Continuing...',
  };

  return (
    <div className="flex items-center justify-center gap-6 py-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl animate-pulse">
      <div className="text-center">
        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          {result.wpm}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{labels.wpm}</span>
      </div>
      <div className="text-center">
        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          {result.accuracy}%
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{labels.accuracy}</span>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {labels.continue}
      </div>
    </div>
  );
});

export const ExerciseRunner = memo(function ExerciseRunner({
  lesson,
  locale,
  onComplete,
}: ExerciseRunnerProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseResults, setExerciseResults] = useState<ExerciseResult[]>([]);
  const [phase, setPhase] = useState<'typing' | 'result'>('typing');
  const [typingKey, setTypingKey] = useState(0);
  const [lastResult, setLastResult] = useState<ExerciseResult | null>(null);

  // Aggregate letter accuracy across all exercises
  const letterAccuracyRef = useRef<Record<string, LetterStats>>({});

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === lesson.exercises.length - 1;

  // Handle exercise completion
  const handleExerciseComplete = useCallback((stats: TypingStats) => {
    const result: ExerciseResult = {
      exerciseId: currentExercise.id,
      accuracy: stats.accuracy,
      wpm: stats.wpm,
      timeSpent: stats.elapsedTime / 1000, // Convert to seconds
      errors: stats.errorCount,
      totalCharacters: currentExercise.content.length,
      passed: stats.accuracy >= (currentExercise.targetAccuracy || lesson.passingAccuracy),
    };

    // Merge letter accuracy from this exercise into aggregated stats
    for (const [letter, exerciseStats] of Object.entries(stats.letterAccuracy)) {
      const current = letterAccuracyRef.current[letter] || { correct: 0, total: 0 };
      letterAccuracyRef.current[letter] = {
        correct: current.correct + exerciseStats.correct,
        total: current.total + exerciseStats.total,
      };
    }

    const newResults = [...exerciseResults, result];
    setExerciseResults(newResults);
    setLastResult(result);
    setPhase('result');

    if (isLastExercise) {
      // Calculate total stats
      const totalStats = newResults.reduce(
        (acc, r) => ({
          accuracy: acc.accuracy + r.accuracy,
          wpm: acc.wpm + r.wpm,
          timeSpent: acc.timeSpent + r.timeSpent,
          errors: acc.errors + r.errors,
        }),
        { accuracy: 0, wpm: 0, timeSpent: 0, errors: 0 }
      );

      // Average accuracy and wpm
      const avgStats = {
        accuracy: Math.round(totalStats.accuracy / newResults.length),
        wpm: Math.round(totalStats.wpm / newResults.length),
        timeSpent: Math.round(totalStats.timeSpent),
        errors: totalStats.errors,
        letterAccuracy: { ...letterAccuracyRef.current },
      };

      // Small delay before completing
      setTimeout(() => {
        onComplete(newResults, avgStats);
      }, 1000);
    } else {
      // Move to next exercise after short delay
      setTimeout(() => {
        setCurrentExerciseIndex((i) => i + 1);
        setPhase('typing');
        setTypingKey((k) => k + 1);
        setLastResult(null);
      }, 1500);
    }
  }, [currentExercise, exerciseResults, isLastExercise, lesson.passingAccuracy, onComplete]);

  return (
    <div className="flex flex-col">
      {/* Header with progress */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="font-semibold text-gray-800 dark:text-gray-200">
              {lesson.title[locale]}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {locale === 'he' ? 'תרגיל' : 'Exercise'} {currentExerciseIndex + 1} / {lesson.exercises.length}
            </p>
          </div>

          {/* Progress bar */}
          <div className="flex-1 max-w-xs">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentExerciseIndex + (phase === 'result' ? 1 : 0)) / lesson.exercises.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col mt-2">
        {phase === 'typing' && (
          <div className="flex-1 flex flex-col w-full h-full">
            <TypingArea
              key={typingKey}
              text={currentExercise.content}
              onComplete={handleExerciseComplete}
              showStats={true}
              allowBackspace={false}
              compactKeyboard={false}
            />
          </div>
        )}

        {phase === 'result' && lastResult && (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
              <ExerciseResultMini result={lastResult} locale={locale} />
              {isLastExercise && (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-4 animate-pulse">
                  {locale === 'he' ? 'מחשב תוצאות...' : 'Calculating results...'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ExerciseRunner;
