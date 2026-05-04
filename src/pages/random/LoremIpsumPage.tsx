import { useState, useCallback } from 'react';
import { ToolPageLayout } from '../../components/ToolPageLayout';
import { OutputArea } from '../../components/OutputArea';
import { generateLoremIpsum } from '../../utils/random';
import { copyToClipboard } from '../../services/clipboard';
import styles from './RandomizerPage.module.css';

type LoremUnit = 'paragraphs' | 'sentences' | 'words';

export default function LoremIpsumPage() {
  const [quantity, setQuantity] = useState(3);
  const [unit, setUnit] = useState<LoremUnit>('paragraphs');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value)) {
        setQuantity(Math.max(1, Math.min(100, value)));
      }
    },
    [],
  );

  const handleUnitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setUnit(e.target.value as LoremUnit);
    },
    [],
  );

  const handleGenerate = useCallback(() => {
    try {
      const result = generateLoremIpsum(quantity, unit);
      setOutput(result);
      setError(null);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'An unexpected error occurred.',
      );
      setOutput('');
    }
  }, [quantity, unit]);

  const handleCopy = useCallback(() => {
    copyToClipboard(output);
  }, [output]);

  return (
    <ToolPageLayout
      title="Lorem Ipsum Generator"
      description="Generate placeholder Lorem Ipsum text in configurable quantities."
    >
      <div className={styles.form}>
        <div className={styles.optionsRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="loremQuantity">
              Quantity (1–100)
            </label>
            <input
              id="loremQuantity"
              className={styles.numberInput}
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="loremUnit">
              Unit
            </label>
            <select
              id="loremUnit"
              className={styles.selectInput}
              value={unit}
              onChange={handleUnitChange}
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
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
