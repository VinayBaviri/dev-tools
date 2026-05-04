// Feature: dev-toolbox, Property 12: UUID v4 format compliance
// Feature: dev-toolbox, Property 13: Password generation meets criteria
// Feature: dev-toolbox, Property 14: Random number within range
// Feature: dev-toolbox, Property 17: Lorem Ipsum generates correct quantity

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  generateUUIDs,
  generatePassword,
  randomInteger,
  generateLoremIpsum,
  PasswordOptions,
} from './random';

/**
 * UUID v4 regex pattern per RFC 4122:
 * xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where y is [8,9,a,b]
 */
const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Character sets matching the implementation
const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const DIGIT_CHARS = '0123456789';
const SPECIAL_CHARS = '!@#$%^&*()-_=+[]{}|;:,.<>?';

/**
 * Property 12: UUID v4 format compliance
 *
 * For any generated UUID, it SHALL conform to RFC 4122 version 4 format:
 * matching the pattern xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where y is
 * one of [8, 9, a, b].
 *
 * **Validates: Requirements 11.1**
 */
describe('Property 12: UUID v4 format compliance', () => {
  it('every generated UUID matches the v4 format pattern', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        (count) => {
          const uuids = generateUUIDs(count);

          expect(uuids).toHaveLength(count);

          for (const uuid of uuids) {
            expect(uuid).toMatch(UUID_V4_REGEX);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Arbitrary for valid PasswordOptions.
 * Generates length 1–128 with at least one character type enabled.
 */
const passwordOptionsArb: fc.Arbitrary<PasswordOptions> = fc
  .record({
    length: fc.integer({ min: 1, max: 128 }),
    uppercase: fc.boolean(),
    lowercase: fc.boolean(),
    digits: fc.boolean(),
    special: fc.boolean(),
  })
  .filter(
    (opts) => opts.uppercase || opts.lowercase || opts.digits || opts.special,
  );

/**
 * Builds the allowed character set string from the given options.
 */
function buildAllowedChars(opts: PasswordOptions): string {
  let allowed = '';
  if (opts.uppercase) allowed += UPPERCASE_CHARS;
  if (opts.lowercase) allowed += LOWERCASE_CHARS;
  if (opts.digits) allowed += DIGIT_CHARS;
  if (opts.special) allowed += SPECIAL_CHARS;
  return allowed;
}

/**
 * Property 13: Password generation meets criteria
 *
 * For any valid password options (length 1–128, any combination of character
 * types with at least one enabled), the generated password SHALL have exactly
 * the specified length and SHALL contain only characters from the enabled
 * character sets.
 *
 * **Validates: Requirements 11.3**
 */
describe('Property 13: Password generation meets criteria', () => {
  it('generated password has exactly the specified length', () => {
    fc.assert(
      fc.property(passwordOptionsArb, (opts) => {
        const password = generatePassword(opts);
        expect(password).toHaveLength(opts.length);
      }),
      { numRuns: 100 },
    );
  });

  it('generated password contains only characters from enabled sets', () => {
    fc.assert(
      fc.property(passwordOptionsArb, (opts) => {
        const password = generatePassword(opts);
        const allowedSet = new Set(buildAllowedChars(opts).split(''));

        for (const char of password) {
          expect(allowedSet.has(char)).toBe(true);
        }
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Property 14: Random number within range
 *
 * For any pair of integers (min, max) where min ≤ max, the generated random
 * integer SHALL satisfy min ≤ result ≤ max.
 *
 * **Validates: Requirements 11.5**
 */
describe('Property 14: Random number within range', () => {
  it('result is always within the inclusive range [min, max]', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -10000, max: 10000 }),
        fc.integer({ min: 0, max: 10000 }),
        (min, offset) => {
          const max = min + offset;
          const result = randomInteger(min, max);

          expect(result).toBeGreaterThanOrEqual(min);
          expect(result).toBeLessThanOrEqual(max);
          expect(Number.isInteger(result)).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Property 17: Lorem Ipsum generates correct quantity
 *
 * For any quantity (1–100) and unit (paragraphs, sentences, or words), the
 * generated text SHALL contain exactly the requested number of the specified unit.
 *
 * **Validates: Requirements 11.6**
 */
describe('Property 17: Lorem Ipsum generates correct quantity', () => {
  it('generates exactly the requested number of words', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        (quantity) => {
          const text = generateLoremIpsum(quantity, 'words');
          const wordCount = text.split(/\s+/).filter(Boolean).length;
          expect(wordCount).toBe(quantity);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('generates exactly the requested number of sentences', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        (quantity) => {
          const text = generateLoremIpsum(quantity, 'sentences');
          // Sentences end with a period followed by space or end-of-string
          const sentenceCount = text.split(/\.\s*/).filter(Boolean).length;
          expect(sentenceCount).toBe(quantity);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('generates exactly the requested number of paragraphs', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 50 }),
        (quantity) => {
          const text = generateLoremIpsum(quantity, 'paragraphs');
          const paragraphCount = text.split('\n\n').length;
          expect(paragraphCount).toBe(quantity);
        },
      ),
      { numRuns: 100 },
    );
  });
});
