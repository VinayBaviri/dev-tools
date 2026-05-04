// Feature: dev-toolbox, Property 5: Markdown to HTML produces valid HTML
// **Validates: Requirements 7.1**

// Feature: dev-toolbox, Property 6: HTML to Markdown content preservation
// **Validates: Requirements 7.4**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { markdownToHTML, htmlToMarkdown } from './markdown';

describe('Property 5: Markdown to HTML produces valid HTML', () => {
  /** Set of HTML void elements that don't require closing tags. */
  const VOID_ELEMENTS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr',
  ]);

  /**
   * Checks that every opening tag in the HTML has a matching closing tag,
   * unless it's a void element. Returns true if well-formed.
   */
  function hasMatchedTags(html: string): boolean {
    const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\/?>/g;
    const stack: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = tagPattern.exec(html)) !== null) {
      const fullMatch = match[0];
      const tagName = match[1].toLowerCase();

      // Skip void elements and self-closing tags
      if (VOID_ELEMENTS.has(tagName) || fullMatch.endsWith('/>')) {
        continue;
      }

      if (fullMatch.startsWith('</')) {
        // Closing tag — must match the most recent opening tag
        if (stack.length === 0 || stack[stack.length - 1] !== tagName) {
          return false;
        }
        stack.pop();
      } else {
        // Opening tag
        stack.push(tagName);
      }
    }

    return stack.length === 0;
  }

  /**
   * Arbitrary for Markdown-like strings combining headings, bold, italic,
   * links, lists, paragraphs, and plain text.
   */
  const markdownFragmentArb = fc.oneof(
    // Plain text words
    fc.lorem({ maxCount: 5, mode: 'words' }),
    // Heading
    fc.tuple(
      fc.integer({ min: 1, max: 6 }),
      fc.lorem({ maxCount: 3, mode: 'words' }),
    ).map(([level, text]) => `${'#'.repeat(level)} ${text}`),
    // Bold text
    fc.lorem({ maxCount: 2, mode: 'words' }).map((t) => `**${t}**`),
    // Italic text
    fc.lorem({ maxCount: 2, mode: 'words' }).map((t) => `*${t}*`),
    // Link
    fc.tuple(
      fc.lorem({ maxCount: 2, mode: 'words' }),
      fc.webUrl(),
    ).map(([text, url]) => `[${text}](${url})`),
    // Unordered list items
    fc.array(fc.lorem({ maxCount: 3, mode: 'words' }), { minLength: 1, maxLength: 4 })
      .map((items) => items.map((item) => `- ${item}`).join('\n')),
    // Code block
    fc.lorem({ maxCount: 3, mode: 'words' }).map((t) => `\`${t}\``),
  );

  const markdownArb = fc
    .array(markdownFragmentArb, { minLength: 1, maxLength: 5 })
    .map((fragments) => fragments.join('\n\n'));

  it('for any Markdown string, converting to HTML produces well-formed tags', () => {
    fc.assert(
      fc.property(markdownArb, (md) => {
        const html = markdownToHTML(md);
        expect(hasMatchedTags(html)).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});

describe('Property 6: HTML to Markdown content preservation', () => {
  /**
   * Arbitrary for safe text content — alphanumeric + spaces, no HTML
   * special characters that would interfere with tag parsing.
   */
  const textContentArb = fc
    .array(
      fc.constantFrom(
        ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 '.split(''),
      ),
      { minLength: 1, maxLength: 20 },
    )
    .map((chars) => chars.join(''))
    .filter((s) => s.trim().length > 0);

  /** Arbitrary for a paragraph element */
  const paragraphArb = textContentArb.map((text) => ({
    html: `<p>${text}</p>`,
    texts: [text.trim()],
  }));

  /** Arbitrary for a heading element (h1-h6) */
  const headingArb = fc.tuple(
    fc.integer({ min: 1, max: 6 }),
    textContentArb,
  ).map(([level, text]) => ({
    html: `<h${level}>${text}</h${level}>`,
    texts: [text.trim()],
  }));

  /** Arbitrary for a bold element */
  const boldArb = textContentArb.map((text) => ({
    html: `<strong>${text}</strong>`,
    texts: [text.trim()],
  }));

  /** Arbitrary for an italic element */
  const italicArb = textContentArb.map((text) => ({
    html: `<em>${text}</em>`,
    texts: [text.trim()],
  }));

  /** Arbitrary for a link element */
  const linkArb = fc.tuple(textContentArb, fc.webUrl()).map(([text, url]) => ({
    html: `<a href="${url}">${text}</a>`,
    texts: [text.trim()],
  }));

  /** Arbitrary for an unordered list */
  const ulArb = fc
    .array(textContentArb, { minLength: 1, maxLength: 4 })
    .map((items) => ({
      html: `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`,
      texts: items.map((item) => item.trim()),
    }));

  /** Arbitrary for an ordered list */
  const olArb = fc
    .array(textContentArb, { minLength: 1, maxLength: 4 })
    .map((items) => ({
      html: `<ol>${items.map((item) => `<li>${item}</li>`).join('')}</ol>`,
      texts: items.map((item) => item.trim()),
    }));

  /** Combined arbitrary producing HTML with expected text content */
  const htmlWithTextsArb = fc
    .array(
      fc.oneof(paragraphArb, headingArb, boldArb, italicArb, linkArb, ulArb, olArb),
      { minLength: 1, maxLength: 5 },
    )
    .map((elements) => ({
      html: elements.map((el) => el.html).join('\n'),
      expectedTexts: elements.flatMap((el) => el.texts),
    }));

  it('for any HTML with basic elements, converting to Markdown preserves all text content', () => {
    fc.assert(
      fc.property(htmlWithTextsArb, ({ html, expectedTexts }) => {
        const markdown = htmlToMarkdown(html);

        for (const text of expectedTexts) {
          expect(markdown).toContain(text);
        }
      }),
      { numRuns: 100 },
    );
  });
});
