/**
 * Hebrew Stage 5: משפטים (Sentences)
 * Building fluency with Hebrew sentences.
 * Focus: Complete sentences with proper spacing
 */

import type { Stage, Lesson } from '@/types/lesson';

const lessons: Lesson[] = [
  {
    id: 'he-stage-5-lesson-1',
    stageId: 5,
    lessonNumber: 1,
    title: { en: 'Simple Sentences', he: 'משפטים פשוטים' },
    description: { en: 'Practice typing simple Hebrew sentences', he: 'תרגל הקלדת משפטים פשוטים בעברית' },
    newKeys: [],
    practiceKeys: [],
    difficulty: 'medium',
    xpReward: 80,
    passingAccuracy: 75,
    estimatedMinutes: 5,
    exercises: [
      { id: 'he-stage-5-lesson-1-ex-1', type: 'sentences', content: 'שלום לכולם. מה שלומך היום?', instructions: { en: 'Type these greeting sentences', he: 'הקלד את משפטי הברכה האלה' }, targetAccuracy: 75 },
      { id: 'he-stage-5-lesson-1-ex-2', type: 'sentences', content: 'היום יום יפה. השמש זורחת.', instructions: { en: 'Weather-related sentences', he: 'משפטים על מזג האוויר' }, targetAccuracy: 75 },
      { id: 'he-stage-5-lesson-1-ex-3', type: 'sentences', content: 'אני אוהב ללמוד. הלמידה מעניינת.', instructions: { en: 'Learning-related sentences', he: 'משפטים על לימודים' }, targetAccuracy: 80 },
    ],
  },
  {
    id: 'he-stage-5-lesson-2',
    stageId: 5,
    lessonNumber: 2,
    title: { en: 'Question Sentences', he: 'משפטי שאלה' },
    description: { en: 'Practice typing questions in Hebrew', he: 'תרגל הקלדת שאלות בעברית' },
    newKeys: [],
    practiceKeys: [],
    difficulty: 'medium',
    xpReward: 80,
    passingAccuracy: 75,
    estimatedMinutes: 5,
    exercises: [
      { id: 'he-stage-5-lesson-2-ex-1', type: 'sentences', content: 'מה השעה? איפה אתה גר?', instructions: { en: 'Simple questions', he: 'שאלות פשוטות' }, targetAccuracy: 75 },
      { id: 'he-stage-5-lesson-2-ex-2', type: 'sentences', content: 'מי זה? מה זה? למה?', instructions: { en: 'Basic question words', he: 'מילות שאלה בסיסיות' }, targetAccuracy: 75 },
      { id: 'he-stage-5-lesson-2-ex-3', type: 'sentences', content: 'האם אתה מבין? האם זה נכון?', instructions: { en: 'Yes/no questions', he: 'שאלות כן/לא' }, targetAccuracy: 80 },
    ],
  },
  {
    id: 'he-stage-5-lesson-3',
    stageId: 5,
    lessonNumber: 3,
    title: { en: 'Daily Conversation', he: 'שיחה יומיומית' },
    description: { en: 'Practice everyday conversation phrases', he: 'תרגל ביטויי שיחה יומיומיים' },
    newKeys: [],
    practiceKeys: [],
    difficulty: 'medium',
    xpReward: 85,
    passingAccuracy: 75,
    estimatedMinutes: 5,
    exercises: [
      { id: 'he-stage-5-lesson-3-ex-1', type: 'sentences', content: 'בוקר טוב! מה נשמע? הכל בסדר.', instructions: { en: 'Morning conversation', he: 'שיחת בוקר' }, targetAccuracy: 75 },
      { id: 'he-stage-5-lesson-3-ex-2', type: 'sentences', content: 'תודה רבה. על לא דבר. בבקשה.', instructions: { en: 'Polite expressions', he: 'ביטויי נימוס' }, targetAccuracy: 75 },
      { id: 'he-stage-5-lesson-3-ex-3', type: 'sentences', content: 'נעים מאד. שמחתי להכיר. להתראות!', instructions: { en: 'Meeting and parting', he: 'פגישה ופרידה' }, targetAccuracy: 80 },
    ],
  },
  {
    id: 'he-stage-5-lesson-4',
    stageId: 5,
    lessonNumber: 4,
    title: { en: 'Longer Sentences', he: 'משפטים ארכים' },
    description: { en: 'Practice typing longer Hebrew sentences', he: 'תרגל הקלדת משפטים ארכים יותר' },
    newKeys: [],
    practiceKeys: [],
    difficulty: 'medium',
    xpReward: 90,
    passingAccuracy: 75,
    estimatedMinutes: 6,
    exercises: [
      { id: 'he-stage-5-lesson-4-ex-1', type: 'sentences', content: 'אני לומד לכתוב בעברית על המחשב.', instructions: { en: 'Typing about typing!', he: 'הקלדה על הקלדה!' }, targetAccuracy: 75 },
      { id: 'he-stage-5-lesson-4-ex-2', type: 'sentences', content: 'הספר הזה מאד מעניין ושווה קריאה.', instructions: { en: 'Opinion sentence', he: 'משפט דעה' }, targetAccuracy: 75 },
      { id: 'he-stage-5-lesson-4-ex-3', type: 'sentences', content: 'כאשר מתרגלים כל יום, רואים שיפור.', instructions: { en: 'Motivational sentence', he: 'משפט מוטיבציה' }, targetAccuracy: 80 },
    ],
  },
  {
    id: 'he-stage-5-lesson-5',
    stageId: 5,
    lessonNumber: 5,
    title: { en: 'Mixed Sentences', he: 'משפטים מעורבים' },
    description: { en: 'Practice a variety of sentence types', he: 'תרגל מגוון סוגי משפטים' },
    newKeys: [],
    practiceKeys: [],
    difficulty: 'hard',
    xpReward: 100,
    passingAccuracy: 80,
    estimatedMinutes: 6,
    exercises: [
      { id: 'he-stage-5-lesson-5-ex-1', type: 'sentences', content: 'הקלדה מהירה דורשת תרגול. כל יום קצת.', instructions: { en: 'Practice makes perfect', he: 'תרגול עושה מושלם' }, targetAccuracy: 75 },
      { id: 'he-stage-5-lesson-5-ex-2', type: 'sentences', content: 'המקלדת היא הכלי שלנו. נלמד להשתמש בה.', instructions: { en: 'Tool and learning', he: 'כלי ולמידה' }, targetAccuracy: 80 },
      { id: 'he-stage-5-lesson-5-ex-3', type: 'sentences', content: 'צעד אחר צעד, אני מתקדם. ההצלחה קרובה!', instructions: { en: 'Encouragement sentences', he: 'משפטי עידוד' }, targetAccuracy: 80 },
    ],
  },
];

export const stage5Hebrew: Stage = {
  id: 5,
  name: { en: 'Sentence Summit', he: 'פסגת המשפטים' },
  description: { en: 'Build fluency with complete Hebrew sentences', he: 'בנה שטף עם משפטים שלמים בעברית' },
  icon: '💬',
  themeColor: 'var(--color-accent-pink)',
  lessons,
  masteredKeys: [],
  totalXp: lessons.reduce((sum, l) => sum + l.xpReward, 0),
  passingAccuracy: 75,
};
