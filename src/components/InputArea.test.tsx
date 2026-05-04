import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { InputArea } from './InputArea';

describe('InputArea', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    onPaste: vi.fn(),
    onClear: vi.fn(),
  };

  it('renders a textarea with the provided value', () => {
    render(<InputArea {...defaultProps} value="hello" />);
    const textarea = screen.getByRole('textbox', { name: /input/i });
    expect(textarea).toHaveValue('hello');
  });

  it('renders placeholder text', () => {
    render(<InputArea {...defaultProps} placeholder="Enter text here" />);
    const textarea = screen.getByPlaceholderText('Enter text here');
    expect(textarea).toBeInTheDocument();
  });

  it('calls onChange when the user types', async () => {
    const onChange = vi.fn();
    render(<InputArea {...defaultProps} onChange={onChange} />);
    const textarea = screen.getByRole('textbox', { name: /input/i });
    await userEvent.type(textarea, 'a');
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('renders Paste and Clear buttons', () => {
    render(<InputArea {...defaultProps} />);
    expect(screen.getByRole('button', { name: /paste/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('calls onPaste when Paste button is clicked', async () => {
    const onPaste = vi.fn();
    render(<InputArea {...defaultProps} onPaste={onPaste} />);
    await userEvent.click(screen.getByRole('button', { name: /paste/i }));
    expect(onPaste).toHaveBeenCalledOnce();
  });

  it('calls onClear when Clear button is clicked', async () => {
    const onClear = vi.fn();
    render(<InputArea {...defaultProps} onClear={onClear} />);
    await userEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(onClear).toHaveBeenCalledOnce();
  });
});
