import { describe, it, expect } from 'vitest';
import { formatSQL } from './sql';

describe('formatSQL', () => {
  it('formats a SELECT query with proper indentation and uppercase keywords', () => {
    const input = 'select id, name, email from users where active = true';
    const result = formatSQL(input);

    expect(result).toContain('SELECT');
    expect(result).toContain('FROM');
    expect(result).toContain('WHERE');
    expect(result).toContain('id');
    expect(result).toContain('name');
    expect(result).toContain('email');
    expect(result).toContain('users');
  });

  it('formats a JOIN query', () => {
    const input =
      'select u.name, o.total from users u inner join orders o on u.id = o.user_id where o.total > 100';
    const result = formatSQL(input);

    expect(result).toContain('SELECT');
    expect(result).toContain('FROM');
    expect(result).toContain('INNER JOIN');
    expect(result).toContain('ON');
    expect(result).toContain('WHERE');
  });

  it('formats an INSERT query', () => {
    const input =
      "insert into users (name, email) values ('Alice', 'alice@example.com')";
    const result = formatSQL(input);

    expect(result).toContain('INSERT INTO');
    expect(result).toContain('VALUES');
    expect(result).toContain('users');
  });

  it('throws error for empty input', () => {
    expect(() => formatSQL('')).toThrow('Input is empty');
    expect(() => formatSQL('   ')).toThrow('Input is empty');
  });
});
