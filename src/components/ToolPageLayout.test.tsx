import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ToolPageLayout } from './ToolPageLayout';

describe('ToolPageLayout', () => {
  it('renders title as h1', () => {
    render(
      <ToolPageLayout title="URL Encoder" description="Encode URLs">
        <div />
      </ToolPageLayout>
    );
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('URL Encoder');
  });

  it('renders description paragraph', () => {
    render(
      <ToolPageLayout title="URL Encoder" description="Encode special characters in URLs">
        <div />
      </ToolPageLayout>
    );
    expect(screen.getByText('Encode special characters in URLs')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <ToolPageLayout title="Test Tool" description="A test tool">
        <p>Child content here</p>
      </ToolPageLayout>
    );
    expect(screen.getByText('Child content here')).toBeInTheDocument();
  });

  it('applies consistent layout structure', () => {
    const { container } = render(
      <ToolPageLayout title="My Tool" description="Description text">
        <div data-testid="child" />
      </ToolPageLayout>
    );
    // Verify the structural hierarchy: container > header + content
    const wrapper = container.firstElementChild!;
    expect(wrapper.querySelector('header')).toBeInTheDocument();
    expect(wrapper.querySelector('h1')).toBeInTheDocument();
    expect(wrapper.querySelector('p')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
