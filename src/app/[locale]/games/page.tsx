'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { ArcadeBackground } from '@/components/games/GameBackgrounds';

function formatTime(ms: number | null): string {
  if (ms === null) return '-';
  const seconds = ms / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(0);
  return `${minutes}:${remainingSeconds.padStart(2, '0')}`;
}

interface GameCardData {
  id: 'race' | 'target' | 'tower' | 'daily' | 'calm';
  icon: string;
  href: string;
  gradient: string;
  glowColor: string;
  bestScore?: string;
  bestLabel?: string;
  secondary?: string;
  badge?: { text: string; color: string };
}

export default function GamesPage() {
  const t = useTranslations('games');
  const locale = useLocale() as 'en' | 'he';
  const isRTL = locale === 'he';

  const [isHydrated, setIsHydrated] = useState(false);

  // Game store
  const raceBestTime = useGameStore((s) => s.raceBestTime);
  const raceGamesPlayed = useGameStore((s) => s.raceGamesPlayed);
  const targetHighScore = useGameStore((s) => s.targetHighScore);
  const targetMaxCombo = useGameStore((s) => s.targetMaxCombo);
  const towerMaxHeight = useGameStore((s) => s.towerMaxHeight);
  const dailyStreak = useGameStore((s) => s.dailyStreak);
  const todayCompleted = useGameStore((s) => s.todayCompleted);
  const checkDailyReset = useGameStore((s) => s.checkDailyReset);

  useEffect(() => {
    setIsHydrated(true);
    checkDailyReset();
  }, [checkDailyReset]);

  // Build game cards data
  const games: GameCardData[] = [
    {
      id: 'race',
      icon: '🏎️',
      href: '/games/race',
      gradient: 'from-orange-500 via-red-500 to-rose-600',
      glowColor: 'rgba(249, 115, 22, 0.4)',
      bestScore: isHydrated && raceBestTime ? formatTime(raceBestTime) : undefined,
      bestLabel: t('bestTime'),
      secondary: isHydrated && raceGamesPlayed > 0 ? `${raceGamesPlayed} ${t('gamesPlayed')}` : undefined,
    },
    {
      id: 'target',
      icon: '🎯',
      href: '/games/target',
      gradient: 'from-purple-500 via-indigo-500 to-blue-600',
      glowColor: 'rgba(139, 92, 246, 0.4)',
      bestScore: isHydrated && targetHighScore > 0 ? targetHighScore.toLocaleString() : undefined,
      bestLabel: t('bestScore'),
      secondary: isHydrated && targetMaxCombo > 0 ? `${t('maxCombo')}: ${targetMaxCombo}x` : undefined,
    },
    {
      id: 'tower',
      icon: '🏗️',
      href: '/games/tower',
      gradient: 'from-amber-400 via-orange-500 to-red-500',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      bestScore: isHydrated && towerMaxHeight > 0 ? `${towerMaxHeight}` : undefined,
      bestLabel: t('maxHeight'),
    },
    {
      id: 'daily',
      icon: '📅',
      href: '/games/daily',
      gradient: 'from-pink-500 via-purple-500 to-violet-600',
      glowColor: 'rgba(236, 72, 153, 0.4)',
      secondary: isHydrated && dailyStreak > 0 ? `🔥 ${dailyStreak} ${t('dayStreak')}` : undefined,
      badge: isHydrated && todayCompleted
        ? { text: t('completed'), color: 'bg-green-500' }
        : { text: t('daily.todayLabel') || 'Today', color: 'bg-pink-500 animate-pulse' },
    },
    {
      id: 'calm',
      icon: '🧘',
      href: '/practice/calm',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
      glowColor: 'rgba(20, 184, 166, 0.4)',
    },
  ];

  // Loading skeleton
  if (!isHydrated) {
    return (
      <div className="min-h-screen relative">
        <ArcadeBackground />
        <div className="relative z-10 container mx-auto max-w-6xl px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-16 w-64 bg-white/10 rounded-2xl mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-56 bg-white/10 rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ArcadeBackground />

      <div className="relative z-10 container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-4">
            <span className="text-4xl">🎮</span>
            <h1 className="font-display text-4xl font-bold text-white">
              {t('title')}
            </h1>
          </div>
          <p className="text-lg text-white/70 max-w-md mx-auto">
            {t('subtitle')}
          </p>
        </motion.header>

        {/* Games grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={game.href}>
                <div
                  className={`
                    relative group overflow-hidden rounded-3xl p-6 h-56
                    bg-gradient-to-br ${game.gradient}
                    transform transition-all duration-300
                    hover:scale-[1.03] hover:-translate-y-1
                    cursor-pointer
                  `}
                  style={{
                    boxShadow: `0 10px 40px -10px ${game.glowColor}, 0 0 0 1px rgba(255,255,255,0.1)`,
                  }}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                    }} />
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Badge */}
                  {game.badge && (
                    <div className={`absolute top-4 right-4 ${game.badge.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                      {game.badge.text}
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Icon and title */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-5xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {game.icon}
                      </span>
                      <h3 className="text-2xl font-bold text-white drop-shadow-md">
                        {t(`${game.id}.title`)}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-white/80 text-sm mb-auto line-clamp-2">
                      {t(`${game.id}.description`)}
                    </p>

                    {/* Stats */}
                    <div className="mt-4 flex items-end justify-between">
                      <div className="space-y-1">
                        {game.bestScore && (
                          <div className="text-white/90 text-sm">
                            <span className="text-white/60">{game.bestLabel}: </span>
                            <span className="font-bold">{game.bestScore}</span>
                          </div>
                        )}
                        {game.secondary && (
                          <div className="text-white/70 text-xs">
                            {game.secondary}
                          </div>
                        )}
                      </div>

                      {/* Play button */}
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold text-sm group-hover:bg-white/30 transition-colors">
                        <span className="text-lg">▶</span>
                        {t('play')}
                      </div>
                    </div>
                  </div>

                  {/* Large background icon */}
                  <div className="absolute -bottom-4 -right-4 text-[120px] opacity-10 pointer-events-none select-none">
                    {game.icon}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* XP Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={`p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-4xl">💡</span>
            <div>
              <h3 className="font-semibold text-white mb-1">
                {t('xpInfo.title')}
              </h3>
              <p className="text-sm text-white/70">
                {t('xpInfo.description')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back to levels */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <Link
            href="/levels"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/10"
          >
            <span className={isRTL ? 'rotate-180' : ''}>←</span>
            {t('backToLevels')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
