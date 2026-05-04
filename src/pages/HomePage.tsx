import { Link } from 'react-router-dom';
import { toolCategories, getToolCount } from '../data/toolRegistry';
import styles from './HomePage.module.css';

export default function HomePage() {
  const totalTools = getToolCount();

  return (
    <div className={styles.homePage}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dev Toolbox</h1>
        <p className={styles.subtitle}>
          A clean, fast, and private collection of {totalTools} developer utilities.
        </p>
      </header>

      <section className={styles.intro}>
        <div className={styles.introGrid}>
          <div className={styles.introCard}>
            <span className={styles.introIcon}>🚫</span>
            <h3 className={styles.introTitle}>Zero Ads</h3>
            <p className={styles.introText}>
              No banners, no pop-ups, no sponsored content. Developer tools should help you work, not sell you things.
            </p>
          </div>
          <div className={styles.introCard}>
            <span className={styles.introIcon}>🔒</span>
            <h3 className={styles.introTitle}>Fully Private</h3>
            <p className={styles.introText}>
              Everything runs locally in your browser. No data is ever sent to a server. No analytics, no tracking, no cookies.
            </p>
          </div>
          <div className={styles.introCard}>
            <span className={styles.introIcon}>⚡</span>
            <h3 className={styles.introTitle}>Instant Results</h3>
            <p className={styles.introText}>
              All processing happens client-side in real time. No waiting for server responses, no rate limits, no sign-ups.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.whySection}>
        <h2 className={styles.whySectionTitle}>Why Dev Toolbox?</h2>
        <p className={styles.whyText}>
          Every developer has been there — you need to quickly encode a URL, format some JSON, or generate a UUID, and you end up on a random website cluttered with ads, cookie banners, and tracking scripts. Half the screen is advertising, the other half is begging you to sign up.
        </p>
        <p className={styles.whyText}>
          Dev Toolbox exists because daily development work deserves better. It's a single, self-contained application with every utility you reach for regularly — built to respect your time, your screen space, and your privacy. No accounts, no subscriptions, no data collection. Just tools that work.
        </p>
      </section>

      <hr className={styles.divider} />

      {toolCategories.map((category) => (
        <section key={category.id} className={styles.categorySection}>
          <h2 className={styles.categoryName}>
            <span>{category.icon}</span>
            {category.name}
          </h2>
          <div className={styles.cardGrid}>
            {category.tools.map((tool) => (
              <Link key={tool.id} to={tool.path} className={styles.card}>
                <h3 className={styles.cardName}>
                  <span className={styles.cardIcon}>{tool.icon}</span>
                  {tool.name}
                </h3>
                <p className={styles.cardDescription}>{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
