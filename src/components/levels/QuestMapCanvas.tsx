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

// Stage positions on the map (percentage based for the winding path)
// Layout like map3: Start bottom-left, wind through to finish
const stagePositions = [
  { x: 15, y: 75 },  // Stage 1 - bottom left
  { x: 75, y: 70 },  // Stage 2 - right
  { x: 20, y: 50 },  // Stage 3 - left middle
  { x: 70, y: 35 },  // Stage 4 - right upper
  { x: 25, y: 20 },  // Stage 5 - left top
  { x: 80, y: 12 },  // Stage 6 - right top (finish!)
];

// Stage themes
const stageThemes: Record<number, { emoji: string; color: string; bgColor: string }> = {
  1: { emoji: '🏠', color: '#FF6B35', bgColor: '#FFE4D6' },
  2: { emoji: '🌊', color: '#00B4D8', bgColor: '#D4F1F9' },
  3: { emoji: '⛰️', color: '#8B5CF6', bgColor: '#EDE9FE' },
  4: { emoji: '🌲', color: '#22C55E', bgColor: '#DCFCE7' },
  5: { emoji: '🏔️', color: '#06B6D4', bgColor: '#CFFAFE' },
  6: { emoji: '🏆', color: '#F59E0B', bgColor: '#FEF3C7' },
};

// Decorative characters scattered on the map
const decorations = [
  // Characters
  { emoji: '🐔', x: 8, y: 82, size: 2.5 },
  { emoji: '🦀', x: 88, y: 78, size: 2 },
  { emoji: '🦉', x: 45, y: 42, size: 2.2 },
  { emoji: '🐿️', x: 50, y: 65, size: 2 },
  { emoji: '🦋', x: 40, y: 25, size: 2 },
  { emoji: '🐻', x: 55, y: 18, size: 2.5 },
  // Nature
  { emoji: '🌴', x: 5, y: 65, size: 2.8 },
  { emoji: '🌳', x: 92, y: 55, size: 2.5 },
  { emoji: '🌲', x: 8, y: 35, size: 2.8 },
  { emoji: '🌸', x: 60, y: 55, size: 1.8 },
  { emoji: '🍄', x: 35, y: 60, size: 1.8 },
  { emoji: '🪨', x: 48, y: 30, size: 2 },
  // Fun elements
  { emoji: '⭐', x: 90, y: 8, size: 2 },
  { emoji: '✨', x: 85, y: 5, size: 1.5 },
  { emoji: '🎈', x: 30, y: 85, size: 2 },
  { emoji: '🦜', x: 12, y: 45, size: 2 },
];

// Generate SVG path for the winding trail
const generateWindingPath = () => {
  const points = stagePositions;
  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    // Create bezier curve control points for smooth winding
    const midX = (curr.x + next.x) / 2;
    const controlY1 = curr.y + (next.y - curr.y) * 0.3;
    const controlY2 = curr.y + (next.y - curr.y) * 0.7;
    path += ` C ${curr.x} ${controlY1}, ${next.x} ${controlY2}, ${next.x} ${next.y}`;
  }

  return path;
};

// Stage sign component
const StageSign = memo(function StageSign({
  stage,
  position,
  locale,
}: {
  stage: Stage;
  position: { x: number; y: number };
  locale: 'en' | 'he';
}) {
  const theme = stageThemes[stage.id];
  const isLocked = stage.status === 'locked';
  const isCurrent = stage.status === 'current';
  const isCompleted = stage.status === 'completed';

  const statusText: Record<LevelStatus, { en: string; he: string }> = {
    locked: { en: 'Locked', he: 'נעול' },
    available: { en: 'Start!', he: 'התחל!' },
    current: { en: 'Continue', he: 'המשך' },
    completed: { en: 'Done!', he: 'הושלם!' },
  };

  const content = (
    <div
      className={`quest-sign ${isLocked ? 'quest-sign-locked' : ''} ${isCurrent ? 'quest-sign-current' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        '--sign-color': theme.color,
        '--sign-bg': theme.bgColor,
      } as React.CSSProperties}
    >
      {/* Number bubble */}
      <div className="quest-sign-number" style={{ backgroundColor: isLocked ? '#9CA3AF' : theme.color }}>
        {isLocked ? '🔒' : stage.id}
      </div>

      {/* Wooden sign board */}
      <div className="quest-sign-board">
        <div className="quest-sign-emoji">{theme.emoji}</div>
        <div className="quest-sign-name">{stage.name}</div>

        {/* Progress for current */}
        {isCurrent && stage.completedLessons !== undefined && (
          <div className="quest-sign-progress">
            <div className="quest-sign-progress-track">
              <div
                className="quest-sign-progress-fill"
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
        {isCompleted && <div className="quest-sign-stars">⭐⭐⭐</div>}

        {/* Lessons count */}
        <div className="quest-sign-lessons">
          {stage.lessons} {locale === 'he' ? 'שיעורים' : 'lessons'}
        </div>

        {/* Action button */}
        {!isLocked && (
          <div className="quest-sign-action" style={{ backgroundColor: theme.color }}>
            {statusText[stage.status][locale]}
          </div>
        )}
      </div>

      {/* YOU ARE HERE indicator */}
      {isCurrent && (
        <div className="quest-sign-here">
          {locale === 'he' ? '👆 אתה כאן!' : '👆 YOU ARE HERE!'}
        </div>
      )}
    </div>
  );

  if (!isLocked && stage.href) {
    return (
      <Link href={stage.href} className="quest-sign-link">
        {content}
      </Link>
    );
  }

  return content;
});

export const QuestMapCanvas = memo(function QuestMapCanvas({
  stages,
  locale,
}: QuestMapProps) {
  const pathD = generateWindingPath();

  return (
    <div className="quest-canvas" dir="ltr">
      {/* Background texture */}
      <div className="quest-canvas-bg" />

      {/* Decorative elements */}
      {decorations.map((dec, i) => (
        <div
          key={i}
          className="quest-canvas-decor"
          style={{
            left: `${dec.x}%`,
            top: `${dec.y}%`,
            fontSize: `${dec.size}rem`,
          }}
        >
          {dec.emoji}
        </div>
      ))}

      {/* SVG for the dotted path */}
      <svg className="quest-canvas-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* Path shadow */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(101, 67, 33, 0.3)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Main dotted path */}
        <path
          d={pathD}
          fill="none"
          stroke="#8B4513"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="2 4"
        />
      </svg>

      {/* START HERE banner */}
      <div className="quest-start">
        <span className="quest-start-flag">🚩</span>
        <span className="quest-start-text">{locale === 'he' ? 'התחל כאן!' : 'START HERE!'}</span>
      </div>

      {/* FINISH banner */}
      <div className="quest-finish">
        <span className="quest-finish-text">{locale === 'he' ? 'סיום!' : 'FINISH!'}</span>
        <span className="quest-finish-flag">🎯</span>
      </div>

      {/* Stage signs */}
      {stages.map((stage, index) => (
        <StageSign
          key={stage.id}
          stage={stage}
          position={stagePositions[index]}
          locale={locale}
        />
      ))}

      {/* Legend */}
      <div className="quest-canvas-legend" dir={locale === 'he' ? 'rtl' : 'ltr'}>
        <div className="quest-legend-item">
          <span className="quest-legend-dot" style={{ background: '#22C55E' }}>✓</span>
          <span>{locale === 'he' ? 'הושלם' : 'Done'}</span>
        </div>
        <div className="quest-legend-item">
          <span className="quest-legend-dot quest-legend-current" style={{ background: '#F59E0B' }} />
          <span>{locale === 'he' ? 'נוכחי' : 'Current'}</span>
        </div>
        <div className="quest-legend-item">
          <span className="quest-legend-dot" style={{ background: '#9CA3AF' }}>🔒</span>
          <span>{locale === 'he' ? 'נעול' : 'Locked'}</span>
        </div>
      </div>
    </div>
  );
});

export default QuestMapCanvas;
