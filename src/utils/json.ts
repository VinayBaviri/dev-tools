/**
 * JSON utility functions for parsing, formatting, validating, and converting JSON data.
 */

/**
 * Parses a JSON string into a JavaScript value.
 * Wraps `JSON.parse` with a descriptive error message on failure.
 *
 * @param input - The JSON string to parse.
 * @returns The parsed JavaScript value.
 */
export function jsonParse(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch (e) {
    const message =
      e instanceof SyntaxError ? e.message : 'Unknown parsing error';
    throw new Error(`Invalid JSON: ${message}`);
  }
}

/**
 * Stringifies a JavaScript value into a JSON string.
 * Uses the specified indentation level (defaults to 2 spaces).
 *
 * @param value - The value to stringify.
 * @param indent - Number of spaces for indentation (default: 2).
 * @returns The formatted JSON string.
 */
export function jsonStringify(value: unknown, indent: number = 2): string {
  return JSON.stringify(value, null, indent);
}

/**
 * Minifies a JSON string by removing all unnecessary whitespace.
 * Parses the input and re-stringifies with no indentation.
 *
 * @param input - The JSON string to minify.
 * @returns The compact JSON string with no whitespace.
 */
export function jsonMinify(input: string): string {
  const parsed = jsonParse(input);
  return JSON.stringify(parsed);
}

/**
 * Formats a JSON string with 2-space indentation for readability.
 * Parses the input and re-stringifies with pretty-printing.
 *
 * @param input - The JSON string to format.
 * @returns The prettified JSON string with 2-space indentation.
 */
export function jsonFormat(input: string): string {
  const parsed = jsonParse(input);
  return jsonStringify(parsed, 2);
}

/**
 * Validates whether a string is valid JSON.
 * Returns an object indicating validity and, on failure, an error description
 * with location information when available.
 *
 * @param input - The string to validate as JSON.
 * @returns An object with `valid: true` if the input is valid JSON,
 *          or `valid: false` with an `error` description if invalid.
 */
export function jsonValidate(input: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    const message =
      e instanceof SyntaxError ? e.message : 'Unknown validation error';
    return { valid: false, error: message };
  }
}

/**
 * Escapes a value for safe inclusion in a CSV field.
 * Wraps the value in double quotes if it contains commas, double quotes, or newlines.
 * Double quotes within the value are escaped by doubling them.
 */
function escapeCSVField(value: string): string {
  if (
    value.includes(',') ||
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r')
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Converts a JSON string representing an array of flat objects into CSV format.
 * Extracts unique keys across all objects as the header row, then produces
 * one data row per object. Missing keys in an object produce empty fields.
 *
 * @param input - A JSON string that parses to an array of objects.
 * @returns A CSV string with a header row followed by data rows.
 * @throws Error if the input is not a JSON array of objects.
 */
export function jsonToCSV(input: string): string {
  const parsed = jsonParse(input);

  if (!Array.isArray(parsed)) {
    throw new Error(
      'Invalid input: expected a JSON array of objects, but received a non-array value.',
    );
  }

  if (parsed.length === 0) {
    return '';
  }

  // Validate that all elements are flat objects
  for (let i = 0; i < parsed.length; i++) {
    if (
      parsed[i] === null ||
      typeof parsed[i] !== 'object' ||
      Array.isArray(parsed[i])
    ) {
      throw new Error(
        `Invalid input: expected an array of objects, but element at index ${i} is not an object.`,
      );
    }
  }

  // Extract unique keys in insertion order across all objects
  const keySet = new Set<string>();
  for (const obj of parsed) {
    for (const key of Object.keys(obj as Record<string, unknown>)) {
      keySet.add(key);
    }
  }
  const headers = Array.from(keySet);

  // Build header row
  const headerRow = headers.map((h) => escapeCSVField(h)).join(',');

  // Build data rows
  const dataRows = parsed.map((obj) => {
    const record = obj as Record<string, unknown>;
    return headers
      .map((key) => {
        const value = record[key];
        if (value === undefined || value === null) {
          return '';
        }
        return escapeCSVField(String(value));
      })
      .join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}
