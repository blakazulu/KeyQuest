/**
 * Difficulty Settings
 * Age-based difficulty profiles with subtle adjustments
 */

import type { AgeGroup } from '@/stores/useSettingsStore';

/**
 * Encouragement level for feedback messaging
 */
export type EncouragementLevel = 'high' | 'medium' | 'low';

/**
 * Difficulty profile based on age group
 * Contains subtle adjustments that don't affect core gameplay
 */
export interface DifficultyProfile {
  /** Preferred word length range [min, max] */
  wordLengthRange: [number, number];
  /** Level of encouragement in feedback messages */
  encouragementLevel: EncouragementLevel;
  /** Whether to show keyboard by default */
  showKeyboardDefault: boolean;
  /** Whether to show finger guide by default */
  showFingerGuideDefault: boolean;
  /** Label for the profile */
  label: { en: string; he: string };
}

/**
 * Difficulty profiles for each age group
 */
const difficultyProfiles: Record<AgeGroup, DifficultyProfile> = {
  child: {
    wordLengthRange: [2, 4],
    encouragementLevel: 'high',
    showKeyboardDefault: true,
    showFingerGuideDefault: true,
    label: { en: 'Child', he: 'ילד' },
  },
  teen: {
    wordLengthRange: [3, 6],
    encouragementLevel: 'medium',
    showKeyboardDefault: true,
    showFingerGuideDefault: false,
    label: { en: 'Teen', he: 'נער' },
  },
  adult: {
    wordLengthRange: [4, 8],
    encouragementLevel: 'low',
    showKeyboardDefault: false,
    showFingerGuideDefault: false,
    label: { en: 'Adult', he: 'מבוגר' },
  },
};

/**
 * Get the difficulty profile for an age group
 *
 * @param ageGroup - The user's age group
 * @returns The difficulty profile
 */
export function getDifficultyProfile(ageGroup: AgeGroup): DifficultyProfile {
  return difficultyProfiles[ageGroup];
}

/**
 * Encouragement messages for different scenarios
 * Used in lesson summaries and feedback
 */
export interface EncouragementMessages {
  perfect: { en: string; he: string };
  great: { en: string; he: string };
  good: { en: string; he: string };
  keepTrying: { en: string; he: string };
  improvement: { en: string; he: string };
}

/**
 * Get encouragement messages based on level
 */
const encouragementMessages: Record<EncouragementLevel, EncouragementMessages> = {
  high: {
    perfect: {
      en: 'WOW! You are AMAZING! Perfect score!',
      he: 'וואו! את/ה מדהים/ה! ציון מושלם!',
    },
    great: {
      en: 'Super awesome job! You are doing great!',
      he: 'עבודה סופר מעולה! את/ה ממש טובה/ים!',
    },
    good: {
      en: 'Good work! Keep practicing and you will be even better!',
      he: 'עבודה טובה! המשיכ/י לתרגל ותהי/ה עוד יותר טוב/ה!',
    },
    keepTrying: {
      en: "Don't give up! Every practice makes you better!",
      he: 'אל תוותר/י! כל תרגול עושה אותך טוב/ה יותר!',
    },
    improvement: {
      en: 'Look at you improving! So proud of you!',
      he: 'ראי/ה איך את/ה משתפר/ת! כל כך גאים בך!',
    },
  },
  medium: {
    perfect: {
      en: 'Perfect score! Excellent work!',
      he: 'ציון מושלם! עבודה מעולה!',
    },
    great: {
      en: 'Great job! Keep up the good work!',
      he: 'כל הכבוד! המשיכו ככה!',
    },
    good: {
      en: 'Good work! Practice makes perfect.',
      he: 'עבודה טובה! תרגול מביא לשלמות.',
    },
    keepTrying: {
      en: 'Keep practicing! You got this.',
      he: 'המשיכ/י לתרגל! את/ה יכול/ה!',
    },
    improvement: {
      en: 'Nice improvement! Your hard work is paying off.',
      he: 'שיפור יפה! העבודה הקשה משתלמת.',
    },
  },
  low: {
    perfect: {
      en: 'Perfect accuracy.',
      he: 'דיוק מושלם.',
    },
    great: {
      en: 'Well done.',
      he: 'כל הכבוד.',
    },
    good: {
      en: 'Good progress.',
      he: 'התקדמות טובה.',
    },
    keepTrying: {
      en: 'Keep practicing.',
      he: 'המשיכו לתרגל.',
    },
    improvement: {
      en: 'Improvement noted.',
      he: 'שיפור נרשם.',
    },
  },
};

/**
 * Get an encouragement message based on performance and age group
 *
 * @param ageGroup - The user's age group
 * @param scenario - The performance scenario
 * @param locale - The language locale
 * @returns The encouragement message
 */
export function getEncouragementMessage(
  ageGroup: AgeGroup,
  scenario: keyof EncouragementMessages,
  locale: 'en' | 'he'
): string {
  const profile = getDifficultyProfile(ageGroup);
  const messages = encouragementMessages[profile.encouragementLevel];
  return messages[scenario][locale];
}

/**
 * Get the appropriate message based on accuracy
 *
 * @param accuracy - The accuracy percentage
 * @param ageGroup - The user's age group
 * @param locale - The language locale
 * @param isImprovement - Whether this is an improvement over previous best
 * @returns The encouragement message
 */
export function getAccuracyFeedback(
  accuracy: number,
  ageGroup: AgeGroup,
  locale: 'en' | 'he',
  isImprovement: boolean = false
): string {
  if (isImprovement) {
    return getEncouragementMessage(ageGroup, 'improvement', locale);
  }

  if (accuracy >= 100) {
    return getEncouragementMessage(ageGroup, 'perfect', locale);
  } else if (accuracy >= 90) {
    return getEncouragementMessage(ageGroup, 'great', locale);
  } else if (accuracy >= 70) {
    return getEncouragementMessage(ageGroup, 'good', locale);
  } else {
    return getEncouragementMessage(ageGroup, 'keepTrying', locale);
  }
}

/**
 * Check if a word fits within the preferred length range for an age group
 *
 * @param word - The word to check
 * @param ageGroup - The user's age group
 * @returns Whether the word is within the preferred length range
 */
export function isWordAppropriate(word: string, ageGroup: AgeGroup): boolean {
  const profile = getDifficultyProfile(ageGroup);
  const [min, max] = profile.wordLengthRange;
  return word.length >= min && word.length <= max;
}

/**
 * Get word length filter for text generation
 *
 * @param ageGroup - The user's age group
 * @returns Filter function for words
 */
export function getWordFilter(ageGroup: AgeGroup): (word: string) => boolean {
  return (word: string) => isWordAppropriate(word, ageGroup);
}
