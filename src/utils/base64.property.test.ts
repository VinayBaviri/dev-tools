// Feature: dev-toolbox, Property 15: Base64 encode/decode round-trip
// **Validates: Requirements 12.1, 12.2, 12.3**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { base64Encode, base64Decode } from './base64';

describe('Property 15: Base64 encode/decode round-trip', () => {
  it('for any string s, base64Decode(base64Encode(s)) === s', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(base64Decode(base64Encode(s))).toBe(s);
      }),
      { numRuns: 100 },
    );
  });
});
