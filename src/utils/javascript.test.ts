import { describe, it, expect } from 'vitest';
import { formatJS, minifyJS } from './javascript';

/**
 * Unit tests for JavaScript utility functions.
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4
 */

describe('formatJS', () => {
  it('formats valid JavaScript with consistent indentation', async () => {
    const input = 'function hello(){const x=1;return x+2;}';
    const result = await formatJS(input);
    expect(result).toContain('function hello()');
    expect(result).toContain('const x = 1;');
    expect(result).toContain('return x + 2;');
    // Should have newlines for indentation
    expect(result.split('\n').length).toBeGreaterThan(1);
  });

  it('formats object literals with proper spacing', async () => {
    const input = 'const obj={a:1,b:"hello",c:true};';
    const result = await formatJS(input);
    expect(result).toContain('a: 1');
    expect(result).toContain('b: "hello"');
    expect(result).toContain('c: true');
  });

  it('formats arrow functions', async () => {
    const input = 'const add=(a,b)=>a+b;';
    const result = await formatJS(input);
    expect(result).toContain('=>');
    expect(result).toContain('a + b');
  });

  it('handles empty string', async () => {
    const result = await formatJS('');
    expect(result).toBe('');
  });

  it('handles whitespace-only string', async () => {
    const result = await formatJS('   \n  ');
    expect(result).toBe('');
  });

  it('throws descriptive error for syntactically invalid JS', async () => {
    await expect(formatJS('function {')).rejects.toThrow(/[Ss]yntax error/);
  });

  it('error message includes syntax error location info', async () => {
    try {
      await formatJS('const x = {;');
      expect.fail('Should have thrown');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toMatch(/line|column|\d+:\d+/i);
    }
  });
});

describe('minifyJS', () => {
  it('minifies valid JavaScript by removing whitespace', async () => {
    const input = `function hello() {
  const x = 1;
  return x + 2;
}`;
    const result = await minifyJS(input);
    // Minified output should be shorter than the input
    expect(result.length).toBeLessThan(input.length);
    // Should still contain the function logic
    expect(result).toContain('function');
    expect(result).toContain('hello');
    expect(result).toContain('return');
  });

  it('removes comments during minification', async () => {
    const input = `// This is a comment
const x = 1; // inline comment
/* block comment */
const y = 2;`;
    const result = await minifyJS(input);
    expect(result).not.toContain('This is a comment');
    expect(result).not.toContain('inline comment');
    expect(result).not.toContain('block comment');
    expect(result).toContain('const x');
    expect(result).toContain('const y');
  });

  it('handles empty string', async () => {
    const result = await minifyJS('');
    expect(result).toBe('');
  });

  it('handles whitespace-only string', async () => {
    const result = await minifyJS('   \n  ');
    expect(result).toBe('');
  });

  it('throws descriptive error for syntactically invalid JS', async () => {
    await expect(minifyJS('function {')).rejects.toThrow(/[Ss]yntax error/);
  });

  it('error message includes syntax error location info', async () => {
    try {
      await minifyJS('const x = {;');
      expect.fail('Should have thrown');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toMatch(/line|column|\d+:\d+/i);
    }
  });
});
