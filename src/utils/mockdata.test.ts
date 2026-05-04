import { describe, it, expect } from 'vitest';
import { generateMockData, MockDataConfig } from './mockdata';

describe('generateMockData', () => {
  const baseConfig: MockDataConfig = {
    columns: [
      { name: 'id', type: 'integer' },
      { name: 'name', type: 'string' },
    ],
    rowCount: 5,
    outputFormat: 'json',
  };

  it('generates correct number of rows', () => {
    const result = generateMockData(baseConfig);
    const rows = JSON.parse(result) as unknown[];
    expect(rows).toHaveLength(5);
  });

  it('generates all column types correctly', () => {
    const config: MockDataConfig = {
      columns: [
        { name: 'str', type: 'string' },
        { name: 'int', type: 'integer' },
        { name: 'flt', type: 'float' },
        { name: 'bool', type: 'boolean' },
        { name: 'dt', type: 'date' },
        { name: 'em', type: 'email' },
        { name: 'uid', type: 'uuid' },
      ],
      rowCount: 3,
      outputFormat: 'json',
    };

    const result = generateMockData(config);
    const rows = JSON.parse(result) as Record<string, unknown>[];

    expect(rows).toHaveLength(3);

    for (const row of rows) {
      expect(typeof row.str).toBe('string');
      expect(typeof row.int).toBe('number');
      expect(Number.isInteger(row.int)).toBe(true);
      expect(typeof row.flt).toBe('number');
      expect(typeof row.bool).toBe('boolean');
      expect(row.dt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(row.em).toMatch(/.+@.+\..+/);
      expect(row.uid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    }
  });

  it('supports JSON output format', () => {
    const result = generateMockData({ ...baseConfig, outputFormat: 'json' });
    const parsed = JSON.parse(result);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(5);
  });

  it('supports CSV output format', () => {
    const result = generateMockData({ ...baseConfig, outputFormat: 'csv' });
    const lines = result.split('\n');

    // Header row + 5 data rows
    expect(lines).toHaveLength(6);
    // Header should contain column names
    expect(lines[0]).toContain('id');
    expect(lines[0]).toContain('name');
  });

  it('throws error for row count < 1', () => {
    expect(() =>
      generateMockData({ ...baseConfig, rowCount: 0 }),
    ).toThrow('Invalid row count');
  });

  it('throws error for row count > 1000', () => {
    expect(() =>
      generateMockData({ ...baseConfig, rowCount: 1001 }),
    ).toThrow('Invalid row count');
  });

  it('throws error for empty columns array', () => {
    expect(() =>
      generateMockData({ ...baseConfig, columns: [] }),
    ).toThrow('at least one column must be defined');
  });
});
