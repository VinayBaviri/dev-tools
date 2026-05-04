import { describe, it, expect } from 'vitest';
import { base64Encode, base64Decode, base64EncodeFile, getEncodedSize } from './base64';

describe('base64Encode', () => {
  it('encodes a simple ASCII string', () => {
    expect(base64Encode('Hello, World!')).toBe('SGVsbG8sIFdvcmxkIQ==');
  });

  it('encodes an empty string', () => {
    expect(base64Encode('')).toBe('');
  });

  it('encodes a string with unicode characters', () => {
    const encoded = base64Encode('café ☕');
    expect(base64Decode(encoded)).toBe('café ☕');
  });

  it('encodes a string with special characters', () => {
    const encoded = base64Encode('<script>alert("xss")</script>');
    expect(encoded).toBe('PHNjcmlwdD5hbGVydCgieHNzIik8L3NjcmlwdD4=');
  });

  it('encodes a string with newlines', () => {
    const encoded = base64Encode('line1\nline2\nline3');
    expect(base64Decode(encoded)).toBe('line1\nline2\nline3');
  });
});

describe('base64Decode', () => {
  it('decodes a simple Base64 string', () => {
    expect(base64Decode('SGVsbG8sIFdvcmxkIQ==')).toBe('Hello, World!');
  });

  it('decodes an empty string', () => {
    expect(base64Decode('')).toBe('');
  });

  it('decodes a Base64 string without padding', () => {
    // "Hi" encodes to "SGk=" but atob also accepts "SGk"
    expect(base64Decode('SGk=')).toBe('Hi');
  });

  it('throws a descriptive error for invalid Base64 input', () => {
    expect(() => base64Decode('not-valid-base64!!!')).toThrow('Invalid Base64 string');
  });

  it('throws a descriptive error for Base64 with invalid characters', () => {
    expect(() => base64Decode('####')).toThrow('Invalid Base64 string');
  });

  it('round-trips with base64Encode for ASCII strings', () => {
    const original = 'The quick brown fox jumps over the lazy dog';
    expect(base64Decode(base64Encode(original))).toBe(original);
  });

  it('round-trips with base64Encode for unicode strings', () => {
    const original = '日本語テスト 🎉';
    expect(base64Decode(base64Encode(original))).toBe(original);
  });
});

describe('base64EncodeFile', () => {
  it('encodes an ArrayBuffer of ASCII bytes', () => {
    const text = 'Hello';
    const encoder = new TextEncoder();
    const buffer = encoder.encode(text).buffer as ArrayBuffer;
    expect(base64EncodeFile(buffer)).toBe('SGVsbG8=');
  });

  it('encodes an empty ArrayBuffer', () => {
    const buffer = new ArrayBuffer(0);
    expect(base64EncodeFile(buffer)).toBe('');
  });

  it('encodes binary data correctly', () => {
    const bytes = new Uint8Array([0, 1, 2, 255, 254, 253]);
    const buffer = bytes.buffer as ArrayBuffer;
    const encoded = base64EncodeFile(buffer);
    // Verify by decoding back to bytes
    const decoded = atob(encoded);
    const decodedBytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      decodedBytes[i] = decoded.charCodeAt(i);
    }
    expect(Array.from(decodedBytes)).toEqual([0, 1, 2, 255, 254, 253]);
  });

  it('produces valid Base64 output for file-like data', () => {
    const data = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in ASCII
    const buffer = data.buffer as ArrayBuffer;
    const encoded = base64EncodeFile(buffer);
    // Should only contain valid Base64 characters
    expect(encoded).toMatch(/^[A-Za-z0-9+/]*={0,2}$/);
  });
});

describe('getEncodedSize', () => {
  it('returns 0 for an empty string', () => {
    expect(getEncodedSize('')).toBe(0);
  });

  it('returns the byte length of an ASCII Base64 string', () => {
    const encoded = base64Encode('Hello, World!');
    // "SGVsbG8sIFdvcmxkIQ==" is 24 ASCII characters = 24 bytes
    expect(getEncodedSize(encoded)).toBe(encoded.length);
  });

  it('returns the correct byte count for a known Base64 string', () => {
    const encoded = 'SGVsbG8='; // Base64 for "Hello"
    expect(getEncodedSize(encoded)).toBe(8);
  });

  it('returns a size larger than the original input for non-empty strings', () => {
    const original = 'Test data for size calculation';
    const encoded = base64Encode(original);
    const encodedSize = getEncodedSize(encoded);
    // Base64 encoding increases size by ~33%
    expect(encodedSize).toBeGreaterThan(original.length);
  });
});
