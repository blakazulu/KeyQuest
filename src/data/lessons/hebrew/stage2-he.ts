/**
 * Hebrew Stage 2: השורה העליונה (Top Row)
 * Expanding to the top row keys.
 * Focus: ק ר א ט ו ן ם פ
 */

import type { Stage, Lesson } from '@/types/lesson';

const lessons: Lesson[] = [
  {
    id: 'he-stage-2-lesson-1',
    stageId: 2,
    lessonNumber: 1,
    title: { en: 'Index Fingers Reach Up', he: 'האצבעות המורות מתרוממות' },
    description: { en: 'Learn ר and ו - index finger keys', he: 'למד ר ו-ו - מקשי האצבע המורה' },
    newKeys: ['ר', 'ו'],
    practiceKeys: ['ר', 'ו', 'כ', 'ח'],
    difficulty: 'beginner',
    xpReward: 50,
    passingAccuracy: 70,
    estimatedMinutes: 3,
    exercises: [
      { id: 'he-stage-2-lesson-1-ex-1', type: 'key-practice', content: 'ר ר ר ר ר ו ו ו ו ו', instructions: { en: 'Reach up with your index fingers to ר and ו', he: 'הרם את האצבעות המורות ל-ר ו-ו' }, focusKeys: ['ר', 'ו'], targetAccuracy: 70 },
      { id: 'he-stage-2-lesson-1-ex-2', type: 'key-practice', content: 'כר חו כר חו כר חו', instructions: { en: 'Home to top row transitions', he: 'מעבר משורת הבית לשורה העליונה' }, focusKeys: ['ר', 'ו', 'כ', 'ח'], targetAccuracy: 75 },
      { id: 'he-stage-2-lesson-1-ex-3', type: 'letter-combo', content: 'רכ וח רו כח רכו', instructions: { en: 'Mix home and top row keys', he: 'ערבב מקשי שורת הבית והשורה העליונה' }, focusKeys: ['ר', 'ו', 'כ', 'ח'], targetAccuracy: 75 },
    ],
  },
  {
    id: 'he-stage-2-lesson-2',
    stageId: 2,
    lessonNumber: 2,
    title: { en: 'Left Top Row', he: 'השורה העליונה שמאל' },
    description: { en: 'Learn ק and א', he: 'למד ק ו-א' },
    newKeys: ['ק', 'א'],
    practiceKeys: ['ק', 'ר', 'א', 'ג', 'ד'],
    difficulty: 'beginner',
    xpReward: 50,
    passingAccuracy: 70,
    estimatedMinutes: 3,
    exercises: [
      { id: 'he-stage-2-lesson-2-ex-1', type: 'key-practice', content: 'ק ק ק ק א א א א', instructions: { en: 'Practice ק with middle finger and א with index', he: 'תרגל ק עם האמה ו-א עם האצבע' }, focusKeys: ['ק', 'א'], targetAccuracy: 70 },
      { id: 'he-stage-2-lesson-2-ex-2', type: 'key-practice', content: 'קג אכ קג אכ רד', instructions: { en: 'Home to top transitions', he: 'מעברים בין שורת הבית לעליונה' }, focusKeys: ['ק', 'א', 'ג', 'כ'], targetAccuracy: 75 },
      { id: 'he-stage-2-lesson-2-ex-3', type: 'letter-combo', content: 'קרא גדש קאר', instructions: { en: 'Combine all left hand keys', he: 'שלב את כל המקשים של יד שמאל' }, focusKeys: ['ק', 'ר', 'א', 'ג', 'ד', 'ש'], targetAccuracy: 75 },
    ],
  },
  {
    id: 'he-stage-2-lesson-3',
    stageId: 2,
    lessonNumber: 3,
    title: { en: 'Right Top Row', he: 'השורה העליונה ימין' },
    description: { en: 'Learn ט, ן, ם, פ', he: 'למד ט, ן, ם, פ' },
    newKeys: ['ט', 'ן', 'ם', 'פ'],
    practiceKeys: ['ט', 'ו', 'ן', 'ם', 'פ', 'ח', 'ל', 'ך', 'ף'],
    difficulty: 'beginner',
    xpReward: 60,
    passingAccuracy: 70,
    estimatedMinutes: 4,
    exercises: [
      { id: 'he-stage-2-lesson-3-ex-1', type: 'key-practice', content: 'ט ט ט ן ן ן ם ם ם פ פ פ', instructions: { en: 'Practice each new key', he: 'תרגל כל מקש חדש' }, focusKeys: ['ט', 'ן', 'ם', 'פ'], targetAccuracy: 70 },
      { id: 'he-stage-2-lesson-3-ex-2', type: 'key-practice', content: 'טח ןל ום ךפ טח ןל', instructions: { en: 'Top to home row pairs', he: 'זוגות שורה עליונה לשורת הבית' }, focusKeys: ['ט', 'ן', 'ם', 'פ'], targetAccuracy: 75 },
      { id: 'he-stage-2-lesson-3-ex-3', type: 'letter-combo', content: 'טוןם פחל וטן', instructions: { en: 'Right hand top row combinations', he: 'צירופי שורה עליונה יד ימין' }, focusKeys: ['ט', 'ו', 'ן', 'ם', 'פ'], targetAccuracy: 75 },
    ],
  },
  {
    id: 'he-stage-2-lesson-4',
    stageId: 2,
    lessonNumber: 4,
    title: { en: 'Full Top Row', he: 'השורה העליונה המלאה' },
    description: { en: 'Combine all top row keys', he: 'שלב את כל מקשי השורה העליונה' },
    newKeys: [],
    practiceKeys: ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'],
    difficulty: 'easy',
    xpReward: 60,
    passingAccuracy: 75,
    estimatedMinutes: 4,
    exercises: [
      { id: 'he-stage-2-lesson-4-ex-1', type: 'key-practice', content: 'קראט וןםפ קראט וןםפ', instructions: { en: 'Full top row left to right', he: 'השורה העליונה המלאה משמאל לימין' }, focusKeys: ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'], targetAccuracy: 70 },
      { id: 'he-stage-2-lesson-4-ex-2', type: 'letter-combo', content: 'קו רן אם טף קו רן', instructions: { en: 'Cross-hand top row practice', he: 'תרגול שורה עליונה חוצה ידיים' }, focusKeys: ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'], targetAccuracy: 75 },
      { id: 'he-stage-2-lesson-4-ex-3', type: 'letter-combo', content: 'טורא קןום פראט', instructions: { en: 'Random top row combinations', he: 'צירופים אקראיים מהשורה העליונה' }, focusKeys: ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'], targetAccuracy: 75 },
    ],
  },
  {
    id: 'he-stage-2-lesson-5',
    stageId: 2,
    lessonNumber: 5,
    title: { en: 'Home & Top Combined', he: 'שורת הבית והעליונה יחד' },
    description: { en: 'Practice both rows together', he: 'תרגל את שתי השורות יחד' },
    newKeys: [],
    practiceKeys: ['ש', 'ד', 'ג', 'כ', 'ח', 'ל', 'ך', 'ף', 'ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'],
    difficulty: 'easy',
    xpReward: 70,
    passingAccuracy: 75,
    estimatedMinutes: 4,
    exercises: [
      { id: 'he-stage-2-lesson-5-ex-1', type: 'letter-combo', content: 'קש רד אג טכ וח ןל ום ףפ', instructions: { en: 'Top and home row pairs', he: 'זוגות שורה עליונה ושורת הבית' }, focusKeys: ['ש', 'ד', 'ג', 'כ', 'ק', 'ר', 'א', 'ט'], targetAccuracy: 75 },
      { id: 'he-stage-2-lesson-5-ex-2', type: 'letter-combo', content: 'שרק דאג כטר חון לםף', instructions: { en: 'Mix all keys fluently', he: 'ערבב את כל המקשים בזרימה' }, focusKeys: ['ש', 'ד', 'ג', 'כ', 'ק', 'ר', 'א'], targetAccuracy: 75 },
      { id: 'he-stage-2-lesson-5-ex-3', type: 'words', content: 'את רק גם דג כל', instructions: { en: 'Simple Hebrew words!', he: 'מילים פשוטות בעברית!' }, focusKeys: ['א', 'ת', 'ר', 'ק', 'ג', 'ם', 'ד', 'כ', 'ל'], targetAccuracy: 80 },
    ],
  },
];

export const stage2Hebrew: Stage = {
  id: 2,
  name: { en: 'Top Row Trek', he: 'השורה העליונה' },
  description: { en: 'Master the Hebrew top row: ק ר א ט ו ן ם פ', he: 'שלוט בשורה העליונה: ק ר א ט ו ן ם פ' },
  icon: '⬆️',
  themeColor: 'var(--color-accent-cyan)',
  lessons,
  masteredKeys: ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'],
  totalXp: lessons.reduce((sum, l) => sum + l.xpReward, 0),
  passingAccuracy: 70,
};
