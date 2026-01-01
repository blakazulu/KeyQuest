'use client';

import { memo, useState, useEffect } from 'react';

interface SessionData {
  lessonId: string;
  accuracy: number;
  wpm: number;
  date: string;
}

export interface ProgressChartProps {
  /** Session history data */
  sessions: SessionData[];
  /** Current locale */
  locale: 'en' | 'he';
  /** Maximum sessions to show */
  maxSessions?: number;
  /** Animation delay in ms */
  delay?: number;
}

type MetricType = 'accuracy' | 'wpm';

// SVG Bar component
const Bar = memo(function Bar({
  value,
  maxValue,
  index,
  total,
  color,
  isVisible,
  date,
  label,
}: {
  value: number;
  maxValue: number;
  index: number;
  total: number;
  color: string;
  isVisible: boolean;
  date: string;
  label: string;
}) {
  const barWidth = Math.max(100 / total - 2, 8);
  const barHeight = (value / maxValue) * 100;
  const x = (index / total) * 100 + 1;

  return (
    <g className="group cursor-pointer">
      {/* Bar */}
      <rect
        x={`${x}%`}
        y={`${100 - barHeight}%`}
        width={`${barWidth}%`}
        height={`${barHeight}%`}
        rx="4"
        fill={color}
        className="transition-all duration-500 group-hover:opacity-80"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'bottom',
          transitionDelay: `${index * 50}ms`,
        }}
      />

      {/* Tooltip (positioned above bar) */}
      <g
        className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        transform={`translate(${x + barWidth / 2}, ${100 - barHeight - 5})`}
      >
        <rect
          x="-25%"
          y="-20"
          width="50%"
          height="18"
          rx="4"
          fill="rgba(0,0,0,0.8)"
        />
        <text
          x="0"
          y="-8"
          textAnchor="middle"
          fill="white"
          fontSize="11"
          fontWeight="600"
        >
          {label}
        </text>
      </g>
    </g>
  );
});

export const ProgressChart = memo(function ProgressChart({
  sessions,
  locale,
  maxSessions = 10,
  delay = 0,
}: ProgressChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeMetric, setActiveMetric] = useState<MetricType>('accuracy');
  const [barsVisible, setBarsVisible] = useState(false);

  const isRTL = locale === 'he';
  const labels = {
    title: isRTL ? 'התקדמות אחרונה' : 'Recent Progress',
    accuracy: isRTL ? 'דיוק' : 'Accuracy',
    wpm: isRTL ? 'מהירות' : 'Speed',
    noData: isRTL ? 'השלם שיעורים כדי לראות התקדמות' : 'Complete lessons to see your progress',
    sessions: isRTL ? 'שיעורים אחרונים' : 'Last sessions',
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => setBarsVisible(true), 200);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  // Reset bars visibility when metric changes
  useEffect(() => {
    setBarsVisible(false);
    const timeout = setTimeout(() => setBarsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, [activeMetric]);

  // Get last N sessions
  const recentSessions = sessions.slice(-maxSessions);

  // Calculate max value for scaling
  const maxValue = activeMetric === 'accuracy' ? 100 : Math.max(...recentSessions.map(s => s.wpm), 50);

  // Color configuration
  const colors = {
    accuracy: {
      bar: '#0EA5E9', // cyan-500
      bg: 'from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-900/10',
    },
    wpm: {
      bar: '#F59E0B', // amber-500
      bg: 'from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-orange-900/10',
    },
  };

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
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold text-gray-800 dark:text-gray-100">
          {labels.title}
        </h3>

        {/* Metric Toggle */}
        <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-0.5">
          <button
            onClick={() => setActiveMetric('accuracy')}
            className={`
              px-3 py-1 text-xs font-medium rounded-full transition-all
              ${activeMetric === 'accuracy'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }
            `}
            aria-pressed={activeMetric === 'accuracy'}
          >
            {labels.accuracy}
          </button>
          <button
            onClick={() => setActiveMetric('wpm')}
            className={`
              px-3 py-1 text-xs font-medium rounded-full transition-all
              ${activeMetric === 'wpm'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }
            `}
            aria-pressed={activeMetric === 'wpm'}
          >
            {labels.wpm}
          </button>
        </div>
      </div>

      {/* Chart Area */}
      {recentSessions.length === 0 ? (
        <div className="h-32 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
          {labels.noData}
        </div>
      ) : (
        <div className="relative">
          {/* Chart */}
          <div
            className={`
              h-32 rounded-lg p-2 bg-gradient-to-b ${colors[activeMetric].bg}
            `}
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full"
              aria-hidden="true"
            >
              {/* Horizontal grid lines */}
              <line x1="0" y1="25%" x2="100" y2="25%" stroke="currentColor" strokeOpacity="0.1" />
              <line x1="0" y1="50%" x2="100" y2="50%" stroke="currentColor" strokeOpacity="0.1" />
              <line x1="0" y1="75%" x2="100" y2="75%" stroke="currentColor" strokeOpacity="0.1" />

              {/* Bars */}
              {recentSessions.map((session, index) => {
                const value = activeMetric === 'accuracy' ? session.accuracy : session.wpm;
                const displayLabel = activeMetric === 'accuracy'
                  ? `${Math.round(value)}%`
                  : `${Math.round(value)} WPM`;

                return (
                  <Bar
                    key={`${session.date}-${index}`}
                    value={value}
                    maxValue={maxValue}
                    index={index}
                    total={recentSessions.length}
                    color={colors[activeMetric].bar}
                    isVisible={barsVisible}
                    date={session.date}
                    label={displayLabel}
                  />
                );
              })}
            </svg>
          </div>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-2 bottom-2 flex flex-col justify-between text-[10px] text-gray-400 dark:text-gray-500 -ml-1 pointer-events-none">
            <span>{activeMetric === 'accuracy' ? '100%' : `${maxValue}`}</span>
            <span>{activeMetric === 'accuracy' ? '50%' : `${Math.round(maxValue / 2)}`}</span>
            <span>0</span>
          </div>
        </div>
      )}

      {/* Footer */}
      {recentSessions.length > 0 && (
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          {labels.sessions}: {recentSessions.length}
        </p>
      )}
    </div>
  );
});

export default ProgressChart;
