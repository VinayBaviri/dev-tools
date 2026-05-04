import { useState, useCallback, useRef } from 'react';
import { ToolPageLayout } from '../../components/ToolPageLayout';
import { InputArea } from '../../components/InputArea';
import { OutputArea } from '../../components/OutputArea';
import { formatJS } from '../../utils/javascript';
import { copyToClipboard, readFromClipboard } from '../../services/clipboard';

export default function JSFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const latestInputRef = useRef('');

  const processInput = useCallback(async (value: string) => {
    setInput(value);
    latestInputRef.current = value;

    if (value === '') {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const result = await formatJS(value);
      // Only update if this is still the latest input
      if (latestInputRef.current === value) {
        setOutput(result);
        setError(null);
      }
    } catch (e) {
      if (latestInputRef.current === value) {
        setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
        setOutput('');
      }
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
    latestInputRef.current = '';
  }, []);

  const handleCopy = useCallback(() => {
    copyToClipboard(output);
  }, [output]);

  return (
    <ToolPageLayout
      title="JS Formatter"
      description="Format JavaScript code with consistent indentation, line breaks, and spacing."
    >
      <InputArea
        value={input}
        onChange={processInput}
        placeholder="Enter JavaScript to format…"
        onPaste={handlePaste}
        onClear={handleClear}
      />
      <OutputArea value={output} error={error} onCopy={handleCopy} />
    </ToolPageLayout>
  );
}
