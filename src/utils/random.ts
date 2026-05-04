/**
 * Randomizer utility functions for generating UUIDs, passwords,
 * random integers, and Lorem Ipsum placeholder text.
 */

/**
 * Configuration options for password generation.
 */
export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  digits: boolean;
  special: boolean;
}

/** Default password options: length 16 with all character types enabled. */
export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  digits: true,
  special: true,
};

// Character sets for password generation
const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const DIGIT_CHARS = '0123456789';
const SPECIAL_CHARS = '!@#$%^&*()-_=+[]{}|;:,.<>?';

// Lorem Ipsum word pool
const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing',
  'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore',
  'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam',
  'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure',
  'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat',
  'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
  'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum', 'ac', 'ante', 'bibendum',
  'blandit', 'congue', 'cras', 'cursus', 'diam', 'dictum', 'dignissim',
  'donec', 'egestas', 'elementum', 'etiam', 'eu', 'facilisis', 'faucibus',
  'felis', 'fermentum', 'gravida', 'habitant', 'hendrerit', 'iaculis',
  'integer', 'interdum', 'justo', 'lacinia', 'lacus', 'lectus', 'leo',
  'ligula', 'lobortis', 'luctus', 'maecenas', 'massa', 'mattis',
  'mauris', 'metus', 'mi', 'morbi', 'nam', 'nec', 'neque', 'nibh',
  'nullam', 'nunc', 'odio', 'orci', 'ornare', 'pellentesque', 'pharetra',
  'placerat', 'porta', 'porttitor', 'posuere', 'praesent', 'pretium',
  'proin', 'pulvinar', 'purus', 'quam', 'quisque', 'rhoncus', 'risus',
  'rutrum', 'sagittis', 'sapien', 'scelerisque', 'semper', 'senectus',
  'sociosqu', 'sodales', 'sollicitudin', 'suscipit', 'suspendisse',
  'tellus', 'tincidunt', 'tortor', 'tristique', 'turpis', 'ultrices',
  'ultricies', 'urna', 'varius', 'vehicula', 'vel', 'vestibulum',
  'vitae', 'vivamus', 'viverra', 'volutpat', 'vulputate',
];

/**
 * Generates an array of version-4 UUIDs using the Web Crypto API.
 *
 * @param count - Number of UUIDs to generate (1–100).
 * @returns An array of UUID strings.
 * @throws Error if count is outside the valid range.
 */
export function generateUUIDs(count: number): string[] {
  if (!Number.isInteger(count) || count < 1 || count > 100) {
    throw new Error('UUID count must be an integer between 1 and 100.');
  }

  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    uuids.push(crypto.randomUUID());
  }
  return uuids;
}

/**
 * Generates a random password matching the specified criteria.
 *
 * Ensures the password contains at least one character from each enabled
 * character set, then fills the remaining length with random characters
 * from the combined pool. The result is shuffled to avoid predictable
 * positioning of required characters.
 *
 * @param options - Password generation options.
 * @returns A random password string.
 * @throws Error if options are invalid.
 */
export function generatePassword(options: PasswordOptions = DEFAULT_PASSWORD_OPTIONS): string {
  const { length, uppercase, lowercase, digits, special } = options;

  if (!Number.isInteger(length) || length < 1 || length > 128) {
    throw new Error('Password length must be an integer between 1 and 128.');
  }

  if (!uppercase && !lowercase && !digits && !special) {
    throw new Error('At least one character type must be enabled.');
  }

  // Build the character pool and collect required characters
  let pool = '';
  const required: string[] = [];

  if (uppercase) {
    pool += UPPERCASE_CHARS;
    required.push(randomCharFrom(UPPERCASE_CHARS));
  }
  if (lowercase) {
    pool += LOWERCASE_CHARS;
    required.push(randomCharFrom(LOWERCASE_CHARS));
  }
  if (digits) {
    pool += DIGIT_CHARS;
    required.push(randomCharFrom(DIGIT_CHARS));
  }
  if (special) {
    pool += SPECIAL_CHARS;
    required.push(randomCharFrom(SPECIAL_CHARS));
  }

  // If length is shorter than the number of required characters,
  // just pick from the pool without guaranteeing all types
  if (length < required.length) {
    const chars: string[] = [];
    for (let i = 0; i < length; i++) {
      chars.push(randomCharFrom(pool));
    }
    return chars.join('');
  }

  // Fill remaining slots from the combined pool
  const remaining = length - required.length;
  const chars = [...required];
  for (let i = 0; i < remaining; i++) {
    chars.push(randomCharFrom(pool));
  }

  // Shuffle using Fisher-Yates to avoid predictable character positions
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
}

/**
 * Generates a random integer within the specified inclusive range.
 *
 * @param min - Minimum value (inclusive).
 * @param max - Maximum value (inclusive).
 * @returns A random integer between min and max.
 * @throws Error if min or max are not integers or if min > max.
 */
export function randomInteger(min: number, max: number): number {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error('Both min and max must be integers.');
  }
  if (min > max) {
    throw new Error('Min must be less than or equal to max.');
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates Lorem Ipsum placeholder text.
 *
 * @param quantity - Number of units to generate (1–100).
 * @param unit - The unit type: 'paragraphs', 'sentences', or 'words'.
 * @returns Generated Lorem Ipsum text.
 * @throws Error if quantity is outside the valid range.
 */
export function generateLoremIpsum(
  quantity: number,
  unit: 'paragraphs' | 'sentences' | 'words',
): string {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
    throw new Error('Quantity must be an integer between 1 and 100.');
  }

  switch (unit) {
    case 'words':
      return generateWords(quantity);
    case 'sentences':
      return generateSentences(quantity);
    case 'paragraphs':
      return generateParagraphs(quantity);
    default:
      throw new Error('Unit must be "paragraphs", "sentences", or "words".');
  }
}

/**
 * Returns a random character from the given string.
 */
function randomCharFrom(chars: string): string {
  return chars[Math.floor(Math.random() * chars.length)];
}

/**
 * Picks a random word from the Lorem Ipsum word pool.
 */
function randomLoremWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

/**
 * Generates the specified number of random Lorem Ipsum words.
 */
function generateWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(randomLoremWord());
  }
  return words.join(' ');
}

/**
 * Generates a single Lorem Ipsum sentence (5–15 words, capitalized, period-terminated).
 */
function generateSentence(): string {
  const wordCount = Math.floor(Math.random() * 11) + 5; // 5–15 words
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(randomLoremWord());
  }
  // Capitalize first word
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

/**
 * Generates the specified number of Lorem Ipsum sentences.
 */
function generateSentences(count: number): string {
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(' ');
}

/**
 * Generates a single Lorem Ipsum paragraph (3–7 sentences).
 */
function generateParagraph(): string {
  const sentenceCount = Math.floor(Math.random() * 5) + 3; // 3–7 sentences
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(' ');
}

/**
 * Generates the specified number of Lorem Ipsum paragraphs, separated by blank lines.
 */
function generateParagraphs(count: number): string {
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    paragraphs.push(generateParagraph());
  }
  return paragraphs.join('\n\n');
}
