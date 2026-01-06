/**
 * Hebrew word pools for typing practice.
 * Words are organized by length for progressive difficulty.
 */

// Short words (2-3 letters) - great for beginners
// Note: Hebrew final letters (ך, ם, ן, ף, ץ) are used at word endings
export const shortHebrewWords = [
  // 2-letter words
  'אם', 'אב', 'יד', 'עד', 'גב', 'זה', 'לא', 'כן', 'מה', 'על',
  'עם', 'אל', 'גם', 'רק', 'בו', 'לו', 'כי', 'או', 'פה', 'שם',
  'דג', 'גל', 'חם', 'קר', 'טל', 'יש', 'אך', 'עץ', 'בת', 'בן',
  // 3-letter words
  'אמא', 'אבא', 'סבא', 'סבתא', 'ילד', 'ילדה', 'כלב', 'חתול', 'דבש', 'עוף',
  'חלב', 'לחם', 'מים', 'שמש', 'ירח', 'כוכב', 'ספר', 'בית', 'דלת', 'חלון',
];

// Medium words (4-5 letters) - building vocabulary
export const mediumHebrewWords = [
  // 4-letter words
  'שלום', 'תודה', 'בוקר', 'ערב', 'לילה', 'יופי', 'חבר', 'חברה', 'ילדה', 'מורה',
  'תלמיד', 'כיתה', 'ספריה', 'עיתון', 'רחוב', 'עיר', 'כפר', 'נהר', 'ים', 'הר',
  'שדה', 'פרח', 'עציץ', 'גינה', 'בגד', 'נעל', 'כובע', 'משקפיים', 'שעון', 'טלפון',
  // 5-letter words
  'מחשב', 'מסך', 'עכבר', 'מקלדת', 'טלויזיה', 'רדיו', 'שולחן', 'כיסא', 'מיטה', 'ארון',
  'חלון', 'דלת', 'קיר', 'רצפה', 'תקרה', 'גג', 'מרפסת', 'מטבח', 'סלון', 'חדר',
];

// Long words (6+ letters) - for advanced practice
export const longHebrewWords = [
  'מקלדת', 'הקלדה', 'תרגול', 'תרגיל', 'אימון', 'למידה', 'הצלחה', 'התקדמות', 'שיפור', 'מיומנות',
  'מהירות', 'דיוק', 'ריכוז', 'אצבעות', 'מקלדת', 'מסך', 'מחשב', 'תוכנה', 'יישום', 'קובץ',
  'תיקיה', 'מסמך', 'טקסט', 'מילה', 'משפט', 'פסקה', 'עמוד', 'ספר', 'סיפור', 'כתיבה',
  'קריאה', 'שיחה', 'דיבור', 'הקשבה', 'שמיעה', 'ראיה', 'תצפית', 'מחשבה', 'רעיון', 'יצירה',
];

// Common phrases for sentence practice
export const hebrewPhrases = [
  'בוקר טוב',
  'ערב טוב',
  'לילה טוב',
  'מה שלומך',
  'מה נשמע',
  'הכל בסדר',
  'תודה רבה',
  'על לא דבר',
  'בבקשה',
  'סליחה',
  'להתראות',
  'שבת שלום',
  'חג שמח',
  'מזל טוב',
  'יום הולדת שמח',
];

// Simple sentences for typing practice
export const hebrewSentences = [
  'שלום לכולם.',
  'מה שלומך היום?',
  'היום יום יפה.',
  'אני אוהב ללמוד.',
  'הקלדה היא כיף.',
  'המחשב על השולחן.',
  'הספר על המדף.',
  'הילד משחק בגינה.',
  'השמש זורחת בשמיים.',
  'הציפור שרה על העץ.',
  'אני לומד לכתוב מהר.',
  'תרגול עושה מושלם.',
  'כל יום אני משתפר.',
  'הדיוק חשוב יותר מהמהירות.',
  'צעד אחר צעד, אני מתקדם.',
];

// Practice texts by difficulty level
export const hebrewPracticeTexts = {
  easy: [
    'שלום. מה שלומך?',
    'אני בסדר, תודה.',
    'היום יום יפה מאוד.',
    'אני אוהב ללמוד דברים חדשים.',
  ],
  medium: [
    'הקלדה עיוורת היא מיומנות חשובה בעידן הדיגיטלי.',
    'תרגול יומי הוא המפתח להצלחה בכל תחום.',
    'כאשר מתרגלים כל יום, רואים שיפור משמעותי.',
    'המחשב הפך לכלי עבודה חיוני בחיי היומיום.',
  ],
  hard: [
    'הקלדה מהירה ומדייקת מאפשרת לבטא רעיונות ביעילות רבה יותר.',
    'כשלומדים הקלדה נכונה מההתחלה, חוסכים זמן רב בעתיד.',
    'המקלדת היא הממשק העיקרי בינינו לבין המחשב, ולכן חשוב להכיר אותה היטב.',
    'תרגול עקבי ומתמשך הוא הדרך הטובה ביותר לשפר את מהירות ההקלדה והדיוק.',
  ],
};

// All Hebrew words combined
export const allHebrewWords = [
  ...shortHebrewWords,
  ...mediumHebrewWords,
  ...longHebrewWords,
];

/**
 * Get a random Hebrew word.
 */
export function getRandomHebrewWord(): string {
  return allHebrewWords[Math.floor(Math.random() * allHebrewWords.length)];
}

/**
 * Get random Hebrew words of specific length range.
 */
export function getHebrewWordsByLength(minLength: number, maxLength: number): string[] {
  return allHebrewWords.filter(
    (word) => word.length >= minLength && word.length <= maxLength
  );
}

/**
 * Get Hebrew words containing specific letters (for targeted practice).
 */
export function getHebrewWordsWithLetters(letters: string[]): string[] {
  return allHebrewWords.filter((word) =>
    letters.some((letter) => word.includes(letter))
  );
}

/**
 * Get Hebrew words containing a specific letter.
 */
export function getHebrewWordsForLetter(letter: string): string[] {
  return allHebrewWords.filter((word) => word.includes(letter));
}

/**
 * Get a random Hebrew word containing a specific letter.
 */
export function getRandomHebrewWordWithLetter(letter: string): string {
  const wordsWithLetter = getHebrewWordsForLetter(letter);
  if (wordsWithLetter.length === 0) {
    return getRandomHebrewWord();
  }
  return wordsWithLetter[Math.floor(Math.random() * wordsWithLetter.length)];
}

/**
 * Get a random Hebrew sentence.
 */
export function getRandomHebrewSentence(): string {
  return hebrewSentences[Math.floor(Math.random() * hebrewSentences.length)];
}

/**
 * Generate Hebrew practice text targeting specific letters.
 * @param targetLetters Letters to focus on (40% of words will contain these)
 * @param wordCount Number of words to generate
 */
export function generateHebrewPracticeText(
  targetLetters: string[] = [],
  wordCount: number = 10
): string {
  const words: string[] = [];

  for (let i = 0; i < wordCount; i++) {
    // 40% chance to use a word with target letters if specified
    if (targetLetters.length > 0 && Math.random() < 0.4) {
      const targetWords = getHebrewWordsWithLetters(targetLetters);
      if (targetWords.length > 0) {
        words.push(targetWords[Math.floor(Math.random() * targetWords.length)]);
        continue;
      }
    }
    // Otherwise, pick a random word
    words.push(getRandomHebrewWord());
  }

  return words.join(' ');
}
