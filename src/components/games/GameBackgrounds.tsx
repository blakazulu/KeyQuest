'use client';

import { useEffect, useState } from 'react';

interface GameBackgroundProps {
  animate?: boolean;
  className?: string;
}

/**
 * Arcade-style background for the Games Hub - Neon retro arcade theme
 */
export function ArcadeBackground({ animate = true, className = '' }: GameBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const shouldAnimate = animate && !prefersReducedMotion;

  return (
    <div className={`fixed inset-0 overflow-hidden -z-10 ${className}`} aria-hidden="true">
      {/* Deep space gradient with purple/blue tones */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #1a0a2e 0%, #0a0a1a 50%, #050510 100%)',
        }}
      />

      {/* Animated perspective grid floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[60%]"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(139, 92, 246, 0.1) 100%)',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      >
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="arcade-floor-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="1" />
            </pattern>
            <linearGradient id="grid-fade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>
            <mask id="grid-mask">
              <rect width="100%" height="100%" fill="url(#grid-fade)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#arcade-floor-grid)" mask="url(#grid-mask)" />
        </svg>
      </div>

      {/* Neon horizon line */}
      <div
        className="absolute left-0 right-0 h-1"
        style={{
          top: '55%',
          background: 'linear-gradient(90deg, transparent 0%, #f472b6 20%, #8b5cf6 50%, #06b6d4 80%, transparent 100%)',
          boxShadow: '0 0 30px 10px rgba(139, 92, 246, 0.5), 0 0 60px 20px rgba(244, 114, 182, 0.3)',
        }}
      />

      {/* Twinkling stars */}
      <div className="absolute inset-0">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-white ${shouldAnimate && i % 2 === 0 ? 'animate-twinkle' : ''}`}
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Shooting stars */}
      {shouldAnimate && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-32 h-px animate-shooting-star"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                top: `${10 + i * 15}%`,
                left: '-10%',
                animationDelay: `${i * 3}s`,
                animationDuration: `${4 + i}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Large glowing orbs */}
      <div className="absolute inset-0">
        <div
          className={`absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-30 ${shouldAnimate ? 'animate-pulse-slow' : ''}`}
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', top: '-10%', left: '-5%' }}
        />
        <div
          className={`absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-25 ${shouldAnimate ? 'animate-pulse-slow' : ''}`}
          style={{ background: 'radial-gradient(circle, #f472b6 0%, transparent 70%)', top: '20%', right: '-10%', animationDelay: '1.5s' }}
        />
        <div
          className={`absolute w-[350px] h-[350px] rounded-full blur-[70px] opacity-20 ${shouldAnimate ? 'animate-pulse-slow' : ''}`}
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', bottom: '10%', left: '20%', animationDelay: '2.5s' }}
        />
      </div>

      {/* Floating neon game icons with glow */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { emoji: '🎮', x: 5, y: 15, size: 'text-6xl', delay: 0 },
          { emoji: '🕹️', x: 85, y: 10, size: 'text-5xl', delay: 0.5 },
          { emoji: '👾', x: 15, y: 70, size: 'text-5xl', delay: 1 },
          { emoji: '🏆', x: 75, y: 65, size: 'text-6xl', delay: 1.5 },
          { emoji: '⭐', x: 50, y: 8, size: 'text-4xl', delay: 2 },
          { emoji: '🎯', x: 90, y: 40, size: 'text-5xl', delay: 2.5 },
          { emoji: '🚀', x: 8, y: 45, size: 'text-5xl', delay: 3 },
          { emoji: '💎', x: 70, y: 30, size: 'text-4xl', delay: 3.5 },
          { emoji: '🔥', x: 30, y: 25, size: 'text-4xl', delay: 4 },
          { emoji: '⚡', x: 60, y: 75, size: 'text-5xl', delay: 4.5 },
        ].map((icon, i) => (
          <span
            key={i}
            className={`absolute ${icon.size} ${shouldAnimate ? 'animate-float-icon' : ''}`}
            style={{
              left: `${icon.x}%`,
              top: `${icon.y}%`,
              opacity: 0.15,
              filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))',
              animationDelay: `${icon.delay}s`,
            }}
          >
            {icon.emoji}
          </span>
        ))}
      </div>

      {/* Neon arcade machine silhouettes at bottom */}
      <svg className="absolute bottom-0 left-0 right-0 h-32 opacity-20" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="machine-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Arcade machine silhouettes */}
        <g fill="url(#machine-glow)">
          <rect x="5%" y="60" width="60" height="80" rx="5" />
          <rect x="5%" y="40" width="60" height="25" rx="3" />
          <rect x="20%" y="50" width="70" height="90" rx="5" />
          <rect x="20%" y="25" width="70" height="30" rx="3" />
          <rect x="75%" y="55" width="65" height="85" rx="5" />
          <rect x="75%" y="35" width="65" height="25" rx="3" />
          <rect x="88%" y="60" width="55" height="80" rx="5" />
          <rect x="88%" y="42" width="55" height="22" rx="3" />
        </g>
      </svg>

      {/* Retro scanlines overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
}

/**
 * Racing theme background with road and sky
 */
export function RaceBackground({ animate = true, className = '' }: GameBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const shouldAnimate = animate && !prefersReducedMotion;

  return (
    <div className={`fixed inset-0 overflow-hidden -z-10 ${className}`} aria-hidden="true">
      {/* Sky gradient - sunset racing vibe */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #0f172a 0%, #1e3a5f 30%, #f97316 70%, #fbbf24 100%)',
        }}
      />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        {/* Stars in sky */}
        {[...Array(30)].map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * 1920}
            cy={Math.random() * 400}
            r={Math.random() * 2 + 1}
            fill="white"
            opacity={Math.random() * 0.5 + 0.3}
          />
        ))}

        {/* Sun/Moon */}
        <circle cx="1600" cy="300" r="80" fill="#fcd34d" opacity="0.9" />
        <circle cx="1600" cy="300" r="70" fill="#fbbf24" />

        {/* Mountains silhouette */}
        <path
          d="M 0 600 L 300 400 L 500 550 L 800 350 L 1000 500 L 1300 380 L 1600 520 L 1920 420 L 1920 700 L 0 700 Z"
          fill="#1e293b"
          opacity="0.8"
        />

        {/* Hills */}
        <path
          d="M 0 650 Q 400 550 800 630 Q 1200 720 1600 620 Q 1800 570 1920 600 L 1920 800 L 0 800 Z"
          fill="#374151"
        />

        {/* Road */}
        <path
          d="M 700 1080 L 800 700 L 1120 700 L 1220 1080 Z"
          fill="#4b5563"
        />
        <path
          d="M 750 1080 L 840 720 L 1080 720 L 1170 1080 Z"
          fill="#374151"
        />

        {/* Road markings */}
        <g className={shouldAnimate ? 'animate-road-scroll' : ''}>
          {[...Array(10)].map((_, i) => (
            <rect
              key={i}
              x="945"
              y={720 + i * 50}
              width="30"
              height="25"
              fill="#fbbf24"
              opacity="0.9"
            />
          ))}
        </g>

        {/* Finish line pattern */}
        <g transform="translate(830, 700)">
          {[...Array(8)].map((_, i) => (
            <rect
              key={i}
              x={(i % 2) * 30}
              y={Math.floor(i / 2) * 15}
              width="30"
              height="15"
              fill={i % 2 === 0 ? 'white' : 'black'}
            />
          ))}
        </g>
      </svg>

      {/* Speed lines effect */}
      {shouldAnimate && (
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent animate-speed-line"
              style={{
                width: `${100 + i * 50}px`,
                top: `${30 + i * 15}%`,
                left: '-200px',
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Target shooting theme - night sky with targets
 */
export function TargetBackground({ animate = true, className = '' }: GameBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const shouldAnimate = animate && !prefersReducedMotion;

  return (
    <div className={`fixed inset-0 overflow-hidden -z-10 ${className}`} aria-hidden="true">
      {/* Deep space gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0d0d1a 50%, #000000 100%)',
        }}
      />

      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-white ${shouldAnimate && i % 3 === 0 ? 'animate-twinkle' : ''}`}
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Target rings decoration */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <radialGradient id="target-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Large decorative targets */}
        <g transform="translate(200, 200)" opacity="0.3">
          <circle cx="0" cy="0" r="80" fill="none" stroke="#ef4444" strokeWidth="8" />
          <circle cx="0" cy="0" r="55" fill="none" stroke="#ffffff" strokeWidth="6" />
          <circle cx="0" cy="0" r="30" fill="none" stroke="#ef4444" strokeWidth="6" />
          <circle cx="0" cy="0" r="10" fill="#ef4444" />
        </g>
        <g transform="translate(1700, 600)" opacity="0.2">
          <circle cx="0" cy="0" r="100" fill="none" stroke="#ef4444" strokeWidth="10" />
          <circle cx="0" cy="0" r="70" fill="none" stroke="#ffffff" strokeWidth="8" />
          <circle cx="0" cy="0" r="40" fill="none" stroke="#ef4444" strokeWidth="8" />
          <circle cx="0" cy="0" r="15" fill="#ef4444" />
        </g>
      </svg>

      {/* Crosshair overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="white" strokeWidth="1" />
          <line x1="100" y1="0" x2="100" y2="200" stroke="white" strokeWidth="1" />
          <line x1="0" y1="100" x2="200" y2="100" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      {/* Glowing particles */}
      {shouldAnimate && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-red-500 animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.3,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Tower builder theme - construction site sky
 */
export function TowerBackground({ animate = true, className = '' }: GameBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const shouldAnimate = animate && !prefersReducedMotion;

  return (
    <div className={`fixed inset-0 overflow-hidden -z-10 ${className}`} aria-hidden="true">
      {/* Warm construction sky */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #fef3c7 0%, #fcd34d 40%, #f59e0b 80%, #d97706 100%)',
        }}
      />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        {/* Sun */}
        <circle cx="960" cy="200" r="120" fill="#fef08a" opacity="0.8" />
        <circle cx="960" cy="200" r="100" fill="#fde047" />

        {/* Clouds */}
        <g opacity="0.8">
          <ellipse cx="300" cy="180" rx="80" ry="40" fill="white" />
          <ellipse cx="360" cy="170" rx="60" ry="35" fill="white" />
          <ellipse cx="240" cy="185" rx="50" ry="30" fill="white" />
        </g>
        <g opacity="0.7">
          <ellipse cx="1500" cy="220" rx="90" ry="45" fill="white" />
          <ellipse cx="1570" cy="210" rx="70" ry="40" fill="white" />
          <ellipse cx="1430" cy="225" rx="55" ry="32" fill="white" />
        </g>

        {/* City skyline silhouette */}
        <path
          d="M 0 800
             L 0 650 L 80 650 L 80 600 L 120 600 L 120 650 L 200 650 L 200 550 L 280 550 L 280 650
             L 350 650 L 350 500 L 400 500 L 400 450 L 450 450 L 450 500 L 500 500 L 500 650
             L 600 650 L 600 580 L 680 580 L 680 650 L 750 650 L 750 400 L 850 400 L 850 650
             L 950 650 L 950 520 L 1050 520 L 1050 650 L 1150 650 L 1150 480 L 1200 480 L 1200 380 L 1250 380 L 1250 480 L 1300 480 L 1300 650
             L 1400 650 L 1400 550 L 1500 550 L 1500 650 L 1600 650 L 1600 620 L 1700 620 L 1700 650
             L 1800 650 L 1800 580 L 1920 580 L 1920 800 Z"
          fill="#78350f"
          opacity="0.3"
        />

        {/* Crane */}
        <g transform="translate(1400, 300)">
          {/* Vertical pole */}
          <rect x="0" y="0" width="20" height="500" fill="#854d0e" />
          {/* Horizontal arm */}
          <rect x="-200" y="0" width="400" height="15" fill="#a16207" />
          {/* Support cable */}
          <line x1="10" y1="0" x2="-180" y2="50" stroke="#374151" strokeWidth="3" />
          <line x1="10" y1="0" x2="180" y2="50" stroke="#374151" strokeWidth="3" />
          {/* Hook */}
          <line x1="-150" y1="15" x2="-150" y2="150" stroke="#374151" strokeWidth="3" />
          <rect x="-165" y="150" width="30" height="20" fill="#374151" rx="5" />
        </g>

        {/* Ground */}
        <rect x="0" y="800" width="1920" height="280" fill="#92400e" />
        <rect x="0" y="800" width="1920" height="20" fill="#78350f" />
      </svg>

      {/* Floating blocks decoration */}
      {shouldAnimate && (
        <div className="absolute inset-0 pointer-events-none">
          {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'].map((color, i) => (
            <div
              key={i}
              className="absolute w-8 h-8 rounded-lg opacity-20 animate-float-block"
              style={{
                backgroundColor: color,
                left: `${10 + i * 15}%`,
                top: `${20 + (i * 7) % 50}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Daily challenge theme - calendar/sunrise
 */
export function DailyBackground({ animate = true, className = '' }: GameBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const shouldAnimate = animate && !prefersReducedMotion;

  return (
    <div className={`fixed inset-0 overflow-hidden -z-10 ${className}`} aria-hidden="true">
      {/* Sunrise gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #1e1b4b 0%, #4c1d95 20%, #7c3aed 40%, #f472b6 60%, #fbbf24 80%, #fef3c7 100%)',
        }}
      />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        {/* Stars fading */}
        {[...Array(50)].map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * 1920}
            cy={Math.random() * 400}
            r={Math.random() * 2 + 0.5}
            fill="white"
            opacity={Math.random() * 0.4}
          />
        ))}

        {/* Rising sun */}
        <defs>
          <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="960" cy="750" r="200" fill="url(#sun-glow)" opacity="0.6" />
        <circle cx="960" cy="750" r="100" fill="#fef08a" />
        <circle cx="960" cy="750" r="80" fill="#fde047" />

        {/* Sun rays */}
        <g transform="translate(960, 750)" opacity="0.4">
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1="0"
              y1="-120"
              x2="0"
              y2="-200"
              stroke="#fbbf24"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${i * 30})`}
              className={shouldAnimate ? 'animate-pulse' : ''}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </g>

        {/* Hills */}
        <path
          d="M 0 800 Q 300 700 600 780 Q 900 850 1200 750 Q 1500 680 1920 760 L 1920 1080 L 0 1080 Z"
          fill="#581c87"
          opacity="0.5"
        />
        <path
          d="M 0 850 Q 400 780 800 840 Q 1100 900 1400 820 Q 1700 760 1920 800 L 1920 1080 L 0 1080 Z"
          fill="#7c3aed"
          opacity="0.4"
        />
      </svg>

      {/* Calendar grid overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full">
          <defs>
            <pattern id="calendar-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#calendar-grid)" />
        </svg>
      </div>

      {/* Floating calendar pages */}
      {shouldAnimate && (
        <div className="absolute inset-0 pointer-events-none">
          {['📅', '✨', '🌟', '🔥', '⭐'].map((emoji, i) => (
            <span
              key={i}
              className="absolute text-3xl opacity-10 animate-float-slow"
              style={{
                left: `${15 + i * 18}%`,
                top: `${20 + (i * 13) % 40}%`,
                animationDelay: `${i * 0.7}s`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
