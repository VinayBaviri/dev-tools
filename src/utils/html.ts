/**
 * HTML utility functions for encoding, decoding, minifying, and prettifying HTML.
 */

/**
 * Map of special characters to their HTML entity equivalents.
 */
const ENCODE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Reverse map of HTML entities to their original characters.
 */
const DECODE_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
  '&apos;': "'",
};

/**
 * Converts special characters in a string to their corresponding HTML entities.
 * Encodes: & < > " '
 *
 * @param input - The string to encode.
 * @returns The HTML-entity-encoded string.
 */
export function htmlEncode(input: string): string {
  return input.replace(/[&<>"']/g, (char) => ENCODE_MAP[char]);
}

/**
 * Converts HTML entities back to their original characters.
 * Decodes named entities (&amp;, &lt;, &gt;, &quot;, &apos;) and
 * numeric entities (&#39;, &#x27;, and other decimal/hex references).
 *
 * @param input - The HTML-entity-encoded string to decode.
 * @returns The decoded plain text string.
 */
export function htmlDecode(input: string): string {
  // First pass: decode known named and numeric entities from our map
  let result = input.replace(
    /&(?:amp|lt|gt|quot|apos|#39|#x27);/g,
    (entity) => DECODE_MAP[entity] ?? entity,
  );

  // Second pass: decode remaining numeric entities (decimal &#NNN; and hex &#xHHH;)
  result = result.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(Number(code)),
  );
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16)),
  );

  return result;
}

/**
 * Removes unnecessary whitespace from HTML markup.
 * Collapses whitespace between tags and trims whitespace around tag boundaries.
 *
 * @param input - The HTML markup to minify.
 * @returns The minified HTML string.
 */
export function htmlMinify(input: string): string {
  let result = input;

  // Remove HTML comments
  result = result.replace(/<!--[\s\S]*?-->/g, '');

  // Collapse whitespace between tags: >   < becomes ><
  result = result.replace(/>\s+</g, '><');

  // Trim leading/trailing whitespace
  result = result.trim();

  return result;
}

/**
 * Void elements that should not have closing tags.
 */
const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

/**
 * Formats HTML markup with consistent indentation and line breaks.
 * Each tag is placed on its own line with proper nesting indentation.
 *
 * @param input - The HTML markup to prettify.
 * @returns The formatted HTML string with consistent indentation.
 */
export function htmlPrettify(input: string): string {
  // First minify to normalize whitespace
  const minified = htmlMinify(input);

  if (!minified) {
    return '';
  }

  const tokens = tokenize(minified);
  const lines: string[] = [];
  let indentLevel = 0;
  const indentStr = '  ';

  for (const token of tokens) {
    if (token.type === 'closing') {
      indentLevel = Math.max(0, indentLevel - 1);
      lines.push(`${indentStr.repeat(indentLevel)}${token.value}`);
    } else if (token.type === 'opening') {
      lines.push(`${indentStr.repeat(indentLevel)}${token.value}`);
      const tagName = getTagName(token.value);
      if (tagName && !VOID_ELEMENTS.has(tagName.toLowerCase()) && !isSelfClosing(token.value)) {
        indentLevel++;
      }
    } else if (token.type === 'self-closing' || token.type === 'void') {
      lines.push(`${indentStr.repeat(indentLevel)}${token.value}`);
    } else if (token.type === 'comment' || token.type === 'doctype') {
      lines.push(`${indentStr.repeat(indentLevel)}${token.value}`);
    } else if (token.type === 'text') {
      const trimmed = token.value.trim();
      if (trimmed) {
        lines.push(`${indentStr.repeat(indentLevel)}${trimmed}`);
      }
    }
  }

  return lines.join('\n');
}

/**
 * Token types for HTML tokenization.
 */
interface HtmlToken {
  type: 'opening' | 'closing' | 'self-closing' | 'void' | 'text' | 'comment' | 'doctype';
  value: string;
}

/**
 * Tokenizes an HTML string into a sequence of tags and text nodes.
 */
function tokenize(html: string): HtmlToken[] {
  const tokens: HtmlToken[] = [];
  const regex = /<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/[^>]+>|<[^>]+\/\s*>|<[^>]+>|[^<]+/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const value = match[0];

    if (value.startsWith('<!--')) {
      tokens.push({ type: 'comment', value });
    } else if (/^<!DOCTYPE/i.test(value)) {
      tokens.push({ type: 'doctype', value });
    } else if (value.startsWith('</')) {
      tokens.push({ type: 'closing', value });
    } else if (isSelfClosing(value)) {
      tokens.push({ type: 'self-closing', value });
    } else if (value.startsWith('<')) {
      const tagName = getTagName(value);
      if (tagName && VOID_ELEMENTS.has(tagName.toLowerCase())) {
        tokens.push({ type: 'void', value });
      } else {
        tokens.push({ type: 'opening', value });
      }
    } else {
      tokens.push({ type: 'text', value });
    }
  }

  return tokens;
}

/**
 * Extracts the tag name from an HTML tag string.
 */
function getTagName(tag: string): string | null {
  const match = tag.match(/^<\/?([a-zA-Z][a-zA-Z0-9-]*)/);
  return match ? match[1] : null;
}

/**
 * Checks if a tag string is self-closing (ends with />).
 */
function isSelfClosing(tag: string): boolean {
  return /\/\s*>$/.test(tag);
}
