/**
 * Date-seeded random number generator for Daily Challenge.
 * Ensures the same challenge for all users on the same day.
 */

import type { KeyboardLayoutType } from '@/data/keyboard-layout';

// Simple seeded random number generator (Mulberry32)
function seededRandom(seed: number): () => number {
  let state = seed;
  return function () {
    let t = (state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fisher-Yates shuffle with seeded random for deterministic results
function shuffleArray<T>(array: T[], random: () => number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Convert date to numeric seed
function dateToSeed(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // Create a unique seed from the date
  return year * 10000 + month * 100 + day;
}

// Challenge sentences pool - English (varied topics and lengths)
const CHALLENGE_SENTENCES_EN = [
  'The quick brown fox jumps over the lazy dog near the river bank.',
  'Programming requires patience and practice to master effectively.',
  'Keyboard skills are essential in our digital age.',
  'Every expert was once a beginner who never gave up.',
  'Success comes from consistent daily practice and dedication.',
  'Type each word carefully and watch your speed increase.',
  'The journey of a thousand miles begins with a single step.',
  'Learning to type fast opens many doors in your career.',
  'Focus on accuracy first, then speed will naturally follow.',
  'Challenge yourself every day to become a better typist.',
  'Your fingers will remember the keys with enough practice.',
  'Speed and precision are the hallmarks of a skilled typist.',
  'Take breaks when needed but always return to practice.',
  'The keyboard is your instrument, master it with care.',
  'Daily practice is the secret to typing excellence.',
  'Stay calm and let your fingers dance across the keys.',
  'Every keystroke brings you closer to mastery.',
  'Believe in yourself and your typing will improve.',
  'The best typists started exactly where you are now.',
  'Persistence and practice make perfect performance.',
  'Keep your eyes on the screen, not on the keyboard.',
  'Muscle memory develops through repetition and patience.',
  'Fast typing is a valuable skill in many professions.',
  'Type with confidence and accuracy will follow.',
  'A good typist never looks down at their hands.',
  'Practice makes progress, not just perfection.',
  'Your daily challenge awaits, are you ready?',
  'Each day brings new opportunities to improve.',
  'The more you type, the faster you become.',
  'Embrace the challenge and grow stronger today.',
];

// Challenge sentences pool - Hebrew
const CHALLENGE_SENTENCES_HE = [
  'הקלדה מהירה היא מיומנות חשובה בעולם הדיגיטלי של היום.',
  'כל מומחה התחיל פעם כמתחיל שלא ויתר אף פעם.',
  'תרגול יומי הוא המפתח להצלחה בהקלדה עיוורת.',
  'המקלדת היא כלי, ואפשר לשלוט בה עם מספיק תרגול.',
  'כל הקשה על המקלדת מקרבת אותך לשליטה מושלמת.',
  'התמקד קודם בדיוק, והמהירות תבוא באופן טבעי.',
  'האצבעות שלך יזכרו את המקשים עם מספיק תרגול.',
  'אתגר את עצמך כל יום להפוך למקליד טוב יותר.',
  'הצלחה מגיעה מתרגול עקבי ומסירות יומיומית.',
  'למד להקליד מהר ופתח דלתות רבות בקריירה שלך.',
  'מהירות ודיוק הם סימני ההיכר של מקליד מיומן.',
  'תרגול עושה התקדמות, לא רק שלמות.',
  'האתגר היומי שלך מחכה, האם אתה מוכן?',
  'כל יום מביא הזדמנויות חדשות להשתפר.',
  'ככל שתקליד יותר, כך תהיה מהיר יותר.',
  'שמור על הרוגע ותן לאצבעותיך לרקוד על המקשים.',
  'האמן בעצמך וההקלדה שלך תשתפר.',
  'המקלידים הטובים ביותר התחילו בדיוק היכן שאתה עכשיו.',
  'התמדה ותרגול מביאים לביצוע מושלם.',
  'שמור את העיניים על המסך, לא על המקלדת.',
];

// Fun daily themes
const DAILY_THEMES = [
  { emoji: '🌅', name: 'Morning Motivation' },
  { emoji: '🎯', name: 'Focus Challenge' },
  { emoji: '⚡', name: 'Speed Trial' },
  { emoji: '🎮', name: 'Game Day' },
  { emoji: '📚', name: 'Learning Session' },
  { emoji: '🏆', name: 'Championship Round' },
  { emoji: '🔥', name: 'Streak Builder' },
];

export interface DailyChallenge {
  date: string; // YYYY-MM-DD
  text: string;
  theme: { emoji: string; name: string };
  wordCount: number;
  characterCount: number;
}

/**
 * Generate the daily challenge for a given date.
 * Returns the same challenge for all users on the same day.
 */
export function getDailyChallenge(date: Date = new Date(), layout: KeyboardLayoutType = 'qwerty'): DailyChallenge {
  const seed = dateToSeed(date);
  const random = seededRandom(seed);

  // Select appropriate sentences based on layout
  const CHALLENGE_SENTENCES = layout === 'hebrew' ? CHALLENGE_SENTENCES_HE : CHALLENGE_SENTENCES_EN;

  // Select 2-3 sentences for the challenge
  const sentenceCount = 2 + Math.floor(random() * 2); // 2-3 sentences
  // Use Fisher-Yates shuffle for deterministic results across all JS engines
  const shuffledSentences = shuffleArray(CHALLENGE_SENTENCES, random);
  const selectedSentences = shuffledSentences.slice(0, sentenceCount);
  const text = selectedSentences.join(' ');

  // Select theme based on day
  const themeIndex = Math.floor(random() * DAILY_THEMES.length);
  const theme = DAILY_THEMES[themeIndex];

  // Format date using local timezone for consistency
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  return {
    date: dateString,
    text,
    theme,
    wordCount: text.split(/\s+/).length,
    characterCount: text.length,
  };
}

/**
 * Get a date string in YYYY-MM-DD format using local timezone.
 */
function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if a given date string is today (using local timezone).
 */
export function isToday(dateString: string): boolean {
  const today = getLocalDateString(new Date());
  return dateString === today;
}

/**
 * Get today's date string in YYYY-MM-DD format (using local timezone).
 */
export function getTodayString(): string {
  return getLocalDateString(new Date());
}
