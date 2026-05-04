import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import URLEncoderPage from './pages/url/URLEncoderPage';
import URLDecoderPage from './pages/url/URLDecoderPage';
import URLParserPage from './pages/url/URLParserPage';
import HTMLEncoderPage from './pages/html/HTMLEncoderPage';
import HTMLDecoderPage from './pages/html/HTMLDecoderPage';
import HTMLPreviewerPage from './pages/html/HTMLPreviewerPage';
import HTMLMinifierPage from './pages/html/HTMLMinifierPage';
import HTMLPrettifierPage from './pages/html/HTMLPrettifierPage';
import MarkdownPreviewerPage from './pages/markdown/MarkdownPreviewerPage';
import HTMLToMarkdownPage from './pages/markdown/HTMLToMarkdownPage';
import JSFormatterPage from './pages/js/JSFormatterPage';
import JSMinifierPage from './pages/js/JSMinifierPage';
import JSONFormatterPage from './pages/json/JSONFormatterPage';
import JSONValidatorPage from './pages/json/JSONValidatorPage';
import JSONMinifierPage from './pages/json/JSONMinifierPage';
import JSONToCSVPage from './pages/json/JSONToCSVPage';
import JSONTreeViewerPage from './pages/json/JSONTreeViewerPage';
import SQLFormatterPage from './pages/db/SQLFormatterPage';
import MockDataGeneratorPage from './pages/db/MockDataGeneratorPage';
import UUIDGeneratorPage from './pages/random/UUIDGeneratorPage';
import PasswordGeneratorPage from './pages/random/PasswordGeneratorPage';
import RandomNumberPage from './pages/random/RandomNumberPage';
import LoremIpsumPage from './pages/random/LoremIpsumPage';
import Base64EncoderPage from './pages/base64/Base64EncoderPage';
import Base64DecoderPage from './pages/base64/Base64DecoderPage';
import Base64FilePage from './pages/base64/Base64FilePage';
import JiraIdExtractorPage from './pages/jira/JiraIdExtractorPage';
import styles from './App.module.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <ThemeProvider>
      <div className={styles.appShell}>
        {/* Hamburger menu button — visible only below 768px */}
        <button
          className={styles.hamburger}
          onClick={handleToggleSidebar}
          aria-label="Toggle navigation menu"
          aria-expanded={sidebarOpen}
        >
          ☰
        </button>

        {/* Overlay for mobile when sidebar is open */}
        <div
          className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
          onClick={handleCloseSidebar}
          aria-hidden="true"
        />

        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

        <main className={styles.main}>
          <div className={styles.pageContent}>
            <Routes>
              {/* Home */}
              <Route path="/" element={<HomePage />} />

              {/* URL Tools */}
              <Route path="/url/encode" element={<URLEncoderPage />} />
              <Route path="/url/decode" element={<URLDecoderPage />} />
              <Route path="/url/parse" element={<URLParserPage />} />

              {/* HTML Tools */}
              <Route path="/html/encode" element={<HTMLEncoderPage />} />
              <Route path="/html/decode" element={<HTMLDecoderPage />} />
              <Route path="/html/preview" element={<HTMLPreviewerPage />} />
              <Route path="/html/minify" element={<HTMLMinifierPage />} />
              <Route path="/html/prettify" element={<HTMLPrettifierPage />} />

              {/* Markdown Tools */}
              <Route path="/markdown/preview" element={<MarkdownPreviewerPage />} />
              <Route path="/markdown/from-html" element={<HTMLToMarkdownPage />} />

              {/* JavaScript Tools */}
              <Route path="/js/format" element={<JSFormatterPage />} />
              <Route path="/js/minify" element={<JSMinifierPage />} />

              {/* JSON Tools */}
              <Route path="/json/format" element={<JSONFormatterPage />} />
              <Route path="/json/validate" element={<JSONValidatorPage />} />
              <Route path="/json/minify" element={<JSONMinifierPage />} />
              <Route path="/json/to-csv" element={<JSONToCSVPage />} />
              <Route path="/json/tree" element={<JSONTreeViewerPage />} />

              {/* Database Tools */}
              <Route path="/db/sql-format" element={<SQLFormatterPage />} />
              <Route path="/db/mock-data" element={<MockDataGeneratorPage />} />

              {/* Randomizer Tools */}
              <Route path="/random/uuid" element={<UUIDGeneratorPage />} />
              <Route path="/random/password" element={<PasswordGeneratorPage />} />
              <Route path="/random/number" element={<RandomNumberPage />} />
              <Route path="/random/lorem" element={<LoremIpsumPage />} />

              {/* Base64 Tools */}
              <Route path="/base64/encode" element={<Base64EncoderPage />} />
              <Route path="/base64/decode" element={<Base64DecoderPage />} />
              <Route path="/base64/file" element={<Base64FilePage />} />

              {/* Utility Tools */}
              <Route path="/utility/jira-ids" element={<JiraIdExtractorPage />} />
            </Routes>
          </div>

          <footer className={styles.footer}>
            <p className={styles.footerText}>
              Built with care. No ads, no tracking, just tools.
            </p>
            <p className={styles.footerCredit}>
              Crafted by <strong>Hari BVSP</strong> © 2026
              <span className={styles.footerSep}>·</span>
              <a
                href="https://github.com/VinayBaviri/dev-tools"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                GitHub
              </a>
            </p>
          </footer>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
