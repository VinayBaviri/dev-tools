interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>{title}</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
        This tool page is under construction.
      </p>
    </div>
  );
}
