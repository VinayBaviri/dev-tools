import styles from './ToolPageLayout.module.css';

interface ToolPageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ToolPageLayout({
  title,
  description,
  children,
}: ToolPageLayoutProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </header>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
