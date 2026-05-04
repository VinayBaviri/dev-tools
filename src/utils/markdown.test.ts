import { describe, it, expect } from 'vitest';
import { markdownToHTML, htmlToMarkdown } from './markdown';

/**
 * Unit tests for Markdown utility functions.
 * Validates: Requirements 7.1, 7.2, 7.4
 */

describe('markdownToHTML', () => {
  it('converts h1 heading', () => {
    expect(markdownToHTML('# Hello')).toContain('<h1>Hello</h1>');
  });

  it('converts h2 heading', () => {
    expect(markdownToHTML('## Hello')).toContain('<h2>Hello</h2>');
  });

  it('converts h3 heading', () => {
    expect(markdownToHTML('### Hello')).toContain('<h3>Hello</h3>');
  });

  it('converts h4 heading', () => {
    expect(markdownToHTML('#### Hello')).toContain('<h4>Hello</h4>');
  });

  it('converts h5 heading', () => {
    expect(markdownToHTML('##### Hello')).toContain('<h5>Hello</h5>');
  });

  it('converts h6 heading', () => {
    expect(markdownToHTML('###### Hello')).toContain('<h6>Hello</h6>');
  });

  it('converts bold text', () => {
    expect(markdownToHTML('**bold**')).toContain('<strong>bold</strong>');
  });

  it('converts italic text', () => {
    expect(markdownToHTML('*italic*')).toContain('<em>italic</em>');
  });

  it('converts links', () => {
    const result = markdownToHTML('[example](https://example.com)');
    expect(result).toContain('<a href="https://example.com">example</a>');
  });

  it('converts images', () => {
    const result = markdownToHTML('![alt text](https://example.com/img.png)');
    expect(result).toContain('<img src="https://example.com/img.png" alt="alt text">');
  });

  it('converts unordered lists', () => {
    const md = '- item one\n- item two\n- item three';
    const result = markdownToHTML(md);
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>item one</li>');
    expect(result).toContain('<li>item two</li>');
    expect(result).toContain('<li>item three</li>');
    expect(result).toContain('</ul>');
  });

  it('converts ordered lists', () => {
    const md = '1. first\n2. second\n3. third';
    const result = markdownToHTML(md);
    expect(result).toContain('<ol>');
    expect(result).toContain('<li>first</li>');
    expect(result).toContain('<li>second</li>');
    expect(result).toContain('<li>third</li>');
    expect(result).toContain('</ol>');
  });

  it('converts fenced code blocks', () => {
    const md = '```\nconst x = 1;\n```';
    const result = markdownToHTML(md);
    expect(result).toContain('<code>');
    expect(result).toContain('const x = 1;');
  });

  it('converts inline code', () => {
    const result = markdownToHTML('use `console.log` here');
    expect(result).toContain('<code>console.log</code>');
  });

  it('converts blockquotes', () => {
    const result = markdownToHTML('> This is a quote');
    expect(result).toContain('<blockquote>');
    expect(result).toContain('This is a quote');
    expect(result).toContain('</blockquote>');
  });

  it('handles empty string', () => {
    expect(markdownToHTML('')).toBe('');
  });
});

describe('htmlToMarkdown', () => {
  it('converts paragraphs', () => {
    const result = htmlToMarkdown('<p>Hello world</p>');
    expect(result).toContain('Hello world');
  });

  it('converts headings', () => {
    expect(htmlToMarkdown('<h1>Title</h1>')).toContain('# Title');
    expect(htmlToMarkdown('<h2>Subtitle</h2>')).toContain('## Subtitle');
    expect(htmlToMarkdown('<h3>Section</h3>')).toContain('### Section');
  });

  it('converts bold/strong', () => {
    expect(htmlToMarkdown('<strong>bold</strong>')).toContain('**bold**');
    expect(htmlToMarkdown('<b>bold</b>')).toContain('**bold**');
  });

  it('converts italic/em', () => {
    expect(htmlToMarkdown('<em>italic</em>')).toContain('*italic*');
    expect(htmlToMarkdown('<i>italic</i>')).toContain('*italic*');
  });

  it('converts links', () => {
    const result = htmlToMarkdown('<a href="https://example.com">click here</a>');
    expect(result).toContain('[click here](https://example.com)');
  });

  it('converts unordered lists', () => {
    const html = '<ul><li>apple</li><li>banana</li></ul>';
    const result = htmlToMarkdown(html);
    expect(result).toContain('- apple');
    expect(result).toContain('- banana');
  });

  it('converts ordered lists', () => {
    const html = '<ol><li>first</li><li>second</li></ol>';
    const result = htmlToMarkdown(html);
    expect(result).toContain('1. first');
    expect(result).toContain('2. second');
  });

  it('converts code blocks', () => {
    const html = '<pre><code>const x = 1;</code></pre>';
    const result = htmlToMarkdown(html);
    expect(result).toContain('```');
    expect(result).toContain('const x = 1;');
  });

  it('handles empty string', () => {
    const result = htmlToMarkdown('');
    expect(result.trim()).toBe('');
  });
});
