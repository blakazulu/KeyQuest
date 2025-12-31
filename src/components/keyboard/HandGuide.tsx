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

// Map finger types to part names
type FingerPart = 'pinky' | 'ring' | 'middle' | 'index' | 'thumb';

const fingerToPartMap: Record<Finger, FingerPart> = {
  'left-pinky': 'pinky',
  'left-ring': 'ring',
  'left-middle': 'middle',
  'left-index': 'index',
  'right-pinky': 'pinky',
  'right-ring': 'ring',
  'right-middle': 'middle',
  'right-index': 'index',
  'thumb': 'thumb',
};

// Professional hand path (palm facing up, thumb on right for right hand)
const HAND_PATH = "m323.53 65.156c-8.0951-0.06253-16.241 7.976-18.812 30.438l-3.8438 48.875-2.7812 43.281 0.34375 52c-2.297 11.259-8.4753 10.924-15.375 8.375-29.131-36.268-32.562-92.352-52.344-134.72-18.143-27.991-32.124-17.064-37 6.9688 3.0974 19.957 6.7861 32.721 10.812 41.531l7.35 27.59c3.6068 17.106 7.2057 35.402 10.812 45.375l7.3438 30 9.75 48.875c1.58 12.161 2.4705 24.085-4.1875 33.5 0 0-41.145-3.4859-40.844-9.0625-14.389-18.581-31.12-31.514-46.344-41.656-24.237-16.147-47.831-10.358-49.844 0.65625-0.94095 5.1493 5.0091 9.3001 11.375 15.531 6.9188 2.9357 11.238 12.264 17.344 19.281 6.6825 7.6801 11.123 17.456 19.625 23.938 10.243 7.8085 15.254 20.987 22.719 30.406 11.76 28.443 25.19 52.447 43.625 65.969 34.385 29.203 43.563 58.28 56.219 88.656 2.2444 6.9 4.5722 13.051 6.125 19.031l134.16-0.01c-4.3533-26.298-8.1065-56.359-9.75-100 1.2178-6.0191 1.2384-11.428 5.9375-19.188 10.65-22.858 15.984-48.39 19.531-81 2.3133-21.268 9.0155-29.613 12.562-37.688 0.42485 1.0217 23.156-26.071 42.438-53.5 11.928-16.967 24.73-32.958 26.344-34.469 5.9857-5.6043 13.216-24.733 11.875-24.062 8.0301-16.64-0.3213-18.797-16.406-15.031-10.177 6.2584-18.111 15.888-26.531 24.781-20.605 20.747-38.856 41.89-64.594 61.781-13.637 2.9548-16.384-0.77158-16.75-15.344l8.75-33.5 5.9062-25.125c2.3415-35.021 10.017-55.887 15.031-83.781 1.8104-36.113-27.722-31.926-33.875-13.969l-11.156 48.875-5.5938 24.062-17.438 54.469c-6.6212 6.6662-14.82 19.175-14.312 0l2.77-29.66c-1.3883-13.733-2.4275-29.406-2.0938-44-2.3554-27.065-1.8224-50.652 0-71.562 1.837-13.397-8.467-26.857-18.875-26.938z";

// Right hand overlay positions (thumb LEFT, pinky RIGHT)
const RIGHT_FINGER_OVERLAYS = {
  thumb: { cx: 135, cy: 320, rx: 45, ry: 55, rotate: -35 },
  index: { cx: 220, cy: 170, rx: 24, ry: 75, rotate: -15 },
  middle: { cx: 320, cy: 140, rx: 24, ry: 80, rotate: 0 },
  ring: { cx: 400, cy: 160, rx: 22, ry: 70, rotate: 10 },
  pinky: { cx: 490, cy: 230, rx: 20, ry: 60, rotate: 35 },
};

// Left hand overlay positions (adjusted to match mirrored SVG)
const LEFT_FINGER_OVERLAYS = {
  pinky: { cx: 125, cy: 230, rx: 20, ry: 60, rotate: -35 },
  ring: { cx: 210, cy: 160, rx: 22, ry: 70, rotate: -10 },
  middle: { cx: 290, cy: 140, rx: 24, ry: 80, rotate: 0 },
  index: { cx: 385, cy: 170, rx: 24, ry: 75, rotate: 15 },
  thumb: { cx: 470, cy: 320, rx: 45, ry: 55, rotate: 35 },
};

interface FingerOverlayProps {
  overlay: { cx: number; cy: number; rx: number; ry: number; rotate: number };
  activeColor: string;
}

const FingerOverlay = memo(function FingerOverlay({ overlay, activeColor }: FingerOverlayProps) {
  return (
    <ellipse
      cx={overlay.cx}
      cy={overlay.cy}
      rx={overlay.rx}
      ry={overlay.ry}
      fill={activeColor}
      opacity="0.55"
      transform={overlay.rotate !== 0 ? `rotate(${overlay.rotate} ${overlay.cx} ${overlay.cy})` : undefined}
      style={{
        filter: `drop-shadow(0 0 12px ${activeColor})`,
      }}
    />
  );
});

/**
 * Left hand SVG component with individual finger highlighting
 */
export const LeftHand = memo(function LeftHand({
  activeFinger,
  locale = 'en',
  className = '',
}: HandGuideProps) {
  const isLeftHand = activeFinger?.startsWith('left');
  const isThumb = activeFinger === 'thumb';
  const activePart = activeFinger ? fingerToPartMap[activeFinger] : undefined;
  const activeColor = activeFinger ? fingerColors[activeFinger] : undefined;

  const showOverlay = (isLeftHand || isThumb) && activePart && activeColor;

  // DEBUG: Show all fingers at once for positioning
  const DEBUG_MODE = false;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        viewBox="0 0 610 610"
        className="w-40 h-52"
        aria-label={activeFinger && activeFinger.startsWith('left')
          ? `Use your ${fingerNames[activeFinger][locale]}`
          : locale === 'he' ? 'יד שמאל' : 'Left hand'}
      >
        {/* Professional hand base (mirrored for left hand) */}
        <g transform="translate(610, 0) scale(-1, 1)">
          <path
            d={HAND_PATH}
            fill="#E8ECF0"
            stroke="#C8D0D8"
            strokeWidth="6"
          />
        </g>

        {/* DEBUG: Show all finger overlays */}
        {DEBUG_MODE ? (
          <>
            <FingerOverlay overlay={LEFT_FINGER_OVERLAYS.pinky} activeColor={fingerColors['left-pinky']} />
            <FingerOverlay overlay={LEFT_FINGER_OVERLAYS.ring} activeColor={fingerColors['left-ring']} />
            <FingerOverlay overlay={LEFT_FINGER_OVERLAYS.middle} activeColor={fingerColors['left-middle']} />
            <FingerOverlay overlay={LEFT_FINGER_OVERLAYS.index} activeColor={fingerColors['left-index']} />
            <FingerOverlay overlay={LEFT_FINGER_OVERLAYS.thumb} activeColor={fingerColors['thumb']} />
          </>
        ) : (
          showOverlay && (
            <FingerOverlay
              overlay={LEFT_FINGER_OVERLAYS[activePart]}
              activeColor={activeColor}
            />
          )
        )}
      </svg>
      <span className="text-sm text-muted font-medium mt-1">
        {locale === 'he' ? 'שמאל' : 'Left'}
      </span>
      {showOverlay && activeFinger && (
        <span
          className="text-xs font-semibold mt-1 px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${activeColor}20`,
            color: activeColor,
          }}
        >
          {fingerNames[activeFinger][locale]}
        </span>
      )}
    </div>
  );
});

/**
 * Right hand SVG component with individual finger highlighting
 */
export const RightHand = memo(function RightHand({
  activeFinger,
  locale = 'en',
  className = '',
}: HandGuideProps) {
  const isRightHand = activeFinger?.startsWith('right');
  const isThumb = activeFinger === 'thumb';
  const activePart = activeFinger ? fingerToPartMap[activeFinger] : undefined;
  const activeColor = activeFinger ? fingerColors[activeFinger] : undefined;

  const showOverlay = (isRightHand || isThumb) && activePart && activeColor;

  // DEBUG: Show all fingers at once for positioning
  const DEBUG_MODE = false;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        viewBox="0 0 610 610"
        className="w-40 h-52"
        aria-label={activeFinger && activeFinger.startsWith('right')
          ? `Use your ${fingerNames[activeFinger][locale]}`
          : locale === 'he' ? 'יד ימין' : 'Right hand'}
      >
        {/* Professional hand base */}
        <path
          d={HAND_PATH}
          fill="#E8ECF0"
          stroke="#C8D0D8"
          strokeWidth="6"
        />

        {/* DEBUG: Show all finger overlays */}
        {DEBUG_MODE ? (
          <>
            <FingerOverlay overlay={RIGHT_FINGER_OVERLAYS.pinky} activeColor={fingerColors['right-pinky']} />
            <FingerOverlay overlay={RIGHT_FINGER_OVERLAYS.ring} activeColor={fingerColors['right-ring']} />
            <FingerOverlay overlay={RIGHT_FINGER_OVERLAYS.middle} activeColor={fingerColors['right-middle']} />
            <FingerOverlay overlay={RIGHT_FINGER_OVERLAYS.index} activeColor={fingerColors['right-index']} />
            <FingerOverlay overlay={RIGHT_FINGER_OVERLAYS.thumb} activeColor={fingerColors['thumb']} />
          </>
        ) : (
          showOverlay && (
            <FingerOverlay
              overlay={RIGHT_FINGER_OVERLAYS[activePart]}
              activeColor={activeColor}
            />
          )
        )}
      </svg>
      <span className="text-sm text-muted font-medium mt-1">
        {locale === 'he' ? 'ימין' : 'Right'}
      </span>
      {showOverlay && activeFinger && (
        <span
          className="text-xs font-semibold mt-1 px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${activeColor}20`,
            color: activeColor,
          }}
        >
          {fingerNames[activeFinger][locale]}
        </span>
      )}
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
    <div className={`flex items-start justify-center gap-6 ${className}`}>
      <LeftHand activeFinger={activeFinger} locale={locale} />
      <div className="flex-shrink-0">{children}</div>
      <RightHand activeFinger={activeFinger} locale={locale} />
    </div>
  );
});
