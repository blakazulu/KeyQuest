/**
 * Hebrew Stage 3: השורה התחתונה (Bottom Row)
 * Expanding to the bottom row keys.
 * Focus: ז ס ב ה נ מ צ ת ץ
 */

import type { Stage, Lesson } from '@/types/lesson';

const lessons: Lesson[] = [
  {
    id: 'he-stage-3-lesson-1',
    stageId: 3,
    lessonNumber: 1,
    title: { en: 'Index Fingers Reach Down', he: 'האצבעות המורות יורדות' },
    description: { en: 'Learn ה and מ - index finger keys', he: 'למד ה ו-מ - מקשי האצבע המורה' },
    newKeys: ['ה', 'מ'],
    practiceKeys: ['ה', 'מ', 'כ', 'ח'],
    difficulty: 'beginner',
    xpReward: 50,
    passingAccuracy: 70,
    estimatedMinutes: 3,
    exercises: [
      { id: 'he-stage-3-lesson-1-ex-1', type: 'key-practice', content: 'ה ה ה ה ה מ מ מ מ מ', instructions: { en: 'Reach down with your index fingers to ה and מ', he: 'הורד את האצבעות המורות ל-ה ו-מ' }, focusKeys: ['ה', 'מ'], targetAccuracy: 70 },
      { id: 'he-stage-3-lesson-1-ex-2', type: 'key-practice', content: 'כה חמ כה חמ כה חמ', instructions: { en: 'Home to bottom row transitions', he: 'מעבר משורת הבית לשורה התחתונה' }, focusKeys: ['ה', 'מ', 'כ', 'ח'], targetAccuracy: 75 },
      { id: 'he-stage-3-lesson-1-ex-3', type: 'letter-combo', content: 'הכ מח הם כמ חה', instructions: { en: 'Mix home and bottom row keys', he: 'ערבב מקשי שורת הבית והתחתונה' }, focusKeys: ['ה', 'מ', 'כ', 'ח'], targetAccuracy: 75 },
    ],
  },
  {
    id: 'he-stage-3-lesson-2',
    stageId: 3,
    lessonNumber: 2,
    title: { en: 'Left Bottom Row', he: 'השורה התחתונה שמאל' },
    description: { en: 'Learn ז ס ב נ', he: 'למד ז ס ב נ' },
    newKeys: ['ז', 'ס', 'ב', 'נ'],
    practiceKeys: ['ז', 'ס', 'ב', 'ה', 'נ', 'ש', 'ד', 'ג', 'כ'],
    difficulty: 'beginner',
    xpReward: 55,
    passingAccuracy: 70,
    estimatedMinutes: 4,
    exercises: [
      { id: 'he-stage-3-lesson-2-ex-1', type: 'key-practice', content: 'ז ז ס ס ב ב נ נ ה ה', instructions: { en: 'Practice each new key', he: 'תרגל כל מקש חדש' }, focusKeys: ['ז', 'ס', 'ב', 'נ'], targetAccuracy: 70 },
      { id: 'he-stage-3-lesson-2-ex-2', type: 'key-practice', content: 'זש סד בג נכ הכ', instructions: { en: 'Bottom to home row pairs', he: 'זוגות שורה תחתונה לשורת הבית' }, focusKeys: ['ז', 'ס', 'ב', 'נ'], targetAccuracy: 75 },
      { id: 'he-stage-3-lesson-2-ex-3', type: 'letter-combo', content: 'זסב הנ בזס נהב', instructions: { en: 'Left hand bottom row practice', he: 'תרגול שורה תחתונה יד שמאל' }, focusKeys: ['ז', 'ס', 'ב', 'ה', 'נ'], targetAccuracy: 75 },
    ],
  },
  {
    id: 'he-stage-3-lesson-3',
    stageId: 3,
    lessonNumber: 3,
    title: { en: 'Right Bottom Row', he: 'השורה התחתונה ימין' },
    description: { en: 'Learn צ ת ץ', he: 'למד צ ת ץ' },
    newKeys: ['צ', 'ת', 'ץ'],
    practiceKeys: ['מ', 'צ', 'ת', 'ץ', 'ח', 'ל', 'ך'],
    difficulty: 'beginner',
    xpReward: 55,
    passingAccuracy: 70,
    estimatedMinutes: 4,
    exercises: [
      { id: 'he-stage-3-lesson-3-ex-1', type: 'key-practice', content: 'מ מ צ צ ת ת ץ ץ', instructions: { en: 'Practice each new key', he: 'תרגל כל מקש חדש' }, focusKeys: ['מ', 'צ', 'ת', 'ץ'], targetAccuracy: 70 },
      { id: 'he-stage-3-lesson-3-ex-2', type: 'key-practice', content: 'מח צל תך ץף', instructions: { en: 'Bottom to home row transitions', he: 'מעברים מהתחתונה לשורת הבית' }, focusKeys: ['מ', 'צ', 'ת', 'ץ'], targetAccuracy: 75 },
      { id: 'he-stage-3-lesson-3-ex-3', type: 'letter-combo', content: 'מצת ץתצ מתץ', instructions: { en: 'Right hand bottom row combinations', he: 'צירופי שורה תחתונה יד ימין' }, focusKeys: ['מ', 'צ', 'ת', 'ץ'], targetAccuracy: 75 },
    ],
  },
  {
    id: 'he-stage-3-lesson-4',
    stageId: 3,
    lessonNumber: 4,
    title: { en: 'Full Bottom Row', he: 'השורה התחתונה המלאה' },
    description: { en: 'Combine all bottom row keys', he: 'שלב את כל מקשי השורה התחתונה' },
    newKeys: [],
    practiceKeys: ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ'],
    difficulty: 'easy',
    xpReward: 60,
    passingAccuracy: 75,
    estimatedMinutes: 4,
    exercises: [
      { id: 'he-stage-3-lesson-4-ex-1', type: 'key-practice', content: 'זסבהנ מצתץ זסבהנ', instructions: { en: 'Full bottom row left to right', he: 'השורה התחתונה המלאה משמאל לימין' }, focusKeys: ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ'], targetAccuracy: 70 },
      { id: 'he-stage-3-lesson-4-ex-2', type: 'letter-combo', content: 'זמ סצ בת הץ נמ', instructions: { en: 'Cross-hand bottom row practice', he: 'תרגול שורה תחתונה חוצה ידיים' }, focusKeys: ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ'], targetAccuracy: 75 },
      { id: 'he-stage-3-lesson-4-ex-3', type: 'letter-combo', content: 'נבסז הממצת ץתב', instructions: { en: 'Random bottom row combinations', he: 'צירופים אקראיים מהשורה התחתונה' }, focusKeys: ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ'], targetAccuracy: 75 },
    ],
  },
  {
    id: 'he-stage-3-lesson-5',
    stageId: 3,
    lessonNumber: 5,
    title: { en: 'All Three Rows', he: 'כל שלוש השורות' },
    description: { en: 'Practice all letter keys together', he: 'תרגל את כל מקשי האותיות יחד' },
    newKeys: [],
    practiceKeys: ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ף', 'ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ', 'ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ'],
    difficulty: 'easy',
    xpReward: 75,
    passingAccuracy: 75,
    estimatedMinutes: 5,
    exercises: [
      { id: 'he-stage-3-lesson-5-ex-1', type: 'letter-combo', content: 'שרז דאס גקב כטה', instructions: { en: 'All rows mixed together', he: 'כל השורות מעורבבות יחד' }, focusKeys: ['ש', 'ר', 'ז', 'ד', 'א', 'ס', 'ג', 'ק', 'ב', 'כ', 'ט', 'ה'], targetAccuracy: 70 },
      { id: 'he-stage-3-lesson-5-ex-2', type: 'words', content: 'זה בא גם את על', instructions: { en: 'Simple Hebrew words!', he: 'מילים פשוטות בעברית!' }, focusKeys: ['ז', 'ה', 'ב', 'א', 'ג', 'ם', 'א', 'ת', 'ע', 'ל'], targetAccuracy: 75 },
      { id: 'he-stage-3-lesson-5-ex-3', type: 'words', content: 'מה כן לא אם בת', instructions: { en: 'More Hebrew words!', he: 'עוד מילים בעברית!' }, focusKeys: ['מ', 'ה', 'כ', 'ן', 'ל', 'א', 'א', 'ם', 'ב', 'ת'], targetAccuracy: 80 },
    ],
  },
];

export const stage3Hebrew: Stage = {
  id: 3,
  name: { en: 'Bottom Row Basics', he: 'השורה התחתונה' },
  description: { en: 'Master the Hebrew bottom row: ז ס ב ה נ מ צ ת ץ', he: 'שלוט בשורה התחתונה: ז ס ב ה נ מ צ ת ץ' },
  icon: '⬇️',
  themeColor: 'var(--color-accent-orange)',
  lessons,
  masteredKeys: ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ'],
  totalXp: lessons.reduce((sum, l) => sum + l.xpReward, 0),
  passingAccuracy: 70,
};
