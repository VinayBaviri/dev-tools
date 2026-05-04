// Feature: dev-toolbox, Property 3: HTML encode/decode round-trip
// **Validates: Requirements 6.1, 6.2, 6.3**

// Feature: dev-toolbox, Property 4: HTML minify/prettify semantic equivalence
// **Validates: Requirements 6.5, 6.6, 6.7**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { htmlEncode, htmlDecode, htmlMinify, htmlPrettify } from './html';

describe('Property 3: HTML encode/decode round-trip', () => {
  it('for any string s, htmlDecode(htmlEncode(s)) === s', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(htmlDecode(htmlEncode(s))).toBe(s);
      }),
      { numRuns: 100 },
    );
  });
});

describe('Property 4: HTML minify/prettify semantic equivalence', () => {
  /**
   * Arbitrary for simple text content (no HTML special chars that would
   * break tag structure). Uses alphanumeric + spaces.
   */
  const textContentArb = fc
    .array(
      fc.constantFrom(
        ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 '.split(''),
      ),
      { minLength: 1, maxLength: 30 },
    )
    .map((chars) => chars.join(''))
    .filter((s) => s.trim().length > 0);

  /** Arbitrary for a tag name. */
  const tagNameArb = fc.constantFrom('p', 'div', 'span', 'h1', 'h2', 'h3', 'section', 'article');

  /** Arbitrary for a simple HTML element: <tag>text</tag> */
  const simpleElementArb = fc.tuple(tagNameArb, textContentArb).map(
    ([tag, text]) => `<${tag}>${text}</${tag}>`,
  );

  /** Arbitrary for a nested HTML structure: <outer><inner>text</inner></outer> */
  const nestedElementArb = fc
    .tuple(tagNameArb, tagNameArb, textContentArb)
    .map(([outer, inner, text]) => `<${outer}><${inner}>${text}</${inner}></${outer}>`);

  /** Arbitrary for HTML with multiple sibling elements */
  const siblingElementsArb = fc
    .array(simpleElementArb, { minLength: 1, maxLength: 4 })
    .map((elements) => `<div>${elements.join('')}</div>`);

  /** Combined arbitrary for various HTML structures */
  const htmlArb = fc.oneof(simpleElementArb, nestedElementArb, siblingElementsArb);

  /**
   * Extracts normalized text content from HTML by stripping tags and
   * collapsing whitespace. This gives us a semantic comparison that
   * ignores formatting differences.
   */
  function extractTextContent(html: string): string {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  it('for any valid HTML markup, minifying then prettifying preserves text content', () => {
    fc.assert(
      fc.property(htmlArb, (html) => {
        const minified = htmlMinify(html);
        const prettified = htmlPrettify(minified);

        const originalText = extractTextContent(html);
        const roundTripText = extractTextContent(prettified);

        expect(roundTripText).toBe(originalText);
      }),
      { numRuns: 100 },
    );
  });
});
