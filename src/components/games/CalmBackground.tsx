'use client';

import { useEffect, useState } from 'react';

interface CalmBackgroundProps {
  /** Whether animations are enabled (respects reduced motion) */
  animate?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Ambient animated background for Calm Mode.
 * Features:
 * - Soft, slowly shifting gradient
 * - Optional floating particles/orbs
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

  return (
    <div
      className={`fixed inset-0 overflow-hidden -z-10 ${className}`}
      aria-hidden="true"
    >
      {/* Base gradient layer */}
      <div
        className={`
          absolute inset-0
          bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100
          dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950
          ${shouldAnimate ? 'calm-bg-animate' : ''}
        `}
      />

      {/* Soft overlay gradient for depth */}
      <div
        className={`
          absolute inset-0
          bg-gradient-to-tr from-transparent via-cyan-50/30 to-purple-50/20
          dark:from-transparent dark:via-cyan-900/10 dark:to-purple-900/10
          ${shouldAnimate ? 'calm-bg-overlay-animate' : ''}
        `}
      />

      {/* Floating orbs (subtle ambient elements) */}
      {shouldAnimate && (
        <>
          <FloatingOrb
            size="lg"
            color="blue"
            position={{ top: '10%', left: '15%' }}
            delay={0}
          />
          <FloatingOrb
            size="md"
            color="purple"
            position={{ top: '60%', right: '20%' }}
            delay={2}
          />
          <FloatingOrb
            size="sm"
            color="cyan"
            position={{ bottom: '20%', left: '30%' }}
            delay={4}
          />
          <FloatingOrb
            size="md"
            color="indigo"
            position={{ top: '30%', right: '10%' }}
            delay={1}
          />
        </>
      )}

      {/* Subtle noise texture overlay for depth */}
      <div
        className="
          absolute inset-0
          opacity-[0.015] dark:opacity-[0.03]
          bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]
        "
      />
    </div>
  );
}

interface FloatingOrbProps {
  size: 'sm' | 'md' | 'lg';
  color: 'blue' | 'purple' | 'cyan' | 'indigo';
  position: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  delay?: number;
}

/**
 * Soft, floating orb element for ambient background effect
 */
function FloatingOrb({ size, color, position, delay = 0 }: FloatingOrbProps) {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  const colorClasses = {
    blue: 'bg-blue-300/20 dark:bg-blue-500/10',
    purple: 'bg-purple-300/20 dark:bg-purple-500/10',
    cyan: 'bg-cyan-300/20 dark:bg-cyan-500/10',
    indigo: 'bg-indigo-300/20 dark:bg-indigo-500/10',
  };

  return (
    <div
      className={`
        absolute rounded-full blur-3xl
        ${sizeClasses[size]}
        ${colorClasses[color]}
        calm-orb-float
      `}
      style={{
        ...position,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

/**
 * Simple version without floating orbs - just gradient
 */
export function CalmBackgroundSimple({ className = '' }: { className?: string }) {
  return (
    <div
      className={`
        fixed inset-0 -z-10
        bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100
        dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950
        ${className}
      `}
      aria-hidden="true"
    />
  );
}
