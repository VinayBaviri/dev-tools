/**
 * Markdown utility functions for converting between Markdown and HTML.
 */

import { marked } from 'marked';

// Configure marked for CommonMark compliance:
// - gfm: false disables GitHub Flavored Markdown extensions
// - async: false ensures synchronous rendering
// - breaks: false follows CommonMark line break rules
marked.use({
  async: false,
  gfm: false,
  breaks: false,
});

/**
 * Converts a Markdown string to HTML using the marked library.
 * Configured for CommonMark compliance.
 *
 * @param input - The Markdown string to convert.
 * @returns The corresponding HTML string.
 */
export function markdownToHTML(input: string): string {
  return marked.parse(input) as string;
}

/**
 * Converts an HTML string to Markdown text.
 * Supports basic HTML elements: h1-h6, p, ul/ol/li, a, strong/b, em/i,
 * blockquote, pre/code.
 *
 * Uses a regex-based approach with no DOM dependency.
 *
 * @param input - The HTML string to convert.
 * @returns The equivalent Markdown string.
 */
export function htmlToMarkdown(input: string): string {
  let result = input;

  // Process code blocks (pre > code) before inline code to avoid conflicts
  result = result.replace(
    /<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (_, content) => `\n\`\`\`\n${decodeEntities(content).trim()}\n\`\`\`\n`,
  );

  // Inline code
  result = result.replace(
    /<code[^>]*>([\s\S]*?)<\/code>/gi,
    (_, content) => `\`${decodeEntities(content)}\``,
  );

  // Headings h1-h6
  result = result.replace(
    /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi,
    (_, level, content) => `\n${'#'.repeat(Number(level))} ${stripTags(content).trim()}\n`,
  );

  // Blockquotes — handle nested content
  result = result.replace(
    /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
    (_, content) => {
      const inner = stripTags(content).trim();
      const lines = inner.split('\n').map((line: string) => `> ${line.trim()}`);
      return `\n${lines.join('\n')}\n`;
    },
  );

  // Bold (strong and b)
  result = result.replace(
    /<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi,
    (_, content) => `**${stripTags(content)}**`,
  );

  // Italic (em and i)
  result = result.replace(
    /<(?:em|i)[^>]*>([\s\S]*?)<\/(?:em|i)>/gi,
    (_, content) => `*${stripTags(content)}*`,
  );

  // Links
  result = result.replace(
    /<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, text) => `[${stripTags(text)}](${href})`,
  );

  // Unordered lists
  result = result.replace(
    /<ul[^>]*>([\s\S]*?)<\/ul>/gi,
    (_, content) => {
      const items = extractListItems(content);
      return `\n${items.map((item) => `- ${item}`).join('\n')}\n`;
    },
  );

  // Ordered lists
  result = result.replace(
    /<ol[^>]*>([\s\S]*?)<\/ol>/gi,
    (_, content) => {
      const items = extractListItems(content);
      return `\n${items.map((item, i) => `${i + 1}. ${item}`).join('\n')}\n`;
    },
  );

  // Paragraphs
  result = result.replace(
    /<p[^>]*>([\s\S]*?)<\/p>/gi,
    (_, content) => `\n${content.trim()}\n`,
  );

  // Strip any remaining HTML tags
  result = stripTags(result);

  // Decode HTML entities
  result = decodeEntities(result);

  // Clean up excessive blank lines (3+ newlines → 2)
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim() + '\n';
}

/**
 * Extracts text content from <li> elements within a list.
 */
function extractListItems(html: string): string[] {
  const items: string[] = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match: RegExpExecArray | null;

  while ((match = liRegex.exec(html)) !== null) {
    items.push(stripTags(match[1]).trim());
  }

  return items;
}

/**
 * Removes all HTML tags from a string, leaving only text content.
 */
function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

/**
 * Decodes common HTML entities back to their original characters.
 */
function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'");
}
