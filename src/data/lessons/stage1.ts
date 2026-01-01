/**
 * Stage 1: Home Row Haven
 * Introduction to the keyboard and home row position.
 * Focus: Getting comfortable with finger placement on ASDF JKL;
 */

import type { Stage, Lesson } from '@/types/lesson';

const lessons: Lesson[] = [
  {
    id: 'stage-1-lesson-1',
    stageId: 1,
    lessonNumber: 1,
    title: {
      en: 'Meet Your Home Row',
      he: 'הכר את שורת הבית',
    },
    description: {
      en: 'Learn where your fingers rest on the keyboard',
      he: 'למד היכן האצבעות שלך נחות על המקלדת',
    },
    newKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    practiceKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    difficulty: 'beginner',
    xpReward: 50,
    passingAccuracy: 70,
    estimatedMinutes: 3,
    exercises: [
      {
        id: 'stage-1-lesson-1-ex-1',
        type: 'key-practice',
        content: 'f f f f f j j j j j',
        instructions: {
          en: 'Place your index fingers on F and J. Feel the bumps? Type F and J.',
          he: 'הנח את האצבעות המורות על F ו-J. מרגיש את הבליטות? הקלד F ו-J.',
        },
        focusKeys: ['f', 'j'],
        focusFingers: ['left-index', 'right-index'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-1-lesson-1-ex-2',
        type: 'key-practice',
        content: 'f j f j f j f j f j',
        instructions: {
          en: 'Alternate between F and J. Keep your fingers on the home row!',
          he: 'החלף בין F ו-J. שמור על האצבעות בשורת הבית!',
        },
        focusKeys: ['f', 'j'],
        focusFingers: ['left-index', 'right-index'],
        targetAccuracy: 75,
      },
      {
        id: 'stage-1-lesson-1-ex-3',
        type: 'key-practice',
        content: 'ff jj ff jj ff jj ff jj',
        instructions: {
          en: 'Double taps! Type each letter twice.',
          he: 'הקשות כפולות! הקלד כל אות פעמיים.',
        },
        focusKeys: ['f', 'j'],
        focusFingers: ['left-index', 'right-index'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'stage-1-lesson-2',
    stageId: 1,
    lessonNumber: 2,
    title: {
      en: 'Left Hand Home',
      he: 'בית יד שמאל',
    },
    description: {
      en: 'Practice the left hand home row keys: A S D F',
      he: 'תרגל את מקשי שורת הבית של יד שמאל: A S D F',
    },
    newKeys: ['a', 's', 'd'],
    practiceKeys: ['a', 's', 'd', 'f'],
    difficulty: 'beginner',
    xpReward: 50,
    passingAccuracy: 70,
    estimatedMinutes: 3,
    exercises: [
      {
        id: 'stage-1-lesson-2-ex-1',
        type: 'key-practice',
        content: 'asdf asdf asdf asdf',
        instructions: {
          en: 'Type the left hand home row: A S D F',
          he: 'הקלד את שורת הבית של יד שמאל: A S D F',
        },
        focusKeys: ['a', 's', 'd', 'f'],
        focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-1-lesson-2-ex-2',
        type: 'key-practice',
        content: 'fdsa fdsa fdsa fdsa',
        instructions: {
          en: 'Now backwards: F D S A',
          he: 'עכשיו לאחור: F D S A',
        },
        focusKeys: ['a', 's', 'd', 'f'],
        focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-1-lesson-2-ex-3',
        type: 'key-practice',
        content: 'as df as df as df as df',
        instructions: {
          en: 'Pair them up: AS and DF',
          he: 'צור זוגות: AS ו-DF',
        },
        focusKeys: ['a', 's', 'd', 'f'],
        focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index'],
        targetAccuracy: 75,
      },
      {
        id: 'stage-1-lesson-2-ex-4',
        type: 'letter-combo',
        content: 'sad dad fad add',
        instructions: {
          en: 'Simple words with left hand only!',
          he: 'מילים פשוטות עם יד שמאל בלבד!',
        },
        focusKeys: ['a', 's', 'd', 'f'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'stage-1-lesson-3',
    stageId: 1,
    lessonNumber: 3,
    title: {
      en: 'Right Hand Home',
      he: 'בית יד ימין',
    },
    description: {
      en: 'Practice the right hand home row keys: J K L ;',
      he: 'תרגל את מקשי שורת הבית של יד ימין: J K L ;',
    },
    newKeys: ['k', 'l', ';'],
    practiceKeys: ['j', 'k', 'l', ';'],
    difficulty: 'beginner',
    xpReward: 50,
    passingAccuracy: 70,
    estimatedMinutes: 3,
    exercises: [
      {
        id: 'stage-1-lesson-3-ex-1',
        type: 'key-practice',
        content: 'jkl; jkl; jkl; jkl;',
        instructions: {
          en: 'Type the right hand home row: J K L ;',
          he: 'הקלד את שורת הבית של יד ימין: J K L ;',
        },
        focusKeys: ['j', 'k', 'l', ';'],
        focusFingers: ['right-index', 'right-middle', 'right-ring', 'right-pinky'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-1-lesson-3-ex-2',
        type: 'key-practice',
        content: ';lkj ;lkj ;lkj ;lkj',
        instructions: {
          en: 'Now backwards: ; L K J',
          he: 'עכשיו לאחור: ; L K J',
        },
        focusKeys: ['j', 'k', 'l', ';'],
        focusFingers: ['right-index', 'right-middle', 'right-ring', 'right-pinky'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-1-lesson-3-ex-3',
        type: 'key-practice',
        content: 'jk l; jk l; jk l; jk l;',
        instructions: {
          en: 'Pair them up: JK and L;',
          he: 'צור זוגות: JK ו-L;',
        },
        focusKeys: ['j', 'k', 'l', ';'],
        focusFingers: ['right-index', 'right-middle', 'right-ring', 'right-pinky'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'stage-1-lesson-4',
    stageId: 1,
    lessonNumber: 4,
    title: {
      en: 'Full Home Row',
      he: 'שורת הבית המלאה',
    },
    description: {
      en: 'Combine both hands on the home row',
      he: 'שלב את שתי הידיים על שורת הבית',
    },
    newKeys: [],
    practiceKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    difficulty: 'beginner',
    xpReward: 75,
    passingAccuracy: 75,
    estimatedMinutes: 4,
    exercises: [
      {
        id: 'stage-1-lesson-4-ex-1',
        type: 'key-practice',
        content: 'asdf jkl; asdf jkl;',
        instructions: {
          en: 'Full home row! Left hand, then right hand.',
          he: 'שורת הבית המלאה! יד שמאל, אחר כך יד ימין.',
        },
        focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-1-lesson-4-ex-2',
        type: 'key-practice',
        content: 'aj sk dl f; aj sk dl f;',
        instructions: {
          en: 'Mirror fingers! Same position, opposite hands.',
          he: 'אצבעות מראה! אותו מיקום, ידיים הפוכות.',
        },
        focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        targetAccuracy: 75,
      },
      {
        id: 'stage-1-lesson-4-ex-3',
        type: 'letter-combo',
        content: 'ask all fall sad lad',
        instructions: {
          en: 'Words using both hands!',
          he: 'מילים בשימוש שתי הידיים!',
        },
        focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
        targetAccuracy: 75,
      },
      {
        id: 'stage-1-lesson-4-ex-4',
        type: 'letter-combo',
        content: 'salad flask falls asks dads',
        instructions: {
          en: 'Longer words with home row keys!',
          he: 'מילים ארוכות יותר עם מקשי שורת הבית!',
        },
        focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'stage-1-lesson-5',
    stageId: 1,
    lessonNumber: 5,
    title: {
      en: 'Home Row Mastery',
      he: 'שליטה בשורת הבית',
    },
    description: {
      en: 'Put it all together with a final challenge',
      he: 'שלב הכל יחד באתגר אחרון',
    },
    newKeys: [],
    practiceKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    difficulty: 'easy',
    xpReward: 100,
    passingAccuracy: 80,
    estimatedMinutes: 5,
    exercises: [
      {
        id: 'stage-1-lesson-5-ex-1',
        type: 'letter-combo',
        content: 'a sad lad asks dad',
        instructions: {
          en: 'Type this phrase using home row keys.',
          he: 'הקלד את המשפט הזה בשימוש מקשי שורת הבית.',
        },
        focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
        targetAccuracy: 80,
      },
      {
        id: 'stage-1-lesson-5-ex-2',
        type: 'letter-combo',
        content: 'all lads fall; sad dads ask',
        instructions: {
          en: 'A longer challenge with semicolons!',
          he: 'אתגר ארוך יותר עם נקודה פסיק!',
        },
        focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        targetAccuracy: 80,
      },
      {
        id: 'stage-1-lesson-5-ex-3',
        type: 'accuracy',
        content: 'salads fall;lass asks dad; all lads add',
        instructions: {
          en: 'Final challenge! Focus on accuracy.',
          he: 'אתגר אחרון! התמקד בדיוק.',
        },
        focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        targetAccuracy: 85,
      },
    ],
  },
];

export const stage1: Stage = {
  id: 1,
  name: {
    en: 'Home Row Haven',
    he: 'נמל שורת הבית',
  },
  description: {
    en: 'Master the home row position - the foundation of touch typing',
    he: 'שלוט בשורת הבית - היסוד של הקלדה עיוורת',
  },
  icon: '🏠',
  themeColor: 'var(--color-accent-cyan)',
  lessons,
  masteredKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
  totalXp: lessons.reduce((sum, lesson) => sum + lesson.xpReward, 0),
  passingAccuracy: 75,
};
