import { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { toolCategories } from '../data/toolRegistry';
import { useTheme } from '../contexts/ThemeContext';
import { filterTools } from '../utils/search';
import SearchBar from './SearchBar';
import styles from './Sidebar.module.css';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set(),
  );

  const toggleCategory = useCallback((categoryId: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  const handleToolClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const filteredCategories = filterTools(toolCategories, searchQuery);

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
      aria-label="Tool navigation"
    >
      <div className={styles.homeSection}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${styles.homeLink} ${isActive ? styles.homeLinkActive : ''}`
          }
          onClick={handleToolClick}
        >
          <span className={styles.homeIcon}>🏠</span>
          <span>Home</span>
        </NavLink>
      </div>

      <SearchBar query={searchQuery} onChange={setSearchQuery} />

      <nav className={styles.nav}>
        {filteredCategories.map((category) => {
          const isCollapsed = collapsedCategories.has(category.id);
          return (
            <div key={category.id} className={styles.categoryGroup}>
              <button
                className={styles.categoryHeader}
                onClick={() => toggleCategory(category.id)}
                aria-expanded={!isCollapsed}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span className={styles.categoryName}>{category.name}</span>
                <span
                  className={`${styles.chevron} ${isCollapsed ? styles.chevronCollapsed : ''}`}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </button>

              {!isCollapsed && (
                <ul className={styles.toolList}>
                  {category.tools.map((tool) => (
                    <li key={tool.id}>
                      <NavLink
                        to={tool.path}
                        className={({ isActive }) =>
                          `${styles.toolLink} ${isActive ? styles.toolLinkActive : ''}`
                        }
                        onClick={handleToolClick}
                      >
                        {tool.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
          <span className={styles.themeLabel}>
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </span>
        </button>
      </div>
    </aside>
  );
}
