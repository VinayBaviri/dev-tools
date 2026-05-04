import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './OutputArea.module.css';

interface OutputAreaProps {
  value: string;
  error?: string | null;
  onCopy: () => void;
}

export function OutputArea({ value, error, onCopy }: OutputAreaProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(() => {
    onCopy();
    setCopied(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setCopied(false);
      timerRef.current = null;
    }, 2000);
  }, [onCopy]);

  const hasError = error != null && error !== '';

  return (
    <div className={styles.container}>
      {hasError ? (
        <pre className={styles.error} role="alert" aria-label="Error output">
          {error}
        </pre>
      ) : (
        <pre className={styles.output} aria-label="Output">
          {value}
        </pre>
      )}
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.button}${copied ? ` ${styles.copied}` : ''}`}
          onClick={handleCopy}
          aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
