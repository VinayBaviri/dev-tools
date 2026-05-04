import { useState, useCallback, useRef, useEffect } from 'react';
import { ToolPageLayout } from '../../components/ToolPageLayout';
import { InputArea } from '../../components/InputArea';
import { markdownToHTML } from '../../utils/markdown';
import { copyToClipboard, readFromClipboard } from '../../services/clipboard';
import styles from './MarkdownPreviewerPage.module.css';

export default function MarkdownPreviewerPage() {
  const [input, setInput] = useState('');
  const [html, setHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleChange = useCallback((value: string) => {
    setInput(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (value === '') {
        setHtml('');
      } else {
        setHtml(markdownToHTML(value));
      }
      debounceRef.current = null;
    }, 300);
  }, []);

  const handlePaste = useCallback(async () => {
    const text = await readFromClipboard();
    if (text) {
      handleChange(text);
    }
  }, [handleChange]);

  const handleClear = useCallback(() => {
    setInput('');
    setHtml('');
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  const handleCopy = useCallback(() => {
    copyToClipboard(html);
    setCopied(true);

    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current);
    }

    copyTimerRef.current = setTimeout(() => {
      setCopied(false);
      copyTimerRef.current = null;
    }, 2000);
  }, [html]);

  return (
    <ToolPageLayout
      title="Markdown Previewer"
      description="Write Markdown and see the rendered HTML preview in real-time."
    >
      <InputArea
        value={input}
        onChange={handleChange}
        placeholder="Enter Markdown text to preview…"
        onPaste={handlePaste}
        onClear={handleClear}
      />
      <div className={styles.previewContainer}>
        <div
          className={styles.preview}
          dangerouslySetInnerHTML={{ __html: html }}
          aria-label="Markdown preview"
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
