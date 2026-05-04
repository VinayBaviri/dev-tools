import { useState, useCallback } from 'react';
import { ToolPageLayout } from '../../components/ToolPageLayout';
import { InputArea } from '../../components/InputArea';
import { OutputArea } from '../../components/OutputArea';
import { parseURL } from '../../utils/url';
import type { ParsedURL } from '../../utils/url';
import { copyToClipboard, readFromClipboard } from '../../services/clipboard';

function formatParsedURL(parsed: ParsedURL): string {
  const lines: string[] = [];

  lines.push(`Protocol:     ${parsed.protocol}`);
  lines.push(`Host:         ${parsed.host}`);
  lines.push(`Port:         ${parsed.port || '(default)'}`);
  lines.push(`Path:         ${parsed.path}`);

  const paramEntries = Object.entries(parsed.queryParams);
  if (paramEntries.length > 0) {
    lines.push(`Query Params:`);
    for (const [key, value] of paramEntries) {
      lines.push(`  ${key} = ${value}`);
    }
  } else {
    lines.push(`Query Params: (none)`);
  }

  lines.push(`Fragment:     ${parsed.fragment || '(none)'}`);

  return lines.join('\n');
}

export default function URLParserPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const processInput = useCallback((value: string) => {
    setInput(value);
    if (value === '') {
      setOutput('');
      setError(null);
      return;
    }
    try {
      const parsed = parseURL(value);
      setOutput(formatParsedURL(parsed));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
      setOutput('');
    }
  }, []);

  const handlePaste = useCallback(async () => {
    const text = await readFromClipboard();
    if (text) {
      processInput(text);
    }
  }, [processInput]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
  }, []);

  const handleCopy = useCallback(() => {
    copyToClipboard(output);
  }, [output]);

  return (
    <ToolPageLayout
      title="URL Parser"
      description="Parse a URL into its individual components: protocol, host, port, path, query parameters, and fragment."
    >
      <InputArea
        value={input}
        onChange={processInput}
        placeholder="Enter a URL to parse (e.g., https://example.com:8080/path?key=value#section)…"
        onPaste={handlePaste}
        onClear={handleClear}
      />
      <OutputArea value={output} error={error} onCopy={handleCopy} />
    </ToolPageLayout>
  );
}
