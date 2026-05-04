// Feature: dev-toolbox, Property 7: JSON parse/stringify round-trip
// **Validates: Requirements 9.1, 9.2, 9.3**

// Feature: dev-toolbox, Property 8: JSON minify/format semantic equivalence
// **Validates: Requirements 9.7, 9.8**

// Feature: dev-toolbox, Property 9: JSON validation correctness
// **Validates: Requirements 9.5**

// Feature: dev-toolbox, Property 10: JSON to CSV structural correctness
// **Validates: Requirements 9.9**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { jsonParse, jsonStringify, jsonMinify, jsonFormat, jsonValidate, jsonToCSV } from './json';

/**
 * Property 7: JSON parse/stringify round-trip
 *
 * For any valid JSON value, parsing then stringifying then parsing again
 * produces a value deeply equal to the first parse result:
 *   deepEqual(JSON.parse(JSON.stringify(JSON.parse(s))), JSON.parse(s))
 */
describe('Property 7: JSON parse/stringify round-trip', () => {
  it('for any valid JSON string, parse(stringify(parse(s))) deep-equals parse(s)', () => {
    fc.assert(
      fc.property(fc.json(), (jsonStr) => {
        const firstParse = jsonParse(jsonStr);
        const stringified = jsonStringify(firstParse);
        const secondParse = jsonParse(stringified);
        expect(secondParse).toEqual(firstParse);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Property 8: JSON minify/format semantic equivalence
 *
 * For any valid JSON string, parsing the minified version produces a value
 * deeply equal to parsing the original:
 *   deepEqual(JSON.parse(jsonMinify(s)), JSON.parse(s))
 */
describe('Property 8: JSON minify/format semantic equivalence', () => {
  it('for any valid JSON string, parse(minify(s)) deep-equals parse(s)', () => {
    fc.assert(
      fc.property(fc.json(), (jsonStr) => {
        const original = jsonParse(jsonStr);
        const minified = jsonMinify(jsonStr);
        const minifiedParsed = jsonParse(minified);
        expect(minifiedParsed).toEqual(original);
      }),
      { numRuns: 100 },
    );
  });

  it('for any valid JSON string, parse(format(s)) deep-equals parse(s)', () => {
    fc.assert(
      fc.property(fc.json(), (jsonStr) => {
        const original = jsonParse(jsonStr);
        const formatted = jsonFormat(jsonStr);
        const formattedParsed = jsonParse(formatted);
        expect(formattedParsed).toEqual(original);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Property 9: JSON validation correctness
 *
 * For any valid JSON string, validate returns { valid: true }.
 * For any non-JSON string, validate returns { valid: false }.
 */
describe('Property 9: JSON validation correctness', () => {
  it('for any valid JSON string, jsonValidate returns { valid: true }', () => {
    fc.assert(
      fc.property(fc.json(), (jsonStr) => {
        const result = jsonValidate(jsonStr);
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      }),
      { numRuns: 100 },
    );
  });

  it('for any non-JSON string, jsonValidate returns { valid: false }', () => {
    // Generate strings that are definitely not valid JSON.
    // We prefix with '{invalid:' to ensure they can't accidentally be valid JSON.
    const invalidJsonArb = fc
      .string({ minLength: 1 })
      .map((s) => `{invalid: ${s}}`);

    fc.assert(
      fc.property(invalidJsonArb, (invalidStr) => {
        const result = jsonValidate(invalidStr);
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Property 10: JSON to CSV structural correctness
 *
 * For any JSON array of flat objects, CSV output has correct structure:
 * - Header columns = unique keys across all objects
 * - Each data row has the same number of columns as the header
 */
describe('Property 10: JSON to CSV structural correctness', () => {
  /**
   * Arbitrary for a flat object value (string, number, boolean, or null).
   */
  const flatValueArb = fc.oneof(
    fc.string().filter((s) => !s.includes('\n') && !s.includes('\r')),
    fc.integer(),
    fc.double({ noNaN: true, noDefaultInfinity: true }),
    fc.boolean(),
  );

  /**
   * Arbitrary for a flat object with 1-5 keys.
   * Keys are simple alphanumeric identifiers to avoid CSV escaping edge cases
   * that would complicate column counting.
   */
  const flatObjectArb = fc
    .array(
      fc.tuple(
        fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{0,9}$/),
        flatValueArb,
      ),
      { minLength: 1, maxLength: 5 },
    )
    .map((entries) => Object.fromEntries(entries))
    .filter((obj) => Object.keys(obj).length > 0);

  /**
   * Arbitrary for an array of 1-10 flat objects.
   */
  const flatObjectArrayArb = fc.array(flatObjectArb, {
    minLength: 1,
    maxLength: 10,
  });

  it('header column count equals the number of unique keys across all objects', () => {
    fc.assert(
      fc.property(flatObjectArrayArb, (objects) => {
        const jsonStr = JSON.stringify(objects);
        const csv = jsonToCSV(jsonStr);
        const lines = csv.split('\n');

        // Collect all unique keys across all objects
        const allKeys = new Set<string>();
        for (const obj of objects) {
          for (const key of Object.keys(obj)) {
            allKeys.add(key);
          }
        }

        // Parse header — count commas outside of quoted fields
        const headerColumnCount = countCSVColumns(lines[0]);
        expect(headerColumnCount).toBe(allKeys.size);
      }),
      { numRuns: 100 },
    );
  });

  it('each data row has the same number of columns as the header', () => {
    fc.assert(
      fc.property(flatObjectArrayArb, (objects) => {
        const jsonStr = JSON.stringify(objects);
        const csv = jsonToCSV(jsonStr);
        const lines = csv.split('\n');

        const headerColumnCount = countCSVColumns(lines[0]);

        // Each data row (lines[1..n]) should have the same column count
        for (let i = 1; i < lines.length; i++) {
          const rowColumnCount = countCSVColumns(lines[i]);
          expect(rowColumnCount).toBe(headerColumnCount);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('number of data rows equals the number of objects in the array', () => {
    fc.assert(
      fc.property(flatObjectArrayArb, (objects) => {
        const jsonStr = JSON.stringify(objects);
        const csv = jsonToCSV(jsonStr);
        const lines = csv.split('\n');

        // First line is header, rest are data rows
        expect(lines.length - 1).toBe(objects.length);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Counts the number of columns in a CSV line, respecting quoted fields.
 * A quoted field may contain commas that should not be treated as delimiters.
 */
function countCSVColumns(line: string): number {
  let count = 1;
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Escaped quote inside quoted field — skip next char
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      count++;
    }
  }
  return count;
}
