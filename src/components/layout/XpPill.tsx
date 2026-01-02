'use client';

import { memo, useEffect, useState, useRef, useMemo } from 'react';
import { useProgressStore, type XpEvent } from '@/stores/useProgressStore';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getLesson } from '@/data/lessons';
import { getAchievement, achievements } from '@/data/achievements';

export const XpPill = memo(function XpPill() {
  const totalXp = useProgressStore((s) => s.totalXp);
  const xpHistory = useProgressStore((s) => s.xpHistory);
  const userAchievements = useProgressStore((s) => s.achievements);
  const [displayXp, setDisplayXp] = useState(totalXp);
  const [isAnimating, setIsAnimating] = useState(false);
  const [xpGain, setXpGain] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const prevXpRef = useRef(totalXp);
  const [isHydrated, setIsHydrated] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const locale = useLocale() as 'en' | 'he';
  const t = useTranslations('gamification');

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
    setDisplayXp(totalXp);
    prevXpRef.current = totalXp;
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        pillRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !pillRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    }

    if (isPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isPopupOpen]);

  // Close popup on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsPopupOpen(false);
        pillRef.current?.focus();
      }
    }

    if (isPopupOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isPopupOpen]);

  // Get recent XP events (last 10)
  const recentEvents = xpHistory
    .slice(-10)
    .reverse()
    .map((event) => {
      if (event.type === 'lesson') {
        const lesson = getLesson(event.id);
        return {
          ...event,
          title: lesson?.title[locale] || event.id,
          icon: '📚',
        };
      } else {
        const achievement = getAchievement(event.id);
        return {
          ...event,
          title: achievement?.title[locale] || event.id,
          icon: achievement?.icon || '🏆',
        };
      }
    });

  // Calculate achievement percentage
  const achievementPercent = useMemo(() => {
    const unlockedCount = Object.values(userAchievements).filter((a) => a.unlocked).length;
    const totalCount = achievements.length;
    return totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;
  }, [userAchievements]);

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

  const isRTL = locale === 'he';

  return (
    <div className={`fixed top-4 ${isRTL ? 'left-4' : 'right-4'} z-50 flex flex-col items-end gap-2`}>
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

      {/* Main pill - now a button */}
      <button
        ref={pillRef}
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        className={`
          flex items-center gap-2.5 px-5 py-3
          bg-white/95 dark:bg-gray-800/95 backdrop-blur-md
          rounded-full shadow-lg
          border-2 border-purple-200 dark:border-purple-700
          transition-all duration-300 cursor-pointer
          ${isAnimating
            ? 'scale-115 shadow-[0_0_30px_rgba(147,51,234,0.6)] border-purple-400 dark:border-purple-500'
            : 'scale-100 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600'
          }
        `}
        aria-expanded={isPopupOpen}
        aria-haspopup="true"
        aria-label={`Total XP: ${displayXp}. ${isPopupOpen ? 'Close' : 'View'} XP history`}
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

        {/* Dropdown arrow */}
        <svg
          className={`w-4 h-4 text-purple-400 transition-transform duration-200 ${isPopupOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* XP History Popup */}
      {isPopupOpen && (
        <div
          ref={popupRef}
          className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} w-72
            bg-white dark:bg-gray-800 rounded-2xl shadow-2xl
            border border-purple-200 dark:border-purple-700
            overflow-hidden animate-popup-in`}
          role="dialog"
          aria-label={t('xp.breakdown.title')}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3">
            <h3 className="font-display font-bold text-white text-lg">
              {t('xp.breakdown.title')}
            </h3>
          </div>

          {/* Event list */}
          <div className="max-h-80 overflow-y-auto">
            {recentEvents.length > 0 ? (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentEvents.map((event, idx) => (
                  <li key={idx} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <span className="text-lg shrink-0">{event.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 dark:text-gray-100 text-sm truncate">
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {new Date(event.date).toLocaleDateString(locale === 'he' ? 'he-IL' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-purple-600 dark:text-purple-400 font-bold">
                          +{event.xp}
                        </span>
                        <span className="text-xs text-purple-500">XP</span>
                      </div>
                    </div>
                    {/* Stats badges for lessons only */}
                    {event.type === 'lesson' && event.accuracy !== undefined && (
                      <div className="flex gap-2 mt-2 ms-7">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                          {event.accuracy}%
                        </span>
                        {event.wpm !== undefined && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                            {event.wpm} WPM
                          </span>
                        )}
                        {event.stars !== undefined && event.stars > 0 && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                            {'⭐'.repeat(event.stars)}
                          </span>
                        )}
                      </div>
                    )}
                    {/* Achievement badge */}
                    {event.type === 'achievement' && (
                      <div className="flex gap-2 mt-2 ms-7">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                          {locale === 'he' ? 'הישג' : 'Achievement'}
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                <span className="text-3xl mb-2 block">{totalXp > 0 ? '📊' : '📚'}</span>
                <p className="text-sm">
                  {totalXp > 0
                    ? (locale === 'he' ? 'היסטוריית XP תתעדכן מעכשיו' : 'XP history will be tracked from now on')
                    : (locale === 'he' ? 'השלם שיעורים כדי לצבור XP!' : 'Complete lessons to earn XP!')
                  }
                </p>
                {totalXp > 0 && (
                  <p className="text-xs mt-2 text-gray-400">
                    {locale === 'he' ? `כבר צברת ${totalXp} XP!` : `You already have ${totalXp} XP!`}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-800/80 px-4 py-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('xp.breakdown.total')}
              </span>
              <span className="font-display font-bold text-lg text-purple-600 dark:text-purple-400">
                {totalXp.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Achievement percentage badge */}
      <Link
        href="/achievements"
        className="flex items-center gap-1.5 px-3 py-1.5
          bg-white/90 dark:bg-gray-800/90 backdrop-blur-md
          rounded-full shadow-md
          border border-amber-200 dark:border-amber-700
          transition-all duration-200 cursor-pointer
          hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-600
          hover:scale-105"
        aria-label={`${achievementPercent}% ${locale === 'he' ? 'הישגים' : 'achievements'}`}
      >
        <span className="text-sm">🏆</span>
        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
          {achievementPercent}%
        </span>
      </Link>

      {/* CSS for animations */}
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

        @keyframes popup-in {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-xp-gain {
          animation: xp-gain 1.5s ease-out forwards;
        }

        .animate-popup-in {
          animation: popup-in 0.2s ease-out forwards;
        }

        .scale-115 {
          transform: scale(1.15);
        }
      `}</style>
    </div>
  );
});

export default XpPill;
