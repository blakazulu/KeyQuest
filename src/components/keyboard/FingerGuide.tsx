'use client';

import { memo } from 'react';
import { type Finger, fingerToClass, fingerNames } from '@/data/keyboard-layout';

interface FingerGuideProps {
  /** Which finger should be highlighted */
  activeFinger?: Finger;
  /** Locale for finger names */
  locale?: 'en' | 'he';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Visual guide showing which finger to use for the current key.
 * Displays stylized hands with the active finger highlighted.
 */
export const FingerGuide = memo(function FingerGuide({
  activeFinger,
  locale = 'en',
  size = 'md',
  className = '',
}: FingerGuideProps) {
  const sizeClasses = {
    sm: 'h-16',
    md: 'h-24',
    lg: 'h-32',
  };

  const fingerSizes = {
    sm: { width: 8, height: 20 },
    md: { width: 12, height: 32 },
    lg: { width: 16, height: 44 },
  };

  const { width: fingerWidth, height: fingerHeight } = fingerSizes[size];

  // Finger positions for left and right hands
  const leftFingers: { finger: Finger; offset: number; heightMod: number }[] = [
    { finger: 'left-pinky', offset: 0, heightMod: 0.7 },
    { finger: 'left-ring', offset: 1, heightMod: 0.9 },
    { finger: 'left-middle', offset: 2, heightMod: 1 },
    { finger: 'left-index', offset: 3, heightMod: 0.85 },
  ];

  const rightFingers: { finger: Finger; offset: number; heightMod: number }[] = [
    { finger: 'right-index', offset: 0, heightMod: 0.85 },
    { finger: 'right-middle', offset: 1, heightMod: 1 },
    { finger: 'right-ring', offset: 2, heightMod: 0.9 },
    { finger: 'right-pinky', offset: 3, heightMod: 0.7 },
  ];

  const renderFinger = (
    finger: Finger,
    offset: number,
    heightMod: number,
    isThumb = false
  ) => {
    const isActive = activeFinger === finger;
    const fingerClass = isActive ? fingerToClass[finger] : 'bg-surface-raised';

    return (
      <div
        key={finger}
        className={`
          rounded-t-full transition-all duration-150
          ${fingerClass}
          ${isActive ? 'ring-2 ring-white ring-opacity-50 scale-105' : 'opacity-60'}
          ${isThumb ? 'rounded-full' : ''}
        `}
        style={{
          width: isThumb ? fingerWidth * 1.2 : fingerWidth,
          height: isThumb ? fingerWidth * 1.2 : fingerHeight * heightMod,
          marginLeft: offset > 0 ? 2 : 0,
        }}
        title={fingerNames[finger][locale]}
        aria-label={isActive ? `Active finger: ${fingerNames[finger][locale]}` : undefined}
      />
    );
  };

  return (
    <div
      className={`flex items-end justify-center gap-8 ${sizeClasses[size]} ${className}`}
      dir="ltr"
      role="img"
      aria-label={
        activeFinger
          ? `Use your ${fingerNames[activeFinger][locale]}`
          : 'Finger placement guide'
      }
    >
      {/* Left hand */}
      <div className="flex flex-col items-center">
        <div className="flex items-end">
          {leftFingers.map(({ finger, offset, heightMod }) =>
            renderFinger(finger, offset, heightMod)
          )}
        </div>
        {/* Left thumb */}
        <div className="mt-1 flex justify-end w-full pr-2">
          {activeFinger === 'thumb' && renderFinger('thumb', 0, 1, true)}
        </div>
        <span className="text-caption text-muted mt-1">
          {locale === 'he' ? 'שמאל' : 'Left'}
        </span>
      </div>

      {/* Right hand */}
      <div className="flex flex-col items-center">
        <div className="flex items-end">
          {rightFingers.map(({ finger, offset, heightMod }) =>
            renderFinger(finger, offset, heightMod)
          )}
        </div>
        {/* Right thumb */}
        <div className="mt-1 flex justify-start w-full pl-2">
          {activeFinger === 'thumb' && renderFinger('thumb', 0, 1, true)}
        </div>
        <span className="text-caption text-muted mt-1">
          {locale === 'he' ? 'ימין' : 'Right'}
        </span>
      </div>
    </div>
  );
});

/**
 * Simple finger indicator showing just the active finger name and color.
 */
export const FingerIndicator = memo(function FingerIndicator({
  activeFinger,
  locale = 'en',
  className = '',
}: Omit<FingerGuideProps, 'size'>) {
  if (!activeFinger) return null;

  const fingerClass = fingerToClass[activeFinger];
  const fingerName = fingerNames[activeFinger][locale];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border ${className}`}
      dir="ltr"
    >
      <span
        className={`w-3 h-3 rounded-full ${fingerClass}`}
        aria-hidden="true"
      />
      <span className="text-body-sm font-medium">{fingerName}</span>
    </div>
  );
});
