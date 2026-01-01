'use client';

import { memo, useEffect, useState, useRef } from 'react';
import { useProgressStore } from '@/stores/useProgressStore';

export const XpPill = memo(function XpPill() {
  const totalXp = useProgressStore((s) => s.totalXp);
  const [displayXp, setDisplayXp] = useState(totalXp);
  const [isAnimating, setIsAnimating] = useState(false);
  const [xpGain, setXpGain] = useState(0);
  const prevXpRef = useRef(totalXp);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
    setDisplayXp(totalXp);
    prevXpRef.current = totalXp;
  }, []);

  // Animate when XP changes
  useEffect(() => {
    if (!isHydrated) return;

    const prevXp = prevXpRef.current;
    const diff = totalXp - prevXp;

    if (diff > 0) {
      // XP increased - animate!
      setXpGain(diff);
      setIsAnimating(true);

      // Count up animation
      const duration = Math.min(1000, diff * 20); // Faster for larger gains
      const startTime = performance.now();
      const startValue = prevXp;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + diff * easeOut);
        setDisplayXp(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Animation complete
          setTimeout(() => {
            setIsAnimating(false);
            setXpGain(0);
          }, 1500);
        }
      };

      requestAnimationFrame(animate);
    } else {
      // XP didn't increase (or decreased for some reason)
      setDisplayXp(totalXp);
    }

    prevXpRef.current = totalXp;
  }, [totalXp, isHydrated]);

  // Don't render until hydrated to avoid mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* XP Gain popup */}
      {xpGain > 0 && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 animate-xp-gain"
          aria-live="polite"
        >
          <span className="text-lg font-bold text-purple-500 dark:text-purple-400 whitespace-nowrap drop-shadow-lg">
            +{xpGain} XP
          </span>
        </div>
      )}

      {/* Main pill */}
      <div
        className={`
          flex items-center gap-2.5 px-5 py-3
          bg-white/95 dark:bg-gray-800/95 backdrop-blur-md
          rounded-full shadow-lg
          border-2 border-purple-200 dark:border-purple-700
          transition-all duration-300
          ${isAnimating
            ? 'scale-115 shadow-[0_0_30px_rgba(147,51,234,0.6)] border-purple-400 dark:border-purple-500'
            : 'scale-100 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600'
          }
        `}
        role="status"
        aria-label={`Total XP: ${displayXp}`}
      >
        {/* Star icon with glow when animating */}
        <span
          className={`
            text-2xl transition-all duration-300
            ${isAnimating ? 'animate-bounce scale-125' : ''}
          `}
          style={{
            filter: isAnimating ? 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.8))' : undefined
          }}
        >
          ⭐
        </span>

        {/* XP Value */}
        <span
          className={`
            font-display font-bold tabular-nums
            transition-all duration-300
            ${isAnimating
              ? 'text-purple-600 dark:text-purple-400 text-2xl'
              : 'text-gray-800 dark:text-gray-100 text-xl'
            }
          `}
        >
          {displayXp.toLocaleString()}
        </span>

        {/* XP label */}
        <span className="text-sm font-bold text-purple-500 dark:text-purple-400">
          XP
        </span>
      </div>

      {/* CSS for XP gain animation */}
      <style jsx>{`
        @keyframes xp-gain {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) translateY(-25px) scale(1.3);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-50px) scale(0.8);
          }
        }

        .animate-xp-gain {
          animation: xp-gain 1.5s ease-out forwards;
        }

        .scale-115 {
          transform: scale(1.15);
        }
      `}</style>
    </div>
  );
});

export default XpPill;
