/**
 * Stage 2: Letter Lagoon
 * Expanding from home row to nearby keys.
 * Focus: G, H (index finger reach) and E, I (common vowels)
 */

import type { Stage, Lesson } from '@/types/lesson';

const lessons: Lesson[] = [
  {
    id: 'stage-2-lesson-1',
    stageId: 2,
    lessonNumber: 1,
    title: {
      en: 'Reach for G and H',
      he: 'הגעה ל-G ו-H',
    },
    description: {
      en: 'Your index fingers reach inward to G and H',
      he: 'האצבעות המורות שלך נמתחות פנימה ל-G ו-H',
    },
    newKeys: ['g', 'h'],
    practiceKeys: ['f', 'g', 'h', 'j'],
    difficulty: 'beginner',
    xpReward: 60,
    passingAccuracy: 70,
    estimatedMinutes: 4,
    exercises: [
      {
        id: 'stage-2-lesson-1-ex-1',
        type: 'key-practice',
        content: 'fg fg fg fg fgf fgf fgf',
        instructions: {
          en: 'F is your anchor. Reach to G with the same finger.',
          he: 'F היא העוגן שלך. הגע ל-G עם אותה אצבע.',
        },
        focusKeys: ['f', 'g'],
        focusFingers: ['left-index'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-2-lesson-1-ex-2',
        type: 'key-practice',
        content: 'jh jh jh jh jhj jhj jhj',
        instructions: {
          en: 'J is your anchor. Reach to H with the same finger.',
          he: 'J היא העוגן שלך. הגע ל-H עם אותה אצבע.',
        },
        focusKeys: ['j', 'h'],
        focusFingers: ['right-index'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-2-lesson-1-ex-3',
        type: 'key-practice',
        content: 'gh gh gh fghj fghj fghj',
        instructions: {
          en: 'Now combine G and H together!',
          he: 'עכשיו שלב את G ו-H יחד!',
        },
        focusKeys: ['f', 'g', 'h', 'j'],
        targetAccuracy: 75,
      },
      {
        id: 'stage-2-lesson-1-ex-4',
        type: 'words',
        content: 'had has half gal glad hash',
        instructions: {
          en: 'Words with G and H!',
          he: 'מילים עם G ו-H!',
        },
        focusKeys: ['g', 'h', 'a', 's', 'd', 'f', 'l'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'stage-2-lesson-2',
    stageId: 2,
    lessonNumber: 2,
    title: {
      en: 'The Letter E',
      he: 'האות E',
    },
    description: {
      en: 'E is the most common letter - reach up with your left middle finger',
      he: 'E היא האות הנפוצה ביותר - הגע למעלה עם האמה של יד שמאל',
    },
    newKeys: ['e'],
    practiceKeys: ['d', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'a', 's'],
    difficulty: 'beginner',
    xpReward: 60,
    passingAccuracy: 70,
    estimatedMinutes: 4,
    exercises: [
      {
        id: 'stage-2-lesson-2-ex-1',
        type: 'key-practice',
        content: 'ded ded ded ede ede ede',
        instructions: {
          en: 'D is your anchor. Reach up to E, then back to D.',
          he: 'D היא העוגן שלך. הגע למעלה ל-E, ואז חזרה ל-D.',
        },
        focusKeys: ['d', 'e'],
        focusFingers: ['left-middle'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-2-lesson-2-ex-2',
        type: 'key-practice',
        content: 'fed led sed elfelf elf',
        instructions: {
          en: 'Simple combinations with E.',
          he: 'שילובים פשוטים עם E.',
        },
        focusKeys: ['e', 'f', 'l', 's', 'd'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-2-lesson-2-ex-3',
        type: 'words',
        content: 'she he led fed sea see',
        instructions: {
          en: 'Common words with E!',
          he: 'מילים נפוצות עם E!',
        },
        focusKeys: ['e', 's', 'h', 'l', 'f', 'd', 'a'],
        targetAccuracy: 75,
      },
      {
        id: 'stage-2-lesson-2-ex-4',
        type: 'words',
        content: 'feed feel edge hedge shed lead',
        instructions: {
          en: 'More words featuring E!',
          he: 'עוד מילים עם E!',
        },
        focusKeys: ['e', 'f', 'l', 'd', 'g', 'h', 's', 'a'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'stage-2-lesson-3',
    stageId: 2,
    lessonNumber: 3,
    title: {
      en: 'The Letter I',
      he: 'האות I',
    },
    description: {
      en: 'I is another common vowel - reach up with your right middle finger',
      he: 'I היא עוד תנועה נפוצה - הגע למעלה עם האמה של יד ימין',
    },
    newKeys: ['i'],
    practiceKeys: ['k', 'i', 'e', 'd', 'f', 'g', 'h', 'j', 'l', 'a', 's'],
    difficulty: 'beginner',
    xpReward: 60,
    passingAccuracy: 70,
    estimatedMinutes: 4,
    exercises: [
      {
        id: 'stage-2-lesson-3-ex-1',
        type: 'key-practice',
        content: 'kik kik kik iki iki iki',
        instructions: {
          en: 'K is your anchor. Reach up to I, then back to K.',
          he: 'K היא העוגן שלך. הגע למעלה ל-I, ואז חזרה ל-K.',
        },
        focusKeys: ['k', 'i'],
        focusFingers: ['right-middle'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-2-lesson-3-ex-2',
        type: 'key-practice',
        content: 'if is id kid lid did hid',
        instructions: {
          en: 'Simple words with I.',
          he: 'מילים פשוטות עם I.',
        },
        focusKeys: ['i', 'f', 's', 'd', 'k', 'l', 'h'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-2-lesson-3-ex-3',
        type: 'words',
        content: 'like side hide disk file',
        instructions: {
          en: 'Words combining E and I!',
          he: 'מילים שמשלבות E ו-I!',
        },
        focusKeys: ['i', 'e', 'l', 'k', 's', 'd', 'h', 'f'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'stage-2-lesson-4',
    stageId: 2,
    lessonNumber: 4,
    title: {
      en: 'R and U Keys',
      he: 'מקשי R ו-U',
    },
    description: {
      en: 'Expand your reach with R (left index up) and U (right index up)',
      he: 'הרחב את ההישג שלך עם R (אצבע שמאל למעלה) ו-U (אצבע ימין למעלה)',
    },
    newKeys: ['r', 'u'],
    practiceKeys: ['r', 'u', 'f', 'j', 'e', 'i', 'a', 's', 'd', 'k', 'l'],
    difficulty: 'easy',
    xpReward: 75,
    passingAccuracy: 75,
    estimatedMinutes: 5,
    exercises: [
      {
        id: 'stage-2-lesson-4-ex-1',
        type: 'key-practice',
        content: 'frf frf rfr rfr frfr frfr',
        instructions: {
          en: 'F anchor, reach up to R.',
          he: 'עוגן F, הגע למעלה ל-R.',
        },
        focusKeys: ['f', 'r'],
        focusFingers: ['left-index'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-2-lesson-4-ex-2',
        type: 'key-practice',
        content: 'juj juj uju uju juju juju',
        instructions: {
          en: 'J anchor, reach up to U.',
          he: 'עוגן J, הגע למעלה ל-U.',
        },
        focusKeys: ['j', 'u'],
        focusFingers: ['right-index'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-2-lesson-4-ex-3',
        type: 'words',
        content: 'red rue are sure fire like',
        instructions: {
          en: 'Words with R and U!',
          he: 'מילים עם R ו-U!',
        },
        focusKeys: ['r', 'u', 'e', 'd', 's', 'i', 'f', 'l', 'k', 'a'],
        targetAccuracy: 75,
      },
      {
        id: 'stage-2-lesson-4-ex-4',
        type: 'words',
        content: 'true user rule rider surge',
        instructions: {
          en: 'Combining all new keys!',
          he: 'שילוב כל המקשים החדשים!',
        },
        focusKeys: ['r', 'u', 't', 'e', 's', 'i', 'd', 'l', 'g'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'stage-2-lesson-5',
    stageId: 2,
    lessonNumber: 5,
    title: {
      en: 'T and Y Keys',
      he: 'מקשי T ו-Y',
    },
    description: {
      en: 'T and Y complete the top row center',
      he: 'T ו-Y משלימים את מרכז השורה העליונה',
    },
    newKeys: ['t', 'y'],
    practiceKeys: ['t', 'y', 'r', 'u', 'e', 'i', 'f', 'g', 'h', 'j'],
    difficulty: 'easy',
    xpReward: 75,
    passingAccuracy: 75,
    estimatedMinutes: 5,
    exercises: [
      {
        id: 'stage-2-lesson-5-ex-1',
        type: 'key-practice',
        content: 'ftf ftf tft tft frtf frtf',
        instructions: {
          en: 'T is above G - use your left index finger.',
          he: 'T נמצא מעל G - השתמש באצבע המורה של יד שמאל.',
        },
        focusKeys: ['f', 't'],
        focusFingers: ['left-index'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-2-lesson-5-ex-2',
        type: 'key-practice',
        content: 'jyj jyj yjy yjy juyj juyj',
        instructions: {
          en: 'Y is above H - use your right index finger.',
          he: 'Y נמצא מעל H - השתמש באצבע המורה של יד ימין.',
        },
        focusKeys: ['j', 'y'],
        focusFingers: ['right-index'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-2-lesson-5-ex-3',
        type: 'words',
        content: 'the try yes yet they that',
        instructions: {
          en: 'Common words with T and Y!',
          he: 'מילים נפוצות עם T ו-Y!',
        },
        focusKeys: ['t', 'y', 'h', 'e', 'r', 's', 'a'],
        targetAccuracy: 75,
      },
      {
        id: 'stage-2-lesson-5-ex-4',
        type: 'words',
        content: 'truly style dusty rusty thirty',
        instructions: {
          en: 'Longer words with T and Y!',
          he: 'מילים ארוכות יותר עם T ו-Y!',
        },
        focusKeys: ['t', 'y', 'r', 'u', 'l', 's', 'd', 'i', 'h'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'stage-2-lesson-6',
    stageId: 2,
    lessonNumber: 6,
    title: {
      en: 'Stage 2 Challenge',
      he: 'אתגר שלב 2',
    },
    description: {
      en: 'Put together everything from Stage 2!',
      he: 'שלב הכל משלב 2!',
    },
    newKeys: [],
    practiceKeys: ['e', 'r', 't', 'y', 'u', 'i', 'g', 'h', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
    difficulty: 'easy',
    xpReward: 100,
    passingAccuracy: 80,
    estimatedMinutes: 5,
    exercises: [
      {
        id: 'stage-2-lesson-6-ex-1',
        type: 'sentences',
        content: 'the red hat is safe here',
        instructions: {
          en: 'Your first full sentence!',
          he: 'המשפט המלא הראשון שלך!',
        },
        targetAccuracy: 75,
      },
      {
        id: 'stage-2-lesson-6-ex-2',
        type: 'sentences',
        content: 'they like the true sight',
        instructions: {
          en: 'Keep it steady and accurate.',
          he: 'שמור על יציבות ודיוק.',
        },
        targetAccuracy: 80,
      },
      {
        id: 'stage-2-lesson-6-ex-3',
        type: 'accuracy',
        content: 'the right fighter seeks the grail at dusk',
        instructions: {
          en: 'Final challenge! Focus on accuracy.',
          he: 'אתגר אחרון! התמקד בדיוק.',
        },
        targetAccuracy: 85,
      },
    ],
  },
];

export const stage2: Stage = {
  id: 2,
  name: {
    en: 'Letter Lagoon',
    he: 'לגונת האותיות',
  },
  description: {
    en: 'Expand from home row to nearby keys - E, R, T, Y, U, I, G, H',
    he: 'הרחב משורת הבית למקשים סמוכים - E, R, T, Y, U, I, G, H',
  },
  icon: '🌊',
  themeColor: 'var(--color-accent-blue)',
  lessons,
  masteredKeys: ['e', 'r', 't', 'y', 'u', 'i', 'g', 'h'],
  totalXp: lessons.reduce((sum, lesson) => sum + lesson.xpReward, 0),
  passingAccuracy: 75,
};
