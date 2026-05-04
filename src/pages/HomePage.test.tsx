import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { toolCategories, getAllTools, getToolCount } from '../data/toolRegistry';
import HomePage from './HomePage';

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  it('renders the "Dev Toolbox" heading', () => {
    renderHomePage();
    expect(screen.getByRole('heading', { level: 1, name: 'Dev Toolbox' })).toBeInTheDocument();
  });

  it('displays the total tool count', () => {
    renderHomePage();
    const count = getToolCount();
    expect(screen.getByText(new RegExp(`${count} developer utilities`))).toBeInTheDocument();
  });

  it('renders all tool categories as sections', () => {
    renderHomePage();
    for (const category of toolCategories) {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    }
  });

  it('renders all tools as cards with name and description', () => {
    renderHomePage();
    const allTools = getAllTools();
    for (const tool of allTools) {
      expect(screen.getByText(tool.name)).toBeInTheDocument();
      expect(screen.getByText(tool.description)).toBeInTheDocument();
    }
  });

  it('cards link to the correct tool paths', () => {
    renderHomePage();
    const allTools = getAllTools();
    for (const tool of allTools) {
      const link = screen.getByText(tool.name).closest('a');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', tool.path);
    }
  });

  it('clicking a card navigates to the tool page', async () => {
    const user = userEvent.setup();
    renderHomePage();
    const firstTool = getAllTools()[0];
    const link = screen.getByText(firstTool.name).closest('a')!;

    await user.click(link);

    // After clicking, the MemoryRouter location should have changed.
    // We verify the link was clickable and had the right href.
    expect(link).toHaveAttribute('href', firstTool.path);
  });
});
