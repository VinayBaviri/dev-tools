import { useState, useCallback, useRef, useEffect } from 'react';
import { ToolPageLayout } from '../../components/ToolPageLayout';
import { InputArea } from '../../components/InputArea';
import { copyToClipboard, readFromClipboard } from '../../services/clipboard';
import styles from './HTMLPreviewerPage.module.css';

export default function HTMLPreviewerPage() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handlePaste = useCallback(async () => {
    const text = await readFromClipboard();
    if (text) {
      setInput(text);
    }
  }, []);

  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  const handleCopy = useCallback(() => {
    copyToClipboard(input);
    setCopied(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setCopied(false);
      timerRef.current = null;
    }, 2000);
  }, [input]);

  return (
    <ToolPageLayout
      title="HTML Previewer"
      description="Render HTML markup in a sandboxed preview area."
    >
      <InputArea
        value={input}
        onChange={setInput}
        placeholder="Enter HTML markup to preview…"
        onPaste={handlePaste}
        onClear={handleClear}
      />
      <div className={styles.previewContainer}>
        <iframe
          className={styles.preview}
          srcDoc={input}
          sandbox="allow-same-origin"
          title="HTML Preview"
          aria-label="HTML preview"
        />
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
    </ToolPageLayout>
  );
}
