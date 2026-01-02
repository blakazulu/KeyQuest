/**
 * Word pool for Calm Mode - organized by length and letter
 * Used for endless text generation with weak letter targeting
 */

// Common 2-letter words
const twoLetterWords = [
  'a', 'an', 'am', 'as', 'at', 'be', 'by', 'do', 'go', 'he',
  'if', 'in', 'is', 'it', 'me', 'my', 'no', 'of', 'on', 'or',
  'so', 'to', 'up', 'us', 'we',
];

// Common 3-letter words
const threeLetterWords = [
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
  'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
  'how', 'man', 'new', 'now', 'old', 'see', 'way', 'who', 'boy', 'did',
  'let', 'put', 'say', 'she', 'too', 'use', 'any', 'may', 'run', 'top',
  'big', 'red', 'cat', 'dog', 'sun', 'fun', 'cup', 'hat', 'bat', 'mat',
  'sat', 'ran', 'hop', 'job', 'box', 'fox', 'mix', 'fix', 'six', 'yes',
];

// Common 4-letter words
const fourLetterWords = [
  'that', 'with', 'have', 'this', 'will', 'your', 'from', 'they',
  'been', 'some', 'what', 'when', 'make', 'like', 'time', 'just',
  'know', 'take', 'come', 'want', 'look', 'good', 'work', 'year',
  'also', 'back', 'give', 'most', 'only', 'over', 'such', 'more',
  'find', 'here', 'many', 'than', 'them', 'then', 'were', 'very',
  'call', 'down', 'each', 'even', 'hand', 'high', 'last', 'long',
  'life', 'home', 'love', 'read', 'keep', 'help', 'play', 'feel',
  'best', 'must', 'need', 'part', 'into', 'well', 'same', 'used',
  'book', 'city', 'much', 'name', 'kind', 'move', 'open', 'live',
  'tree', 'blue', 'fast', 'jump', 'word', 'next', 'both', 'hard',
];

// Common 5-letter words
const fiveLetterWords = [
  'there', 'their', 'which', 'would', 'these', 'other', 'about',
  'could', 'after', 'first', 'water', 'where', 'think', 'being',
  'great', 'place', 'right', 'still', 'young', 'every', 'found',
  'world', 'house', 'never', 'under', 'again', 'might', 'while',
  'three', 'those', 'night', 'thing', 'group', 'state', 'since',
  'study', 'light', 'write', 'story', 'point', 'heard', 'often',
  'asked', 'later', 'known', 'small', 'early', 'began', 'taken',
  'paper', 'music', 'happy', 'start', 'plant', 'learn', 'watch',
  'earth', 'close', 'above', 'along', 'sound', 'today', 'money',
  'green', 'speak', 'party', 'heart', 'peace', 'quiet', 'dream',
];

// Common 6-letter words
const sixLetterWords = [
  'people', 'before', 'should', 'number', 'always', 'become',
  'around', 'though', 'school', 'family', 'friend', 'little',
  'mother', 'father', 'system', 'second', 'public', 'almost',
  'happen', 'simple', 'person', 'change', 'really', 'follow',
  'return', 'reason', 'answer', 'others', 'better', 'during',
  'beauty', 'nature', 'wonder', 'listen', 'travel', 'garden',
  'gentle', 'warmth', 'safety', 'moment', 'sunset', 'breath',
];

// All words combined by tier (for weighted selection)
export const wordsByLength = {
  short: twoLetterWords,      // 2 letters
  medium: [...threeLetterWords, ...fourLetterWords],  // 3-4 letters
  long: [...fiveLetterWords, ...sixLetterWords],      // 5-6 letters
};

// All words flat array
export const allWords = [
  ...twoLetterWords,
  ...threeLetterWords,
  ...fourLetterWords,
  ...fiveLetterWords,
  ...sixLetterWords,
];

/**
 * Words indexed by letter - for weak letter targeting
 * Each letter maps to words containing that letter
 */
export const wordsByLetter: Record<string, string[]> = {};

// Build the letter index
for (const word of allWords) {
  const letters = new Set(word.toLowerCase().split(''));
  for (const letter of letters) {
    if (!wordsByLetter[letter]) {
      wordsByLetter[letter] = [];
    }
    wordsByLetter[letter].push(word);
  }
}

/**
 * Pangrams - sentences containing all letters of the alphabet
 * Useful for comprehensive practice
 */
export const pangrams = [
  'the quick brown fox jumps over the lazy dog',
  'pack my box with five dozen liquor jugs',
  'how vexingly quick daft zebras jump',
  'the five boxing wizards jump quickly',
  'sphinx of black quartz judge my vow',
  'two driven jocks help fax my big quiz',
  'jackdaws love my big sphinx of quartz',
];

/**
 * Get words containing a specific letter
 * Returns empty array if no words found
 */
export function getWordsForLetter(letter: string): string[] {
  return wordsByLetter[letter.toLowerCase()] || [];
}

/**
 * Get a random word from the pool
 * Weighted toward medium-length words for comfortable typing
 */
export function getRandomWord(): string {
  const rand = Math.random();
  let pool: string[];

  if (rand < 0.15) {
    // 15% short words
    pool = wordsByLength.short;
  } else if (rand < 0.75) {
    // 60% medium words (most common)
    pool = wordsByLength.medium;
  } else {
    // 25% long words
    pool = wordsByLength.long;
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get a random word containing a specific letter
 * Falls back to any random word if no match found
 */
export function getRandomWordWithLetter(letter: string): string {
  const words = getWordsForLetter(letter);
  if (words.length === 0) {
    return getRandomWord();
  }
  return words[Math.floor(Math.random() * words.length)];
}
