import { useState, useCallback } from 'react';
import { InputArea } from '../../components/InputArea';
import { OutputArea } from '../../components/OutputArea';
import { extractJiraIds } from '../../utils/jira';
import { copyToClipboard, readFromClipboard } from '../../services/clipboard';
import styles from './JiraIdExtractorPage.module.css';

export default function JiraIdExtractorPage() {
  const [prefix, setPrefix] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const processInput = useCallback(
    (text: string, currentPrefix: string) => {
      if (!text.trim() || !currentPrefix.trim()) {
        setOutput('');
        return;
      }
      const ids = extractJiraIds(text, currentPrefix);
      setOutput(ids.length > 0 ? ids.join('\n') : 'No Jira IDs found.');
    },
    [],
  );

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value);
      processInput(value, prefix);
    },
    [prefix, processInput],
  );

  const handlePrefixChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPrefix = e.target.value;
      setPrefix(newPrefix);
      processInput(input, newPrefix);
    },
    [input, processInput],
  );

  const handlePaste = useCallback(async () => {
    const text = await readFromClipboard();
    if (text) {
      setInput(text);
      processInput(text, prefix);
    }
  }, [prefix, processInput]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
  }, []);

  const handleCopy = useCallback(() => {
    copyToClipboard(output);
  }, [output]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Jira ID Extractor</h1>
        <div className={styles.prefixRow}>
          <label className={styles.prefixLabel} htmlFor="jiraPrefix">
            Prefix:
          </label>
          <input
            id="jiraPrefix"
            className={styles.prefixInput}
            type="text"
            value={prefix}
            onChange={handlePrefixChange}
            placeholder="e.g. M3-"
          />
        </div>
      </div>
      <div className={styles.panels}>
        <InputArea
          value={input}
          onChange={handleInputChange}
          placeholder="Paste commit messages here…"
          onPaste={handlePaste}
          onClear={handleClear}
        />
        <OutputArea value={output} error={null} onCopy={handleCopy} />
      </div>
    </div>
  );
}
