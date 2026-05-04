/**
 * Mock data generation utility for producing realistic sample data
 * matching a user-defined table schema.
 */

/**
 * Defines a single column in the mock data schema.
 */
export interface ColumnDefinition {
  name: string;
  type: 'string' | 'integer' | 'float' | 'boolean' | 'date' | 'email' | 'uuid';
}

/**
 * Configuration for mock data generation.
 */
export interface MockDataConfig {
  columns: ColumnDefinition[];
  rowCount: number;
  outputFormat: 'json' | 'csv';
}

// Word pools for generating realistic string and email values
const FIRST_NAMES = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Hank',
  'Ivy', 'Jack', 'Karen', 'Leo', 'Mona', 'Nick', 'Olivia', 'Paul',
  'Quinn', 'Rita', 'Sam', 'Tina', 'Uma', 'Vince', 'Wendy', 'Xander',
  'Yara', 'Zane',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
];

const DOMAINS = [
  'example.com', 'test.org', 'sample.net', 'demo.io', 'mock.dev',
];

/**
 * Returns a random element from the given array.
 */
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates a random integer between min and max (inclusive).
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a single value for the given column type.
 */
function generateValue(type: ColumnDefinition['type']): string | number | boolean {
  switch (type) {
    case 'string':
      return `${randomElement(FIRST_NAMES)} ${randomElement(LAST_NAMES)}`;

    case 'integer':
      return randomInt(1, 10000);

    case 'float':
      return parseFloat((Math.random() * 10000).toFixed(2));

    case 'boolean':
      return Math.random() < 0.5;

    case 'date': {
      const start = new Date(2000, 0, 1).getTime();
      const end = new Date(2030, 11, 31).getTime();
      const date = new Date(start + Math.random() * (end - start));
      return date.toISOString().split('T')[0];
    }

    case 'email': {
      const first = randomElement(FIRST_NAMES).toLowerCase();
      const last = randomElement(LAST_NAMES).toLowerCase();
      const domain = randomElement(DOMAINS);
      return `${first}.${last}@${domain}`;
    }

    case 'uuid':
      return crypto.randomUUID();

    default:
      return '';
  }
}

/**
 * Escapes a value for safe inclusion in a CSV field.
 * Wraps the value in double quotes if it contains commas, double quotes, or newlines.
 */
function escapeCSVField(value: string): string {
  const str = String(value);
  if (
    str.includes(',') ||
    str.includes('"') ||
    str.includes('\n') ||
    str.includes('\r')
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates mock data matching the provided schema configuration.
 *
 * Produces realistic sample data for each column type:
 * - string: random first/last name combinations
 * - integer: random integers between 1 and 10000
 * - float: random decimal numbers with 2 decimal places
 * - boolean: random true/false values
 * - date: random dates in ISO format (YYYY-MM-DD) between 2000 and 2030
 * - email: random email addresses
 * - uuid: random v4 UUIDs via crypto.randomUUID()
 *
 * @param config - The mock data configuration specifying columns, row count, and output format.
 * @returns A string containing the generated data in the requested format (JSON or CSV).
 * @throws Error if the configuration is invalid.
 */
export function generateMockData(config: MockDataConfig): string {
  // Validate columns
  if (!config.columns || config.columns.length === 0) {
    throw new Error('Invalid configuration: at least one column must be defined.');
  }

  // Validate row count
  if (
    !Number.isInteger(config.rowCount) ||
    config.rowCount < 1 ||
    config.rowCount > 1000
  ) {
    throw new Error(
      'Invalid row count: must be an integer between 1 and 1000.',
    );
  }

  // Validate output format
  if (config.outputFormat !== 'json' && config.outputFormat !== 'csv') {
    throw new Error(
      'Invalid output format: must be "json" or "csv".',
    );
  }

  // Generate rows
  const rows: Record<string, string | number | boolean>[] = [];
  for (let i = 0; i < config.rowCount; i++) {
    const row: Record<string, string | number | boolean> = {};
    for (const column of config.columns) {
      row[column.name] = generateValue(column.type);
    }
    rows.push(row);
  }

  // Format output
  if (config.outputFormat === 'json') {
    return JSON.stringify(rows, null, 2);
  }

  // CSV format
  const headers = config.columns.map((c) => c.name);
  const headerRow = headers.map((h) => escapeCSVField(h)).join(',');
  const dataRows = rows.map((row) =>
    headers.map((h) => escapeCSVField(String(row[h]))).join(','),
  );

  return [headerRow, ...dataRows].join('\n');
}
