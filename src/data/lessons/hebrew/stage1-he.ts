/**
 * Hebrew Stage 1: שורת הבית (Home Row)
 * Introduction to the Hebrew keyboard and home row position.
 * Focus: Getting comfortable with finger placement on ש ד ג כ | ח ל ך ף
 */

import type { Stage, Lesson } from '@/types/lesson';

const lessons: Lesson[] = [
  {
    id: 'he-stage-1-lesson-1',
    stageId: 1,
    lessonNumber: 1,
    title: {
      en: 'Meet Your Hebrew Home Row',
      he: 'הכר את שורת הבית',
    },
    description: {
      en: 'Learn where your fingers rest on the Hebrew keyboard',
      he: 'למד היכן האצבעות שלך נחות על המקלדת העברית',
    },
    newKeys: ['כ', 'ח'],
    practiceKeys: ['כ', 'ח'],
    difficulty: 'beginner',
    xpReward: 50,
    passingAccuracy: 70,
    estimatedMinutes: 3,
    exercises: [
      {
        id: 'he-stage-1-lesson-1-ex-1',
        type: 'key-practice',
        content: 'כ כ כ כ כ ח ח ח ח ח',
        instructions: {
          en: 'Place your index fingers on כ and ח. Type כ and ח.',
          he: 'הנח את האצבעות המורות על כ ו-ח. הקלד כ ו-ח.',
        },
        focusKeys: ['כ', 'ח'],
        focusFingers: ['left-index', 'right-index'],
        targetAccuracy: 70,
      },
      {
        id: 'he-stage-1-lesson-1-ex-2',
        type: 'key-practice',
        content: 'כ ח כ ח כ ח כ ח כ ח',
        instructions: {
          en: 'Alternate between כ and ח. Keep your fingers on the home row!',
          he: 'החלף בין כ ו-ח. שמור על האצבעות בשורת הבית!',
        },
        focusKeys: ['כ', 'ח'],
        focusFingers: ['left-index', 'right-index'],
        targetAccuracy: 75,
      },
      {
        id: 'he-stage-1-lesson-1-ex-3',
        type: 'key-practice',
        content: 'ככ חח ככ חח ככ חח',
        instructions: {
          en: 'Double taps! Type each letter twice.',
          he: 'הקשות כפולות! הקלד כל אות פעמיים.',
        },
        focusKeys: ['כ', 'ח'],
        focusFingers: ['left-index', 'right-index'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'he-stage-1-lesson-2',
    stageId: 1,
    lessonNumber: 2,
    title: {
      en: 'Left Hand Home',
      he: 'בית יד שמאל',
    },
    description: {
      en: 'Practice the left hand home row keys: ש ד ג כ',
      he: 'תרגל את מקשי שורת הבית של יד שמאל: ש ד ג כ',
    },
    newKeys: ['ש', 'ד', 'ג'],
    practiceKeys: ['ש', 'ד', 'ג', 'כ'],
    difficulty: 'beginner',
    xpReward: 50,
    passingAccuracy: 70,
    estimatedMinutes: 3,
    exercises: [
      {
        id: 'he-stage-1-lesson-2-ex-1',
        type: 'key-practice',
        content: 'שדגכ שדגכ שדגכ שדגכ',
        instructions: {
          en: 'Type the left hand home row: ש ד ג כ',
          he: 'הקלד את שורת הבית של יד שמאל: ש ד ג כ',
        },
        focusKeys: ['ש', 'ד', 'ג', 'כ'],
        focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index'],
        targetAccuracy: 70,
      },
      {
        id: 'he-stage-1-lesson-2-ex-2',
        type: 'key-practice',
        content: 'שד גכ שד גכ שד גכ',
        instructions: {
          en: 'Practice finger pairs: pinky-ring, then middle-index',
          he: 'תרגל זוגות אצבעות: זרת-קמיצה, אחר כך אמה-אצבע',
        },
        focusKeys: ['ש', 'ד', 'ג', 'כ'],
        focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index'],
        targetAccuracy: 75,
      },
      {
        id: 'he-stage-1-lesson-2-ex-3',
        type: 'letter-combo',
        content: 'דש גד כש דג שכ',
        instructions: {
          en: 'Mix it up! Practice different combinations.',
          he: 'בואו נערבב! תרגל צירופים שונים.',
        },
        focusKeys: ['ש', 'ד', 'ג', 'כ'],
        focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'he-stage-1-lesson-3',
    stageId: 1,
    lessonNumber: 3,
    title: {
      en: 'Right Hand Home',
      he: 'בית יד ימין',
    },
    description: {
      en: 'Practice the right hand home row keys: ח ל ך ף',
      he: 'תרגל את מקשי שורת הבית של יד ימין: ח ל ך ף',
    },
    newKeys: ['ל', 'ך', 'ף'],
    practiceKeys: ['ח', 'ל', 'ך', 'ף'],
    difficulty: 'beginner',
    xpReward: 50,
    passingAccuracy: 70,
    estimatedMinutes: 3,
    exercises: [
      {
        id: 'he-stage-1-lesson-3-ex-1',
        type: 'key-practice',
        content: 'חלךף חלךף חלךף חלךף',
        instructions: {
          en: 'Type the right hand home row: ח ל ך ף',
          he: 'הקלד את שורת הבית של יד ימין: ח ל ך ף',
        },
        focusKeys: ['ח', 'ל', 'ך', 'ף'],
        focusFingers: ['right-index', 'right-middle', 'right-ring', 'right-pinky'],
        targetAccuracy: 70,
      },
      {
        id: 'he-stage-1-lesson-3-ex-2',
        type: 'key-practice',
        content: 'חל ךף חל ךף חל ךף',
        instructions: {
          en: 'Practice finger pairs on the right hand',
          he: 'תרגל זוגות אצבעות ביד ימין',
        },
        focusKeys: ['ח', 'ל', 'ך', 'ף'],
        focusFingers: ['right-index', 'right-middle', 'right-ring', 'right-pinky'],
        targetAccuracy: 75,
      },
      {
        id: 'he-stage-1-lesson-3-ex-3',
        type: 'letter-combo',
        content: 'לח ףל חך ףח לך',
        instructions: {
          en: 'Mix it up with different combinations!',
          he: 'בואו נערבב עם צירופים שונים!',
        },
        focusKeys: ['ח', 'ל', 'ך', 'ף'],
        focusFingers: ['right-index', 'right-middle', 'right-ring', 'right-pinky'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'he-stage-1-lesson-4',
    stageId: 1,
    lessonNumber: 4,
    title: {
      en: 'Full Home Row',
      he: 'שורת הבית המלאה',
    },
    description: {
      en: 'Combine both hands on the home row',
      he: 'שלב את שתי הידיים בשורת הבית',
    },
    newKeys: [],
    practiceKeys: ['ש', 'ד', 'ג', 'כ', 'ח', 'ל', 'ך', 'ף'],
    difficulty: 'beginner',
    xpReward: 60,
    passingAccuracy: 75,
    estimatedMinutes: 4,
    exercises: [
      {
        id: 'he-stage-1-lesson-4-ex-1',
        type: 'key-practice',
        content: 'שדגכ חלךף שדגכ חלךף',
        instructions: {
          en: 'Type the full home row, left then right hand',
          he: 'הקלד את שורת הבית המלאה, יד שמאל ואז ימין',
        },
        focusKeys: ['ש', 'ד', 'ג', 'כ', 'ח', 'ל', 'ך', 'ף'],
        focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
        targetAccuracy: 70,
      },
      {
        id: 'he-stage-1-lesson-4-ex-2',
        type: 'letter-combo',
        content: 'כח גל דך שף כח גל',
        instructions: {
          en: 'Practice crossing between hands',
          he: 'תרגל מעבר בין הידיים',
        },
        focusKeys: ['ש', 'ד', 'ג', 'כ', 'ח', 'ל', 'ך', 'ף'],
        targetAccuracy: 75,
      },
      {
        id: 'he-stage-1-lesson-4-ex-3',
        type: 'letter-combo',
        content: 'שח דל גך כף שח דל גך כף',
        instructions: {
          en: 'Finger mirrors: match left and right fingers',
          he: 'אצבעות מראה: התאם אצבעות שמאל וימין',
        },
        focusKeys: ['ש', 'ד', 'ג', 'כ', 'ח', 'ל', 'ך', 'ף'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'he-stage-1-lesson-5',
    stageId: 1,
    lessonNumber: 5,
    title: {
      en: 'Home Row Mastery',
      he: 'שליטה בשורת הבית',
    },
    description: {
      en: 'Master the home row with mixed practice',
      he: 'שלוט בשורת הבית עם תרגול מעורב',
    },
    newKeys: [],
    practiceKeys: ['ש', 'ד', 'ג', 'כ', 'ח', 'ל', 'ך', 'ף'],
    difficulty: 'easy',
    xpReward: 75,
    passingAccuracy: 80,
    estimatedMinutes: 5,
    exercises: [
      {
        id: 'he-stage-1-lesson-5-ex-1',
        type: 'letter-combo',
        content: 'גדש כחל ףךל שגד',
        instructions: {
          en: 'Random home row combinations',
          he: 'צירופים אקראיים משורת הבית',
        },
        focusKeys: ['ש', 'ד', 'ג', 'כ', 'ח', 'ל', 'ך', 'ף'],
        targetAccuracy: 75,
      },
      {
        id: 'he-stage-1-lesson-5-ex-2',
        type: 'letter-combo',
        content: 'כלש גחד ףכש לגד',
        instructions: {
          en: 'Keep going! Your fingers are learning.',
          he: 'המשך! האצבעות שלך לומדות.',
        },
        focusKeys: ['ש', 'ד', 'ג', 'כ', 'ח', 'ל', 'ך', 'ף'],
        targetAccuracy: 80,
      },
      {
        id: 'he-stage-1-lesson-5-ex-3',
        type: 'letter-combo',
        content: 'שלך גדף כחד לשג ףכח',
        instructions: {
          en: 'Final challenge! You can do this!',
          he: 'אתגר אחרון! אתה יכול!',
        },
        focusKeys: ['ש', 'ד', 'ג', 'כ', 'ח', 'ל', 'ך', 'ף'],
        targetAccuracy: 80,
      },
    ],
  },
];

export const stage1Hebrew: Stage = {
  id: 1,
  name: {
    en: 'Home Row Haven',
    he: 'שורת הבית',
  },
  description: {
    en: 'Master the Hebrew home row: ש ד ג כ | ח ל ך ף',
    he: 'שלוט בשורת הבית העברית: ש ד ג כ | ח ל ך ף',
  },
  icon: '🏠',
  themeColor: 'var(--color-accent-green)',
  lessons,
  masteredKeys: ['ש', 'ד', 'ג', 'כ', 'ח', 'ל', 'ך', 'ף'],
  totalXp: lessons.reduce((sum, l) => sum + l.xpReward, 0),
  passingAccuracy: 70,
};
