import { useState, useCallback } from 'react';
import { ToolPageLayout } from '../../components/ToolPageLayout';
import { OutputArea } from '../../components/OutputArea';
import { randomInteger } from '../../utils/random';
import { copyToClipboard } from '../../services/clipboard';
import styles from './RandomizerPage.module.css';

export default function RandomNumberPage() {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value)) {
        setMin(value);
      }
    },
    [],
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value)) {
        setMax(value);
      }
    },
    [],
  );

  const handleGenerate = useCallback(() => {
    try {
      const result = randomInteger(min, max);
      setOutput(String(result));
      setError(null);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'An unexpected error occurred.',
      );
      setOutput('');
    }
  }, [min, max]);

  const handleCopy = useCallback(() => {
    copyToClipboard(output);
  }, [output]);

  return (
    <ToolPageLayout
      title="Random Number Generator"
      description="Generate a random integer within a specified inclusive range."
    >
      <div className={styles.form}>
        <div className={styles.optionsRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="randomMin">
              Min
            </label>
            <input
              id="randomMin"
              className={styles.numberInput}
              type="number"
              value={min}
              onChange={handleMinChange}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="randomMax">
              Max
            </label>
            <input
              id="randomMax"
              className={styles.numberInput}
              type="number"
              value={max}
              onChange={handleMaxChange}
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
