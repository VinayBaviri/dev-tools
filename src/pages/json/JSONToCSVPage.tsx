import { useState, useCallback } from 'react';
import { ToolPageLayout } from '../../components/ToolPageLayout';
import { InputArea } from '../../components/InputArea';
import { OutputArea } from '../../components/OutputArea';
import { jsonToCSV } from '../../utils/json';
import { copyToClipboard, readFromClipboard } from '../../services/clipboard';

export default function JSONToCSVPage() {
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
      setOutput(jsonToCSV(value));
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
      title="JSON to CSV"
      description="Convert a JSON array of objects into CSV format with automatic header detection."
    >
      <InputArea
        value={input}
        onChange={processInput}
        placeholder={'Enter a JSON array of objects (e.g., [{"name":"Alice","age":30},{"name":"Bob","age":25}])…'}
        onPaste={handlePaste}
        onClear={handleClear}
      />
      <OutputArea value={output} error={error} onCopy={handleCopy} />
    </ToolPageLayout>
  );
}
