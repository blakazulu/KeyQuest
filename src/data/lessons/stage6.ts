/**
 * Stage 6: Master's Summit
 * Advanced fluency challenges
 * Focus: Speed, accuracy, and real-world typing scenarios
 */

import type { Stage, Lesson } from '@/types/lesson';

const lessons: Lesson[] = [
  {
    id: 'stage-6-lesson-1',
    stageId: 6,
    lessonNumber: 1,
    title: {
      en: 'Speed Building',
      he: 'בניית מהירות',
    },
    description: {
      en: 'Push your typing speed to new heights',
      he: 'דחוף את מהירות ההקלדה שלך לגבהים חדשים',
    },
    newKeys: [],
    practiceKeys: 'abcdefghijklmnopqrstuvwxyz.?!,'.split(''),
    difficulty: 'hard',
    xpReward: 125,
    passingAccuracy: 90,
    estimatedMinutes: 5,
    exercises: [
      {
        id: 'stage-6-lesson-1-ex-1',
        type: 'timed',
        content: 'the quick brown fox jumps over the lazy dog. pack my box with five dozen liquor jugs.',
        instructions: {
          en: 'Classic pangrams! Type as fast as you can.',
          he: 'פנגרמות קלאסיות! הקלד כמה שיותר מהר.',
        },
        targetAccuracy: 90,
        targetWpm: 30,
        timeLimit: 60,
      },
      {
        id: 'stage-6-lesson-1-ex-2',
        type: 'timed',
        content: 'speed is not about rushing. it is about efficiency. good typing is smooth and steady. rhythm is the key.',
        instructions: {
          en: 'Maintain your rhythm while typing fast!',
          he: 'שמור על הקצב שלך תוך כדי הקלדה מהירה!',
        },
        targetAccuracy: 90,
        targetWpm: 35,
        timeLimit: 60,
      },
      {
        id: 'stage-6-lesson-1-ex-3',
        type: 'timed',
        content: 'practice makes permanent. what you do repeatedly becomes natural. keep your fingers light and your eyes on the text.',
        instructions: {
          en: 'Expert advice while you type!',
          he: 'עצות מומחה בזמן שאתה מקליד!',
        },
        targetAccuracy: 90,
        targetWpm: 40,
        timeLimit: 60,
      },
    ],
  },
  {
    id: 'stage-6-lesson-2',
    stageId: 6,
    lessonNumber: 2,
    title: {
      en: 'Numbers and Symbols',
      he: 'מספרים וסמלים',
    },
    description: {
      en: 'Master the number row and common symbols',
      he: 'שלוט בשורת המספרים וסמלים נפוצים',
    },
    newKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    practiceKeys: '1234567890abcdefghijklmnopqrstuvwxyz.?!,'.split(''),
    difficulty: 'hard',
    xpReward: 150,
    passingAccuracy: 85,
    estimatedMinutes: 6,
    exercises: [
      {
        id: 'stage-6-lesson-2-ex-1',
        type: 'key-practice',
        content: '1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0',
        instructions: {
          en: 'Practice the number row. Each finger reaches up.',
          he: 'תרגל את שורת המספרים. כל אצבע מגיעה למעלה.',
        },
        focusKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        targetAccuracy: 80,
      },
      {
        id: 'stage-6-lesson-2-ex-2',
        type: 'sentences',
        content: 'i have 3 cats and 2 dogs. my phone number is 555 1234.',
        instructions: {
          en: 'Numbers mixed with words.',
          he: 'מספרים מעורבים עם מילים.',
        },
        targetAccuracy: 85,
      },
      {
        id: 'stage-6-lesson-2-ex-3',
        type: 'sentences',
        content: 'the year is 2024. there are 12 months and 365 days. i was born in 1990.',
        instructions: {
          en: 'Dates and years - common number usage.',
          he: 'תאריכים ושנים - שימוש נפוץ במספרים.',
        },
        targetAccuracy: 85,
      },
      {
        id: 'stage-6-lesson-2-ex-4',
        type: 'sentences',
        content: 'buy 5 apples, 3 oranges, and 10 bananas. the total is 18 items.',
        instructions: {
          en: 'A shopping list with numbers!',
          he: 'רשימת קניות עם מספרים!',
        },
        targetAccuracy: 85,
      },
    ],
  },
  {
    id: 'stage-6-lesson-3',
    stageId: 6,
    lessonNumber: 3,
    title: {
      en: 'Email Practice',
      he: 'תרגול אימייל',
    },
    description: {
      en: 'Type realistic email content',
      he: 'הקלד תוכן אימייל ריאליסטי',
    },
    newKeys: ['@'],
    practiceKeys: '@1234567890abcdefghijklmnopqrstuvwxyz.?!,'.split(''),
    difficulty: 'hard',
    xpReward: 150,
    passingAccuracy: 90,
    estimatedMinutes: 6,
    exercises: [
      {
        id: 'stage-6-lesson-3-ex-1',
        type: 'paragraph',
        content: 'hello! thank you for your message. i will get back to you soon. have a great day!',
        instructions: {
          en: 'A friendly email response.',
          he: 'תשובת אימייל ידידותית.',
        },
        targetAccuracy: 90,
      },
      {
        id: 'stage-6-lesson-3-ex-2',
        type: 'paragraph',
        content: 'good morning! i hope this email finds you well. i wanted to follow up on our meeting. please let me know your thoughts.',
        instructions: {
          en: 'A professional email follow-up.',
          he: 'מעקב אימייל מקצועי.',
        },
        targetAccuracy: 90,
      },
      {
        id: 'stage-6-lesson-3-ex-3',
        type: 'paragraph',
        content: 'hi team! just a reminder about tomorrow meeting at 2 pm. please come prepared with your updates. see you there!',
        instructions: {
          en: 'A team meeting reminder.',
          he: 'תזכורת לפגישת צוות.',
        },
        targetAccuracy: 90,
      },
    ],
  },
  {
    id: 'stage-6-lesson-4',
    stageId: 6,
    lessonNumber: 4,
    title: {
      en: 'Story Time',
      he: 'זמן סיפור',
    },
    description: {
      en: 'Type engaging story passages',
      he: 'הקלד קטעי סיפור מרתקים',
    },
    newKeys: [],
    practiceKeys: 'abcdefghijklmnopqrstuvwxyz.?!,'.split(''),
    difficulty: 'hard',
    xpReward: 175,
    passingAccuracy: 90,
    estimatedMinutes: 7,
    exercises: [
      {
        id: 'stage-6-lesson-4-ex-1',
        type: 'paragraph',
        content: 'once upon a time, in a land far away, there lived a young hero. every day, they practiced their skills. one day, a great adventure would begin!',
        instructions: {
          en: 'The beginning of an epic tale.',
          he: 'תחילתו של סיפור אפי.',
        },
        targetAccuracy: 90,
      },
      {
        id: 'stage-6-lesson-4-ex-2',
        type: 'paragraph',
        content: 'the dragon roared and flames lit up the sky. but our hero was not afraid. with quick thinking and faster fingers, they found a way to save the day.',
        instructions: {
          en: 'Action and adventure!',
          he: 'אקשן והרפתקאות!',
        },
        targetAccuracy: 90,
      },
      {
        id: 'stage-6-lesson-4-ex-3',
        type: 'paragraph',
        content: 'the kingdom celebrated! everyone cheered for the brave hero. and from that day on, typing was known as the most powerful skill in all the land.',
        instructions: {
          en: 'A happy ending!',
          he: 'סוף שמח!',
        },
        targetAccuracy: 90,
      },
    ],
  },
  {
    id: 'stage-6-lesson-5',
    stageId: 6,
    lessonNumber: 5,
    title: {
      en: 'Quote Collection',
      he: 'אוסף ציטוטים',
    },
    description: {
      en: 'Type famous and inspiring quotes',
      he: 'הקלד ציטוטים מפורסמים ומעוררי השראה',
    },
    newKeys: [],
    practiceKeys: 'abcdefghijklmnopqrstuvwxyz.?!,'.split(''),
    difficulty: 'hard',
    xpReward: 175,
    passingAccuracy: 90,
    estimatedMinutes: 7,
    exercises: [
      {
        id: 'stage-6-lesson-5-ex-1',
        type: 'paragraph',
        content: 'the only way to do great work is to love what you do. if you have not found it yet, keep looking. do not settle.',
        instructions: {
          en: 'Words of wisdom about work and passion.',
          he: 'מילות חוכמה על עבודה ותשוקה.',
        },
        targetAccuracy: 90,
      },
      {
        id: 'stage-6-lesson-5-ex-2',
        type: 'paragraph',
        content: 'success is not final, failure is not fatal. it is the courage to continue that counts. never give up on your dreams!',
        instructions: {
          en: 'Motivational wisdom.',
          he: 'חוכמה מוטיבציונית.',
        },
        targetAccuracy: 90,
      },
      {
        id: 'stage-6-lesson-5-ex-3',
        type: 'paragraph',
        content: 'be the change you wish to see in the world. every small action matters. together we can make a difference.',
        instructions: {
          en: 'Inspiring words for change.',
          he: 'מילים מעוררות השראה לשינוי.',
        },
        targetAccuracy: 90,
      },
    ],
  },
  {
    id: 'stage-6-lesson-6',
    stageId: 6,
    lessonNumber: 6,
    title: {
      en: 'Master Challenge',
      he: 'אתגר המאסטר',
    },
    description: {
      en: 'The ultimate typing test - prove your mastery!',
      he: 'מבחן ההקלדה האולטימטיבי - הוכח את השליטה שלך!',
    },
    newKeys: [],
    practiceKeys: 'abcdefghijklmnopqrstuvwxyz.?!,1234567890'.split(''),
    difficulty: 'expert',
    xpReward: 250,
    passingAccuracy: 95,
    estimatedMinutes: 10,
    exercises: [
      {
        id: 'stage-6-lesson-6-ex-1',
        type: 'timed',
        content: 'the journey of a thousand miles begins with a single step. every expert was once a beginner. you have come so far!',
        instructions: {
          en: 'Speed test! Show what you have learned.',
          he: 'מבחן מהירות! הראה מה למדת.',
        },
        targetAccuracy: 90,
        targetWpm: 40,
        timeLimit: 60,
      },
      {
        id: 'stage-6-lesson-6-ex-2',
        type: 'paragraph',
        content: 'congratulations on reaching the final challenge! you have learned all the keys, practiced words and sentences, and built your speed. now it is time to prove you are a typing master.',
        instructions: {
          en: 'The penultimate challenge!',
          he: 'האתגר הלפני אחרון!',
        },
        targetAccuracy: 95,
      },
      {
        id: 'stage-6-lesson-6-ex-3',
        type: 'accuracy',
        content: 'you did it! you have completed the typing course. from learning the home row to typing full paragraphs, you have mastered it all. keep practicing to maintain and improve your skills. the keyboard is now your friend!',
        instructions: {
          en: 'Final accuracy test. Give it your best!',
          he: 'מבחן דיוק אחרון. תן את המיטב!',
        },
        targetAccuracy: 95,
      },
    ],
  },
];

export const stage6: Stage = {
  id: 6,
  name: {
    en: "Master's Summit",
    he: 'פסגת המאסטר',
  },
  description: {
    en: 'Achieve typing mastery with advanced challenges',
    he: 'השג שליטה בהקלדה עם אתגרים מתקדמים',
  },
  icon: '🏆',
  themeColor: 'var(--color-achievement)',
  lessons,
  masteredKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '@'],
  totalXp: lessons.reduce((sum, lesson) => sum + lesson.xpReward, 0),
  passingAccuracy: 90,
};
