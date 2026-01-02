'use client';

import { useEffect, useState } from 'react';

interface CalmBackgroundProps {
  /** Whether animations are enabled (respects reduced motion) */
  animate?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Cheerful illustrated background for Calm Mode.
 * Features a friendly landscape with sky, sun, clouds, hills, and trees.
 */
export function CalmBackground({
  animate = true,
  className = '',
}: CalmBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const shouldAnimate = animate && !prefersReducedMotion;

  return (
    <div
      className={`fixed inset-0 overflow-hidden -z-10 ${className}`}
      aria-hidden="true"
    >
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #87CEEB 0%, #B0E0E6 40%, #E0F4FF 100%)',
        }}
      />

      {/* SVG Scene */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dark overlay gradient on entire background - darker at bottom for keyboard/stats */}
        <defs>
          <linearGradient id="darkOverlay" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="50%" stopColor="#000000" stopOpacity="0.1" />
            <stop offset="75%" stopColor="#000000" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1920" height="1080" fill="url(#darkOverlay)" />

        {/* Sun - Top Left */}
        <g className={shouldAnimate ? 'calm-sun-glow' : ''} transform="translate(160, 200)">
          {/* Sun rays */}
          <g className={shouldAnimate ? 'calm-sun-rays' : ''}>
            {[...Array(12)].map((_, i) => (
              <line
                key={i}
                x1="0"
                y1="0"
                x2="0"
                y2="-80"
                stroke="#FFD93D"
                strokeWidth="8"
                strokeLinecap="round"
                transform={`rotate(${i * 30})`}
                opacity="0.8"
              />
            ))}
          </g>
          {/* Sun circle */}
          <circle cx="0" cy="0" r="70" fill="#FFD93D" />
          <circle cx="0" cy="0" r="60" fill="#FFEB3B" />
          {/* Sun face */}
          <circle cx="-20" cy="-10" r="8" fill="#F59E0B" /> {/* Left eye */}
          <circle cx="20" cy="-10" r="8" fill="#F59E0B" /> {/* Right eye */}
          <path
            d="M -20 15 Q 0 35 20 15"
            stroke="#F59E0B"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          /> {/* Smile */}
        </g>

        {/* Clouds */}
        <g className={shouldAnimate ? 'calm-cloud-float' : ''}>
          {/* Cloud 1 - Left */}
          <g transform="translate(250, 180)">
            <ellipse cx="0" cy="0" rx="60" ry="40" fill="white" />
            <ellipse cx="50" cy="10" rx="50" ry="35" fill="white" />
            <ellipse cx="-40" cy="15" rx="45" ry="30" fill="white" />
            <ellipse cx="20" cy="-15" rx="40" ry="30" fill="white" />
            {/* Cloud face */}
            <circle cx="0" cy="5" r="5" fill="#CBD5E1" />
            <circle cx="25" cy="5" r="5" fill="#CBD5E1" />
            <path d="M 5 20 Q 12 28 20 20" stroke="#CBD5E1" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>

          {/* Cloud 2 - Right */}
          <g transform="translate(1550, 210)" className={shouldAnimate ? 'calm-cloud-float-delayed' : ''}>
            <ellipse cx="0" cy="0" rx="55" ry="35" fill="white" />
            <ellipse cx="45" cy="8" rx="45" ry="30" fill="white" />
            <ellipse cx="-35" cy="12" rx="40" ry="28" fill="white" />
            <ellipse cx="15" cy="-12" rx="35" ry="25" fill="white" />
            {/* Cloud face */}
            <circle cx="-5" cy="5" r="4" fill="#CBD5E1" />
            <circle cx="18" cy="5" r="4" fill="#CBD5E1" />
            <path d="M 0 18 Q 6 24 13 18" stroke="#CBD5E1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>

          {/* Cloud 3 - Center small */}
          <g transform="translate(750, 160)">
            <ellipse cx="0" cy="0" rx="35" ry="22" fill="white" opacity="0.9" />
            <ellipse cx="28" cy="5" rx="28" ry="18" fill="white" opacity="0.9" />
            <ellipse cx="-22" cy="8" rx="25" ry="16" fill="white" opacity="0.9" />
          </g>

          {/* Cloud 4 - Right of sun */}
          <g transform="translate(1200, 150)">
            <ellipse cx="0" cy="0" rx="40" ry="25" fill="white" opacity="0.9" />
            <ellipse cx="32" cy="6" rx="32" ry="20" fill="white" opacity="0.9" />
            <ellipse cx="-25" cy="10" rx="28" ry="18" fill="white" opacity="0.9" />
          </g>
        </g>

        {/* Rolling Hills - Back layer */}
        <path
          d="M 0 650
             Q 300 550 600 620
             Q 900 700 1200 600
             Q 1500 500 1920 580
             L 1920 1080 L 0 1080 Z"
          fill="#90BE6D"
        />

        {/* Rolling Hills - Middle layer */}
        <path
          d="M 0 750
             Q 250 680 500 730
             Q 800 800 1100 720
             Q 1400 640 1700 700
             Q 1850 740 1920 720
             L 1920 1080 L 0 1080 Z"
          fill="#AAD576"
        />

        {/* Rolling Hills - Front layer */}
        <path
          d="M 0 850
             Q 200 800 450 840
             Q 700 890 950 830
             Q 1200 770 1450 820
             Q 1700 870 1920 830
             L 1920 1080 L 0 1080 Z"
          fill="#C5E898"
        />

        {/* Ground/Grass layer */}
        <rect x="0" y="950" width="1920" height="130" fill="#D4F1A8" />

        {/* Left Tree */}
        <g transform="translate(180, 650)">
          {/* Tree trunk */}
          <path
            d="M 0 0 L 30 0 L 25 180 L 5 180 Z"
            fill="#8B5A2B"
          />
          <path
            d="M 0 0 L 30 0 L 25 180 L 5 180 Z"
            fill="#A0522D"
            opacity="0.5"
          />
          {/* Trunk face */}
          <circle cx="10" cy="80" r="6" fill="#5D3A1A" />
          <circle cx="22" cy="80" r="6" fill="#5D3A1A" />
          <path d="M 8 105 Q 16 118 24 105" stroke="#5D3A1A" strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* Tree foliage */}
          <ellipse cx="15" cy="-60" rx="90" ry="70" fill="#4CAF50" />
          <ellipse cx="-30" cy="-30" rx="60" ry="50" fill="#66BB6A" />
          <ellipse cx="60" cy="-30" rx="60" ry="50" fill="#66BB6A" />
          <ellipse cx="15" cy="-100" rx="70" ry="55" fill="#81C784" />
          <ellipse cx="-20" cy="-80" rx="50" ry="40" fill="#A5D6A7" />
          <ellipse cx="50" cy="-80" rx="50" ry="40" fill="#A5D6A7" />
        </g>

        {/* Right Tree */}
        <g transform="translate(1680, 680)">
          {/* Tree trunk */}
          <path
            d="M 0 0 L 35 0 L 30 160 L 5 160 Z"
            fill="#8B5A2B"
          />
          <path
            d="M 0 0 L 35 0 L 30 160 L 5 160 Z"
            fill="#A0522D"
            opacity="0.5"
          />
          {/* Trunk face */}
          <circle cx="12" cy="70" r="5" fill="#5D3A1A" />
          <circle cx="25" cy="70" r="5" fill="#5D3A1A" />
          <path d="M 10 92 Q 18 103 26 92" stroke="#5D3A1A" strokeWidth="3.5" fill="none" strokeLinecap="round" />

          {/* Tree foliage */}
          <ellipse cx="17" cy="-50" rx="85" ry="65" fill="#4CAF50" />
          <ellipse cx="-25" cy="-25" rx="55" ry="45" fill="#66BB6A" />
          <ellipse cx="55" cy="-25" rx="55" ry="45" fill="#66BB6A" />
          <ellipse cx="17" cy="-90" rx="65" ry="50" fill="#81C784" />
          <ellipse cx="-15" cy="-70" rx="45" ry="35" fill="#A5D6A7" />
          <ellipse cx="45" cy="-70" rx="45" ry="35" fill="#A5D6A7" />
        </g>

        {/* Grass tufts */}
        <g fill="#7CB342">
          {[...Array(20)].map((_, i) => (
            <g key={i} transform={`translate(${80 + i * 95}, 980)`}>
              <path d="M 0 0 Q -5 -20 0 -35 Q 5 -20 0 0" />
              <path d="M 8 0 Q 3 -15 10 -28 Q 15 -15 8 0" />
              <path d="M -8 0 Q -13 -18 -6 -30 Q 0 -18 -8 0" />
            </g>
          ))}
        </g>

      </svg>

      {/* Subtle paper texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

/**
 * Simple version without SVG elements
 */
export function CalmBackgroundSimple({ className = '' }: { className?: string }) {
  return (
    <div
      className={`fixed inset-0 -z-10 ${className}`}
      style={{
        background: 'linear-gradient(to bottom, #87CEEB 0%, #90BE6D 60%, #C5E898 100%)',
      }}
      aria-hidden="true"
    />
  );
}
