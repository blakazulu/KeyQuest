'use client';

import { memo, useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import type { LevelStatus } from '@/components/ui/LevelCard';

interface Stage {
  id: number;
  name: string;
  description: string;
  lessons: number;
  completedLessons?: number;
  status: LevelStatus;
  href?: string;
}

interface QuestMapProps {
  stages: Stage[];
  locale: 'en' | 'he';
  className?: string;
}

// Stage themes with colors and icons
const stageThemes: Record<number, { icon: string; color: string; bgColor: string; secondaryIcon: string }> = {
  1: { icon: '🏠', color: '#FF7B4A', bgColor: '#FFF5F0', secondaryIcon: '🔑' },
  2: { icon: '🌊', color: '#67E8F9', bgColor: '#ECFEFF', secondaryIcon: '🐚' },
  3: { icon: '⛰️', color: '#A78BFA', bgColor: '#F5F3FF', secondaryIcon: '🦅' },
  4: { icon: '🌲', color: '#86EFAC', bgColor: '#ECFDF5', secondaryIcon: '🦋' },
  5: { icon: '🏔️', color: '#93C5FD', bgColor: '#EFF6FF', secondaryIcon: '❄️' },
  6: { icon: '🏆', color: '#FDE047', bgColor: '#FEFCE8', secondaryIcon: '👑' },
};

// Stage node positions (percentage based, zigzag pattern)
const stagePositions = [
  { x: 20, y: 82 },   // Stage 1 - bottom left
  { x: 75, y: 68 },   // Stage 2 - right
  { x: 25, y: 52 },   // Stage 3 - left
  { x: 70, y: 38 },   // Stage 4 - right
  { x: 30, y: 22 },   // Stage 5 - left
  { x: 50, y: 6 },    // Stage 6 - top center (summit!)
];

// Generate the winding path SVG
const generatePath = () => {
  const points = stagePositions.map(p => ({ x: p.x, y: p.y }));
  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const midY = (curr.y + next.y) / 2;
    path += ` C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y}`;
  }

  return path;
};

// Generate individual path segment between two stages
const generateSegmentPath = (fromIndex: number, toIndex: number) => {
  const from = stagePositions[fromIndex];
  const to = stagePositions[toIndex];
  const midY = (from.y + to.y) / 2;
  return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
};

// Calculate a point along a cubic bezier curve at parameter t (0-1)
const getPointOnCurve = (
  fromIndex: number,
  toIndex: number,
  t: number
): { x: number; y: number } => {
  const p0 = stagePositions[fromIndex];
  const p3 = stagePositions[toIndex];
  const midY = (p0.y + p3.y) / 2;
  const p1 = { x: p0.x, y: midY };
  const p2 = { x: p3.x, y: midY };

  // Cubic bezier formula: B(t) = (1-t)³P0 + 3(1-t)²tP1 + 3(1-t)t²P2 + t³P3
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
  };
};

// Generate lesson marker positions along a path segment
const getLessonMarkers = (
  fromIndex: number,
  toIndex: number,
  lessonCount: number,
  completedLessons: number = 0
) => {
  const markers = [];
  // Place markers evenly along the path, avoiding the very start and end
  for (let i = 0; i < lessonCount; i++) {
    const t = (i + 1) / (lessonCount + 1);
    const point = getPointOnCurve(fromIndex, toIndex, t);
    markers.push({
      ...point,
      completed: i < completedLessons,
      index: i,
    });
  }
  return markers;
};

// Decorative elements data
const decorations = [
  // Trees
  { emoji: '🌳', x: 8, y: 75, size: 2, delay: 0 },
  { emoji: '🌲', x: 92, y: 60, size: 2.2, delay: 1 },
  { emoji: '🌴', x: 5, y: 45, size: 1.8, delay: 2 },
  { emoji: '🌳', x: 88, y: 25, size: 2, delay: 0.5 },
  // Flowers & plants
  { emoji: '🌸', x: 15, y: 90, size: 1.4, delay: 0.3 },
  { emoji: '🌺', x: 85, y: 85, size: 1.3, delay: 1.2 },
  { emoji: '🌻', x: 12, y: 35, size: 1.5, delay: 2.5 },
  { emoji: '🌷', x: 90, y: 45, size: 1.3, delay: 0.8 },
  { emoji: '🍀', x: 40, y: 95, size: 1.2, delay: 1.5 },
  { emoji: '🌿', x: 60, y: 92, size: 1.4, delay: 2.2 },
  // Animals
  { emoji: '🦋', x: 35, y: 70, size: 1.3, delay: 0, animate: 'flutter' },
  { emoji: '🐦', x: 65, y: 30, size: 1.4, delay: 1, animate: 'flutter' },
  { emoji: '🐿️', x: 82, y: 75, size: 1.3, delay: 2.5 },
  { emoji: '🦔', x: 18, y: 60, size: 1.2, delay: 1.8 },
  // Clouds
  { emoji: '☁️', x: 10, y: 12, size: 2, delay: 0, animate: 'drift' },
  { emoji: '☁️', x: 85, y: 8, size: 1.8, delay: 2, animate: 'drift' },
  { emoji: '☁️', x: 45, y: 3, size: 1.5, delay: 1, animate: 'drift' },
  // Stars & sparkles
  { emoji: '✨', x: 55, y: 15, size: 1.2, delay: 0, animate: 'sparkle' },
  { emoji: '⭐', x: 42, y: 5, size: 1.3, delay: 1.5, animate: 'sparkle' },
  { emoji: '💫', x: 58, y: 2, size: 1.1, delay: 0.8, animate: 'sparkle' },
  { emoji: '✨', x: 25, y: 18, size: 1, delay: 2, animate: 'sparkle' },
  // Path decorations
  { emoji: '🍄', x: 45, y: 75, size: 1.2, delay: 0.4 },
  { emoji: '🪨', x: 55, y: 55, size: 1.3, delay: 1.1 },
  { emoji: '🌾', x: 48, y: 42, size: 1.4, delay: 0.7 },
  // Water elements near lagoon
  { emoji: '🐠', x: 80, y: 72, size: 1.1, delay: 0.5, animate: 'swim' },
  { emoji: '🐙', x: 70, y: 75, size: 1.2, delay: 1.3 },
  // Mountain elements
  { emoji: '🦅', x: 35, y: 48, size: 1.4, delay: 0.2, animate: 'soar' },
];

const StageNode = memo(function StageNode({
  stage,
  position,
  locale,
  isBottomHalf,
}: {
  stage: Stage;
  position: { x: number; y: number };
  locale: 'en' | 'he';
  isBottomHalf: boolean;
}) {
  const theme = stageThemes[stage.id] || stageThemes[1];
  const isInteractive = stage.status !== 'locked';

  const statusLabels: Record<LevelStatus, { en: string; he: string }> = {
    locked: { en: 'Locked', he: 'נעול' },
    available: { en: 'Start!', he: 'התחל!' },
    current: { en: 'Continue', he: 'המשך' },
    completed: { en: 'Complete!', he: 'הושלם!' },
  };

  const lessonsLabel = locale === 'he' ? 'שיעורים' : 'lessons';
  const ariaLabel = `${locale === 'he' ? 'שלב' : 'Stage'} ${stage.id}: ${stage.name}, ${stage.lessons} ${lessonsLabel}, ${statusLabels[stage.status][locale]}`;

  const nodeContent = (
    <div
      className={`
        quest-node
        ${stage.status === 'locked' ? 'quest-node-locked' : ''}
        ${stage.status === 'available' ? 'quest-node-available' : ''}
        ${stage.status === 'current' ? 'quest-node-current' : ''}
        ${stage.status === 'completed' ? 'quest-node-completed' : ''}
      `}
      style={{
        '--node-color': theme.color,
        '--node-bg': theme.bgColor,
      } as React.CSSProperties}
    >
      {/* Glow ring for current/available */}
      {(stage.status === 'current' || stage.status === 'available') && (
        <div className="quest-node-glow" style={{ borderColor: theme.color }} />
      )}

      {/* Secondary floating icon */}
      {stage.status !== 'locked' && (
        <div className="quest-node-secondary" style={{ color: theme.color }}>
          {theme.secondaryIcon}
        </div>
      )}

      {/* Main circle */}
      <div className="quest-node-circle" style={{ borderColor: theme.color }}>
        <span className="quest-node-icon">
          {stage.status === 'locked' ? '🔒' : theme.icon}
        </span>

        {/* Completed checkmark overlay */}
        {stage.status === 'completed' && (
          <div className="quest-node-check">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Stage number badge */}
      <div
        className="quest-node-badge"
        style={{ backgroundColor: stage.status === 'locked' ? '#9CA3AF' : theme.color }}
      >
        {stage.id}
      </div>

      {/* Stage info card - position based on vertical location */}
      <div className={`quest-node-info ${isBottomHalf ? 'quest-node-info-top' : 'quest-node-info-bottom'}`}>
        <h3 className="quest-node-title">{stage.name}</h3>
        <p className="quest-node-desc">{stage.description}</p>

        {/* Progress for current stage */}
        {stage.status === 'current' && stage.completedLessons !== undefined && (
          <div className="quest-node-progress">
            <div className="quest-node-progress-bar">
              <div
                className="quest-node-progress-fill"
                style={{
                  width: `${(stage.completedLessons / stage.lessons) * 100}%`,
                  backgroundColor: theme.color,
                }}
              />
            </div>
            <span className="quest-node-progress-text">
              {stage.completedLessons}/{stage.lessons}
            </span>
          </div>
        )}

        {/* Stars for completed */}
        {stage.status === 'completed' && (
          <div className="quest-node-stars">
            <span>⭐</span><span>⭐</span><span>⭐</span>
          </div>
        )}

        {/* Action button */}
        {stage.status !== 'locked' && (
          <div
            className="quest-node-action"
            style={{ backgroundColor: theme.color }}
          >
            {statusLabels[stage.status][locale]}
          </div>
        )}

        {/* Lessons count */}
        <div className="quest-node-lessons">
          {stage.lessons} {lessonsLabel}
        </div>
      </div>
    </div>
  );

  const wrapperStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}%`,
    top: `${position.y}%`,
    transform: 'translate(-50%, -50%)',
    zIndex: stage.status === 'current' ? 20 : 10,
  };

  if (isInteractive && stage.href) {
    return (
      <Link
        href={stage.href}
        style={wrapperStyle}
        aria-label={ariaLabel}
        className="quest-node-wrapper"
      >
        {nodeContent}
      </Link>
    );
  }

  return (
    <div
      style={wrapperStyle}
      aria-label={ariaLabel}
      aria-disabled={stage.status === 'locked'}
      className="quest-node-wrapper"
    >
      {nodeContent}
    </div>
  );
});

export const QuestMap = memo(function QuestMap({
  stages,
  locale,
  className = '',
}: QuestMapProps) {
  const pathRef = useRef<SVGPathElement>(null);

  // Animate path drawing on mount
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = `${length}`;
      pathRef.current.style.strokeDashoffset = `${length}`;

      requestAnimationFrame(() => {
        if (pathRef.current) {
          pathRef.current.style.transition = 'stroke-dashoffset 2.5s ease-out';
          pathRef.current.style.strokeDashoffset = '0';
        }
      });
    }
  }, []);

  const pathD = generatePath();

  return (
    <div
      className={`quest-map ${className}`}
      role="navigation"
      aria-label={locale === 'he' ? 'מפת המסע' : 'Quest Map'}
      dir="ltr"
    >
      {/* Inner wrapper to ensure minimum height for scrolling */}
      <div className="quest-map-inner">
      {/* Gradient background layers */}
      <div className="quest-map-gradient" />

      {/* Decorative elements */}
      <div className="quest-map-decorations" aria-hidden="true">
        {decorations.map((decor, i) => (
          <div
            key={i}
            className={`quest-decor ${decor.animate ? `quest-decor-${decor.animate}` : ''}`}
            style={{
              left: `${decor.x}%`,
              top: `${decor.y}%`,
              fontSize: `${decor.size}rem`,
              animationDelay: `${decor.delay}s`,
            }}
          >
            {decor.emoji}
          </div>
        ))}
      </div>

      {/* Ground/grass decoration at bottom */}
      <div className="quest-map-ground" aria-hidden="true">
        <div className="quest-ground-grass" />
      </div>

      {/* SVG Path connecting stages */}
      <svg
        className="quest-path-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="questPathGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF7B4A" />
            <stop offset="25%" stopColor="#67E8F9" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="75%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>
          {/* Glow filter for completed markers */}
          <filter id="markerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Wider shadow path */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(139, 92, 60, 0.15)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Dirt path base */}
        <path
          d={pathD}
          fill="none"
          stroke="#D4B896"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Render lesson markers for each path segment */}
        {stages.slice(0, -1).map((stage, index) => {
          const nextStage = stages[index + 1];
          const theme = stageThemes[stage.id] || stageThemes[1];
          const markers = getLessonMarkers(
            index,
            index + 1,
            stage.lessons,
            stage.completedLessons || 0
          );

          // Determine if this segment is accessible
          const isAccessible = stage.status === 'completed' || stage.status === 'current';
          const isCompleted = stage.status === 'completed';

          return (
            <g key={`segment-${stage.id}`}>
              {/* Lesson markers along the path */}
              {markers.map((marker, markerIndex) => {
                const isMarkerCompleted = marker.completed;
                const isCurrent = stage.status === 'current' && markerIndex === (stage.completedLessons || 0);

                return (
                  <g key={`marker-${stage.id}-${markerIndex}`}>
                    {/* Outer ring for current lesson */}
                    {isCurrent && (
                      <circle
                        cx={marker.x}
                        cy={marker.y}
                        r="2"
                        fill="none"
                        stroke={theme.color}
                        strokeWidth="0.3"
                        opacity="0.6"
                        className="quest-marker-pulse"
                      />
                    )}
                    {/* Marker circle */}
                    <circle
                      cx={marker.x}
                      cy={marker.y}
                      r={isCurrent ? "1.2" : "1"}
                      fill={isMarkerCompleted ? theme.color : (isAccessible ? '#fff' : '#E5E7EB')}
                      stroke={isAccessible ? theme.color : '#9CA3AF'}
                      strokeWidth="0.4"
                      filter={isMarkerCompleted ? "url(#markerGlow)" : undefined}
                    />
                    {/* Checkmark for completed */}
                    {isMarkerCompleted && (
                      <path
                        d={`M ${marker.x - 0.4} ${marker.y} L ${marker.x - 0.1} ${marker.y + 0.3} L ${marker.x + 0.5} ${marker.y - 0.3}`}
                        fill="none"
                        stroke="#fff"
                        strokeWidth="0.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                    {/* Star for current lesson */}
                    {isCurrent && (
                      <text
                        x={marker.x}
                        y={marker.y + 0.3}
                        textAnchor="middle"
                        fontSize="1.2"
                        className="quest-marker-star"
                      >
                        ⭐
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Animated progress path overlay */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="url(#questPathGradient)"
          strokeWidth="0.8"
          strokeLinecap="round"
          className="quest-path-progress"
          opacity="0.4"
        />
      </svg>

      {/* Stage nodes */}
      {stages.map((stage, index) => (
        <StageNode
          key={stage.id}
          stage={stage}
          position={stagePositions[index]}
          locale={locale}
          isBottomHalf={stagePositions[index].y > 50}
        />
      ))}

      {/* Milestone flags along the path */}
      <div className="quest-flags" aria-hidden="true">
        <div className="quest-flag" style={{ left: '47%', top: '76%' }}>🚩</div>
        <div className="quest-flag" style={{ left: '50%', top: '45%' }}>🚩</div>
        <div className="quest-flag" style={{ left: '50%', top: '30%' }}>🚩</div>
      </div>

      {/* Legend */}
      <div className="quest-legend" dir={locale === 'he' ? 'rtl' : 'ltr'}>
        <div className="quest-legend-item">
          <div className="quest-legend-dot quest-legend-completed" />
          <span>{locale === 'he' ? 'הושלם' : 'Completed'}</span>
        </div>
        <div className="quest-legend-item">
          <div className="quest-legend-dot quest-legend-current" />
          <span>{locale === 'he' ? 'נוכחי' : 'Current'}</span>
        </div>
        <div className="quest-legend-item">
          <div className="quest-legend-dot quest-legend-locked" />
          <span>{locale === 'he' ? 'נעול' : 'Locked'}</span>
        </div>
      </div>
      </div>{/* End quest-map-inner */}
    </div>
  );
});

export default QuestMap;
