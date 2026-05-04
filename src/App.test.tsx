import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { getAllTools, getToolCount } from './data/toolRegistry';
import App from './App';

function renderApp(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App shell routing', () => {
  it('renders the home page at the root route "/"', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { name: 'Dev Toolbox' })).toBeInTheDocument();
  });

  it('navigating to a tool route renders the correct tool page', () => {
    renderApp('/url/encode');
    expect(screen.getByRole('heading', { name: 'URL Encoder' })).toBeInTheDocument();
  });

  it('clicking a tool link in the sidebar navigates without full page reload', async () => {
    const user = userEvent.setup();
    renderApp('/');

    // Verify we start on the home page
    expect(screen.getByRole('heading', { name: 'Dev Toolbox' })).toBeInTheDocument();

    // Click a tool link in the sidebar
    const sidebar = screen.getByLabelText('Tool navigation');
    const urlEncoderLink = within(sidebar).getByText('URL Encoder');
    await user.click(urlEncoderLink);

    // The tool page should render in the same document (no full page reload)
    expect(screen.getByRole('heading', { name: 'URL Encoder' })).toBeInTheDocument();
    // Home page heading should no longer be present
    expect(screen.queryByRole('heading', { name: 'Dev Toolbox' })).not.toBeInTheDocument();
  });

  it('hamburger menu button is present and toggles sidebar open/closed', async () => {
    const user = userEvent.setup();
    renderApp('/');

    // The hamburger button is hidden via CSS on desktop (display: none),
    // so we query by aria-label directly rather than by role.
    const hamburger = screen.getByLabelText('Toggle navigation menu');
    expect(hamburger).toBeInTheDocument();

    // Initially closed (aria-expanded=false)
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    await user.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');

    // Click to close
    await user.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  it('all tool routes render their respective placeholder pages', () => {
    const allTools = getAllTools();
    const toolCount = getToolCount();
    expect(allTools).toHaveLength(toolCount);

    for (const tool of allTools) {
      const { unmount } = renderApp(tool.path);
      expect(
        screen.getByRole('heading', { name: tool.name }),
      ).toBeInTheDocument();
      unmount();
    }
  });
});
