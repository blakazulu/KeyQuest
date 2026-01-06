/**
 * Hebrew Stage 4: מילים (Words)
 * Building vocabulary with common Hebrew words.
 * Focus: Short words using all learned letters
 */

import type { Stage, Lesson } from '@/types/lesson';

const lessons: Lesson[] = [
  {
    id: 'he-stage-4-lesson-1',
    stageId: 4,
    lessonNumber: 1,
    title: { en: 'Two-Letter Words', he: 'מילים בשתי אותיות' },
    description: { en: 'Practice simple two-letter Hebrew words', he: 'תרגל מילים פשוטות בשתי אותיות' },
    newKeys: [],
    practiceKeys: [],
    difficulty: 'easy',
    xpReward: 60,
    passingAccuracy: 75,
    estimatedMinutes: 4,
    exercises: [
      { id: 'he-stage-4-lesson-1-ex-1', type: 'words', content: 'אם אב יד גב זה לא כן מה', instructions: { en: 'Type these two-letter words', he: 'הקלד את המילים הקצרות האלה' }, targetAccuracy: 75 },
      { id: 'he-stage-4-lesson-1-ex-2', type: 'words', content: 'על עם אל גם רק בו לו כי', instructions: { en: 'More two-letter words', he: 'עוד מילים בשתי אותיות' }, targetAccuracy: 75 },
      { id: 'he-stage-4-lesson-1-ex-3', type: 'words', content: 'או פה שם דג גל חם קר טל', instructions: { en: 'Keep practicing!', he: 'המשך לתרגל!' }, targetAccuracy: 80 },
    ],
  },
  {
    id: 'he-stage-4-lesson-2',
    stageId: 4,
    lessonNumber: 2,
    title: { en: 'Three-Letter Words', he: 'מילים בשלוש אותיות' },
    description: { en: 'Practice three-letter Hebrew words', he: 'תרגל מילים בשלוש אותיות' },
    newKeys: [],
    practiceKeys: [],
    difficulty: 'easy',
    xpReward: 65,
    passingAccuracy: 75,
    estimatedMinutes: 4,
    exercises: [
      { id: 'he-stage-4-lesson-2-ex-1', type: 'words', content: 'אמא אבא ילד כלב חתול', instructions: { en: 'Family and animal words', he: 'מילות משפחה וחיות' }, targetAccuracy: 75 },
      { id: 'he-stage-4-lesson-2-ex-2', type: 'words', content: 'בית ספר דלת מים שמש', instructions: { en: 'Object words', he: 'מילות חפצים' }, targetAccuracy: 75 },
      { id: 'he-stage-4-lesson-2-ex-3', type: 'words', content: 'טוב רע גדל קטן יפה', instructions: { en: 'Descriptive words', he: 'מילות תיאור' }, targetAccuracy: 80 },
    ],
  },
  {
    id: 'he-stage-4-lesson-3',
    stageId: 4,
    lessonNumber: 3,
    title: { en: 'Common Words', he: 'מילים נפוצות' },
    description: { en: 'Practice the most common Hebrew words', he: 'תרגל את המילים הנפוצות ביותר' },
    newKeys: [],
    practiceKeys: [],
    difficulty: 'medium',
    xpReward: 70,
    passingAccuracy: 75,
    estimatedMinutes: 4,
    exercises: [
      { id: 'he-stage-4-lesson-3-ex-1', type: 'words', content: 'שלום תודה בוקר ערב לילה', instructions: { en: 'Greetings and time words', he: 'מילות ברכה וזמן' }, targetAccuracy: 75 },
      { id: 'he-stage-4-lesson-3-ex-2', type: 'words', content: 'אני אתה את הוא היא אנחנו', instructions: { en: 'Pronoun words', he: 'מילות כינוי גוף' }, targetAccuracy: 75 },
      { id: 'he-stage-4-lesson-3-ex-3', type: 'words', content: 'רוצה יכול צריך אוהב שומע', instructions: { en: 'Action words', he: 'מילות פעולה' }, targetAccuracy: 80 },
    ],
  },
  {
    id: 'he-stage-4-lesson-4',
    stageId: 4,
    lessonNumber: 4,
    title: { en: 'Word Pairs', he: 'זוגות מילים' },
    description: { en: 'Practice word combinations', he: 'תרגל צירופי מילים' },
    newKeys: [],
    practiceKeys: [],
    difficulty: 'medium',
    xpReward: 70,
    passingAccuracy: 75,
    estimatedMinutes: 4,
    exercises: [
      { id: 'he-stage-4-lesson-4-ex-1', type: 'words', content: 'בוקר טוב ערב טוב לילה טוב', instructions: { en: 'Greeting phrases', he: 'ביטויי ברכה' }, targetAccuracy: 75 },
      { id: 'he-stage-4-lesson-4-ex-2', type: 'words', content: 'מה נשמע מה שלומך תודה רבה', instructions: { en: 'Polite phrases', he: 'ביטויי נימוס' }, targetAccuracy: 75 },
      { id: 'he-stage-4-lesson-4-ex-3', type: 'words', content: 'יום יפה בוקר נעים ערב נחמד', instructions: { en: 'Descriptive phrases', he: 'ביטויי תיאור' }, targetAccuracy: 80 },
    ],
  },
  {
    id: 'he-stage-4-lesson-5',
    stageId: 4,
    lessonNumber: 5,
    title: { en: 'Mixed Words Practice', he: 'תרגול מילים מעורב' },
    description: { en: 'Random word practice for fluency', he: 'תרגול מילים אקראי לשטף' },
    newKeys: [],
    practiceKeys: [],
    difficulty: 'medium',
    xpReward: 75,
    passingAccuracy: 80,
    estimatedMinutes: 5,
    exercises: [
      { id: 'he-stage-4-lesson-5-ex-1', type: 'words', content: 'שלום אני רוצה ללמוד עברית', instructions: { en: 'Mixed common words', he: 'מילים נפוצות מעורבות' }, targetAccuracy: 75 },
      { id: 'he-stage-4-lesson-5-ex-2', type: 'words', content: 'היום הלילה אתמול מחר תמיד', instructions: { en: 'Time-related words', he: 'מילות זמן' }, targetAccuracy: 75 },
      { id: 'he-stage-4-lesson-5-ex-3', type: 'words', content: 'אחד שתיים שלוש ארבע חמש', instructions: { en: 'Number words', he: 'מילות מספר' }, targetAccuracy: 80 },
    ],
  },
];

export const stage4Hebrew: Stage = {
  id: 4,
  name: { en: 'Word Wilderness', he: 'עולם המילים' },
  description: { en: 'Build vocabulary with common Hebrew words', he: 'בנה אוצר מילים עם מילים נפוצות בעברית' },
  icon: '📚',
  themeColor: 'var(--color-accent-purple)',
  lessons,
  masteredKeys: [],
  totalXp: lessons.reduce((sum, l) => sum + l.xpReward, 0),
  passingAccuracy: 75,
};
