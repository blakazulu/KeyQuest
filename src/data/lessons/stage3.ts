/**
 * Stage 3: Word Mountain
 * Learning remaining letters: W, O, P, Q (top row) and Z, X, C, V, B, N, M (bottom row)
 * Focus: Completing the alphabet
 */

import type { Stage, Lesson } from '@/types/lesson';

const lessons: Lesson[] = [
  {
    id: 'stage-3-lesson-1',
    stageId: 3,
    lessonNumber: 1,
    title: {
      en: 'W and O Keys',
      he: 'מקשי W ו-O',
    },
    description: {
      en: 'W and O - reach up with your ring fingers',
      he: 'W ו-O - הגע למעלה עם אצבעות הקמיצה',
    },
    newKeys: ['w', 'o'],
    practiceKeys: ['w', 'o', 's', 'l', 'e', 'i', 'a', 'd', 'f', 'j', 'k'],
    difficulty: 'easy',
    xpReward: 65,
    passingAccuracy: 75,
    estimatedMinutes: 4,
    exercises: [
      {
        id: 'stage-3-lesson-1-ex-1',
        type: 'key-practice',
        content: 'sws sws wsw wsw swsw swsw',
        instructions: {
          en: 'S is your anchor. Reach up to W with your ring finger.',
          he: 'S היא העוגן שלך. הגע למעלה ל-W עם אצבע הקמיצה.',
        },
        focusKeys: ['s', 'w'],
        focusFingers: ['left-ring'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-3-lesson-1-ex-2',
        type: 'key-practice',
        content: 'lol lol olo olo lolo lolo',
        instructions: {
          en: 'L is your anchor. Reach up to O with your ring finger.',
          he: 'L היא העוגן שלך. הגע למעלה ל-O עם אצבע הקמיצה.',
        },
        focusKeys: ['l', 'o'],
        focusFingers: ['right-ring'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-3-lesson-1-ex-3',
        type: 'words',
        content: 'wow low owl who two how',
        instructions: {
          en: 'Simple words with W and O!',
          he: 'מילים פשוטות עם W ו-O!',
        },
        focusKeys: ['w', 'o', 'l', 'h', 't'],
        targetAccuracy: 75,
      },
      {
        id: 'stage-3-lesson-1-ex-4',
        type: 'words',
        content: 'would world work words follow',
        instructions: {
          en: 'More complex words with W and O!',
          he: 'מילים מורכבות יותר עם W ו-O!',
        },
        focusKeys: ['w', 'o', 'r', 'l', 'd', 'k', 'f'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'stage-3-lesson-2',
    stageId: 3,
    lessonNumber: 2,
    title: {
      en: 'Q and P Keys',
      he: 'מקשי Q ו-P',
    },
    description: {
      en: 'Q and P - reach up with your pinky fingers',
      he: 'Q ו-P - הגע למעלה עם אצבעות הזרת',
    },
    newKeys: ['q', 'p'],
    practiceKeys: ['q', 'p', 'a', ';', 'w', 'o', 'e', 'i'],
    difficulty: 'easy',
    xpReward: 65,
    passingAccuracy: 75,
    estimatedMinutes: 4,
    exercises: [
      {
        id: 'stage-3-lesson-2-ex-1',
        type: 'key-practice',
        content: 'aqa aqa qaq qaq aqaq aqaq',
        instructions: {
          en: 'A is your anchor. Reach up to Q with your pinky.',
          he: 'A היא העוגן שלך. הגע למעלה ל-Q עם הזרת.',
        },
        focusKeys: ['a', 'q'],
        focusFingers: ['left-pinky'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-3-lesson-2-ex-2',
        type: 'key-practice',
        content: ';p; ;p; p;p p;p ;p;p ;p;p',
        instructions: {
          en: '; is your anchor. Reach up to P with your pinky.',
          he: '; היא העוגן שלך. הגע למעלה ל-P עם הזרת.',
        },
        focusKeys: [';', 'p'],
        focusFingers: ['right-pinky'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-3-lesson-2-ex-3',
        type: 'words',
        content: 'quit quip equip equal type',
        instructions: {
          en: 'Words with Q (always followed by U)!',
          he: 'מילים עם Q (תמיד אחריה U)!',
        },
        focusKeys: ['q', 'u', 'i', 't', 'e', 'p'],
        targetAccuracy: 75,
      },
      {
        id: 'stage-3-lesson-2-ex-4',
        type: 'words',
        content: 'help hope type people keep',
        instructions: {
          en: 'Words with P!',
          he: 'מילים עם P!',
        },
        focusKeys: ['p', 'e', 'l', 'h', 'o', 't', 'k'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'stage-3-lesson-3',
    stageId: 3,
    lessonNumber: 3,
    title: {
      en: 'C and V Keys',
      he: 'מקשי C ו-V',
    },
    description: {
      en: 'C and V on the bottom row - reach down from D and F',
      he: 'C ו-V בשורה התחתונה - הגע למטה מ-D ו-F',
    },
    newKeys: ['c', 'v'],
    practiceKeys: ['c', 'v', 'd', 'f', 'e', 'r'],
    difficulty: 'easy',
    xpReward: 65,
    passingAccuracy: 75,
    estimatedMinutes: 4,
    exercises: [
      {
        id: 'stage-3-lesson-3-ex-1',
        type: 'key-practice',
        content: 'dcd dcd cdc cdc dcdc dcdc',
        instructions: {
          en: 'D is your anchor. Reach down to C with your middle finger.',
          he: 'D היא העוגן שלך. הגע למטה ל-C עם האמה.',
        },
        focusKeys: ['d', 'c'],
        focusFingers: ['left-middle'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-3-lesson-3-ex-2',
        type: 'key-practice',
        content: 'fvf fvf vfv vfv fvfv fvfv',
        instructions: {
          en: 'F is your anchor. Reach down to V with your index finger.',
          he: 'F היא העוגן שלך. הגע למטה ל-V עם האצבע המורה.',
        },
        focusKeys: ['f', 'v'],
        focusFingers: ['left-index'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-3-lesson-3-ex-3',
        type: 'words',
        content: 'cat cave vice voice cover',
        instructions: {
          en: 'Words with C and V!',
          he: 'מילים עם C ו-V!',
        },
        focusKeys: ['c', 'v', 'a', 't', 'e', 'o', 'i', 'r'],
        targetAccuracy: 75,
      },
      {
        id: 'stage-3-lesson-3-ex-4',
        type: 'words',
        content: 'active clever cover civil curve',
        instructions: {
          en: 'More words combining C and V!',
          he: 'עוד מילים שמשלבות C ו-V!',
        },
        focusKeys: ['c', 'v', 'a', 't', 'i', 'e', 'l', 'r', 'u'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'stage-3-lesson-4',
    stageId: 3,
    lessonNumber: 4,
    title: {
      en: 'B and N Keys',
      he: 'מקשי B ו-N',
    },
    description: {
      en: 'B and N - bottom row keys reached by index fingers',
      he: 'B ו-N - מקשי השורה התחתונה שמגיעים אליהם עם האצבעות המורות',
    },
    newKeys: ['b', 'n'],
    practiceKeys: ['b', 'n', 'f', 'j', 'g', 'h', 'v', 'm'],
    difficulty: 'easy',
    xpReward: 65,
    passingAccuracy: 75,
    estimatedMinutes: 4,
    exercises: [
      {
        id: 'stage-3-lesson-4-ex-1',
        type: 'key-practice',
        content: 'fbf fbf bfb bfb fbfb fbfb',
        instructions: {
          en: 'F is your anchor. Reach down and right to B.',
          he: 'F היא העוגן שלך. הגע למטה וימינה ל-B.',
        },
        focusKeys: ['f', 'b'],
        focusFingers: ['left-index'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-3-lesson-4-ex-2',
        type: 'key-practice',
        content: 'jnj jnj njn njn jnjn jnjn',
        instructions: {
          en: 'J is your anchor. Reach down to N.',
          he: 'J היא העוגן שלך. הגע למטה ל-N.',
        },
        focusKeys: ['j', 'n'],
        focusFingers: ['right-index'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-3-lesson-4-ex-3',
        type: 'words',
        content: 'bin ban bun bone bent nine',
        instructions: {
          en: 'Words with B and N!',
          he: 'מילים עם B ו-N!',
        },
        focusKeys: ['b', 'n', 'i', 'a', 'u', 'o', 'e', 't'],
        targetAccuracy: 75,
      },
      {
        id: 'stage-3-lesson-4-ex-4',
        type: 'words',
        content: 'begin behind button dinner banner',
        instructions: {
          en: 'Longer words with B and N!',
          he: 'מילים ארוכות יותר עם B ו-N!',
        },
        focusKeys: ['b', 'n', 'e', 'g', 'i', 'h', 'd', 'u', 't', 'o', 'r', 'a'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'stage-3-lesson-5',
    stageId: 3,
    lessonNumber: 5,
    title: {
      en: 'M and Comma Keys',
      he: 'מקשי M ופסיק',
    },
    description: {
      en: 'M and comma - reach down with right hand',
      he: 'M ופסיק - הגע למטה עם יד ימין',
    },
    newKeys: ['m', ','],
    practiceKeys: ['m', ',', 'j', 'k', 'n', 'b'],
    difficulty: 'easy',
    xpReward: 65,
    passingAccuracy: 75,
    estimatedMinutes: 4,
    exercises: [
      {
        id: 'stage-3-lesson-5-ex-1',
        type: 'key-practice',
        content: 'jmj jmj mjm mjm jmjm jmjm',
        instructions: {
          en: 'J is your anchor. Reach down to M.',
          he: 'J היא העוגן שלך. הגע למטה ל-M.',
        },
        focusKeys: ['j', 'm'],
        focusFingers: ['right-index'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-3-lesson-5-ex-2',
        type: 'key-practice',
        content: 'k,k k,k ,k, ,k, k,k, k,k,',
        instructions: {
          en: 'K is your anchor. Reach down to comma.',
          he: 'K היא העוגן שלך. הגע למטה לפסיק.',
        },
        focusKeys: ['k', ','],
        focusFingers: ['right-middle'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-3-lesson-5-ex-3',
        type: 'words',
        content: 'mom make home time came name',
        instructions: {
          en: 'Words with M!',
          he: 'מילים עם M!',
        },
        focusKeys: ['m', 'o', 'a', 'k', 'e', 'h', 't', 'i', 'c', 'n'],
        targetAccuracy: 75,
      },
      {
        id: 'stage-3-lesson-5-ex-4',
        type: 'sentences',
        content: 'mom, dad, and me',
        instructions: {
          en: 'Using commas in a phrase!',
          he: 'שימוש בפסיקים במשפט!',
        },
        focusKeys: ['m', ',', 'o', 'd', 'a', 'n', 'e'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'stage-3-lesson-6',
    stageId: 3,
    lessonNumber: 6,
    title: {
      en: 'X and Z Keys',
      he: 'מקשי X ו-Z',
    },
    description: {
      en: 'X and Z - the bottom left corner reached by pinky and ring',
      he: 'X ו-Z - הפינה השמאלית התחתונה שמגיעים אליה עם הזרת והקמיצה',
    },
    newKeys: ['x', 'z'],
    practiceKeys: ['x', 'z', 's', 'a', 'c', 'd'],
    difficulty: 'medium',
    xpReward: 70,
    passingAccuracy: 75,
    estimatedMinutes: 4,
    exercises: [
      {
        id: 'stage-3-lesson-6-ex-1',
        type: 'key-practice',
        content: 'sxs sxs xsx xsx sxsx sxsx',
        instructions: {
          en: 'S is your anchor. Reach down to X with your ring finger.',
          he: 'S היא העוגן שלך. הגע למטה ל-X עם הקמיצה.',
        },
        focusKeys: ['s', 'x'],
        focusFingers: ['left-ring'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-3-lesson-6-ex-2',
        type: 'key-practice',
        content: 'aza aza zaz zaz azaz azaz',
        instructions: {
          en: 'A is your anchor. Reach down to Z with your pinky.',
          he: 'A היא העוגן שלך. הגע למטה ל-Z עם הזרת.',
        },
        focusKeys: ['a', 'z'],
        focusFingers: ['left-pinky'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-3-lesson-6-ex-3',
        type: 'words',
        content: 'box fix six mix wax exit',
        instructions: {
          en: 'Words with X!',
          he: 'מילים עם X!',
        },
        focusKeys: ['x', 'b', 'o', 'f', 'i', 's', 'm', 'w', 'a', 'e', 't'],
        targetAccuracy: 75,
      },
      {
        id: 'stage-3-lesson-6-ex-4',
        type: 'words',
        content: 'zoo zip zero zone size pizza',
        instructions: {
          en: 'Words with Z!',
          he: 'מילים עם Z!',
        },
        focusKeys: ['z', 'o', 'i', 'p', 'e', 'r', 'n', 's', 'a'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'stage-3-lesson-7',
    stageId: 3,
    lessonNumber: 7,
    title: {
      en: 'Period and Slash Keys',
      he: 'מקשי נקודה ולוכסן',
    },
    description: {
      en: 'Period and slash - the bottom right punctuation',
      he: 'נקודה ולוכסן - סימני הפיסוק בפינה הימנית התחתונה',
    },
    newKeys: ['.', '/'],
    practiceKeys: ['.', '/', 'l', ';', ',', 'm'],
    difficulty: 'medium',
    xpReward: 70,
    passingAccuracy: 75,
    estimatedMinutes: 4,
    exercises: [
      {
        id: 'stage-3-lesson-7-ex-1',
        type: 'key-practice',
        content: 'l.l l.l .l. .l. l.l. l.l.',
        instructions: {
          en: 'L is your anchor. Reach down to period with your ring finger.',
          he: 'L היא העוגן שלך. הגע למטה לנקודה עם הקמיצה.',
        },
        focusKeys: ['l', '.'],
        focusFingers: ['right-ring'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-3-lesson-7-ex-2',
        type: 'key-practice',
        content: ';/; ;/; /;/ /;/ ;/;/ ;/;/',
        instructions: {
          en: '; is your anchor. Reach down to slash with your pinky.',
          he: '; היא העוגן שלך. הגע למטה ללוכסן עם הזרת.',
        },
        focusKeys: [';', '/'],
        focusFingers: ['right-pinky'],
        targetAccuracy: 70,
      },
      {
        id: 'stage-3-lesson-7-ex-3',
        type: 'sentences',
        content: 'i like it. do you like it too.',
        instructions: {
          en: 'Sentences with periods!',
          he: 'משפטים עם נקודות!',
        },
        focusKeys: ['.', 'i', 'l', 'k', 'e', 't', 'd', 'o', 'y', 'u'],
        targetAccuracy: 75,
      },
    ],
  },
  {
    id: 'stage-3-lesson-8',
    stageId: 3,
    lessonNumber: 8,
    title: {
      en: 'Full Alphabet Mastery',
      he: 'שליטה באלפבית המלא',
    },
    description: {
      en: 'You know all the letters! Time for the final challenge.',
      he: 'אתה מכיר את כל האותיות! הגיע הזמן לאתגר האחרון.',
    },
    newKeys: [],
    practiceKeys: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    difficulty: 'medium',
    xpReward: 125,
    passingAccuracy: 80,
    estimatedMinutes: 6,
    exercises: [
      {
        id: 'stage-3-lesson-8-ex-1',
        type: 'key-practice',
        content: 'the quick brown fox jumps over the lazy dog',
        instructions: {
          en: 'The classic pangram - every letter of the alphabet!',
          he: 'הפנגרמה הקלאסית - כל אות באלפבית!',
        },
        targetAccuracy: 75,
      },
      {
        id: 'stage-3-lesson-8-ex-2',
        type: 'sentences',
        content: 'pack my box with five dozen liquor jugs.',
        instructions: {
          en: 'Another pangram to master!',
          he: 'פנגרמה נוספת לשליטה!',
        },
        targetAccuracy: 80,
      },
      {
        id: 'stage-3-lesson-8-ex-3',
        type: 'accuracy',
        content: 'amazingly few discotheques provide jukeboxes.',
        instructions: {
          en: 'Final pangram challenge! Focus on accuracy.',
          he: 'אתגר הפנגרמה האחרון! התמקד בדיוק.',
        },
        targetAccuracy: 85,
      },
    ],
  },
];

export const stage3: Stage = {
  id: 3,
  name: {
    en: 'Word Mountain',
    he: 'הר המילים',
  },
  description: {
    en: 'Complete your alphabet mastery with all remaining letters',
    he: 'השלם את השליטה באלפבית עם כל האותיות הנותרות',
  },
  icon: '⛰️',
  themeColor: 'var(--color-accent-purple)',
  lessons,
  masteredKeys: ['w', 'o', 'p', 'q', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  totalXp: lessons.reduce((sum, lesson) => sum + lesson.xpReward, 0),
  passingAccuracy: 75,
};
