import { useState, useCallback } from 'react';
import { ToolPageLayout } from '../../components/ToolPageLayout';
import { OutputArea } from '../../components/OutputArea';
import { generatePassword, type PasswordOptions } from '../../utils/random';
import { copyToClipboard } from '../../services/clipboard';
import styles from './RandomizerPage.module.css';

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [digits, setDigits] = useState(true);
  const [special, setSpecial] = useState(true);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLengthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value)) {
        setLength(Math.max(1, Math.min(128, value)));
      }
    },
    [],
  );

  const handleGenerate = useCallback(() => {
    try {
      const options: PasswordOptions = {
        length,
        uppercase,
        lowercase,
        digits,
        special,
      };
      const password = generatePassword(options);
      setOutput(password);
      setError(null);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'An unexpected error occurred.',
      );
      setOutput('');
    }
  }, [length, uppercase, lowercase, digits, special]);

  const handleCopy = useCallback(() => {
    copyToClipboard(output);
  }, [output]);

  return (
    <ToolPageLayout
      title="Password Generator"
      description="Generate a random password with configurable length and character types."
    >
      <div className={styles.form}>
        <div className={styles.optionsRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="passwordLength">
              Length (1–128)
            </label>
            <input
              id="passwordLength"
              className={styles.numberInput}
              type="number"
              min={1}
              max={128}
              value={length}
              onChange={handleLengthChange}
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Character Types</span>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
              />
              Uppercase (A–Z)
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
              />
              Lowercase (a–z)
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={digits}
                onChange={(e) => setDigits(e.target.checked)}
              />
              Digits (0–9)
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={special}
                onChange={(e) => setSpecial(e.target.checked)}
              />
              Special (!@#$…)
            </label>
          </div>
        </div>

        <button
          type="button"
          className={styles.generateButton}
          onClick={handleGenerate}
        >
          Generate
        </button>
      </div>

      <OutputArea value={output} error={error} onCopy={handleCopy} />
    </ToolPageLayout>
  );
}
