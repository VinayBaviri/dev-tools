import { describe, it, expect } from 'vitest';
import {
  generateUUIDs,
  generatePassword,
  randomInteger,
  generateLoremIpsum,
  DEFAULT_PASSWORD_OPTIONS,
} from './random';
import type { PasswordOptions } from './random';

/**
 * UUID v4 regex pattern per RFC 4122:
 * xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where y is [8,9,a,b]
 */
const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// ─── generateUUIDs ──────────────────────────────────────────────────────────

describe('generateUUIDs', () => {
  it('generates a single valid v4 UUID', () => {
    const uuids = generateUUIDs(1);
    expect(uuids).toHaveLength(1);
    expect(uuids[0]).toMatch(UUID_V4_REGEX);
  });

  it('generates the requested number of UUIDs', () => {
    const uuids = generateUUIDs(5);
    expect(uuids).toHaveLength(5);
    uuids.forEach((uuid) => expect(uuid).toMatch(UUID_V4_REGEX));
  });

  it('generates 100 UUIDs (upper bound)', () => {
    const uuids = generateUUIDs(100);
    expect(uuids).toHaveLength(100);
    uuids.forEach((uuid) => expect(uuid).toMatch(UUID_V4_REGEX));
  });

  it('generates unique UUIDs', () => {
    const uuids = generateUUIDs(50);
    const unique = new Set(uuids);
    expect(unique.size).toBe(50);
  });

  it('throws for count of 0', () => {
    expect(() => generateUUIDs(0)).toThrow('UUID count must be an integer between 1 and 100.');
  });

  it('throws for count greater than 100', () => {
    expect(() => generateUUIDs(101)).toThrow('UUID count must be an integer between 1 and 100.');
  });

  it('throws for negative count', () => {
    expect(() => generateUUIDs(-1)).toThrow('UUID count must be an integer between 1 and 100.');
  });

  it('throws for non-integer count', () => {
    expect(() => generateUUIDs(2.5)).toThrow('UUID count must be an integer between 1 and 100.');
  });
});

// ─── generatePassword ───────────────────────────────────────────────────────

describe('generatePassword', () => {
  it('uses default options when none provided', () => {
    const password = generatePassword();
    expect(password).toHaveLength(DEFAULT_PASSWORD_OPTIONS.length);
  });

  it('generates a password of the specified length', () => {
    const password = generatePassword({ ...DEFAULT_PASSWORD_OPTIONS, length: 32 });
    expect(password).toHaveLength(32);
  });

  it('generates a password with only uppercase characters', () => {
    const password = generatePassword({
      length: 20,
      uppercase: true,
      lowercase: false,
      digits: false,
      special: false,
    });
    expect(password).toHaveLength(20);
    expect(password).toMatch(/^[A-Z]+$/);
  });

  it('generates a password with only lowercase characters', () => {
    const password = generatePassword({
      length: 20,
      uppercase: false,
      lowercase: true,
      digits: false,
      special: false,
    });
    expect(password).toHaveLength(20);
    expect(password).toMatch(/^[a-z]+$/);
  });

  it('generates a password with only digits', () => {
    const password = generatePassword({
      length: 20,
      uppercase: false,
      lowercase: false,
      digits: true,
      special: false,
    });
    expect(password).toHaveLength(20);
    expect(password).toMatch(/^[0-9]+$/);
  });

  it('generates a password with only special characters', () => {
    const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';
    const password = generatePassword({
      length: 20,
      uppercase: false,
      lowercase: false,
      digits: false,
      special: true,
    });
    expect(password).toHaveLength(20);
    for (const char of password) {
      expect(specialChars).toContain(char);
    }
  });

  it('generates a password containing all enabled character types when length is sufficient', () => {
    const opts: PasswordOptions = {
      length: 20,
      uppercase: true,
      lowercase: true,
      digits: true,
      special: true,
    };
    const password = generatePassword(opts);
    expect(password).toHaveLength(20);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[a-z]/);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[!@#$%^&*()\-_=+\[\]{}|;:,.<>?]/);
  });

  it('generates a minimum-length password of 1', () => {
    const password = generatePassword({
      length: 1,
      uppercase: true,
      lowercase: false,
      digits: false,
      special: false,
    });
    expect(password).toHaveLength(1);
    expect(password).toMatch(/^[A-Z]$/);
  });

  it('generates a maximum-length password of 128', () => {
    const password = generatePassword({ ...DEFAULT_PASSWORD_OPTIONS, length: 128 });
    expect(password).toHaveLength(128);
  });

  it('handles length shorter than number of enabled character types', () => {
    // 4 types enabled but length is 2 — should still produce a valid password
    const password = generatePassword({
      length: 2,
      uppercase: true,
      lowercase: true,
      digits: true,
      special: true,
    });
    expect(password).toHaveLength(2);
  });

  it('throws for length of 0', () => {
    expect(() =>
      generatePassword({ ...DEFAULT_PASSWORD_OPTIONS, length: 0 }),
    ).toThrow('Password length must be an integer between 1 and 128.');
  });

  it('throws for length greater than 128', () => {
    expect(() =>
      generatePassword({ ...DEFAULT_PASSWORD_OPTIONS, length: 129 }),
    ).toThrow('Password length must be an integer between 1 and 128.');
  });

  it('throws for non-integer length', () => {
    expect(() =>
      generatePassword({ ...DEFAULT_PASSWORD_OPTIONS, length: 10.5 }),
    ).toThrow('Password length must be an integer between 1 and 128.');
  });

  it('throws when no character types are enabled', () => {
    expect(() =>
      generatePassword({
        length: 16,
        uppercase: false,
        lowercase: false,
        digits: false,
        special: false,
      }),
    ).toThrow('At least one character type must be enabled.');
  });
});

// ─── randomInteger ──────────────────────────────────────────────────────────

describe('randomInteger', () => {
  it('returns a value within the specified range', () => {
    const result = randomInteger(1, 10);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
  });

  it('returns the only possible value when min equals max', () => {
    expect(randomInteger(5, 5)).toBe(5);
  });

  it('works with negative ranges', () => {
    const result = randomInteger(-10, -1);
    expect(result).toBeGreaterThanOrEqual(-10);
    expect(result).toBeLessThanOrEqual(-1);
  });

  it('works with a range spanning zero', () => {
    const result = randomInteger(-5, 5);
    expect(result).toBeGreaterThanOrEqual(-5);
    expect(result).toBeLessThanOrEqual(5);
  });

  it('returns an integer', () => {
    const result = randomInteger(0, 1000);
    expect(Number.isInteger(result)).toBe(true);
  });

  it('throws when min is greater than max', () => {
    expect(() => randomInteger(10, 5)).toThrow('Min must be less than or equal to max.');
  });

  it('throws for non-integer min', () => {
    expect(() => randomInteger(1.5, 10)).toThrow('Both min and max must be integers.');
  });

  it('throws for non-integer max', () => {
    expect(() => randomInteger(1, 10.5)).toThrow('Both min and max must be integers.');
  });
});

// ─── generateLoremIpsum ─────────────────────────────────────────────────────

describe('generateLoremIpsum', () => {
  describe('words', () => {
    it('generates the requested number of words', () => {
      const text = generateLoremIpsum(5, 'words');
      const words = text.split(/\s+/).filter(Boolean);
      expect(words).toHaveLength(5);
    });

    it('generates a single word', () => {
      const text = generateLoremIpsum(1, 'words');
      const words = text.split(/\s+/).filter(Boolean);
      expect(words).toHaveLength(1);
    });

    it('words are separated by spaces', () => {
      const text = generateLoremIpsum(10, 'words');
      expect(text).not.toMatch(/^\s/);
      expect(text).not.toMatch(/\s$/);
      expect(text.split(' ')).toHaveLength(10);
    });
  });

  describe('sentences', () => {
    it('generates the requested number of sentences', () => {
      const text = generateLoremIpsum(3, 'sentences');
      const sentences = text.split(/\.\s*/).filter(Boolean);
      expect(sentences).toHaveLength(3);
    });

    it('generates a single sentence', () => {
      const text = generateLoremIpsum(1, 'sentences');
      expect(text).toMatch(/\.$/);
      const sentences = text.split(/\.\s*/).filter(Boolean);
      expect(sentences).toHaveLength(1);
    });

    it('each sentence starts with a capital letter and ends with a period', () => {
      const text = generateLoremIpsum(5, 'sentences');
      // Split on ". " or "." at end to get individual sentences
      const sentences = text.split(/\.\s*/).filter(Boolean);
      for (const sentence of sentences) {
        expect(sentence[0]).toMatch(/[A-Z]/);
      }
      expect(text).toMatch(/\.$/);
    });
  });

  describe('paragraphs', () => {
    it('generates the requested number of paragraphs', () => {
      const text = generateLoremIpsum(3, 'paragraphs');
      const paragraphs = text.split('\n\n');
      expect(paragraphs).toHaveLength(3);
    });

    it('generates a single paragraph', () => {
      const text = generateLoremIpsum(1, 'paragraphs');
      expect(text.split('\n\n')).toHaveLength(1);
      // A paragraph should contain at least one sentence (ending with a period)
      expect(text).toMatch(/\.$/);
    });

    it('paragraphs are separated by double newlines', () => {
      const text = generateLoremIpsum(4, 'paragraphs');
      const parts = text.split('\n\n');
      expect(parts).toHaveLength(4);
      // Each paragraph should be non-empty
      parts.forEach((p) => expect(p.length).toBeGreaterThan(0));
    });

    it('each paragraph contains multiple sentences', () => {
      const text = generateLoremIpsum(2, 'paragraphs');
      const paragraphs = text.split('\n\n');
      for (const paragraph of paragraphs) {
        const sentences = paragraph.split(/\.\s*/).filter(Boolean);
        // Implementation generates 3–7 sentences per paragraph
        expect(sentences.length).toBeGreaterThanOrEqual(3);
        expect(sentences.length).toBeLessThanOrEqual(7);
      }
    });
  });

  describe('error handling', () => {
    it('throws for quantity of 0', () => {
      expect(() => generateLoremIpsum(0, 'words')).toThrow(
        'Quantity must be an integer between 1 and 100.',
      );
    });

    it('throws for quantity greater than 100', () => {
      expect(() => generateLoremIpsum(101, 'words')).toThrow(
        'Quantity must be an integer between 1 and 100.',
      );
    });

    it('throws for negative quantity', () => {
      expect(() => generateLoremIpsum(-1, 'sentences')).toThrow(
        'Quantity must be an integer between 1 and 100.',
      );
    });

    it('throws for non-integer quantity', () => {
      expect(() => generateLoremIpsum(2.5, 'paragraphs')).toThrow(
        'Quantity must be an integer between 1 and 100.',
      );
    });
  });
});
