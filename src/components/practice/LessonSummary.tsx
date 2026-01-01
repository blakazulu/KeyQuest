'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Lesson, LessonResult } from '@/types/lesson';

interface LessonSummaryProps {
  lesson: Lesson;
  result: LessonResult;
  locale: 'en' | 'he';
  nextLessonId: string | null;
  onRestart: () => void;
}

// Confetti particle component
const Confetti = memo(function Confetti({ count = 80 }: { count?: number }) {
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#FFE66D', '#FF69B4', '#00CED1', '#FFA500', '#9370DB', '#00FF7F', '#FF1493'];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const color = colors[i % colors.length];
        const left = Math.random() * 100;
        const delay = Math.random() * 0.8;
        const duration = 2.5 + Math.random() * 2;
        const size = 6 + Math.random() * 10;

        return (
          <div
            key={i}
            className="absolute animate-[confetti-fall_var(--duration)_ease-out_var(--delay)_forwards]"
            style={{
              left: `${left}%`,
              top: '-20px',
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              '--delay': `${delay}s`,
              '--duration': `${duration}s`,
              opacity: 0,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
});

// Animated counter hook
function useCountUp(end: number, duration: number = 1000, delay: number = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOut * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timeout);
  }, [end, duration, delay]);

  return count;
}

// Circular progress ring component
const ProgressRing = memo(function ProgressRing({
  value,
  max,
  size = 140,
  strokeWidth = 10,
  color,
  delay = 0,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  delay?: number;
}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(animatedValue / max, 1);
  const strokeDashoffset = circumference - progress * circumference;

  useEffect(() => {
    const timeout = setTimeout(() => {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = Math.min((currentTime - startTime) / 1200, 1);
        const easeOut = 1 - Math.pow(1 - elapsed, 3);
        setAnimatedValue(easeOut * value);
        if (elapsed < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#F3F4F6"
        strokeWidth={strokeWidth}
        className="dark:stroke-gray-600"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        className="transition-all duration-300"
        style={{
          filter: `drop-shadow(0 0 6px ${color}40)`,
        }}
      />
    </svg>
  );
});

// Star component with animation - middle star bigger, 3D effect
const Stars = memo(function Stars({ count, max = 3, show }: { count: number; max?: number; show: boolean }) {
  // Size classes: side stars smaller, middle star bigger
  const sizes = ['text-5xl', 'text-6xl', 'text-5xl'];
  const offsets = ['mt-2', 'mt-0', 'mt-2']; // Middle star raised

  return (
    <div className="flex gap-3 justify-center items-end" aria-label={`${count} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => {
        const isEarned = i < count;
        return (
          <div
            key={i}
            className={`
              relative transition-all duration-500
              ${offsets[i]}
              ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
            `}
            style={{
              transitionDelay: show ? `${0.6 + i * 0.15}s` : '0s',
            }}
          >
            {/* 3D Star with layers */}
            <span
              className={`
                ${sizes[i]} block relative
                ${isEarned ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}
              `}
              style={{
                filter: isEarned
                  ? 'drop-shadow(0 4px 6px rgba(180, 130, 0, 0.5)) drop-shadow(0 1px 2px rgba(255, 200, 0, 0.8))'
                  : 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2))',
                textShadow: isEarned
                  ? '0 -2px 0 #fcd34d, 0 2px 4px rgba(180, 130, 0, 0.6)'
                  : '0 1px 2px rgba(0, 0, 0, 0.1)',
              }}
            >
              ★
            </span>
            {/* Shine overlay for earned stars */}
            {isEarned && (
              <span
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                }}
              >
                <span className={`${sizes[i]} text-transparent`}>★</span>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
});

// Stat card with progress ring
const StatCard = memo(function StatCard({
  icon,
  value,
  label,
  unit,
  color,
  textColor,
  bgGradient,
  max,
  showNewBest,
  delay,
  show,
  locale,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  unit?: string;
  color: string;
  textColor: string;
  bgGradient: string;
  max: number;
  showNewBest?: boolean;
  delay: number;
  show: boolean;
  locale: 'en' | 'he';
}) {
  const animatedValue = useCountUp(value, 1000, delay);
  const newBestLabel = locale === 'he' ? 'שיא חדש!' : 'New Best!';

  return (
    <div
      className={`
        relative rounded-2xl p-5
        shadow-lg shadow-gray-300/30 dark:shadow-black/20
        border border-white/80 dark:border-gray-600
        backdrop-blur-sm
        transition-all duration-700
        ${bgGradient}
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{ transitionDelay: `${delay / 1000}s` }}
    >
      {/* Icon badge */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 shadow-md border-2"
        style={{ borderColor: color }}
      >
        {icon}
      </div>

      {/* Progress ring with value */}
      <div className="relative flex items-center justify-center mt-4">
        <ProgressRing value={value} max={max} size={120} strokeWidth={8} color={color} delay={delay} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold font-display ${textColor}`}>
            {animatedValue}{unit}
          </span>
        </div>
      </div>

      {/* Label */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">{label}</p>

      {/* New Best badge */}
      {showNewBest && (
        <div
          className={`
            absolute -bottom-2 left-1/2 -translate-x-1/2
            flex items-center gap-1 px-3 py-1
            bg-gradient-to-r from-orange-400 to-amber-400
            text-white text-xs font-bold rounded-full shadow-md
            transition-all duration-500
            ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
          `}
          style={{ transitionDelay: `${delay / 1000 + 0.5}s` }}
        >
          <span>🔥</span>
          <span>{newBestLabel}</span>
        </div>
      )}
    </div>
  );
});

export const LessonSummary = memo(function LessonSummary({
  lesson,
  result,
  locale,
  nextLessonId,
  onRestart,
}: LessonSummaryProps) {
  const router = useRouter();
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const isRTL = locale === 'he';
  const [showElements, setShowElements] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger animations
  useEffect(() => {
    const elementsTimer = setTimeout(() => setShowElements(true), 100);
    if (result.passed) {
      const confettiTimer = setTimeout(() => setShowConfetti(true), 200);
      return () => {
        clearTimeout(elementsTimer);
        clearTimeout(confettiTimer);
      };
    }
    return () => clearTimeout(elementsTimer);
  }, [result.passed]);

  // Auto-focus next button
  useEffect(() => {
    const timer = setTimeout(() => {
      nextButtonRef.current?.focus();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          window.scrollTo({ top: 0, behavior: 'instant' });
          if (nextLessonId) {
            router.push(`/${locale}/practice/${nextLessonId}`);
          } else {
            router.push(`/${locale}/levels`);
          }
          break;
        case 'r':
        case 'R':
          onRestart();
          break;
        case 'Escape':
          window.scrollTo({ top: 0, behavior: 'instant' });
          router.push(`/${locale}/levels`);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router, locale, nextLessonId, onRestart]);

  const labels = {
    lessonComplete: locale === 'he' ? 'השיעור הושלם!' : 'Lesson Completed!',
    notQuite: locale === 'he' ? 'כמעט...' : 'Almost there...',
    wpm: locale === 'he' ? 'מילים לדקה' : 'Words per Minute',
    accuracy: locale === 'he' ? 'דיוק' : 'Accuracy',
    time: locale === 'he' ? 'זמן' : 'Time',
    xpEarned: locale === 'he' ? 'XP' : 'XP Earned',
    nextLesson: locale === 'he' ? 'לשיעור הבא' : 'Next Lesson',
    tryAgain: locale === 'he' ? 'נסה שוב' : 'Try Again',
    backToMap: locale === 'he' ? 'חזרה למפה' : 'Back to Map',
    shortcuts: locale === 'he'
      ? 'Enter = הבא · R = שוב · Esc = מפה'
      : 'Enter = Next · R = Retry · Esc = Map',
  };

  // Format time as m:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-cyan-100 via-teal-50 to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
      role="region"
      aria-live="assertive"
      aria-label={result.passed ? labels.lessonComplete : labels.notQuite}
    >
      {/* Confetti */}
      {showConfetti && result.passed && <Confetti count={80} />}

      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-pink-200/20 rounded-full blur-2xl" />
      </div>

      <div className="w-full max-w-md relative z-20">
        {/* Main card */}
        <div
          className={`
            bg-gradient-to-r from-teal-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800
            backdrop-blur-md rounded-3xl shadow-2xl shadow-teal-500/10
            border border-white/50 dark:border-gray-700
            p-6 transition-all duration-700
            ${showElements ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
          `}
        >
          {/* Trophy */}
          <div
            className={`
              text-center mb-2 transition-all duration-700
              ${showElements ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
            `}
            style={{ transitionDelay: '0.2s' }}
          >
            <span className="text-6xl" style={{ filter: 'drop-shadow(0 4px 8px rgba(234, 179, 8, 0.3))' }}>
              🏆
            </span>
          </div>

          {/* Title */}
          <h1
            className={`
              text-center text-2xl font-bold text-gray-800 dark:text-gray-100 font-display
              transition-all duration-500
              ${showElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
            style={{ transitionDelay: '0.3s' }}
          >
            {result.passed ? labels.lessonComplete : labels.notQuite}
          </h1>

          {/* Lesson name */}
          <p
            className={`
              text-center text-gray-500 dark:text-gray-400 mb-4
              transition-all duration-500
              ${showElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
            style={{ transitionDelay: '0.4s' }}
          >
            {lesson.title[locale]}
          </p>

          {/* Stars */}
          <div className="mb-6">
            <Stars count={result.stars} show={showElements} />
          </div>

          {/* Primary stat cards */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <StatCard
              icon={<span className="text-lg">⚡</span>}
              value={result.wpm}
              label={labels.wpm}
              color="#F59E0B"
              textColor="text-orange-500 dark:text-orange-400"
              bgGradient="bg-gradient-to-br from-white via-orange-50 to-amber-100 dark:from-gray-700 dark:via-gray-700 dark:to-orange-900/30"
              max={100}
              showNewBest={result.isNewBest}
              delay={800}
              show={showElements}
              locale={locale}
            />
            <StatCard
              icon={<span className="text-lg">🎯</span>}
              value={result.accuracy}
              unit="%"
              label={labels.accuracy}
              color="#0EA5E9"
              textColor="text-sky-500 dark:text-sky-400"
              bgGradient="bg-gradient-to-br from-white via-sky-50 to-cyan-100 dark:from-gray-700 dark:via-gray-700 dark:to-sky-900/30"
              max={100}
              delay={1000}
              show={showElements}
              locale={locale}
            />
          </div>

          {/* Secondary stats */}
          <div
            className={`
              flex justify-center gap-3 mb-6
              transition-all duration-500
              ${showElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
            style={{ transitionDelay: '1.2s' }}
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 dark:bg-gray-700/60 border border-gray-200/50 dark:border-gray-600 rounded-full shadow-sm">
              <span className="text-teal-500">⏱</span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {formatTime(result.timeSpent)} {labels.time}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 dark:bg-gray-700/60 border border-gray-200/50 dark:border-gray-600 rounded-full shadow-sm">
              <span className="text-purple-500">⭐</span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                +{result.xpEarned} {labels.xpEarned}
              </span>
            </div>
          </div>

          {/* Primary CTA */}
          <div
            className={`
              transition-all duration-500
              ${showElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
            style={{ transitionDelay: '1.4s' }}
          >
            {result.passed && nextLessonId ? (
              <button
                ref={nextButtonRef}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  router.push(`/${locale}/practice/${nextLessonId}`);
                }}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-lg font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] animate-[gentle-pulse_2s_ease-in-out_infinite]"
              >
                {labels.nextLesson} →
              </button>
            ) : result.passed ? (
              <button
                ref={nextButtonRef}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  router.push(`/${locale}/levels`);
                }}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-lg font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {labels.backToMap} →
              </button>
            ) : (
              <button
                ref={nextButtonRef}
                onClick={onRestart}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg font-bold rounded-2xl shadow-lg shadow-amber-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {labels.tryAgain}
              </button>
            )}
          </div>

          {/* Secondary actions */}
          <div
            className={`
              flex justify-center gap-6 mt-4
              transition-all duration-500
              ${showElements ? 'opacity-100' : 'opacity-0'}
            `}
            style={{ transitionDelay: '1.6s' }}
          >
            {result.passed && (
              <button
                onClick={onRestart}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium transition-colors"
              >
                {labels.tryAgain}
              </button>
            )}
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                router.push(`/${locale}/levels`);
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium transition-colors"
            >
              {labels.backToMap}
            </button>
          </div>

          {/* Keyboard shortcuts */}
          <p
            className={`
              text-center text-xs text-gray-400 mt-4
              transition-all duration-500
              ${showElements ? 'opacity-100' : 'opacity-0'}
            `}
            style={{ transitionDelay: '1.8s' }}
          >
            {labels.shortcuts}
          </p>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotate(720deg);
          }
        }

        @keyframes gentle-pulse {
          0%, 100% {
            box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3), 0 4px 6px -4px rgba(16, 185, 129, 0.3);
          }
          50% {
            box-shadow: 0 10px 25px -3px rgba(16, 185, 129, 0.4), 0 4px 10px -4px rgba(16, 185, 129, 0.4);
          }
        }
      `}</style>
    </div>
  );
});

export default LessonSummary;
