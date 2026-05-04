/**
 * JavaScript utility functions for formatting and minifying JS code.
 * Uses Prettier's standalone browser build for parsing and formatting.
 */

import * as prettier from 'prettier/standalone';
import * as parserBabel from 'prettier/plugins/babel';
import * as parserEstree from 'prettier/plugins/estree';

/**
 * Extracts a descriptive error message from a Prettier syntax error.
 * Includes the error location (line/column) when available.
 */
function formatSyntaxError(error: unknown): string {
  if (error instanceof SyntaxError || (error instanceof Error && error.message)) {
    const message = error.message;

    // Prettier babel parser errors typically include location info like:
    // "... (line:col)" or contain line/column references
    const locMatch = message.match(/\((\d+):(\d+)\)/);
    if (locMatch) {
      return `Syntax error at line ${locMatch[1]}, column ${locMatch[2]}: ${message}`;
    }

    return `Syntax error: ${message}`;
  }

  return 'Syntax error: Unable to parse JavaScript';
}

/**
 * Formats JavaScript code with consistent indentation, line breaks, and spacing
 * using Prettier with the Babel parser.
 *
 * @param input - The JavaScript code to format.
 * @returns A promise that resolves to the prettified JavaScript string.
 * @throws Error with descriptive message including syntax error location for invalid JS.
 */
export async function formatJS(input: string): Promise<string> {
  if (!input.trim()) {
    return '';
  }

  try {
    const formatted = await prettier.format(input, {
      parser: 'babel',
      plugins: [parserBabel, parserEstree],
      semi: true,
      singleQuote: false,
      tabWidth: 2,
      trailingComma: 'all',
    });

    return formatted;
  } catch (error: unknown) {
    throw new Error(formatSyntaxError(error));
  }
}

/**
 * Minifies JavaScript code by removing whitespace and comments while
 * preserving functionality. Uses Prettier to validate syntax, then
 * strips comments and collapses whitespace.
 *
 * @param input - The JavaScript code to minify.
 * @returns A promise that resolves to the minified JavaScript string.
 * @throws Error with descriptive message including syntax error location for invalid JS.
 */
export async function minifyJS(input: string): Promise<string> {
  if (!input.trim()) {
    return '';
  }

  try {
    // Use Prettier with extreme printWidth to get single-line output
    // and minimal formatting options to produce compact code
    const minified = await prettier.format(input, {
      parser: 'babel',
      plugins: [parserBabel, parserEstree],
      printWidth: 999999,
      tabWidth: 0,
      useTabs: false,
      semi: true,
      singleQuote: false,
      trailingComma: 'none',
      bracketSpacing: false,
      arrowParens: 'avoid',
    });

    // Strip comments and collapse whitespace for minification.
    // Order matters: strip line comments first (while lines are intact),
    // then remove block comments, then collapse whitespace.
    let result = minified;

    // Strip single-line comments line by line (before collapsing newlines)
    // This must happen first while // comments are still at end of lines
    result = result
      .split('\n')
      .map((line) => stripLineComment(line))
      .join('\n');

    // Remove multi-line comments
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');

    // Trim each line and remove empty lines
    result = result
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join(' ');

    // Collapse multiple spaces into one
    result = result.replace(/ {2,}/g, ' ');

    return result.trim();
  } catch (error: unknown) {
    throw new Error(formatSyntaxError(error));
  }
}

/**
 * Strips a trailing single-line comment from a line of code,
 * being careful not to strip // inside string literals.
 */
function stripLineComment(line: string): string {
  let inString: string | null = null;
  let escaped = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (inString) {
      if (char === inString) {
        inString = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = char;
      continue;
    }

    if (char === '/' && i + 1 < line.length && line[i + 1] === '/') {
      return line.substring(0, i).trimEnd();
    }
  }

  return line;
}
