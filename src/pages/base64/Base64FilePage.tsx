import { useState, useCallback } from 'react';
import { ToolPageLayout } from '../../components/ToolPageLayout';
import { OutputArea } from '../../components/OutputArea';
import { base64EncodeFile, getEncodedSize } from '../../utils/base64';
import { copyToClipboard } from '../../services/clipboard';
import styles from './Base64FilePage.module.css';

export default function Base64FilePage() {
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [encodedSize, setEncodedSize] = useState<number | null>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        setOutput('');
        setError(null);
        setEncodedSize(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const encoded = base64EncodeFile(arrayBuffer);
          setOutput(encoded);
          setEncodedSize(getEncodedSize(encoded));
          setError(null);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'An unexpected error occurred.',
          );
          setOutput('');
          setEncodedSize(null);
        }
      };
      reader.onerror = () => {
        setError('Failed to read the file. Please try again.');
        setOutput('');
        setEncodedSize(null);
      };
      reader.readAsArrayBuffer(file);
    },
    [],
  );

  const handleCopy = useCallback(() => {
    copyToClipboard(output);
  }, [output]);

  return (
    <ToolPageLayout
      title="Base64 File Encoder"
      description="Upload a file and encode its contents to Base64."
    >
      <div className={styles.uploadContainer}>
        <label className={styles.label} htmlFor="file-upload">
          Choose a file to encode
        </label>
        <input
          id="file-upload"
          type="file"
          className={styles.fileInput}
          onChange={handleFileChange}
          aria-label="Upload file to encode"
        />
        {encodedSize !== null && (
          <p className={styles.sizeInfo}>
            Encoded size: <strong>{encodedSize.toLocaleString()} bytes</strong>
          </p>
        )}
      </div>
      <OutputArea value={output} error={error} onCopy={handleCopy} />
    </ToolPageLayout>
  );
}
