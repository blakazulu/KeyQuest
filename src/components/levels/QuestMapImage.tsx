'use client';

import { memo } from 'react';
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
}

// Stage positions mapped to landmarks on map.webp (percentage coordinates)
// Path: Cottage → Volcano → Cave → Snowy(BR) → Castle → Treasure(TR)
const stagePositions = [
  { x: 18, y: 18 },  // 1: Cottage (top-left)
  { x: 13, y: 52 },  // 2: Volcano (left-center)
  { x: 13, y: 82 },  // 3: Cave (bottom-left)
  { x: 82, y: 82 },  // 4: Snowy mountain (bottom-right)
  { x: 68, y: 52 },  // 5: Castle (middle-right)
  { x: 82, y: 18 },  // 6: Treasure chest (top-right)
];

// Stage themes matching the map landmarks
const stageThemes: Record<number, { emoji: string; color: string }> = {
  1: { emoji: '🏠', color: '#FF6B35' },  // Cottage - warm orange
  2: { emoji: '🌋', color: '#FF4444' },  // Volcano - red
  3: { emoji: '�portal', color: '#8B5CF6' },  // Cave - purple (using portal emoji alternative)
  4: { emoji: '❄️', color: '#06B6D4' },  // Snowy - cyan
  5: { emoji: '🏰', color: '#3B82F6' },  // Castle - blue
  6: { emoji: '🏆', color: '#F59E0B' },  // Treasure - gold
};

// Calculate point along a line at parameter t (0-1)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Generate lesson marker positions between two stages
const getLessonMarkers = (
  fromPos: { x: number; y: number },
  toPos: { x: number; y: number },
  lessonCount: number,
  completedLessons: number,
  isLocked: boolean
) => {
  const markers = [];
  for (let i = 0; i < lessonCount; i++) {
    // Distribute markers evenly along the path (avoiding endpoints)
    const t = (i + 1) / (lessonCount + 1);
    markers.push({
      x: lerp(fromPos.x, toPos.x, t),
      y: lerp(fromPos.y, toPos.y, t),
      completed: i < completedLessons,
      current: !isLocked && i === completedLessons,
      locked: isLocked,
      index: i,
    });
  }
  return markers;
};

// Generate SVG path string for dotted trail
const generatePathD = () => {
  const points = stagePositions;
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    // Simple lines between points (could add curves later)
    d += ` L ${points[i].x} ${points[i].y}`;
  }

  return d;
};

// Stage hotspot component
const StageHotspot = memo(function StageHotspot({
  stage,
  position,
  locale,
  isFirst,
  isLast,
}: {
  stage: Stage;
  position: { x: number; y: number };
  locale: 'en' | 'he';
  isFirst: boolean;
  isLast: boolean;
}) {
  const theme = stageThemes[stage.id];
  const isLocked = stage.status === 'locked';
  const isCurrent = stage.status === 'current';
  const isCompleted = stage.status === 'completed';

  const content = (
    <div
      className={`
        qmi-hotspot
        ${isLocked ? 'qmi-hotspot-locked' : ''}
        ${isCurrent ? 'qmi-hotspot-current' : ''}
        ${isCompleted ? 'qmi-hotspot-completed' : ''}
      `}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        '--stage-color': theme.color,
      } as React.CSSProperties}
    >
      {/* Number badge */}
      <div className="qmi-badge" style={{ backgroundColor: isLocked ? '#9CA3AF' : theme.color }}>
        {isLocked ? '🔒' : stage.id}
      </div>

      {/* Floating label */}
      <div className="qmi-label">
        <div className="qmi-label-icon">{theme.emoji === '�portal' ? '🔮' : theme.emoji}</div>
        <div className="qmi-label-name">{stage.name}</div>

        {/* Progress for current stage */}
        {isCurrent && stage.completedLessons !== undefined && (
          <div className="qmi-label-progress">
            <div className="qmi-progress-bar">
              <div
                className="qmi-progress-fill"
                style={{
                  width: `${(stage.completedLessons / stage.lessons) * 100}%`,
                  backgroundColor: theme.color
                }}
              />
            </div>
            <span>{stage.completedLessons}/{stage.lessons}</span>
          </div>
        )}

        {/* Stars for completed */}
        {isCompleted && <div className="qmi-label-stars">⭐⭐⭐</div>}

        {/* Lesson count */}
        <div className="qmi-label-lessons">
          {stage.lessons} {locale === 'he' ? 'שיעורים' : 'lessons'}
        </div>

        {/* Action button */}
        {!isLocked && (
          <div className="qmi-label-action" style={{ backgroundColor: theme.color }}>
            {stage.status === 'completed'
              ? (locale === 'he' ? 'שחק שוב' : 'Replay')
              : stage.status === 'current'
              ? (locale === 'he' ? 'המשך' : 'Continue')
              : (locale === 'he' ? 'התחל' : 'Start')}
          </div>
        )}
      </div>

      {/* START HERE banner for first stage */}
      {isFirst && (
        <div className="qmi-start-banner">
          🚩 {locale === 'he' ? 'התחל כאן!' : 'START HERE!'}
        </div>
      )}

      {/* FINISH banner for last stage */}
      {isLast && (
        <div className="qmi-finish-banner">
          🎯 {locale === 'he' ? 'סיום!' : 'FINISH!'}
        </div>
      )}

      {/* YOU ARE HERE for current */}
      {isCurrent && (
        <div className="qmi-here-indicator">
          👆 {locale === 'he' ? 'אתה כאן!' : 'YOU ARE HERE!'}
        </div>
      )}
    </div>
  );

  if (!isLocked && stage.href) {
    return (
      <Link href={stage.href} className="qmi-hotspot-link">
        {content}
      </Link>
    );
  }

  return content;
});

// Lesson marker component
const LessonMarker = memo(function LessonMarker({
  x,
  y,
  completed,
  current,
  locked,
  color,
}: {
  x: number;
  y: number;
  completed: boolean;
  current: boolean;
  locked: boolean;
  color: string;
}) {
  return (
    <div
      className={`
        qmi-lesson
        ${completed ? 'qmi-lesson-completed' : ''}
        ${current ? 'qmi-lesson-current' : ''}
        ${locked ? 'qmi-lesson-locked' : ''}
      `}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        '--lesson-color': color,
      } as React.CSSProperties}
    >
      {completed && <span>✓</span>}
      {current && <span>⭐</span>}
    </div>
  );
});

export const QuestMapImage = memo(function QuestMapImage({
  stages,
  locale,
}: QuestMapProps) {
  const pathD = generatePathD();

  return (
    <div className="qmi-container" dir="ltr">
      {/* Fixed aspect ratio wrapper */}
      <div className="qmi-wrapper">
        {/* Background image */}
        <img
          src="/images/map.webp"
          alt=""
          className="qmi-background"
          draggable={false}
        />

        {/* Overlay container - matches image dimensions */}
        <div className="qmi-overlay">
          {/* SVG for dotted path */}
          <svg
            className="qmi-path-svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Path shadow */}
            <path
              d={pathD}
              fill="none"
              stroke="rgba(139, 69, 19, 0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Dotted path */}
            <path
              d={pathD}
              fill="none"
              stroke="#8B4513"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeDasharray="1.5 2.5"
            />
          </svg>

          {/* Lesson markers along paths */}
          {stages.slice(0, -1).map((stage, index) => {
            const fromPos = stagePositions[index];
            const toPos = stagePositions[index + 1];
            const theme = stageThemes[stage.id];
            const markers = getLessonMarkers(
              fromPos,
              toPos,
              stage.lessons,
              stage.completedLessons || 0,
              stage.status === 'locked'
            );

            return markers.map((marker, markerIndex) => (
              <LessonMarker
                key={`lesson-${stage.id}-${markerIndex}`}
                x={marker.x}
                y={marker.y}
                completed={marker.completed}
                current={marker.current}
                locked={marker.locked}
                color={theme.color}
              />
            ));
          })}

          {/* Stage hotspots */}
          {stages.map((stage, index) => (
            <StageHotspot
              key={stage.id}
              stage={stage}
              position={stagePositions[index]}
              locale={locale}
              isFirst={index === 0}
              isLast={index === stages.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Legend - outside the map for fixed positioning */}
      <div className="qmi-legend" dir={locale === 'he' ? 'rtl' : 'ltr'}>
        <div className="qmi-legend-item">
          <span className="qmi-legend-dot qmi-legend-completed">✓</span>
          <span>{locale === 'he' ? 'הושלם' : 'Done'}</span>
        </div>
        <div className="qmi-legend-item">
          <span className="qmi-legend-dot qmi-legend-current" />
          <span>{locale === 'he' ? 'נוכחי' : 'Current'}</span>
        </div>
        <div className="qmi-legend-item">
          <span className="qmi-legend-dot qmi-legend-locked">🔒</span>
          <span>{locale === 'he' ? 'נעול' : 'Locked'}</span>
        </div>
      </div>
    </div>
  );
});

export default QuestMapImage;
