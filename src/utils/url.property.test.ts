// Feature: dev-toolbox, Property 1: URL encode/decode round-trip
// **Validates: Requirements 5.1, 5.2, 5.3**

// Feature: dev-toolbox, Property 2: URL parsing extracts correct components
// **Validates: Requirements 5.4**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { urlEncode, urlDecode, parseURL } from './url';

describe('Property 1: URL encode/decode round-trip', () => {
  it('for any string s, urlDecode(urlEncode(s)) === s', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(urlDecode(urlEncode(s))).toBe(s);
      }),
      { numRuns: 100 },
    );
  });
});

describe('Property 2: URL parsing extracts correct components', () => {
  const alphaNumChars = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
  const segmentChars = 'abcdefghijklmnopqrstuvwxyz0123456789-_'.split('');

  /**
   * Arbitrary for a non-empty string from a given character set.
   */
  function stringFromChars(chars: string[], min: number, max: number) {
    return fc
      .array(fc.constantFrom(...chars), { minLength: min, maxLength: max })
      .map((arr) => arr.join(''));
  }

  /** Arbitrary for a valid hostname like "foo.example.com". */
  const hostArb = fc
    .tuple(
      stringFromChars(alphaNumChars, 1, 10),
      stringFromChars(alphaNumChars, 1, 10),
      fc.constantFrom('com', 'org', 'net', 'io'),
    )
    .map(([sub, domain, tld]) => `${sub}.${domain}.${tld}`);

  /** Arbitrary for a protocol. */
  const protocolArb = fc.constantFrom('http:', 'https:');

  /** Arbitrary for a port string (empty or a valid port number). */
  const portArb = fc.oneof(
    fc.constant(''),
    fc.integer({ min: 1, max: 65535 }).map(String),
  );

  /** Arbitrary for a URL path like "/foo/bar". */
  const pathArb = fc
    .array(stringFromChars(segmentChars, 1, 12), { minLength: 0, maxLength: 4 })
    .map((segments) => '/' + segments.join('/'));

  /** Arbitrary for query parameter keys and values. */
  const queryKeyArb = stringFromChars('abcdefghijklmnopqrstuvwxyz'.split(''), 1, 8);
  const queryValueArb = stringFromChars(alphaNumChars, 1, 10);

  /** Arbitrary for query params as a record of unique keys to values. */
  const queryParamsArb = fc
    .array(fc.tuple(queryKeyArb, queryValueArb), { minLength: 0, maxLength: 4 })
    .map((pairs) => {
      const record: Record<string, string> = {};
      for (const [k, v] of pairs) {
        record[k] = v;
      }
      return record;
    });

  /** Arbitrary for a URL fragment (possibly empty). */
  const fragmentArb = fc.oneof(
    fc.constant(''),
    stringFromChars(segmentChars, 1, 12),
  );

  it('for any valid URL constructed from known components, parsing extracts each component correctly', () => {
    fc.assert(
      fc.property(
        protocolArb,
        hostArb,
        portArb,
        pathArb,
        queryParamsArb,
        fragmentArb,
        (protocol, host, port, path, queryParams, fragment) => {
          // Build the URL string from known parts
          const scheme = protocol.replace(':', '');
          const portPart = port ? `:${port}` : '';
          const queryEntries = Object.entries(queryParams);
          const queryString =
            queryEntries.length > 0
              ? '?' + queryEntries.map(([k, v]) => `${k}=${v}`).join('&')
              : '';
          const fragmentPart = fragment ? `#${fragment}` : '';

          const urlString = `${scheme}://${host}${portPart}${path}${queryString}${fragmentPart}`;

          const parsed = parseURL(urlString);

          // Verify each component matches what we constructed
          expect(parsed.protocol).toBe(protocol);
          expect(parsed.host).toBe(host);
          expect(parsed.port).toBe(port);
          expect(parsed.path).toBe(path);
          expect(parsed.fragment).toBe(fragment);

          // Verify query params match
          expect(Object.keys(parsed.queryParams).sort()).toEqual(
            Object.keys(queryParams).sort(),
          );
          for (const [key, value] of Object.entries(queryParams)) {
            expect(parsed.queryParams[key]).toBe(value);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
