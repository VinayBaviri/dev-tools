import { describe, it, expect } from 'vitest';
import { urlEncode, urlDecode, parseURL } from './url';

describe('urlEncode', () => {
  it('encodes spaces as %20', () => {
    expect(urlEncode('hello world')).toBe('hello%20world');
  });

  it('encodes special characters', () => {
    expect(urlEncode('a&b=c')).toBe('a%26b%3Dc');
  });

  it('encodes unicode characters', () => {
    const encoded = urlEncode('café ☕');
    expect(urlDecode(encoded)).toBe('café ☕');
    expect(encoded).not.toBe('café ☕');
  });

  it('returns empty string for empty input', () => {
    expect(urlEncode('')).toBe('');
  });
});

describe('urlDecode', () => {
  it('decodes percent-encoded spaces', () => {
    expect(urlDecode('hello%20world')).toBe('hello world');
  });

  it('decodes percent-encoded special characters', () => {
    expect(urlDecode('a%26b%3Dc')).toBe('a&b=c');
  });

  it('returns empty string for empty input', () => {
    expect(urlDecode('')).toBe('');
  });

  it('throws a descriptive error for malformed percent-encoding', () => {
    expect(() => urlDecode('%ZZ')).toThrow(
      'Invalid percent-encoded string',
    );
  });
});

describe('parseURL', () => {
  it('parses a full URL with all components', () => {
    const result = parseURL('https://example.com:8080/path/to/page?key=value&foo=bar#section');
    expect(result.protocol).toBe('https:');
    expect(result.host).toBe('example.com');
    expect(result.port).toBe('8080');
    expect(result.path).toBe('/path/to/page');
    expect(result.queryParams).toEqual({ key: 'value', foo: 'bar' });
    expect(result.fragment).toBe('section');
  });

  it('handles URLs without a port', () => {
    const result = parseURL('https://example.com/path');
    expect(result.port).toBe('');
    expect(result.host).toBe('example.com');
  });

  it('handles URLs without query parameters', () => {
    const result = parseURL('https://example.com/path');
    expect(result.queryParams).toEqual({});
  });

  it('handles URLs without a fragment', () => {
    const result = parseURL('https://example.com/path');
    expect(result.fragment).toBe('');
  });

  it('handles multiple query parameters', () => {
    const result = parseURL('https://example.com/?a=1&b=2&c=3');
    expect(result.queryParams).toEqual({ a: '1', b: '2', c: '3' });
  });

  it('throws a descriptive error for malformed URLs', () => {
    expect(() => parseURL('not a url')).toThrow('Invalid URL');
  });
});
