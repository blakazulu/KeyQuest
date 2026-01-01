/**
 * Stage 4: Sentence Safari
 * Building words and short phrases
 * Focus: Common 3-5 letter words, building vocabulary
 */

import type { Stage, Lesson } from '@/types/lesson';

const lessons: Lesson[] = [
  {
    id: 'stage-4-lesson-1',
    stageId: 4,
    lessonNumber: 1,
    title: {
      en: 'Three-Letter Words',
      he: 'מילים בנות שלוש אותיות',
    },
    description: {
      en: 'Master common three-letter words',
      he: 'שלוט במילים נפוצות בנות שלוש אותיות',
    },
    newKeys: [],
    practiceKeys: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    difficulty: 'easy',
    xpReward: 75,
    passingAccuracy: 80,
    estimatedMinutes: 4,
    exercises: [
      {
        id: 'stage-4-lesson-1-ex-1',
        type: 'words',
        content: 'the and for are but not you all can had',
        instructions: {
          en: 'The most common three-letter words.',
          he: 'המילים הנפוצות ביותר בנות שלוש אותיות.',
        },
        targetAccuracy: 75,
      },
      {
        id: 'stage-4-lesson-1-ex-2',
        type: 'words',
        content: 'her was one our out day get has him his',
        instructions: {
          en: 'More common words - keep your rhythm!',
          he: 'עוד מילים נפוצות - שמור על הקצב!',
        },
        targetAccuracy: 80,
      },
      {
        id: 'stage-4-lesson-1-ex-3',
        type: 'words',
        content: 'how man new now old see way who boy did',
        instructions: {
          en: 'Build your speed with these familiar words.',
          he: 'בנה את המהירות שלך עם מילים מוכרות אלה.',
        },
        targetAccuracy: 80,
      },
    ],
  },
  {
    id: 'stage-4-lesson-2',
    stageId: 4,
    lessonNumber: 2,
    title: {
      en: 'Four-Letter Words',
      he: 'מילים בנות ארבע אותיות',
    },
    description: {
      en: 'Level up to four-letter words',
      he: 'התקדם למילים בנות ארבע אותיות',
    },
    newKeys: [],
    practiceKeys: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    difficulty: 'easy',
    xpReward: 80,
    passingAccuracy: 80,
    estimatedMinutes: 5,
    exercises: [
      {
        id: 'stage-4-lesson-2-ex-1',
        type: 'words',
        content: 'that with have this will your from they',
        instructions: {
          en: 'Essential four-letter words.',
          he: 'מילים חיוניות בנות ארבע אותיות.',
        },
        targetAccuracy: 75,
      },
      {
        id: 'stage-4-lesson-2-ex-2',
        type: 'words',
        content: 'been have some what when make like time',
        instructions: {
          en: 'More high-frequency words.',
          he: 'עוד מילים בתדירות גבוהה.',
        },
        targetAccuracy: 80,
      },
      {
        id: 'stage-4-lesson-2-ex-3',
        type: 'words',
        content: 'just know take come want look good work',
        instructions: {
          en: 'Action words you use every day.',
          he: 'מילות פעולה שאתה משתמש בהן כל יום.',
        },
        targetAccuracy: 80,
      },
      {
        id: 'stage-4-lesson-2-ex-4',
        type: 'words',
        content: 'year also back give most only over such',
        instructions: {
          en: 'Complete your four-letter mastery!',
          he: 'השלם את השליטה במילים בנות ארבע אותיות!',
        },
        targetAccuracy: 80,
      },
    ],
  },
  {
    id: 'stage-4-lesson-3',
    stageId: 4,
    lessonNumber: 3,
    title: {
      en: 'Five-Letter Words',
      he: 'מילים בנות חמש אותיות',
    },
    description: {
      en: 'Challenge yourself with five-letter words',
      he: 'אתגר את עצמך עם מילים בנות חמש אותיות',
    },
    newKeys: [],
    practiceKeys: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    difficulty: 'medium',
    xpReward: 85,
    passingAccuracy: 80,
    estimatedMinutes: 5,
    exercises: [
      {
        id: 'stage-4-lesson-3-ex-1',
        type: 'words',
        content: 'there their which would these other about',
        instructions: {
          en: 'Common five-letter words.',
          he: 'מילים נפוצות בנות חמש אותיות.',
        },
        targetAccuracy: 75,
      },
      {
        id: 'stage-4-lesson-3-ex-2',
        type: 'words',
        content: 'could after first water where think being',
        instructions: {
          en: 'Keep building your vocabulary!',
          he: 'המשך לבנות את אוצר המילים שלך!',
        },
        targetAccuracy: 80,
      },
      {
        id: 'stage-4-lesson-3-ex-3',
        type: 'words',
        content: 'great place right still young every found',
        instructions: {
          en: 'Words you see everywhere.',
          he: 'מילים שאתה רואה בכל מקום.',
        },
        targetAccuracy: 80,
      },
      {
        id: 'stage-4-lesson-3-ex-4',
        type: 'words',
        content: 'world house never under again might while',
        instructions: {
          en: 'Complete the five-letter challenge!',
          he: 'השלם את האתגר של מילים בנות חמש אותיות!',
        },
        targetAccuracy: 80,
      },
    ],
  },
  {
    id: 'stage-4-lesson-4',
    stageId: 4,
    lessonNumber: 4,
    title: {
      en: 'Word Pairs',
      he: 'זוגות מילים',
    },
    description: {
      en: 'Practice typing word combinations',
      he: 'תרגל הקלדת שילובי מילים',
    },
    newKeys: [],
    practiceKeys: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    difficulty: 'medium',
    xpReward: 90,
    passingAccuracy: 80,
    estimatedMinutes: 5,
    exercises: [
      {
        id: 'stage-4-lesson-4-ex-1',
        type: 'words',
        content: 'to be or not it is in my on me at us',
        instructions: {
          en: 'Short word pairs - build your flow!',
          he: 'זוגות מילים קצרות - בנה את הזרימה שלך!',
        },
        targetAccuracy: 80,
      },
      {
        id: 'stage-4-lesson-4-ex-2',
        type: 'words',
        content: 'the cat big dog red car old man new day',
        instructions: {
          en: 'Noun and adjective pairs.',
          he: 'זוגות שמות עצם ותואר.',
        },
        targetAccuracy: 80,
      },
      {
        id: 'stage-4-lesson-4-ex-3',
        type: 'words',
        content: 'can run will go may try did see was here',
        instructions: {
          en: 'Verb pairs - action words together!',
          he: 'זוגות פעלים - מילות פעולה יחד!',
        },
        targetAccuracy: 80,
      },
    ],
  },
  {
    id: 'stage-4-lesson-5',
    stageId: 4,
    lessonNumber: 5,
    title: {
      en: 'Simple Phrases',
      he: 'ביטויים פשוטים',
    },
    description: {
      en: 'Connect words into simple phrases',
      he: 'חבר מילים לביטויים פשוטים',
    },
    newKeys: [],
    practiceKeys: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    difficulty: 'medium',
    xpReward: 95,
    passingAccuracy: 80,
    estimatedMinutes: 5,
    exercises: [
      {
        id: 'stage-4-lesson-5-ex-1',
        type: 'sentences',
        content: 'the big cat sat on the mat',
        instructions: {
          en: 'A classic simple phrase.',
          he: 'ביטוי קלאסי פשוט.',
        },
        targetAccuracy: 80,
      },
      {
        id: 'stage-4-lesson-5-ex-2',
        type: 'sentences',
        content: 'i can see the red car from here',
        instructions: {
          en: 'A longer phrase with common words.',
          he: 'ביטוי ארוך יותר עם מילים נפוצות.',
        },
        targetAccuracy: 80,
      },
      {
        id: 'stage-4-lesson-5-ex-3',
        type: 'sentences',
        content: 'the dog ran fast and jumped high',
        instructions: {
          en: 'Action-packed phrase!',
          he: 'ביטוי עמוס בפעולה!',
        },
        targetAccuracy: 80,
      },
      {
        id: 'stage-4-lesson-5-ex-4',
        type: 'sentences',
        content: 'we will go to the park after lunch',
        instructions: {
          en: 'Planning phrase - future tense practice.',
          he: 'ביטוי תכנון - תרגול זמן עתיד.',
        },
        targetAccuracy: 80,
      },
    ],
  },
  {
    id: 'stage-4-lesson-6',
    stageId: 4,
    lessonNumber: 6,
    title: {
      en: 'Word Speed Challenge',
      he: 'אתגר מהירות מילים',
    },
    description: {
      en: 'Test your speed with rapid-fire words',
      he: 'בדוק את המהירות שלך עם מילים מהירות',
    },
    newKeys: [],
    practiceKeys: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    difficulty: 'medium',
    xpReward: 125,
    passingAccuracy: 85,
    estimatedMinutes: 6,
    exercises: [
      {
        id: 'stage-4-lesson-6-ex-1',
        type: 'timed',
        content: 'a an am as at be by do go he if in is it me my no of on or so to up us we',
        instructions: {
          en: 'Two-letter word sprint! Type as fast as you can.',
          he: 'ספרינט מילים בנות שתי אותיות! הקלד כמה שיותר מהר.',
        },
        targetAccuracy: 85,
        timeLimit: 60,
      },
      {
        id: 'stage-4-lesson-6-ex-2',
        type: 'timed',
        content: 'the and for are but not you all can had her was one our out day get has him his how',
        instructions: {
          en: 'Three-letter word sprint! Keep your fingers flying!',
          he: 'ספרינט מילים בנות שלוש אותיות! שמור על האצבעות עפות!',
        },
        targetAccuracy: 85,
        timeLimit: 60,
      },
      {
        id: 'stage-4-lesson-6-ex-3',
        type: 'accuracy',
        content: 'the quick brown fox jumps over the lazy dog while the five wizards jump quickly',
        instructions: {
          en: 'Final challenge! Accuracy is key.',
          he: 'אתגר אחרון! דיוק הוא המפתח.',
        },
        targetAccuracy: 90,
      },
    ],
  },
];

export const stage4: Stage = {
  id: 4,
  name: {
    en: 'Sentence Safari',
    he: 'ספארי משפטים',
  },
  description: {
    en: 'Build vocabulary with common words and simple phrases',
    he: 'בנה אוצר מילים עם מילים נפוצות וביטויים פשוטים',
  },
  icon: '🌲',
  themeColor: 'var(--color-accent-green)',
  lessons,
  masteredKeys: [],
  totalXp: lessons.reduce((sum, lesson) => sum + lesson.xpReward, 0),
  passingAccuracy: 80,
};
