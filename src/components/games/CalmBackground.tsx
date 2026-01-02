'use client';

import { useEffect, useState, useMemo } from 'react';

interface CalmBackgroundProps {
  /** Whether animations are enabled (respects reduced motion) */
  animate?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Earthy, calming background for Calm Mode.
 * Features:
 * - Warm light brown/beige gradient
 * - Abstract tree-like lines growing upward
 * - Respects prefers-reduced-motion
 */
export function CalmBackground({
  animate = true,
  className = '',
}: CalmBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
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

  // Generate tree lines - memoized to prevent regeneration on re-render
  const treeLines = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: 3 + (i * 6.5) + (Math.random() * 3 - 1.5),
      height: 25 + Math.random() * 50,
      delay: i * 0.2,
      duration: 15 + Math.random() * 10,
      opacity: 0.3 + Math.random() * 0.3,
      strokeWidth: 1.5 + Math.random() * 2,
      curve: Math.random() > 0.5 ? 'left' : 'right',
    })),
  []);

  return (
    <div
      className={`fixed inset-0 overflow-hidden -z-10 ${className}`}
      aria-hidden="true"
    >
      {/* Base warm earthy gradient - light browns and beiges */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #d4a574 0%, #c4956a 30%, #b8860b 60%, #8b7355 100%)',
        }}
      />

      {/* Warm golden overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 223, 186, 0.4) 0%, transparent 60%)',
        }}
      />

      {/* Soft green tint at bottom for grass feel */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2/5"
        style={{
          background: 'linear-gradient(to top, rgba(85, 107, 47, 0.25) 0%, rgba(107, 142, 35, 0.15) 50%, transparent 100%)',
        }}
      />

      {/* Abstract tree lines growing upward */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient for tree lines - greens */}
          <linearGradient id="treeGradientLight" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#2d5016" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#4a7c23" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#6b8e23" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#9acd32" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="treeGradientLight2" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#355e20" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#558b2f" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7cb342" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="treeGradientLight3" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#1b4d1b" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#228b22" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#32cd32" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {treeLines.map((line) => {
          const gradients = ['url(#treeGradientLight)', 'url(#treeGradientLight2)', 'url(#treeGradientLight3)'];
          const gradient = gradients[line.id % 3];

          return (
            <g key={line.id}>
              {/* Main trunk line */}
              <path
                d={`
                  M ${line.left}% 100%
                  Q ${line.left + (line.curve === 'left' ? -1.5 : 1.5)}% ${100 - line.height / 2}%
                    ${line.left + (line.curve === 'left' ? -0.5 : 0.5)}% ${100 - line.height}%
                `}
                stroke={gradient}
                strokeWidth={line.strokeWidth}
                fill="none"
                strokeLinecap="round"
                opacity={line.opacity}
                className={shouldAnimate ? 'calm-tree-grow' : ''}
                style={{
                  animationDelay: `${line.delay}s`,
                  animationDuration: `${line.duration}s`,
                }}
              />
              {/* Branch lines for taller trees */}
              {line.height > 35 && (
                <>
                  <path
                    d={`
                      M ${line.left + (line.curve === 'left' ? -0.3 : 0.3)}% ${100 - line.height * 0.55}%
                      Q ${line.left + (line.curve === 'left' ? -2.5 : 2.5)}% ${100 - line.height * 0.65}%
                        ${line.left + (line.curve === 'left' ? -3.5 : 3.5)}% ${100 - line.height * 0.7}%
                    `}
                    stroke={gradient}
                    strokeWidth={line.strokeWidth * 0.6}
                    fill="none"
                    strokeLinecap="round"
                    opacity={line.opacity * 0.7}
                    className={shouldAnimate ? 'calm-tree-grow' : ''}
                    style={{
                      animationDelay: `${line.delay + 0.5}s`,
                      animationDuration: `${line.duration}s`,
                    }}
                  />
                  <path
                    d={`
                      M ${line.left + (line.curve === 'left' ? -0.2 : 0.2)}% ${100 - line.height * 0.35}%
                      Q ${line.left + (line.curve === 'left' ? 2 : -2)}% ${100 - line.height * 0.45}%
                        ${line.left + (line.curve === 'left' ? 2.5 : -2.5)}% ${100 - line.height * 0.5}%
                    `}
                    stroke={gradient}
                    strokeWidth={line.strokeWidth * 0.5}
                    fill="none"
                    strokeLinecap="round"
                    opacity={line.opacity * 0.5}
                    className={shouldAnimate ? 'calm-tree-grow' : ''}
                    style={{
                      animationDelay: `${line.delay + 1}s`,
                      animationDuration: `${line.duration}s`,
                    }}
                  />
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating leaf particles */}
      {shouldAnimate && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full calm-firefly"
              style={{
                left: `${15 + i * 14}%`,
                top: `${25 + (i % 3) * 18}%`,
                animationDelay: `${i * 2}s`,
                background: 'radial-gradient(circle, rgba(154, 205, 50, 0.6) 0%, rgba(107, 142, 35, 0.3) 100%)',
              }}
            />
          ))}
        </div>
      )}

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

/**
 * Simple version without animations
 */
export function CalmBackgroundSimple({ className = '' }: { className?: string }) {
  return (
    <div
      className={`fixed inset-0 -z-10 ${className}`}
      style={{
        background: 'linear-gradient(to bottom, #d4a574 0%, #c4956a 30%, #b8860b 60%, #8b7355 100%)',
      }}
      aria-hidden="true"
    />
  );
}
