'use client';

import { memo, useEffect, useState } from 'react';

export type TrendDirection = 'up' | 'down' | 'same';

export interface StatCardProps {
  /** Icon to display (emoji or ReactNode) */
  icon: React.ReactNode;
  /** Main value to display */
  value: number | string;
  /** Optional unit suffix (e.g., '%', 'WPM') */
  unit?: string;
  /** Label below the value */
  label: string;
  /** Optional sublabel (e.g., trend text) */
  sublabel?: string;
  /** Trend direction for arrow indicator */
  trend?: TrendDirection;
  /** Theme color for the card */
  colorTheme: 'purple' | 'cyan' | 'orange' | 'green';
  /** Animation delay in ms */
  delay?: number;
  /** Whether to animate the number counting up */
  animateValue?: boolean;
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

// Color configurations for each theme
const colorConfig = {
  purple: {
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
    iconBorder: 'border-purple-300 dark:border-purple-700',
    iconText: 'text-purple-600 dark:text-purple-400',
    cardGradient: 'bg-gradient-to-br from-white via-purple-50 to-purple-100 dark:from-gray-800 dark:via-gray-800 dark:to-purple-900/30',
    valueText: 'text-purple-600 dark:text-purple-400',
    trendUp: 'text-green-500',
    trendDown: 'text-rose-500',
  },
  cyan: {
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/40',
    iconBorder: 'border-cyan-300 dark:border-cyan-700',
    iconText: 'text-cyan-600 dark:text-cyan-400',
    cardGradient: 'bg-gradient-to-br from-white via-cyan-50 to-cyan-100 dark:from-gray-800 dark:via-gray-800 dark:to-cyan-900/30',
    valueText: 'text-cyan-600 dark:text-cyan-400',
    trendUp: 'text-green-500',
    trendDown: 'text-rose-500',
  },
  orange: {
    iconBg: 'bg-orange-100 dark:bg-orange-900/40',
    iconBorder: 'border-orange-300 dark:border-orange-700',
    iconText: 'text-orange-600 dark:text-orange-400',
    cardGradient: 'bg-gradient-to-br from-white via-orange-50 to-amber-100 dark:from-gray-800 dark:via-gray-800 dark:to-orange-900/30',
    valueText: 'text-orange-600 dark:text-orange-400',
    trendUp: 'text-green-500',
    trendDown: 'text-rose-500',
  },
  green: {
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconBorder: 'border-emerald-300 dark:border-emerald-700',
    iconText: 'text-emerald-600 dark:text-emerald-400',
    cardGradient: 'bg-gradient-to-br from-white via-emerald-50 to-emerald-100 dark:from-gray-800 dark:via-gray-800 dark:to-emerald-900/30',
    valueText: 'text-emerald-600 dark:text-emerald-400',
    trendUp: 'text-green-500',
    trendDown: 'text-rose-500',
  },
};

// Animated counter hook
function useCountUp(end: number, duration: number = 800, delay: number = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (typeof end !== 'number') return;

    const timeout = setTimeout(() => {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(easeOut * end));
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

// Trend arrow component
const TrendArrow = memo(function TrendArrow({
  direction,
  colorClass
}: {
  direction: TrendDirection;
  colorClass: string;
}) {
  if (direction === 'same') {
    return (
      <span className="text-gray-400 dark:text-gray-500" aria-hidden="true">
        →
      </span>
    );
  }

  return (
    <span className={colorClass} aria-hidden="true">
      {direction === 'up' ? '↑' : '↓'}
    </span>
  );
});

export const StatCard = memo(function StatCard({
  icon,
  value,
  unit = '',
  label,
  sublabel,
  trend,
  colorTheme,
  delay = 0,
  animateValue = true,
  ariaLabel,
}: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const colors = colorConfig[colorTheme];

  // Parse numeric value for animation
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
  const displayValue = animateValue && typeof value === 'number'
    ? useCountUp(numericValue, 800, delay + 200)
    : value;

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  // Build accessible label
  const accessibleLabel = ariaLabel || `${label}: ${value}${unit}${trend ? `, ${trend === 'up' ? 'improving' : trend === 'down' ? 'declining' : 'steady'}` : ''}`;

  return (
    <div
      className={`
        relative rounded-2xl p-5
        shadow-lg shadow-gray-300/20 dark:shadow-black/30
        border border-white/80 dark:border-gray-700
        backdrop-blur-sm
        transition-all duration-500
        ${colors.cardGradient}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      role="region"
      aria-label={accessibleLabel}
    >
      {/* Icon */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            border ${colors.iconBg} ${colors.iconBorder}
          `}
        >
          <span className={`text-lg ${colors.iconText}`}>{icon}</span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <p className={`font-display text-3xl font-bold ${colors.valueText}`}>
          {displayValue}{unit}
        </p>
        {trend && (
          <TrendArrow
            direction={trend}
            colorClass={trend === 'up' ? colors.trendUp : trend === 'down' ? colors.trendDown : 'text-gray-400'}
          />
        )}
      </div>

      {/* Sublabel */}
      {sublabel && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {sublabel}
        </p>
      )}
    </div>
  );
});

export default StatCard;
