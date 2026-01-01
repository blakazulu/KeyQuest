'use client';

import { memo, useEffect, useState, useCallback } from 'react';
import type { LevelStatus } from '@/components/ui/LevelCard';

// Key character images
const KEY_IMAGES = [
  '/images/key/key1.png',
  '/images/key/key2.png',
  '/images/key/key3.png',
  '/images/key/key4.png',
  '/images/key/key5.png',
  '/images/key/key6.png',
  '/images/key/key7.png',
];

// Fisher-Yates shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

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
  onStageClick?: (stageId: number) => void;
}

// Stage positions mapped to landmarks on map.webp (percentage coordinates)
// Path: Cottage → Volcano → Cave → Snowy(BR) → Castle → Treasure(TR)
const stagePositions = [
  { x: 22, y: 20 },  // 1: Cottage (top-left)
  { x: 17.5, y: 50 },  // 2: Volcano (left-center)
  { x: 17, y: 92 },  // 3: Cave (bottom-left)
  { x: 82, y: 82 },  // 4: Snowy mountain (bottom-right)
  { x: 74.7, y: 58 },  // 5: Castle (middle-right)
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

// Calculate point along a cubic bezier curve at parameter t (0-1)
const bezierPoint = (
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number
) => {
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

// Custom coordinate overrides for stage 3→4 path (goes over bridge)
// Only override the values the user specified, keep calculated values for the rest
const stage3to4Overrides: Record<number, { x?: number; y?: number }> = {
  1: { x: 30.608746, y: 87.99869 },       // Lesson 2
  2: { x: 38.945471, y: 74 },             // Lesson 3
  3: { y: 71.703704 },                    // Lesson 4
  4: { x: 52.522634, y: 73.851852 },      // Lesson 5
  5: { x: 60.511111, y: 83.059259 },      // Lesson 6
  6: { y: 86.703704 },                    // Lesson 7
  7: { y: 85.818519 },                    // Lesson 8
};

// Custom coordinate overrides for stage 5→6 path (Castle to Treasure)
const stage5to6Overrides: Record<number, { x?: number; y?: number }> = {
  0: { x: 67.938108, y: 62.412854 },      // Lesson 1
  1: { x: 63.884411, y: 47.863447 },      // Lesson 2
  2: { x: 63.674941, y: 36.703708 },      // Lesson 3
  3: { x: 68.445731, y: 28.285565 },      // Lesson 4
  4: { x: 74.332816, y: 25.960947 },      // Lesson 5
  // Lesson 6 keeps calculated position
};

// Generate control points for a curvy path between two stages
const getControlPoints = (from: { x: number; y: number }, to: { x: number; y: number }, index: number) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  // Alternate curve direction for playful winding effect
  const curveStrength = 15 + (index % 2) * 10;
  const direction = index % 2 === 0 ? 1 : -1;

  // Calculate perpendicular offset for control points
  const len = Math.sqrt(dx * dx + dy * dy);
  const perpX = (-dy / len) * curveStrength * direction;
  const perpY = (dx / len) * curveStrength * direction;

  return {
    cp1: { x: from.x + dx * 0.3 + perpX, y: from.y + dy * 0.3 + perpY },
    cp2: { x: from.x + dx * 0.7 - perpX * 0.5, y: from.y + dy * 0.7 - perpY * 0.5 },
  };
};

// Get lesson positions with overrides applied (for path generation)
const getStage3to4Positions = () => {
  const from = stagePositions[2];
  const to = stagePositions[3];
  const { cp1, cp2 } = getControlPoints(from, to, 2);
  const lessonCount = 8;

  const positions = [];
  for (let i = 0; i < lessonCount; i++) {
    const t = (i + 1) / (lessonCount + 1);
    const point = bezierPoint(from, cp1, cp2, to, t);

    let x = point.x;
    let y = point.y;
    if (stage3to4Overrides[i]) {
      const override = stage3to4Overrides[i];
      if (override.x !== undefined) x = override.x;
      if (override.y !== undefined) y = override.y;
    }
    positions.push({ x, y });
  }
  return positions;
};

const getStage5to6Positions = () => {
  const from = stagePositions[4];
  const to = stagePositions[5];
  const { cp1, cp2 } = getControlPoints(from, to, 4);
  const lessonCount = 6;

  const positions = [];
  for (let i = 0; i < lessonCount; i++) {
    const t = (i + 1) / (lessonCount + 1);
    const point = bezierPoint(from, cp1, cp2, to, t);

    let x = point.x;
    let y = point.y;
    if (stage5to6Overrides[i]) {
      const override = stage5to6Overrides[i];
      if (override.x !== undefined) x = override.x;
      if (override.y !== undefined) y = override.y;
    }
    positions.push({ x, y });
  }
  return positions;
};

// Generate custom path through lesson points
const generateCustomPath = (from: { x: number; y: number }, to: { x: number; y: number }, points: { x: number; y: number }[]) => {
  let path = `M ${from.x} ${from.y}`;

  // Curve to first lesson
  path += ` Q ${(from.x + points[0].x) / 2} ${(from.y + points[0].y) / 2}, ${points[0].x} ${points[0].y}`;

  // Smooth curves through lesson points
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const midX = (curr.x + next.x) / 2;
    const midY = (curr.y + next.y) / 2;
    path += ` Q ${curr.x} ${curr.y}, ${midX} ${midY}`;
  }

  // Final curve to last point and destination
  const last = points[points.length - 1];
  path += ` Q ${last.x} ${last.y}, ${to.x} ${to.y}`;

  return path;
};

// Generate SVG path for a single segment (curvy)
const generateSegmentPath = (fromIndex: number, toIndex: number) => {
  // Custom path for stage 3→4 that goes over the bridge
  if (fromIndex === 2 && toIndex === 3) {
    const from = stagePositions[fromIndex];
    const to = stagePositions[toIndex];
    return generateCustomPath(from, to, getStage3to4Positions());
  }

  // Custom path for stage 5→6 (Castle to Treasure)
  if (fromIndex === 4 && toIndex === 5) {
    const from = stagePositions[fromIndex];
    const to = stagePositions[toIndex];
    return generateCustomPath(from, to, getStage5to6Positions());
  }

  const from = stagePositions[fromIndex];
  const to = stagePositions[toIndex];
  const { cp1, cp2 } = getControlPoints(from, to, fromIndex);
  return `M ${from.x} ${from.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${to.x} ${to.y}`;
};

// Generate lesson marker positions along a curved path
const getLessonMarkers = (
  fromIndex: number,
  toIndex: number,
  lessonCount: number,
  completedLessons: number,
  isLocked: boolean
) => {
  const from = stagePositions[fromIndex];
  const to = stagePositions[toIndex];
  const { cp1, cp2 } = getControlPoints(from, to, fromIndex);

  const markers = [];
  for (let i = 0; i < lessonCount; i++) {
    const t = (i + 1) / (lessonCount + 1);
    const point = bezierPoint(from, cp1, cp2, to, t);

    // Apply overrides for custom paths
    let x = point.x;
    let y = point.y;
    if (fromIndex === 2 && toIndex === 3 && stage3to4Overrides[i]) {
      const override = stage3to4Overrides[i];
      if (override.x !== undefined) x = override.x;
      if (override.y !== undefined) y = override.y;
    }
    if (fromIndex === 4 && toIndex === 5 && stage5to6Overrides[i]) {
      const override = stage5to6Overrides[i];
      if (override.x !== undefined) x = override.x;
      if (override.y !== undefined) y = override.y;
    }

    markers.push({
      x,
      y,
      completed: i < completedLessons,
      current: !isLocked && i === completedLessons,
      locked: isLocked,
      index: i,
    });
  }
  return markers;
};

// Stage hotspot component
const StageHotspot = memo(function StageHotspot({
  stage,
  position,
  locale,
  isFirst,
  isLast,
  keyImage,
  onClick,
}: {
  stage: Stage;
  position: { x: number; y: number };
  locale: 'en' | 'he';
  isFirst: boolean;
  isLast: boolean;
  keyImage: string;
  onClick?: () => void;
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

  if (!isLocked && onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="qmi-hotspot-link"
        aria-label={`${stage.name}, ${stage.lessons} ${locale === 'he' ? 'שיעורים' : 'lessons'}`}
      >
        {content}
      </button>
    );
  }

  return content;
});

// Clickable key character with swirl animation
const ClickableKeyCharacter = memo(function ClickableKeyCharacter({
  initialImage,
  x,
  y,
}: {
  initialImage: string;
  x: number;
  y: number;
}) {
  const [currentImage, setCurrentImage] = useState(initialImage);
  const [animationState, setAnimationState] = useState<'idle' | 'swirl-out' | 'swirl-in'>('idle');

  const handleClick = useCallback(() => {
    if (animationState !== 'idle') return; // Prevent clicking during animation

    // Start swirl-out animation
    setAnimationState('swirl-out');

    // After swirl-out completes, change image and swirl-in
    setTimeout(() => {
      // Pick a random different image
      const otherImages = KEY_IMAGES.filter(img => img !== currentImage);
      const newImage = otherImages[Math.floor(Math.random() * otherImages.length)];
      setCurrentImage(newImage);
      setAnimationState('swirl-in');

      // After swirl-in completes, return to idle
      setTimeout(() => {
        setAnimationState('idle');
      }, 400);
    }, 400);
  }, [animationState, currentImage]);

  return (
    <img
      src={currentImage}
      alt="Key character"
      className={`qmi-lesson-key qmi-lesson-key-clickable ${
        animationState === 'swirl-out' ? 'qmi-key-swirl-out' : ''
      } ${
        animationState === 'swirl-in' ? 'qmi-key-swirl-in' : ''
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      onClick={handleClick}
      draggable={false}
    />
  );
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
  onStageClick,
}: QuestMapProps) {
  // Generate random key images for each stage (shuffled on each page load)
  // Use useState + useEffect to avoid hydration mismatch (random must run client-side only)
  const [stageKeyImages, setStageKeyImages] = useState<string[]>([]);

  useEffect(() => {
    const shuffled = shuffleArray(KEY_IMAGES);
    // If we have more stages than images, cycle through
    setStageKeyImages(stages.map((_, index) => shuffled[index % shuffled.length]));
  }, [stages.length]); // Randomize on mount

  // Detect browser zoom and apply inverse scale to keep overlays fixed size
  useEffect(() => {
    // Store the base devicePixelRatio at initial load (assumed 100% zoom)
    const baseRatio = window.devicePixelRatio || 1;

    const updateZoomScale = () => {
      // Calculate current zoom relative to base
      const currentRatio = window.devicePixelRatio || 1;
      const zoomLevel = currentRatio / baseRatio;
      // Apply inverse scale as CSS variable
      document.documentElement.style.setProperty('--zoom-scale', String(1 / zoomLevel));
    };

    updateZoomScale();

    // Use matchMedia for more reliable zoom detection
    const mediaQuery = window.matchMedia(`(resolution: ${baseRatio}dppx)`);
    mediaQuery.addEventListener('change', updateZoomScale);
    window.addEventListener('resize', updateZoomScale);

    return () => {
      mediaQuery.removeEventListener('change', updateZoomScale);
      window.removeEventListener('resize', updateZoomScale);
    };
  }, []);

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
          {/* SVG for curvy colored roads */}
          <svg
            className="qmi-path-svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Gradients for each road segment */}
              {stages.slice(0, -1).map((stage, index) => {
                const fromTheme = stageThemes[stage.id];
                const toTheme = stageThemes[stages[index + 1].id];
                return (
                  <linearGradient
                    key={`grad-${index}`}
                    id={`roadGradient${index}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor={fromTheme.color} />
                    <stop offset="100%" stopColor={toTheme.color} />
                  </linearGradient>
                );
              })}
            </defs>

            {/* Render each road segment */}
            {stages.slice(0, -1).map((stage, index) => {
              const pathD = generateSegmentPath(index, index + 1);
              const isLocked = stage.status === 'locked';

              return (
                <g key={`road-${index}`} className={isLocked ? 'qmi-road-locked' : ''}>
                  {/* Road shadow/outline */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="rgba(0, 0, 0, 0.3)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* Road base (white/light edge) */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Road colored center */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isLocked ? '#9CA3AF' : `url(#roadGradient${index})`}
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="qmi-road-center"
                  />
                  {/* Road dashed line (like road markings) */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.6)"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    strokeDasharray="2 3"
                  />
                </g>
              );
            })}
          </svg>

          {/* Bridge for stage 3→4 path (over water) */}
          <div
            className="qmi-bridge-wrapper"
            style={{
              left: '45.5%',
              top: '78.8125%',
            }}
          >
            <img
              src="/images/bridge.webp"
              alt=""
              className="qmi-bridge"
              style={{
                width: '29.4445vw',
                transform: 'translate(-50%, -50%) rotate(-0.7577deg)',
              }}
              draggable={false}
            />
          </div>

          {/* Lesson markers along paths */}
          {stages.slice(0, -1).map((stage, index) => {
            const theme = stageThemes[stage.id];
            const markers = getLessonMarkers(
              index,
              index + 1,
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

          {/* Key character above current lesson */}
          {stages.slice(0, -1).map((stage, index) => {
            if (stage.status === 'locked') return null;
            const markers = getLessonMarkers(
              index,
              index + 1,
              stage.lessons,
              stage.completedLessons || 0,
              false
            );
            const currentMarker = markers.find(m => m.current);
            if (!currentMarker || !stageKeyImages[index]) return null;

            return (
              <ClickableKeyCharacter
                key={`key-lesson-${stage.id}`}
                initialImage={stageKeyImages[index]}
                x={currentMarker.x}
                y={currentMarker.y}
              />
            );
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
              keyImage={stageKeyImages[index]}
              onClick={onStageClick ? () => onStageClick(stage.id) : undefined}
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
