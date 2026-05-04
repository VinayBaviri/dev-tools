import { useState, useCallback } from 'react';
import { ToolPageLayout } from '../../components/ToolPageLayout';
import { InputArea } from '../../components/InputArea';
import { OutputArea } from '../../components/OutputArea';
import { jsonUnescape } from '../../utils/json';
import { copyToClipboard, readFromClipboard } from '../../services/clipboard';

export default function JSONUnescapePage() {
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
      setOutput(jsonUnescape(value));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
      setOutput('');
    }
  }, []);

  const handlePaste = useCallback(async () => {
    const text = await readFromClipboard();
    if (text) processInput(text);
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
      title="JSON Unescape"
      description="Unescape a JSON-escaped string back to its original form."
    >
      <InputArea
        value={input}
        onChange={processInput}
        placeholder='Enter escaped text (e.g. He said \\"hello\\"\\nnew line)…'
        onPaste={handlePaste}
        onClear={handleClear}
      />
      <OutputArea value={output} error={error} onCopy={handleCopy} />
    </ToolPageLayout>
  );
}
