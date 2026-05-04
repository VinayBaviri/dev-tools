import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { toolCategories, getAllTools } from '../data/toolRegistry';
import Sidebar from './Sidebar';

function renderSidebar(props: { isOpen?: boolean; onClose?: () => void } = {}) {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    ...props,
  };

  return {
    ...render(
      <MemoryRouter>
        <ThemeProvider>
          <Sidebar {...defaultProps} />
        </ThemeProvider>
      </MemoryRouter>,
    ),
    onClose: defaultProps.onClose,
  };
}

describe('Sidebar', () => {
  describe('category rendering', () => {
    it('renders all 8 category groups', () => {
      renderSidebar();
      for (const category of toolCategories) {
        expect(screen.getByText(category.name)).toBeInTheDocument();
      }
    });

    it('renders all tool links within categories', () => {
      renderSidebar();
      const allTools = getAllTools();
      for (const tool of allTools) {
        expect(screen.getByText(tool.name)).toBeInTheDocument();
      }
    });
  });

  describe('tool link navigation', () => {
    it('tool links use NavLink with correct paths', () => {
      renderSidebar();
      const allTools = getAllTools();
      for (const tool of allTools) {
        const link = screen.getByText(tool.name).closest('a');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', tool.path);
      }
    });

    it('calls onClose when a tool link is clicked', async () => {
      const onClose = vi.fn();
      renderSidebar({ onClose });
      const firstTool = getAllTools()[0];
      await userEvent.click(screen.getByText(firstTool.name));
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe('collapsible categories', () => {
    it('category groups are expanded by default', () => {
      renderSidebar();
      const firstCategory = toolCategories[0];
      const header = screen.getByText(firstCategory.name).closest('button');
      expect(header).toHaveAttribute('aria-expanded', 'true');
      // Tools should be visible
      for (const tool of firstCategory.tools) {
        expect(screen.getByText(tool.name)).toBeInTheDocument();
      }
    });

    it('clicking a category header collapses its tools', async () => {
      renderSidebar();
      const firstCategory = toolCategories[0];
      const header = screen.getByText(firstCategory.name).closest('button')!;

      await userEvent.click(header);

      expect(header).toHaveAttribute('aria-expanded', 'false');
      // Tools in this category should be hidden
      for (const tool of firstCategory.tools) {
        expect(screen.queryByText(tool.name)).not.toBeInTheDocument();
      }
    });

    it('clicking a collapsed category header expands it again', async () => {
      renderSidebar();
      const firstCategory = toolCategories[0];
      const header = screen.getByText(firstCategory.name).closest('button')!;

      // Collapse
      await userEvent.click(header);
      expect(header).toHaveAttribute('aria-expanded', 'false');

      // Expand
      await userEvent.click(header);
      expect(header).toHaveAttribute('aria-expanded', 'true');
      for (const tool of firstCategory.tools) {
        expect(screen.getByText(tool.name)).toBeInTheDocument();
      }
    });
  });

  describe('theme toggle', () => {
    it('renders a theme toggle button', () => {
      renderSidebar();
      const themeButton = screen.getByRole('button', { name: /switch to .+ theme/i });
      expect(themeButton).toBeInTheDocument();
    });

    it('toggles theme label on click', async () => {
      renderSidebar();
      const themeButton = screen.getByRole('button', { name: /switch to .+ theme/i });
      const initialLabel = themeButton.textContent;

      await userEvent.click(themeButton);

      // After toggle, the label should change
      expect(themeButton.textContent).not.toBe(initialLabel);
    });
  });

  describe('search filtering', () => {
    it('filters visible tools when typing in the search bar', async () => {
      renderSidebar();
      const searchInput = screen.getByPlaceholderText('Search tools…');
      const allTools = getAllTools();

      // Type a query that matches only a subset of tools
      await userEvent.type(searchInput, 'uuid');

      // UUID Generator should still be visible
      expect(screen.getByText('UUID Generator')).toBeInTheDocument();

      // Tools that don't match should be hidden
      const nonMatchingTools = allTools.filter(
        (t) =>
          !t.name.toLowerCase().includes('uuid') &&
          !t.description.toLowerCase().includes('uuid') &&
          !t.keywords.some((kw) => kw.toLowerCase().includes('uuid')),
      );
      for (const tool of nonMatchingTools) {
        expect(screen.queryByText(tool.name)).not.toBeInTheDocument();
      }
    });

    it('shows all tools when search query is cleared', async () => {
      renderSidebar();
      const searchInput = screen.getByPlaceholderText('Search tools…');

      // Type then clear
      await userEvent.type(searchInput, 'uuid');
      await userEvent.clear(searchInput);

      const allTools = getAllTools();
      for (const tool of allTools) {
        expect(screen.getByText(tool.name)).toBeInTheDocument();
      }
    });
  });

  describe('sidebar structure', () => {
    it('has an accessible navigation landmark', () => {
      renderSidebar();
      expect(screen.getByLabelText('Tool navigation')).toBeInTheDocument();
    });
  });
});
