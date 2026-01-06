'use client';

import { memo, useState, useCallback, useRef } from 'react';
import { TypingArea } from '@/components/typing';
import { ExerciseCompleteModal } from './ExerciseCompleteModal';
import { KeyboardLayoutChecker } from '@/components/ui/KeyboardLayoutChecker';
import { useProgressStore } from '@/stores/useProgressStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
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
  onExit: () => void;
}

// Calculate XP based on accuracy: 5-10 XP per exercise
function calculateExerciseXp(accuracy: number): number {
  const baseXp = 5;
  const bonusXp = Math.max(0, (accuracy - 80) * 0.25); // 0-5 bonus based on accuracy above 80%
  return Math.round(baseXp + bonusXp);
}

export const ExerciseRunner = memo(function ExerciseRunner({
  lesson,
  locale,
  onComplete,
  onExit,
}: ExerciseRunnerProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseResults, setExerciseResults] = useState<ExerciseResult[]>([]);
  const [phase, setPhase] = useState<'typing' | 'result'>('typing');
  const [typingKey, setTypingKey] = useState(0);
  const [lastResult, setLastResult] = useState<ExerciseResult | null>(null);
  const [lastXpEarned, setLastXpEarned] = useState(0);
  const [pendingTotalStats, setPendingTotalStats] = useState<{
    accuracy: number;
    wpm: number;
    timeSpent: number;
    errors: number;
    letterAccuracy: Record<string, LetterStats>;
  } | null>(null);
  const [keyboardVerified, setKeyboardVerified] = useState(false);

  // Progress store action
  const addExerciseXp = useProgressStore((s) => s.addExerciseXp);

  // Get expected keyboard layout from settings
  const keyboardLayout = useSettingsStore((s) => s.keyboardLayout);

  // Handle keyboard layout verification
  const handleKeyboardReady = useCallback(() => {
    setKeyboardVerified(true);
  }, []);

  // Aggregate letter accuracy across all exercises
  const letterAccuracyRef = useRef<Record<string, LetterStats>>({});

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === lesson.exercises.length - 1;

  // Handle Ctrl+R to restart current exercise
  const handleResetExercise = useCallback(() => {
    setTypingKey((k) => k + 1);
  }, []);

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

    // Calculate and award XP immediately
    const xpEarned = calculateExerciseXp(stats.accuracy);
    addExerciseXp(xpEarned);
    setLastXpEarned(xpEarned);

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
      // Calculate total stats for when user clicks continue
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

      // Store pending stats for when user clicks continue
      setPendingTotalStats(avgStats);
    }
  }, [currentExercise, exerciseResults, isLastExercise, lesson.passingAccuracy, addExerciseXp]);

  // Handle modal continue button
  const handleModalContinue = useCallback(() => {
    if (isLastExercise && pendingTotalStats) {
      // Final exercise - go to summary
      onComplete(exerciseResults.concat(lastResult!), pendingTotalStats);
    } else {
      // Move to next exercise
      setCurrentExerciseIndex((i) => i + 1);
      setPhase('typing');
      setTypingKey((k) => k + 1);
      setLastResult(null);
    }
  }, [isLastExercise, pendingTotalStats, onComplete, exerciseResults, lastResult]);

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
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentExerciseIndex + (phase === 'result' ? 1 : 0)) / lesson.exercises.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col mt-2">
        {/* Keyboard layout verification before starting */}
        {phase === 'typing' && !keyboardVerified && (
          <KeyboardLayoutChecker
            expectedLayout={keyboardLayout}
            locale={locale}
            onReady={handleKeyboardReady}
          />
        )}

        {phase === 'typing' && keyboardVerified && (
          <div className="flex-1 flex flex-col w-full h-full">
            <TypingArea
              key={typingKey}
              text={currentExercise.content}
              onComplete={handleExerciseComplete}
              onReset={handleResetExercise}
              showStats={true}
              allowBackspace={false}
              compactKeyboard={false}
              locale={locale}
            />
          </div>
        )}

        {phase === 'result' && lastResult && (
          <ExerciseCompleteModal
            result={lastResult}
            exerciseNumber={currentExerciseIndex + 1}
            totalExercises={lesson.exercises.length}
            xpEarned={lastXpEarned}
            locale={locale}
            isLastExercise={isLastExercise}
            onContinue={handleModalContinue}
            onExit={onExit}
          />
        )}
      </div>
    </div>
  );
});

export default ExerciseRunner;
