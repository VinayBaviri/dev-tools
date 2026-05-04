import { describe, it, expect } from 'vitest';
import { jsonParse, jsonStringify, jsonMinify, jsonFormat, jsonValidate, jsonToCSV } from './json';

describe('jsonParse', () => {
  it('parses a simple object', () => {
    expect(jsonParse('{"name":"Alice","age":30}')).toEqual({ name: 'Alice', age: 30 });
  });

  it('parses an array of numbers', () => {
    expect(jsonParse('[1, 2, 3]')).toEqual([1, 2, 3]);
  });

  it('parses primitive values', () => {
    expect(jsonParse('"hello"')).toBe('hello');
    expect(jsonParse('42')).toBe(42);
    expect(jsonParse('true')).toBe(true);
    expect(jsonParse('null')).toBeNull();
  });

  it('parses nested objects', () => {
    const input = '{"user":{"name":"Bob","address":{"city":"NYC"}}}';
    expect(jsonParse(input)).toEqual({ user: { name: 'Bob', address: { city: 'NYC' } } });
  });

  it('throws a descriptive error for invalid JSON', () => {
    expect(() => jsonParse('{invalid}')).toThrow('Invalid JSON');
  });

  it('throws a descriptive error for trailing commas', () => {
    expect(() => jsonParse('{"a": 1,}')).toThrow('Invalid JSON');
  });

  it('throws a descriptive error for empty input', () => {
    expect(() => jsonParse('')).toThrow('Invalid JSON');
  });
});

describe('jsonStringify', () => {
  it('stringifies an object with default 2-space indent', () => {
    const result = jsonStringify({ a: 1, b: 2 });
    expect(result).toBe('{\n  "a": 1,\n  "b": 2\n}');
  });

  it('stringifies with custom indent', () => {
    const result = jsonStringify({ x: 1 }, 4);
    expect(result).toBe('{\n    "x": 1\n}');
  });

  it('stringifies an array', () => {
    const result = jsonStringify([1, 2, 3]);
    expect(result).toBe('[\n  1,\n  2,\n  3\n]');
  });

  it('stringifies primitive values', () => {
    expect(jsonStringify('hello')).toBe('"hello"');
    expect(jsonStringify(42)).toBe('42');
    expect(jsonStringify(true)).toBe('true');
    expect(jsonStringify(null)).toBe('null');
  });

  it('stringifies with zero indent produces compact output', () => {
    const result = jsonStringify({ a: 1 }, 0);
    expect(result).toBe('{"a":1}');
  });
});

describe('jsonMinify', () => {
  it('removes whitespace from a formatted JSON string', () => {
    const input = '{\n  "name": "Alice",\n  "age": 30\n}';
    expect(jsonMinify(input)).toBe('{"name":"Alice","age":30}');
  });

  it('minifies an already compact string without change', () => {
    const input = '{"a":1}';
    expect(jsonMinify(input)).toBe('{"a":1}');
  });

  it('minifies an array', () => {
    const input = '[ 1 , 2 , 3 ]';
    expect(jsonMinify(input)).toBe('[1,2,3]');
  });

  it('preserves string values with spaces', () => {
    const input = '{"msg": "hello world"}';
    expect(jsonMinify(input)).toBe('{"msg":"hello world"}');
  });

  it('throws for invalid JSON input', () => {
    expect(() => jsonMinify('{bad}')).toThrow('Invalid JSON');
  });
});

describe('jsonFormat', () => {
  it('formats a compact JSON string with 2-space indentation', () => {
    const input = '{"name":"Alice","age":30}';
    const expected = '{\n  "name": "Alice",\n  "age": 30\n}';
    expect(jsonFormat(input)).toBe(expected);
  });

  it('formats nested objects', () => {
    const input = '{"a":{"b":1}}';
    const result = jsonFormat(input);
    expect(result).toContain('  "a"');
    expect(result).toContain('    "b"');
  });

  it('formats an array of objects', () => {
    const input = '[{"id":1},{"id":2}]';
    const result = jsonFormat(input);
    expect(result).toContain('[\n');
    expect(result).toContain('  {\n');
  });

  it('round-trips with minify preserving data', () => {
    const input = '{"key":"value","num":42,"arr":[1,2,3]}';
    const formatted = jsonFormat(input);
    const minified = jsonMinify(formatted);
    expect(jsonParse(minified)).toEqual(jsonParse(input));
  });

  it('throws for invalid JSON input', () => {
    expect(() => jsonFormat('not json')).toThrow('Invalid JSON');
  });
});

describe('jsonValidate', () => {
  it('returns valid for a correct JSON object', () => {
    expect(jsonValidate('{"a": 1}')).toEqual({ valid: true });
  });

  it('returns valid for a JSON array', () => {
    expect(jsonValidate('[1, 2, 3]')).toEqual({ valid: true });
  });

  it('returns valid for JSON primitives', () => {
    expect(jsonValidate('"hello"')).toEqual({ valid: true });
    expect(jsonValidate('42')).toEqual({ valid: true });
    expect(jsonValidate('true')).toEqual({ valid: true });
    expect(jsonValidate('null')).toEqual({ valid: true });
  });

  it('returns invalid with error for malformed JSON', () => {
    const result = jsonValidate('{invalid}');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
    expect(typeof result.error).toBe('string');
  });

  it('returns invalid with error for trailing commas', () => {
    const result = jsonValidate('{"a": 1,}');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('returns invalid with error for single quotes', () => {
    const result = jsonValidate("{'key': 'value'}");
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('returns invalid with error for empty string', () => {
    const result = jsonValidate('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('returns invalid with error for unquoted keys', () => {
    const result = jsonValidate('{key: "value"}');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('jsonToCSV', () => {
  it('converts an array of flat objects to CSV', () => {
    const input = '[{"name":"Alice","age":30},{"name":"Bob","age":25}]';
    const result = jsonToCSV(input);
    const lines = result.split('\n');
    expect(lines[0]).toBe('name,age');
    expect(lines[1]).toBe('Alice,30');
    expect(lines[2]).toBe('Bob,25');
  });

  it('handles objects with different keys by filling missing values', () => {
    const input = '[{"a":1,"b":2},{"b":3,"c":4}]';
    const result = jsonToCSV(input);
    const lines = result.split('\n');
    expect(lines[0]).toBe('a,b,c');
    expect(lines[1]).toBe('1,2,');
    expect(lines[2]).toBe(',3,4');
  });

  it('escapes fields containing commas', () => {
    const input = '[{"name":"Doe, Jane","city":"NYC"}]';
    const result = jsonToCSV(input);
    const lines = result.split('\n');
    expect(lines[1]).toBe('"Doe, Jane",NYC');
  });

  it('escapes fields containing double quotes', () => {
    const input = '[{"quote":"He said \\"hi\\""}]';
    const result = jsonToCSV(input);
    expect(result).toContain('"He said ""hi"""');
  });

  it('handles null and undefined values as empty fields', () => {
    const input = '[{"a":null,"b":"ok"},{"a":"yes","b":null}]';
    const result = jsonToCSV(input);
    const lines = result.split('\n');
    expect(lines[1]).toBe(',ok');
    expect(lines[2]).toBe('yes,');
  });

  it('handles boolean and numeric values', () => {
    const input = '[{"flag":true,"count":42,"rate":3.14}]';
    const result = jsonToCSV(input);
    const lines = result.split('\n');
    expect(lines[0]).toBe('flag,count,rate');
    expect(lines[1]).toBe('true,42,3.14');
  });

  it('returns empty string for an empty array', () => {
    expect(jsonToCSV('[]')).toBe('');
  });

  it('throws for non-array JSON input', () => {
    expect(() => jsonToCSV('{"a": 1}')).toThrow('expected a JSON array of objects');
  });

  it('throws for array containing non-object elements', () => {
    expect(() => jsonToCSV('[1, 2, 3]')).toThrow('not an object');
  });

  it('throws for array containing null elements', () => {
    expect(() => jsonToCSV('[null]')).toThrow('not an object');
  });

  it('throws for invalid JSON input', () => {
    expect(() => jsonToCSV('not json')).toThrow('Invalid JSON');
  });

  it('handles a single object in the array', () => {
    const input = '[{"id":1,"name":"test"}]';
    const result = jsonToCSV(input);
    const lines = result.split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe('id,name');
    expect(lines[1]).toBe('1,test');
  });
});
