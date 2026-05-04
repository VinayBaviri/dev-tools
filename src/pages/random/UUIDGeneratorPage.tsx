import { useState, useCallback } from 'react';
import { ToolPageLayout } from '../../components/ToolPageLayout';
import { OutputArea } from '../../components/OutputArea';
import { generateUUIDs } from '../../utils/random';
import { copyToClipboard } from '../../services/clipboard';
import styles from './RandomizerPage.module.css';

export default function UUIDGeneratorPage() {
  const [count, setCount] = useState(1);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value)) {
        setCount(Math.max(1, Math.min(100, value)));
      }
    },
    [],
  );

  const handleGenerate = useCallback(() => {
    try {
      const uuids = generateUUIDs(count);
      setOutput(uuids.join('\n'));
      setError(null);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'An unexpected error occurred.',
      );
      setOutput('');
    }
  }, [count]);

  const handleCopy = useCallback(() => {
    copyToClipboard(output);
  }, [output]);

  return (
    <ToolPageLayout
      title="UUID Generator"
      description="Generate random version-4 UUIDs conforming to RFC 4122."
    >
      <div className={styles.form}>
        <div className={styles.optionsRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="uuidCount">
              Count (1–100)
            </label>
            <input
              id="uuidCount"
              className={styles.numberInput}
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={handleCountChange}
            />
          </div>

          <button
            type="button"
            className={styles.generateButton}
            onClick={handleGenerate}
          >
            Generate
          </button>
        </div>
      </div>

      <OutputArea value={output} error={error} onCopy={handleCopy} />
    </ToolPageLayout>
  );
}
