import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  const defaultProps = {
    query: '',
    onChange: vi.fn(),
  };

  it('renders a search input with placeholder', () => {
    render(<SearchBar {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search tools…');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'search');
  });

  it('displays the current query value', () => {
    render(<SearchBar {...defaultProps} query="json" />);
    const input = screen.getByPlaceholderText('Search tools…');
    expect(input).toHaveValue('json');
  });

  it('calls onChange when the user types', async () => {
    const onChange = vi.fn();
    render(<SearchBar {...defaultProps} onChange={onChange} />);
    const input = screen.getByPlaceholderText('Search tools…');
    await userEvent.type(input, 'url');
    // onChange is called once per keystroke with the input value
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenNthCalledWith(1, 'u');
    expect(onChange).toHaveBeenNthCalledWith(2, 'r');
    expect(onChange).toHaveBeenNthCalledWith(3, 'l');
  });

  it('has an accessible label', () => {
    render(<SearchBar {...defaultProps} />);
    const input = screen.getByLabelText('Search tools');
    expect(input).toBeInTheDocument();
  });
});
