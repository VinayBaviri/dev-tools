import styles from './InputArea.module.css';

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onPaste: () => void;
  onClear: () => void;
}

export function InputArea({
  value,
  onChange,
  placeholder,
  onPaste,
  onClear,
}: InputAreaProps) {
  return (
    <div className={styles.container}>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Input"
      />
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.button}
          onClick={onPaste}
          aria-label="Paste from clipboard"
        >
          Paste
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={onClear}
          aria-label="Clear input"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
