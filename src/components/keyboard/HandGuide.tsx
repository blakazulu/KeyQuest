'use client';

import { memo } from 'react';
import { type Finger, fingerNames } from '@/data/keyboard-layout';

interface HandGuideProps {
  /** Which finger should be highlighted */
  activeFinger?: Finger;
  /** Locale for finger names */
  locale?: 'en' | 'he';
  /** Additional CSS classes */
  className?: string;
}

// Finger color mapping
const fingerColors: Record<Finger, string> = {
  'left-pinky': '#FF6B9D',
  'left-ring': '#A78BFA',
  'left-middle': '#00B4D8',
  'left-index': '#00D97E',
  'right-index': '#FDE047',
  'right-middle': '#FF7B4A',
  'right-ring': '#FF6B6B',
  'right-pinky': '#A78BFA',
  'thumb': '#94A3B8',
};

/**
 * Left hand SVG component - realistic hand shape
 */
export const LeftHand = memo(function LeftHand({
  activeFinger,
  locale = 'en',
  className = '',
}: HandGuideProps) {
  const isActive = (finger: Finger) => activeFinger === finger;

  const getFingerFill = (finger: Finger) =>
    isActive(finger) ? fingerColors[finger] : '#E8ECF0';

  const getFingerStroke = (finger: Finger) =>
    isActive(finger) ? fingerColors[finger] : '#C8D0D8';

  const getGlow = (finger: Finger) =>
    isActive(finger) ? `drop-shadow(0 0 12px ${fingerColors[finger]})` : 'none';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        viewBox="0 0 140 200"
        className="w-32 h-44"
        aria-label={activeFinger && activeFinger.startsWith('left')
          ? `Use your ${fingerNames[activeFinger][locale]}`
          : 'Left hand'}
      >
        {/* Palm base */}
        <path
          d="M30 140 Q20 120 25 100 L35 95 L105 95 Q115 100 115 120 L110 160 Q100 180 70 185 Q40 180 30 160 Z"
          fill="#F5F7FA"
          stroke="#D8DEE6"
          strokeWidth="1.5"
        />

        {/* Wrist */}
        <path
          d="M45 180 Q70 190 95 180 L95 200 L45 200 Z"
          fill="#F5F7FA"
          stroke="#D8DEE6"
          strokeWidth="1.5"
        />

        {/* Pinky finger */}
        <path
          d="M25 100 Q20 95 20 85 L20 55 Q20 42 28 42 Q36 42 36 55 L36 95 Z"
          fill={getFingerFill('left-pinky')}
          stroke={getFingerStroke('left-pinky')}
          strokeWidth="2"
          style={{ filter: getGlow('left-pinky'), transition: 'all 0.2s ease' }}
        />
        {/* Pinky nail */}
        <rect x="22" y="44" width="10" height="8" rx="2" fill="#FFF" opacity="0.6" />

        {/* Ring finger */}
        <path
          d="M40 95 Q36 90 36 80 L36 35 Q36 20 47 20 Q58 20 58 35 L58 90 Q58 95 55 95 Z"
          fill={getFingerFill('left-ring')}
          stroke={getFingerStroke('left-ring')}
          strokeWidth="2"
          style={{ filter: getGlow('left-ring'), transition: 'all 0.2s ease' }}
        />
        {/* Ring nail */}
        <rect x="40" y="22" width="12" height="10" rx="3" fill="#FFF" opacity="0.6" />

        {/* Middle finger */}
        <path
          d="M60 95 Q56 90 56 80 L56 25 Q56 8 70 8 Q84 8 84 25 L84 85 Q84 95 80 95 Z"
          fill={getFingerFill('left-middle')}
          stroke={getFingerStroke('left-middle')}
          strokeWidth="2"
          style={{ filter: getGlow('left-middle'), transition: 'all 0.2s ease' }}
        />
        {/* Middle nail */}
        <rect x="61" y="10" width="14" height="11" rx="3" fill="#FFF" opacity="0.6" />

        {/* Index finger */}
        <path
          d="M85 95 Q82 90 82 80 L82 40 Q82 25 94 25 Q106 25 106 40 L106 90 Q106 95 102 95 Z"
          fill={getFingerFill('left-index')}
          stroke={getFingerStroke('left-index')}
          strokeWidth="2"
          style={{ filter: getGlow('left-index'), transition: 'all 0.2s ease' }}
        />
        {/* Index nail */}
        <rect x="86" y="27" width="12" height="10" rx="3" fill="#FFF" opacity="0.6" />

        {/* Thumb */}
        <path
          d="M108 95 Q115 90 120 95 L130 115 Q138 130 130 140 Q122 150 112 145 L105 135 Q100 125 105 110 Z"
          fill={getFingerFill('thumb')}
          stroke={getFingerStroke('thumb')}
          strokeWidth="2"
          style={{ filter: getGlow('thumb'), transition: 'all 0.2s ease' }}
        />
        {/* Thumb nail */}
        <ellipse cx="128" cy="122" rx="6" ry="5" fill="#FFF" opacity="0.6" />

        {/* Palm lines for realism */}
        <path d="M45 120 Q60 130 90 115" stroke="#D8DEE6" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M40 140 Q60 145 85 135" stroke="#D8DEE6" strokeWidth="1" fill="none" opacity="0.5" />
      </svg>
      <span className="text-sm text-muted font-medium">
        {locale === 'he' ? 'שמאל' : 'Left'}
      </span>
    </div>
  );
});

/**
 * Right hand SVG component - realistic hand shape (mirrored)
 */
export const RightHand = memo(function RightHand({
  activeFinger,
  locale = 'en',
  className = '',
}: HandGuideProps) {
  const isActive = (finger: Finger) => activeFinger === finger;

  const getFingerFill = (finger: Finger) =>
    isActive(finger) ? fingerColors[finger] : '#E8ECF0';

  const getFingerStroke = (finger: Finger) =>
    isActive(finger) ? fingerColors[finger] : '#C8D0D8';

  const getGlow = (finger: Finger) =>
    isActive(finger) ? `drop-shadow(0 0 12px ${fingerColors[finger]})` : 'none';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        viewBox="0 0 140 200"
        className="w-32 h-44"
        aria-label={activeFinger && activeFinger.startsWith('right')
          ? `Use your ${fingerNames[activeFinger][locale]}`
          : 'Right hand'}
      >
        {/* Palm base */}
        <path
          d="M110 140 Q120 120 115 100 L105 95 L35 95 Q25 100 25 120 L30 160 Q40 180 70 185 Q100 180 110 160 Z"
          fill="#F5F7FA"
          stroke="#D8DEE6"
          strokeWidth="1.5"
        />

        {/* Wrist */}
        <path
          d="M95 180 Q70 190 45 180 L45 200 L95 200 Z"
          fill="#F5F7FA"
          stroke="#D8DEE6"
          strokeWidth="1.5"
        />

        {/* Thumb */}
        <path
          d="M32 95 Q25 90 20 95 L10 115 Q2 130 10 140 Q18 150 28 145 L35 135 Q40 125 35 110 Z"
          fill={getFingerFill('thumb')}
          stroke={getFingerStroke('thumb')}
          strokeWidth="2"
          style={{ filter: getGlow('thumb'), transition: 'all 0.2s ease' }}
        />
        {/* Thumb nail */}
        <ellipse cx="12" cy="122" rx="6" ry="5" fill="#FFF" opacity="0.6" />

        {/* Index finger */}
        <path
          d="M55 95 Q58 90 58 80 L58 40 Q58 25 46 25 Q34 25 34 40 L34 90 Q34 95 38 95 Z"
          fill={getFingerFill('right-index')}
          stroke={getFingerStroke('right-index')}
          strokeWidth="2"
          style={{ filter: getGlow('right-index'), transition: 'all 0.2s ease' }}
        />
        {/* Index nail */}
        <rect x="38" y="27" width="12" height="10" rx="3" fill="#FFF" opacity="0.6" />

        {/* Middle finger */}
        <path
          d="M80 95 Q84 90 84 80 L84 25 Q84 8 70 8 Q56 8 56 25 L56 85 Q56 95 60 95 Z"
          fill={getFingerFill('right-middle')}
          stroke={getFingerStroke('right-middle')}
          strokeWidth="2"
          style={{ filter: getGlow('right-middle'), transition: 'all 0.2s ease' }}
        />
        {/* Middle nail */}
        <rect x="61" y="10" width="14" height="11" rx="3" fill="#FFF" opacity="0.6" />

        {/* Ring finger */}
        <path
          d="M100 95 Q104 90 104 80 L104 35 Q104 20 93 20 Q82 20 82 35 L82 90 Q82 95 85 95 Z"
          fill={getFingerFill('right-ring')}
          stroke={getFingerStroke('right-ring')}
          strokeWidth="2"
          style={{ filter: getGlow('right-ring'), transition: 'all 0.2s ease' }}
        />
        {/* Ring nail */}
        <rect x="86" y="22" width="12" height="10" rx="3" fill="#FFF" opacity="0.6" />

        {/* Pinky finger */}
        <path
          d="M115 100 Q120 95 120 85 L120 55 Q120 42 112 42 Q104 42 104 55 L104 95 Z"
          fill={getFingerFill('right-pinky')}
          stroke={getFingerStroke('right-pinky')}
          strokeWidth="2"
          style={{ filter: getGlow('right-pinky'), transition: 'all 0.2s ease' }}
        />
        {/* Pinky nail */}
        <rect x="106" y="44" width="10" height="8" rx="2" fill="#FFF" opacity="0.6" />

        {/* Palm lines for realism */}
        <path d="M95 120 Q80 130 50 115" stroke="#D8DEE6" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M100 140 Q80 145 55 135" stroke="#D8DEE6" strokeWidth="1" fill="none" opacity="0.5" />
      </svg>
      <span className="text-sm text-muted font-medium">
        {locale === 'he' ? 'ימין' : 'Right'}
      </span>
    </div>
  );
});

/**
 * Combined keyboard with hands on both sides
 */
export const HandsWithKeyboard = memo(function HandsWithKeyboard({
  activeFinger,
  locale = 'en',
  children,
  className = '',
}: HandGuideProps & { children: React.ReactNode }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <LeftHand activeFinger={activeFinger} locale={locale} />
      <div className="flex-shrink-0">{children}</div>
      <RightHand activeFinger={activeFinger} locale={locale} />
    </div>
  );
});
