/**
 * Achievement definitions for the gamification system.
 * 15 achievements across 6 categories.
 */

import type { Achievement, AchievementCategory } from '@/types/achievement';

export const achievements: Achievement[] = [
  // === MILESTONE ACHIEVEMENTS (4) ===
  {
    id: 'first-steps',
    category: 'milestone',
    rarity: 'common',
    icon: '🎯',
    title: { en: 'First Steps', he: 'צעדים ראשונים' },
    description: { en: 'Complete your first lesson', he: 'השלם את השיעור הראשון שלך' },
    xpReward: 25,
    conditionType: 'lessons_completed',
    threshold: 1,
  },
  {
    id: 'home-row-hero',
    category: 'milestone',
    rarity: 'common',
    icon: '🏠',
    title: { en: 'Home Row Hero', he: 'גיבור שורת הבית' },
    description: { en: 'Complete Stage 1', he: 'השלם את שלב 1' },
    xpReward: 50,
    conditionType: 'stages_completed',
    threshold: 1,
  },
  {
    id: 'halfway-there',
    category: 'milestone',
    rarity: 'rare',
    icon: '⛰️',
    title: { en: 'Halfway There', he: 'באמצע הדרך' },
    description: { en: 'Complete 3 stages', he: 'השלם 3 שלבים' },
    xpReward: 100,
    conditionType: 'stages_completed',
    threshold: 3,
  },
  {
    id: 'keyboard-conqueror',
    category: 'milestone',
    rarity: 'legendary',
    icon: '🏆',
    title: { en: 'Keyboard Conqueror', he: 'כובש המקלדת' },
    description: { en: 'Complete the entire curriculum', he: 'השלם את כל התוכנית' },
    xpReward: 500,
    conditionType: 'curriculum_complete',
    threshold: 1,
  },

  // === SPEED ACHIEVEMENTS (3) ===
  {
    id: 'speed-demon',
    category: 'speed',
    rarity: 'common',
    icon: '⚡',
    title: { en: 'Speed Demon', he: 'שד מהירות' },
    description: { en: 'Reach 30 WPM average', he: 'הגע לממוצע של 30 מילים לדקה' },
    xpReward: 50,
    conditionType: 'average_wpm',
    threshold: 30,
  },
  {
    id: 'lightning-fingers',
    category: 'speed',
    rarity: 'rare',
    icon: '⚡',
    title: { en: 'Lightning Fingers', he: 'אצבעות ברק' },
    description: { en: 'Reach 50 WPM in a lesson', he: 'הגע ל-50 מילים לדקה בשיעור' },
    xpReward: 75,
    conditionType: 'session_wpm_min',
    threshold: 50,
  },
  {
    id: 'turbo-typer',
    category: 'speed',
    rarity: 'epic',
    icon: '🚀',
    title: { en: 'Turbo Typer', he: 'מקליד טורבו' },
    description: { en: 'Reach 70 WPM in a lesson', he: 'הגע ל-70 מילים לדקה בשיעור' },
    xpReward: 150,
    conditionType: 'session_wpm_min',
    threshold: 70,
  },

  // === ACCURACY ACHIEVEMENTS (2) ===
  {
    id: 'perfectionist',
    category: 'accuracy',
    rarity: 'rare',
    icon: '💎',
    title: { en: 'Perfectionist', he: 'פרפקציוניסט' },
    description: { en: 'Complete 5 lessons with 100% accuracy', he: 'השלם 5 שיעורים עם 100% דיוק' },
    xpReward: 100,
    conditionType: 'perfect_lessons',
    threshold: 5,
  },
  {
    id: 'star-collector',
    category: 'accuracy',
    rarity: 'rare',
    icon: '⭐',
    title: { en: 'Star Collector', he: 'אספן כוכבים' },
    description: { en: 'Earn 3 stars on 10 lessons', he: 'קבל 3 כוכבים ב-10 שיעורים' },
    xpReward: 100,
    conditionType: 'three_star_lessons',
    threshold: 10,
  },

  // === STREAK ACHIEVEMENTS (2) ===
  {
    id: 'on-fire',
    category: 'streak',
    rarity: 'common',
    icon: '🔥',
    title: { en: 'On Fire!', he: 'בוער!' },
    description: { en: 'Reach a 7-day streak', he: 'הגע לרצף של 7 ימים' },
    xpReward: 75,
    conditionType: 'streak_days',
    threshold: 7,
  },
  {
    id: 'unstoppable',
    category: 'streak',
    rarity: 'epic',
    icon: '🔥',
    title: { en: 'Unstoppable', he: 'בלתי ניתן לעצירה' },
    description: { en: 'Reach a 30-day streak', he: 'הגע לרצף של 30 ימים' },
    xpReward: 200,
    conditionType: 'streak_days',
    threshold: 30,
  },

  // === DEDICATION ACHIEVEMENTS (2) ===
  {
    id: 'dedicated-typist',
    category: 'dedication',
    rarity: 'common',
    icon: '📚',
    title: { en: 'Dedicated Typist', he: 'מקליד מסור' },
    description: { en: 'Complete 25 practice sessions', he: 'השלם 25 מפגשי תרגול' },
    xpReward: 50,
    conditionType: 'total_sessions',
    threshold: 25,
  },
  {
    id: 'xp-hunter',
    category: 'dedication',
    rarity: 'rare',
    icon: '💰',
    title: { en: 'XP Hunter', he: 'צייד XP' },
    description: { en: 'Earn 1000 total XP', he: 'צבור 1000 XP' },
    xpReward: 100,
    conditionType: 'total_xp',
    threshold: 1000,
  },

  // === MASTERY ACHIEVEMENTS (1) ===
  {
    id: 'key-master',
    category: 'mastery',
    rarity: 'epic',
    icon: '🔑',
    title: { en: 'Key Master', he: 'מאסטר מקשים' },
    description: { en: 'Master 20 keys (95%+ accuracy)', he: 'שלוט ב-20 מקשים (95%+ דיוק)' },
    xpReward: 150,
    conditionType: 'keys_mastered',
    threshold: 20,
  },

  // === SECRET ACHIEVEMENTS (6) - Easter eggs ===
  {
    id: 'curious-clicker',
    category: 'secret',
    rarity: 'common',
    icon: '🗝️',
    title: { en: 'Curious Clicker', he: 'סקרן לחצני' },
    description: { en: 'Click the key 10 times', he: 'לחץ על המפתח 10 פעמים' },
    hidden: true,
    xpReward: 10,
    conditionType: 'home_key_clicks',
    threshold: 10,
  },
  {
    id: 'key-enthusiast',
    category: 'secret',
    rarity: 'rare',
    icon: '🔐',
    title: { en: 'Key Enthusiast', he: 'חובב מפתחות' },
    description: { en: 'Click the key 50 times', he: 'לחץ על המפתח 50 פעמים' },
    hidden: true,
    xpReward: 25,
    conditionType: 'home_key_clicks',
    threshold: 50,
  },
  {
    id: 'key-obsessed',
    category: 'secret',
    rarity: 'epic',
    icon: '🏅',
    title: { en: 'Key Obsessed', he: 'אובססיבי למפתחות' },
    description: { en: 'Click the key 100 times', he: 'לחץ על המפתח 100 פעמים' },
    hidden: true,
    xpReward: 50,
    conditionType: 'home_key_clicks',
    threshold: 100,
  },
  {
    id: 'map-explorer',
    category: 'secret',
    rarity: 'common',
    icon: '🗺️',
    title: { en: 'Map Explorer', he: 'חוקר מפות' },
    description: { en: 'Click the quest key 10 times', he: 'לחץ על מפתח המסע 10 פעמים' },
    hidden: true,
    xpReward: 10,
    conditionType: 'levels_key_clicks',
    threshold: 10,
  },
  {
    id: 'treasure-seeker',
    category: 'secret',
    rarity: 'rare',
    icon: '💎',
    title: { en: 'Treasure Seeker', he: 'מחפש אוצרות' },
    description: { en: 'Click the quest key 50 times', he: 'לחץ על מפתח המסע 50 פעמים' },
    hidden: true,
    xpReward: 25,
    conditionType: 'levels_key_clicks',
    threshold: 50,
  },
  {
    id: 'legendary-finder',
    category: 'secret',
    rarity: 'legendary',
    icon: '👑',
    title: { en: 'Legendary Finder', he: 'מוצא אגדי' },
    description: { en: 'Click the quest key 100 times', he: 'לחץ על מפתח המסע 100 פעמים' },
    hidden: true,
    xpReward: 100,
    conditionType: 'levels_key_clicks',
    threshold: 100,
  },
];

/**
 * Get an achievement by ID.
 */
export function getAchievement(id: string): Achievement | undefined {
  return achievements.find((a) => a.id === id);
}

/**
 * Get all achievements in a specific category.
 */
export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return achievements.filter((a) => a.category === category);
}

/**
 * Get all achievement categories.
 */
export const achievementCategories: AchievementCategory[] = [
  'milestone',
  'speed',
  'accuracy',
  'streak',
  'dedication',
  'mastery',
  'secret',
];
