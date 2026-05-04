/**
 * SQL utility functions for formatting SQL queries.
 */

import { format } from 'sql-formatter';

/**
 * Formats a SQL query string with consistent indentation and keyword capitalization.
 * Uses the sql-formatter library for pretty-printing.
 *
 * @param input - The SQL query string to format.
 * @returns The formatted SQL string.
 * @throws Error if the input is empty or cannot be formatted.
 */
export function formatSQL(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Input is empty: please provide a SQL query to format.');
  }

  try {
    return format(trimmed, {
      language: 'sql',
      tabWidth: 2,
      keywordCase: 'upper',
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : 'Unknown formatting error';
    throw new Error(`SQL formatting error: ${message}`);
  }
}
