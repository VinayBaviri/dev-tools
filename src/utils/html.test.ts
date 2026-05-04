import { describe, it, expect } from 'vitest';
import { htmlEncode, htmlDecode, htmlMinify, htmlPrettify } from './html';

/**
 * Unit tests for HTML utility functions.
 * Validates: Requirements 6.1, 6.2, 6.3, 6.5, 6.6, 6.7
 */

describe('htmlEncode', () => {
  it('encodes & to &amp;', () => {
    expect(htmlEncode('a & b')).toBe('a &amp; b');
  });

  it('encodes < to &lt;', () => {
    expect(htmlEncode('<div>')).toBe('&lt;div&gt;');
  });

  it('encodes > to &gt;', () => {
    expect(htmlEncode('a > b')).toBe('a &gt; b');
  });

  it('encodes " to &quot;', () => {
    expect(htmlEncode('say "hello"')).toBe('say &quot;hello&quot;');
  });

  it("encodes ' to &#39;", () => {
    expect(htmlEncode("it's")).toBe('it&#39;s');
  });

  it('encodes all special characters in a single string', () => {
    expect(htmlEncode('<a href="test">Tom & Jerry\'s</a>')).toBe(
      '&lt;a href=&quot;test&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;',
    );
  });

  it('handles empty string', () => {
    expect(htmlEncode('')).toBe('');
  });

  it('handles strings without special characters', () => {
    expect(htmlEncode('hello world 123')).toBe('hello world 123');
  });
});

describe('htmlDecode', () => {
  it('decodes &amp; to &', () => {
    expect(htmlDecode('a &amp; b')).toBe('a & b');
  });

  it('decodes &lt; and &gt; to < and >', () => {
    expect(htmlDecode('&lt;div&gt;')).toBe('<div>');
  });

  it('decodes &quot; to "', () => {
    expect(htmlDecode('say &quot;hello&quot;')).toBe('say "hello"');
  });

  it('decodes &#39; to \'', () => {
    expect(htmlDecode('it&#39;s')).toBe("it's");
  });

  it('decodes &apos; to \'', () => {
    expect(htmlDecode('it&apos;s')).toBe("it's");
  });

  it('decodes numeric decimal entities', () => {
    expect(htmlDecode('&#65;')).toBe('A');
    expect(htmlDecode('&#169;')).toBe('©');
  });

  it('decodes numeric hex entities', () => {
    expect(htmlDecode('&#x41;')).toBe('A');
    expect(htmlDecode('&#x27;')).toBe("'");
    expect(htmlDecode('&#xA9;')).toBe('©');
  });

  it('handles empty string', () => {
    expect(htmlDecode('')).toBe('');
  });

  it('handles strings without entities', () => {
    expect(htmlDecode('hello world 123')).toBe('hello world 123');
  });
});

describe('htmlMinify', () => {
  it('removes whitespace between tags', () => {
    expect(htmlMinify('<div>  <p>  hello  </p>  </div>')).toBe(
      '<div><p>  hello  </p></div>',
    );
  });

  it('removes HTML comments', () => {
    expect(htmlMinify('<div><!-- comment --><p>text</p></div>')).toBe(
      '<div><p>text</p></div>',
    );
  });

  it('removes multi-line HTML comments', () => {
    expect(
      htmlMinify('<div><!--\n  multi-line\n  comment\n--><p>text</p></div>'),
    ).toBe('<div><p>text</p></div>');
  });

  it('collapses whitespace between sibling tags', () => {
    expect(htmlMinify('<p>one</p>   \n   <p>two</p>')).toBe(
      '<p>one</p><p>two</p>',
    );
  });

  it('trims leading and trailing whitespace', () => {
    expect(htmlMinify('  <div>text</div>  ')).toBe('<div>text</div>');
  });

  it('handles empty string', () => {
    expect(htmlMinify('')).toBe('');
  });

  it('handles already minified HTML', () => {
    const minified = '<div><p>text</p></div>';
    expect(htmlMinify(minified)).toBe(minified);
  });
});

describe('htmlPrettify', () => {
  it('formats nested HTML with indentation', () => {
    const input = '<div><p>hello</p></div>';
    const expected = '<div>\n  <p>\n    hello\n  </p>\n</div>';
    expect(htmlPrettify(input)).toBe(expected);
  });

  it('formats deeply nested HTML', () => {
    const input = '<div><section><p>text</p></section></div>';
    const expected =
      '<div>\n  <section>\n    <p>\n      text\n    </p>\n  </section>\n</div>';
    expect(htmlPrettify(input)).toBe(expected);
  });

  it('handles void elements (br, img, etc.)', () => {
    const input = '<div><br><img src="test.png"></div>';
    const result = htmlPrettify(input);
    expect(result).toContain('<br>');
    expect(result).toContain('<img src="test.png">');
    // Void elements should not increase indentation
    const lines = result.split('\n');
    const brLine = lines.find((l) => l.includes('<br>'));
    const imgLine = lines.find((l) => l.includes('<img'));
    expect(brLine).toBeDefined();
    expect(imgLine).toBeDefined();
  });

  it('handles self-closing tags', () => {
    const input = '<div><input /><hr /></div>';
    const result = htmlPrettify(input);
    expect(result).toContain('<input />');
    expect(result).toContain('<hr />');
  });

  it('handles sibling elements', () => {
    const input = '<div><p>one</p><p>two</p></div>';
    const expected =
      '<div>\n  <p>\n    one\n  </p>\n  <p>\n    two\n  </p>\n</div>';
    expect(htmlPrettify(input)).toBe(expected);
  });

  it('handles empty string', () => {
    expect(htmlPrettify('')).toBe('');
  });

  it('handles whitespace-only input', () => {
    expect(htmlPrettify('   \n  ')).toBe('');
  });
});
