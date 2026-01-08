/**
 * Hebrew Stage 6: מאסטר (Mastery)
 * Advanced typing challenges for speed and accuracy.
 * Focus: Speed building, real-world texts, and paragraphs
 */

import type { Stage, Lesson } from '@/types/lesson';

// All Hebrew letters + punctuation for mastery practice
const hebrewLettersWithPunctuation = [...'אבגדהוזחטיכךלמםנןסעפףצץקרשת'.split(''), '.', '?', '!', ','];

const lessons: Lesson[] = [
  {
    id: 'he-stage-6-lesson-1',
    stageId: 6,
    lessonNumber: 1,
    title: { en: 'Speed Building', he: 'בניית מהירות' },
    description: { en: 'Focus on typing speed with familiar words', he: 'התמקד במהירות הקלדה עם מילים מוכרות' },
    newKeys: [],
    practiceKeys: hebrewLettersWithPunctuation,
    difficulty: 'hard',
    xpReward: 100,
    passingAccuracy: 80,
    estimatedMinutes: 5,
    exercises: [
      { id: 'he-stage-6-lesson-1-ex-1', type: 'timed', content: 'את זה גם כן לא על אם יש מה כי', instructions: { en: 'Type common words as fast as you can!', he: 'הקלד מילים נפוצות כמה שיותר מהר!' }, targetAccuracy: 75, timeLimit: 60 },
      { id: 'he-stage-6-lesson-1-ex-2', type: 'timed', content: 'שלום תודה בוקר טוב ערב נעים לילה שקט', instructions: { en: 'Speed typing: greetings', he: 'הקלדה מהירה: ברכות' }, targetAccuracy: 75, timeLimit: 60 },
      { id: 'he-stage-6-lesson-1-ex-3', type: 'timed', content: 'אני אתה הוא היא אנחנו אתם הם הן', instructions: { en: 'Speed typing: pronouns', he: 'הקלדה מהירה: כינויים' }, targetAccuracy: 80, timeLimit: 60 },
    ],
  },
  {
    id: 'he-stage-6-lesson-2',
    stageId: 6,
    lessonNumber: 2,
    title: { en: 'Paragraph Practice', he: 'תרגול פסקאות' },
    description: { en: 'Type longer passages of Hebrew text', he: 'הקלד קטעי טקסט ארכים יותר בעברית' },
    newKeys: [],
    practiceKeys: hebrewLettersWithPunctuation,
    difficulty: 'hard',
    xpReward: 110,
    passingAccuracy: 80,
    estimatedMinutes: 6,
    exercises: [
      { id: 'he-stage-6-lesson-2-ex-1', type: 'paragraph', content: 'הקלדה עיוורת היא מיומנות חשובה. כאשר לומדים להקליד נכון, החיים נהיים קלים יותר. המחשב הפך לכלי עבודה מרכזי בחיינו.', instructions: { en: 'Type this paragraph about typing', he: 'הקלד את הפסקה הזו על הקלדה' }, targetAccuracy: 75 },
      { id: 'he-stage-6-lesson-2-ex-2', type: 'paragraph', content: 'תרגול יומי הוא המפתח להצלחה. כל יום קצת, וההתקדמות מצטברת. אל תתיאש אם קשה בהתחלה.', instructions: { en: 'Motivational paragraph', he: 'פסקת מוטיבציה' }, targetAccuracy: 80 },
      { id: 'he-stage-6-lesson-2-ex-3', type: 'paragraph', content: 'העברית היא שפה יפה ועשירה. יש בה היסטוריה של אלפי שנים. כיום היא השפה הרשמית של מדינת ישראל.', instructions: { en: 'About the Hebrew language', he: 'על השפה העברית' }, targetAccuracy: 80 },
    ],
  },
  {
    id: 'he-stage-6-lesson-3',
    stageId: 6,
    lessonNumber: 3,
    title: { en: 'Real-World Texts', he: 'טקסטים מהעולם האמיתי' },
    description: { en: 'Practice with realistic everyday texts', he: 'תרגל עם טקסטים יומיומיים אמיתיים' },
    newKeys: [],
    practiceKeys: hebrewLettersWithPunctuation,
    difficulty: 'hard',
    xpReward: 120,
    passingAccuracy: 80,
    estimatedMinutes: 6,
    exercises: [
      { id: 'he-stage-6-lesson-3-ex-1', type: 'paragraph', content: 'שלום רב. תודה על ההודעה. אני אחזור אליך בהקדם. בברכה.', instructions: { en: 'Email-style message', he: 'הודעה בסגנון מייל' }, targetAccuracy: 80 },
      { id: 'he-stage-6-lesson-3-ex-2', type: 'paragraph', content: 'הפגישה תתקיים מחר בשעה עשר בבקר. נא לאשר השתתפות. תודה מראש.', instructions: { en: 'Meeting invitation', he: 'הזמנה לפגישה' }, targetAccuracy: 80 },
      { id: 'he-stage-6-lesson-3-ex-3', type: 'paragraph', content: 'רשימת קניות: לחם, חלב, ביצים, גבינה, ירקות, פירות, מים. לא לשכח!', instructions: { en: 'Shopping list', he: 'רשימת קניות' }, targetAccuracy: 85 },
    ],
  },
  {
    id: 'he-stage-6-lesson-4',
    stageId: 6,
    lessonNumber: 4,
    title: { en: 'Final Challenge', he: 'האתגר האחרון' },
    description: { en: 'Put your Hebrew typing skills to the ultimate test!', he: 'שים את כישורי ההקלדה שלך במבחן האולטימטיבי!' },
    newKeys: [],
    practiceKeys: hebrewLettersWithPunctuation,
    difficulty: 'expert',
    xpReward: 150,
    passingAccuracy: 85,
    estimatedMinutes: 8,
    exercises: [
      { id: 'he-stage-6-lesson-4-ex-1', type: 'paragraph', content: 'הגעת לסוף המסע. כעת אתה שולט בהקלדה עברית. המיומנות הזו תשמש אותך לכל החיים. מזל טוב על ההישג המדהים!', instructions: { en: 'Congratulations passage', he: 'קטע ברכות' }, targetAccuracy: 80 },
      { id: 'he-stage-6-lesson-4-ex-2', type: 'timed', content: 'הקלדה מהירה ומדייקת היא מיומנות חשובה בעולם הדיגיטלי. תרגול עקבי הוא המפתח להצלחה.', instructions: { en: 'Speed test!', he: 'מבחן מהירות!' }, targetAccuracy: 80, timeLimit: 90 },
      { id: 'he-stage-6-lesson-4-ex-3', type: 'accuracy', content: 'סיימת את כל השלבים. אתה מאסטר בהקלדה עברית. המשך לתרגל כדי לשמור על הכישורים שלך. בהצלחה בהמשך!', instructions: { en: 'Final accuracy challenge', he: 'אתגר דיוק אחרון' }, targetAccuracy: 90 },
    ],
  },
];

export const stage6Hebrew: Stage = {
  id: 6,
  name: { en: 'Master Mountain', he: 'פסגת המאסטר' },
  description: { en: 'Achieve Hebrew typing mastery with advanced challenges', he: 'השג שליטה מלאה בהקלדה עברית עם אתגרים מתקדמים' },
  icon: '🏆',
  themeColor: 'var(--color-accent-gold)',
  lessons,
  masteredKeys: [],
  totalXp: lessons.reduce((sum, l) => sum + l.xpReward, 0),
  passingAccuracy: 80,
};
