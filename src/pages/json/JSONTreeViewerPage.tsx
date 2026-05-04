import { useState, useCallback } from 'react';
import { ToolPageLayout } from '../../components/ToolPageLayout';
import { InputArea } from '../../components/InputArea';
import { jsonParse } from '../../utils/json';
import { readFromClipboard } from '../../services/clipboard';
import styles from './JSONTreeViewerPage.module.css';

interface TreeNodeProps {
  label?: string;
  value: unknown;
  defaultExpanded?: boolean;
}

function TreeNode({ label, value, defaultExpanded = true }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  if (value === null) {
    return (
      <li className={styles.nodeItem}>
        <span className={styles.leaf} />
        {label !== undefined && (
          <>
            <span className={styles.key}>"{label}"</span>
            <span>: </span>
          </>
        )}
        <span className={styles.null}>null</span>
      </li>
    );
  }

  if (typeof value === 'string') {
    return (
      <li className={styles.nodeItem}>
        <span className={styles.leaf} />
        {label !== undefined && (
          <>
            <span className={styles.key}>"{label}"</span>
            <span>: </span>
          </>
        )}
        <span className={styles.string}>"{value}"</span>
      </li>
    );
  }

  if (typeof value === 'number') {
    return (
      <li className={styles.nodeItem}>
        <span className={styles.leaf} />
        {label !== undefined && (
          <>
            <span className={styles.key}>"{label}"</span>
            <span>: </span>
          </>
        )}
        <span className={styles.number}>{String(value)}</span>
      </li>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <li className={styles.nodeItem}>
        <span className={styles.leaf} />
        {label !== undefined && (
          <>
            <span className={styles.key}>"{label}"</span>
            <span>: </span>
          </>
        )}
        <span className={styles.boolean}>{String(value)}</span>
      </li>
    );
  }

  if (Array.isArray(value)) {
    const count = value.length;
    return (
      <li className={styles.nodeItem}>
        <button
          type="button"
          className={styles.toggle}
          onClick={handleToggle}
          aria-label={expanded ? 'Collapse' : 'Expand'}
          aria-expanded={expanded}
        >
          {expanded ? '▼' : '▶'}
        </button>
        {label !== undefined && (
          <>
            <span className={styles.key}>"{label}"</span>
            <span>: </span>
          </>
        )}
        <span className={styles.bracket}>[</span>
        {!expanded && (
          <>
            <span className={styles.itemCount}>{count} {count === 1 ? 'item' : 'items'}</span>
            <span className={styles.bracket}>]</span>
          </>
        )}
        {expanded && (
          <>
            <ul className={styles.node}>
              {value.map((item, index) => (
                <TreeNode key={index} label={String(index)} value={item} />
              ))}
            </ul>
            <span className={styles.bracket}>]</span>
          </>
        )}
      </li>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    const count = entries.length;
    return (
      <li className={styles.nodeItem}>
        <button
          type="button"
          className={styles.toggle}
          onClick={handleToggle}
          aria-label={expanded ? 'Collapse' : 'Expand'}
          aria-expanded={expanded}
        >
          {expanded ? '▼' : '▶'}
        </button>
        {label !== undefined && (
          <>
            <span className={styles.key}>"{label}"</span>
            <span>: </span>
          </>
        )}
        <span className={styles.bracket}>{'{'}</span>
        {!expanded && (
          <>
            <span className={styles.itemCount}>{count} {count === 1 ? 'key' : 'keys'}</span>
            <span className={styles.bracket}>{'}'}</span>
          </>
        )}
        {expanded && (
          <>
            <ul className={styles.node}>
              {entries.map(([key, val]) => (
                <TreeNode key={key} label={key} value={val} />
              ))}
            </ul>
            <span className={styles.bracket}>{'}'}</span>
          </>
        )}
      </li>
    );
  }

  // Fallback for other types
  return (
    <li className={styles.nodeItem}>
      <span className={styles.leaf} />
      {label !== undefined && (
        <>
          <span className={styles.key}>"{label}"</span>
          <span>: </span>
        </>
      )}
      <span>{String(value)}</span>
    </li>
  );
}

export default function JSONTreeViewerPage() {
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<unknown>(undefined);
  const [error, setError] = useState<string | null>(null);

  const processInput = useCallback((value: string) => {
    setInput(value);
    if (value === '') {
      setParsed(undefined);
      setError(null);
      return;
    }
    try {
      setParsed(jsonParse(value));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
      setParsed(undefined);
    }
  }, []);

  const handlePaste = useCallback(async () => {
    const text = await readFromClipboard();
    if (text) {
      processInput(text);
    }
  }, [processInput]);

  const handleClear = useCallback(() => {
    setInput('');
    setParsed(undefined);
    setError(null);
  }, []);

  return (
    <ToolPageLayout
      title="JSON Tree Viewer"
      description="Visualize JSON as an interactive, collapsible tree structure."
    >
      <InputArea
        value={input}
        onChange={processInput}
        placeholder='Enter JSON to visualize (e.g., {"users":[{"name":"Alice"},{"name":"Bob"}]})…'
        onPaste={handlePaste}
        onClear={handleClear}
      />
      {error ? (
        <div className={styles.error} role="alert" aria-label="Error output">
          {error}
        </div>
      ) : parsed !== undefined ? (
        <div className={styles.tree} aria-label="JSON tree view">
          <ul className={styles.nodeRoot}>
            <TreeNode value={parsed} />
          </ul>
        </div>
      ) : null}
    </ToolPageLayout>
  );
}
