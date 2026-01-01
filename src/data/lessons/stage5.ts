/**
 * Stage 5: Paragraph Peak
 * Full sentences and paragraphs
 * Focus: Punctuation, capitalization, and sentence flow
 */

import type { Stage, Lesson } from '@/types/lesson';

const lessons: Lesson[] = [
  {
    id: 'stage-5-lesson-1',
    stageId: 5,
    lessonNumber: 1,
    title: {
      en: 'Simple Sentences',
      he: 'משפטים פשוטים',
    },
    description: {
      en: 'Type complete sentences with proper punctuation',
      he: 'הקלד משפטים שלמים עם פיסוק נכון',
    },
    newKeys: [],
    practiceKeys: 'abcdefghijklmnopqrstuvwxyz.,'.split(''),
    difficulty: 'medium',
    xpReward: 100,
    passingAccuracy: 85,
    estimatedMinutes: 5,
    exercises: [
      {
        id: 'stage-5-lesson-1-ex-1',
        type: 'sentences',
        content: 'the sun is bright today. i love sunny days.',
        instructions: {
          en: 'Type these simple sentences. Watch for periods!',
          he: 'הקלד את המשפטים הפשוטים האלה. שים לב לנקודות!',
        },
        targetAccuracy: 80,
      },
      {
        id: 'stage-5-lesson-1-ex-2',
        type: 'sentences',
        content: 'cats are fun pets. dogs are loyal friends. both are great.',
        instructions: {
          en: 'Three sentences in a row!',
          he: 'שלושה משפטים ברצף!',
        },
        targetAccuracy: 85,
      },
      {
        id: 'stage-5-lesson-1-ex-3',
        type: 'sentences',
        content: 'learning to type is a skill. practice makes perfect. keep going.',
        instructions: {
          en: 'Motivational sentences! You got this!',
          he: 'משפטי מוטיבציה! אתה יכול!',
        },
        targetAccuracy: 85,
      },
    ],
  },
  {
    id: 'stage-5-lesson-2',
    stageId: 5,
    lessonNumber: 2,
    title: {
      en: 'Questions',
      he: 'שאלות',
    },
    description: {
      en: 'Practice typing questions with question marks',
      he: 'תרגל הקלדת שאלות עם סימני שאלה',
    },
    newKeys: ['?'],
    practiceKeys: 'abcdefghijklmnopqrstuvwxyz.?'.split(''),
    difficulty: 'medium',
    xpReward: 100,
    passingAccuracy: 85,
    estimatedMinutes: 5,
    exercises: [
      {
        id: 'stage-5-lesson-2-ex-1',
        type: 'sentences',
        content: 'how are you today? what is your name? where do you live?',
        instructions: {
          en: 'Simple questions. The ? is Shift + /',
          he: 'שאלות פשוטות. ה-? הוא Shift + /',
        },
        targetAccuracy: 80,
      },
      {
        id: 'stage-5-lesson-2-ex-2',
        type: 'sentences',
        content: 'do you like pizza? can you help me? will you come with us?',
        instructions: {
          en: 'Yes/no questions.',
          he: 'שאלות כן/לא.',
        },
        targetAccuracy: 85,
      },
      {
        id: 'stage-5-lesson-2-ex-3',
        type: 'sentences',
        content: 'what time is it? where are my keys? why is the sky blue?',
        instructions: {
          en: 'Everyday questions we all ask!',
          he: 'שאלות יומיומיות שכולנו שואלים!',
        },
        targetAccuracy: 85,
      },
    ],
  },
  {
    id: 'stage-5-lesson-3',
    stageId: 5,
    lessonNumber: 3,
    title: {
      en: 'Exclamations',
      he: 'קריאות',
    },
    description: {
      en: 'Add excitement with exclamation marks',
      he: 'הוסף התרגשות עם סימני קריאה',
    },
    newKeys: ['!'],
    practiceKeys: 'abcdefghijklmnopqrstuvwxyz.?!'.split(''),
    difficulty: 'medium',
    xpReward: 100,
    passingAccuracy: 85,
    estimatedMinutes: 5,
    exercises: [
      {
        id: 'stage-5-lesson-3-ex-1',
        type: 'sentences',
        content: 'wow! that is amazing! i love it! this is great!',
        instructions: {
          en: 'Express excitement! The ! is Shift + 1',
          he: 'הבע התרגשות! ה-! הוא Shift + 1',
        },
        targetAccuracy: 80,
      },
      {
        id: 'stage-5-lesson-3-ex-2',
        type: 'sentences',
        content: 'stop! watch out! be careful! look over here!',
        instructions: {
          en: 'Urgent exclamations!',
          he: 'קריאות דחופות!',
        },
        targetAccuracy: 85,
      },
      {
        id: 'stage-5-lesson-3-ex-3',
        type: 'sentences',
        content: 'happy birthday! congratulations! well done! you did it!',
        instructions: {
          en: 'Celebration phrases!',
          he: 'ביטויי חגיגה!',
        },
        targetAccuracy: 85,
      },
    ],
  },
  {
    id: 'stage-5-lesson-4',
    stageId: 5,
    lessonNumber: 4,
    title: {
      en: 'Mixed Punctuation',
      he: 'פיסוק מעורב',
    },
    description: {
      en: 'Combine periods, questions, and exclamations',
      he: 'שלב נקודות, שאלות וקריאות',
    },
    newKeys: [],
    practiceKeys: 'abcdefghijklmnopqrstuvwxyz.?!,'.split(''),
    difficulty: 'medium',
    xpReward: 110,
    passingAccuracy: 85,
    estimatedMinutes: 5,
    exercises: [
      {
        id: 'stage-5-lesson-4-ex-1',
        type: 'sentences',
        content: 'hello! how are you? i am fine. thanks for asking!',
        instructions: {
          en: 'A natural conversation with mixed punctuation.',
          he: 'שיחה טבעית עם פיסוק מעורב.',
        },
        targetAccuracy: 85,
      },
      {
        id: 'stage-5-lesson-4-ex-2',
        type: 'sentences',
        content: 'wait! did you see that? it was amazing. i want to see it again!',
        instructions: {
          en: 'Excitement builds through punctuation!',
          he: 'ההתרגשות נבנית דרך הפיסוק!',
        },
        targetAccuracy: 85,
      },
      {
        id: 'stage-5-lesson-4-ex-3',
        type: 'sentences',
        content: 'ready, set, go! who will win? the race has begun. this is exciting!',
        instructions: {
          en: 'A race commentary with all punctuation types.',
          he: 'פרשנות למרוץ עם כל סוגי הפיסוק.',
        },
        targetAccuracy: 85,
      },
    ],
  },
  {
    id: 'stage-5-lesson-5',
    stageId: 5,
    lessonNumber: 5,
    title: {
      en: 'Short Paragraphs',
      he: 'פסקאות קצרות',
    },
    description: {
      en: 'Type complete paragraphs with multiple sentences',
      he: 'הקלד פסקאות שלמות עם מספר משפטים',
    },
    newKeys: [],
    practiceKeys: 'abcdefghijklmnopqrstuvwxyz.?!,'.split(''),
    difficulty: 'hard',
    xpReward: 125,
    passingAccuracy: 85,
    estimatedMinutes: 6,
    exercises: [
      {
        id: 'stage-5-lesson-5-ex-1',
        type: 'paragraph',
        content: 'typing is a useful skill. when you type fast, you save time. practice every day to improve. soon you will be a typing expert!',
        instructions: {
          en: 'A motivational paragraph about typing.',
          he: 'פסקה מוטיבציונית על הקלדה.',
        },
        targetAccuracy: 85,
      },
      {
        id: 'stage-5-lesson-5-ex-2',
        type: 'paragraph',
        content: 'the cat sat on the mat. it was a sunny day. the cat was happy and warm. it purred softly and fell asleep.',
        instructions: {
          en: 'A simple story paragraph.',
          he: 'פסקת סיפור פשוטה.',
        },
        targetAccuracy: 85,
      },
      {
        id: 'stage-5-lesson-5-ex-3',
        type: 'paragraph',
        content: 'computers are amazing tools. they help us work, learn, and play. typing well makes using computers easier. keep practicing!',
        instructions: {
          en: 'An informational paragraph.',
          he: 'פסקה מידעית.',
        },
        targetAccuracy: 85,
      },
    ],
  },
  {
    id: 'stage-5-lesson-6',
    stageId: 5,
    lessonNumber: 6,
    title: {
      en: 'Sentence Mastery',
      he: 'שליטה במשפטים',
    },
    description: {
      en: 'Master sentences with the final challenge',
      he: 'שלוט במשפטים עם האתגר האחרון',
    },
    newKeys: [],
    practiceKeys: 'abcdefghijklmnopqrstuvwxyz.?!,'.split(''),
    difficulty: 'hard',
    xpReward: 150,
    passingAccuracy: 90,
    estimatedMinutes: 7,
    exercises: [
      {
        id: 'stage-5-lesson-6-ex-1',
        type: 'paragraph',
        content: 'welcome to the final challenge! are you ready? this will test everything you have learned. take a deep breath and begin.',
        instructions: {
          en: 'The ultimate sentence challenge begins!',
          he: 'אתגר המשפטים האולטימטיבי מתחיל!',
        },
        targetAccuracy: 85,
      },
      {
        id: 'stage-5-lesson-6-ex-2',
        type: 'paragraph',
        content: 'success comes from practice. every expert was once a beginner. believe in yourself and keep going. you are doing great!',
        instructions: {
          en: 'Stay motivated!',
          he: 'הישאר ממוטב!',
        },
        targetAccuracy: 90,
      },
      {
        id: 'stage-5-lesson-6-ex-3',
        type: 'accuracy',
        content: 'congratulations! you have completed the sentence challenge. your typing skills have improved so much. be proud of your progress!',
        instructions: {
          en: 'Final accuracy challenge!',
          he: 'אתגר דיוק אחרון!',
        },
        targetAccuracy: 90,
      },
    ],
  },
];

export const stage5: Stage = {
  id: 5,
  name: {
    en: 'Paragraph Peak',
    he: 'פסגת הפסקאות',
  },
  description: {
    en: 'Master full sentences and paragraphs with proper punctuation',
    he: 'שלוט במשפטים ופסקאות מלאים עם פיסוק נכון',
  },
  icon: '🏔️',
  themeColor: 'var(--color-accent-pink)',
  lessons,
  masteredKeys: ['?', '!'],
  totalXp: lessons.reduce((sum, lesson) => sum + lesson.xpReward, 0),
  passingAccuracy: 85,
};
