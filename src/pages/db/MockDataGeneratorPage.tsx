import { useState, useCallback } from 'react';
import { ToolPageLayout } from '../../components/ToolPageLayout';
import { OutputArea } from '../../components/OutputArea';
import {
  generateMockData,
  type ColumnDefinition,
  type MockDataConfig,
} from '../../utils/mockdata';
import { copyToClipboard } from '../../services/clipboard';
import styles from './MockDataGeneratorPage.module.css';

const COLUMN_TYPES: ColumnDefinition['type'][] = [
  'string',
  'integer',
  'float',
  'boolean',
  'date',
  'email',
  'uuid',
];

const DEFAULT_COLUMN: ColumnDefinition = { name: '', type: 'string' };

export default function MockDataGeneratorPage() {
  const [columns, setColumns] = useState<ColumnDefinition[]>([
    { name: 'id', type: 'integer' },
    { name: 'name', type: 'string' },
    { name: 'email', type: 'email' },
  ]);
  const [rowCount, setRowCount] = useState(10);
  const [outputFormat, setOutputFormat] = useState<'json' | 'csv'>('json');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleColumnNameChange = useCallback(
    (index: number, name: string) => {
      setColumns((prev) =>
        prev.map((col, i) => (i === index ? { ...col, name } : col)),
      );
    },
    [],
  );

  const handleColumnTypeChange = useCallback(
    (index: number, type: ColumnDefinition['type']) => {
      setColumns((prev) =>
        prev.map((col, i) => (i === index ? { ...col, type } : col)),
      );
    },
    [],
  );

  const handleAddColumn = useCallback(() => {
    setColumns((prev) => [...prev, { ...DEFAULT_COLUMN }]);
  }, []);

  const handleRemoveColumn = useCallback((index: number) => {
    setColumns((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleRowCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value)) {
        setRowCount(Math.max(1, Math.min(1000, value)));
      }
    },
    [],
  );

  const handleGenerate = useCallback(() => {
    try {
      const config: MockDataConfig = {
        columns,
        rowCount,
        outputFormat,
      };
      const result = generateMockData(config);
      setOutput(result);
      setError(null);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'An unexpected error occurred.',
      );
      setOutput('');
    }
  }, [columns, rowCount, outputFormat]);

  const handleCopy = useCallback(() => {
    copyToClipboard(output);
  }, [output]);

  return (
    <ToolPageLayout
      title="Mock Data Generator"
      description="Generate realistic mock data matching a custom table schema."
    >
      <div className={styles.form}>
        <div className={styles.columnsSection}>
          <span className={styles.columnsLabel}>Columns</span>
          {columns.map((col, index) => (
            <div className={styles.columnRow} key={index}>
              <input
                className={styles.columnInput}
                type="text"
                value={col.name}
                onChange={(e) => handleColumnNameChange(index, e.target.value)}
                placeholder="Column name"
                aria-label={`Column ${index + 1} name`}
              />
              <select
                className={styles.columnSelect}
                value={col.type}
                onChange={(e) =>
                  handleColumnTypeChange(
                    index,
                    e.target.value as ColumnDefinition['type'],
                  )
                }
                aria-label={`Column ${index + 1} type`}
              >
                {COLUMN_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemoveColumn(index)}
                aria-label={`Remove column ${index + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.addButton}
            onClick={handleAddColumn}
          >
            + Add Column
          </button>
        </div>

        <div className={styles.optionsRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="rowCount">
              Row Count
            </label>
            <input
              id="rowCount"
              className={styles.rowCountInput}
              type="number"
              min={1}
              max={1000}
              value={rowCount}
              onChange={handleRowCountChange}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="outputFormat">
              Output Format
            </label>
            <select
              id="outputFormat"
              className={styles.formatSelect}
              value={outputFormat}
              onChange={(e) =>
                setOutputFormat(e.target.value as 'json' | 'csv')
              }
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
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
