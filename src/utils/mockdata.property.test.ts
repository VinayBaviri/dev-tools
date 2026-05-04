// Feature: dev-toolbox, Property 11: Mock data generation matches schema
// **Validates: Requirements 10.3**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateMockData, ColumnDefinition, MockDataConfig } from './mockdata';

/**
 * Supported column types for mock data generation.
 */
const COLUMN_TYPES: ColumnDefinition['type'][] = [
  'string',
  'integer',
  'float',
  'boolean',
  'date',
  'email',
  'uuid',
];

/**
 * Arbitrary for a valid column definition.
 * Generates a column with a simple alphanumeric name and a random supported type.
 */
const columnDefArb: fc.Arbitrary<ColumnDefinition> = fc.record({
  name: fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{0,9}$/),
  type: fc.constantFrom(...COLUMN_TYPES),
});

/**
 * Arbitrary for a valid MockDataConfig with 1–5 columns and 1–50 rows.
 * Row count is kept small (1–50) for test speed while still exercising the property.
 * Columns are deduplicated by name to avoid ambiguous schemas.
 */
const mockDataConfigArb: fc.Arbitrary<MockDataConfig> = fc
  .record({
    columns: fc
      .array(columnDefArb, { minLength: 1, maxLength: 5 })
      .map((cols) => {
        // Deduplicate by name — keep the first occurrence of each name
        const seen = new Set<string>();
        return cols.filter((c) => {
          if (seen.has(c.name)) return false;
          seen.add(c.name);
          return true;
        });
      })
      .filter((cols) => cols.length > 0),
    rowCount: fc.integer({ min: 1, max: 50 }),
    outputFormat: fc.constant('json' as const),
  });

/**
 * Property 11: Mock data generation matches schema
 *
 * For any valid schema (1–1000 rows, any combination of supported column types),
 * the generated data SHALL contain exactly the requested number of rows, and each
 * row SHALL have a value for every column whose type matches the column definition.
 */
describe('Property 11: Mock data generation matches schema', () => {
  it('generated JSON data has exactly the requested number of rows', () => {
    fc.assert(
      fc.property(mockDataConfigArb, (config) => {
        const output = generateMockData(config);
        const rows = JSON.parse(output) as Record<string, unknown>[];

        expect(rows).toHaveLength(config.rowCount);
      }),
      { numRuns: 100 },
    );
  });

  it('each row has a value for every column defined in the schema', () => {
    fc.assert(
      fc.property(mockDataConfigArb, (config) => {
        const output = generateMockData(config);
        const rows = JSON.parse(output) as Record<string, unknown>[];

        for (const row of rows) {
          for (const column of config.columns) {
            expect(row).toHaveProperty(column.name);
            expect(row[column.name]).not.toBeUndefined();
            expect(row[column.name]).not.toBeNull();
          }
        }
      }),
      { numRuns: 100 },
    );
  });

  it('each value matches the expected type for its column definition', () => {
    fc.assert(
      fc.property(mockDataConfigArb, (config) => {
        const output = generateMockData(config);
        const rows = JSON.parse(output) as Record<string, unknown>[];

        for (const row of rows) {
          for (const column of config.columns) {
            const value = row[column.name];
            switch (column.type) {
              case 'string':
                expect(typeof value).toBe('string');
                break;
              case 'integer':
                expect(typeof value).toBe('number');
                expect(Number.isInteger(value)).toBe(true);
                break;
              case 'float':
                expect(typeof value).toBe('number');
                break;
              case 'boolean':
                expect(typeof value).toBe('boolean');
                break;
              case 'date':
                expect(typeof value).toBe('string');
                // ISO date format: YYYY-MM-DD
                expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
                break;
              case 'email':
                expect(typeof value).toBe('string');
                // Basic email format: contains @
                expect(value).toMatch(/.+@.+\..+/);
                break;
              case 'uuid':
                expect(typeof value).toBe('string');
                // UUID v4 format
                expect(value).toMatch(
                  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
                );
                break;
            }
          }
        }
      }),
      { numRuns: 100 },
    );
  });
});
