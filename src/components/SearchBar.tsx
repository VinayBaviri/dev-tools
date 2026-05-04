import styles from './Sidebar.module.css';

export interface SearchBarProps {
  query: string;
  onChange: (query: string) => void;
}

export default function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <div className={styles.searchArea}>
      <input
        type="search"
        className={styles.searchInput}
        placeholder="Search tools…"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search tools"
      />
    </div>
  );
}
