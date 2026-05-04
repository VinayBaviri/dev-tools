import { useState, useCallback } from 'react';
import { ToolPageLayout } from '../../components/ToolPageLayout';
import { InputArea } from '../../components/InputArea';
import { jsonValidate } from '../../utils/json';
import { readFromClipboard } from '../../services/clipboard';
import styles from './JSONValidatorPage.module.css';

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export default function JSONValidatorPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);

  const processInput = useCallback((value: string) => {
    setInput(value);
    if (value === '') {
      setResult(null);
      return;
    }
    setResult(jsonValidate(value));
  }, []);

  const handlePaste = useCallback(async () => {
    const text = await readFromClipboard();
    if (text) {
      processInput(text);
    }
  }, [processInput]);

  const handleClear = useCallback(() => {
    setInput('');
    setResult(null);
  }, []);

  return (
    <ToolPageLayout
      title="JSON Validator"
      description="Check whether a string is valid JSON and see error details for invalid input."
    >
      <InputArea
        value={input}
        onChange={processInput}
        placeholder="Enter JSON to validate…"
        onPaste={handlePaste}
        onClear={handleClear}
      />
      {result && (
        <div
          className={`${styles.result} ${result.valid ? styles.valid : styles.invalid}`}
          role="status"
          aria-label={result.valid ? 'Valid JSON' : 'Invalid JSON'}
        >
          <span className={styles.icon} aria-hidden="true">
            {result.valid ? '✓' : '✗'}
          </span>
          <p className={styles.message}>
            {result.valid ? 'Valid JSON ✓' : result.error}
          </p>
        </div>
      )}
    </ToolPageLayout>
  );
}
