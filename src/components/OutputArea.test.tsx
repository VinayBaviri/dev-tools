import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OutputArea } from './OutputArea';

describe('OutputArea', () => {
  const defaultProps = {
    value: '',
    onCopy: vi.fn(),
  };

  it('renders output value in a pre element', () => {
    render(<OutputArea {...defaultProps} value="hello world" />);
    const output = screen.getByLabelText('Output');
    expect(output.tagName).toBe('PRE');
    expect(output).toHaveTextContent('hello world');
  });

  it('shows error message when error prop is set', () => {
    render(<OutputArea {...defaultProps} error="Something went wrong" />);
    const errorEl = screen.getByRole('alert');
    expect(errorEl).toHaveTextContent('Something went wrong');
  });

  it('hides output when error is shown', () => {
    render(
      <OutputArea {...defaultProps} value="some output" error="Bad input" />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Bad input');
    expect(screen.queryByLabelText('Output')).not.toBeInTheDocument();
  });

  it('shows Copy button that calls onCopy', async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    render(<OutputArea {...defaultProps} onCopy={onCopy} />);
    const copyBtn = screen.getByRole('button', { name: /copy to clipboard/i });
    expect(copyBtn).toHaveTextContent('Copy');
    await user.click(copyBtn);
    expect(onCopy).toHaveBeenCalledOnce();
  });

  it('shows "Copied!" confirmation after clicking Copy', async () => {
    const user = userEvent.setup();
    render(<OutputArea {...defaultProps} />);
    const copyBtn = screen.getByRole('button', { name: /copy to clipboard/i });
    await user.click(copyBtn);
    expect(
      screen.getByRole('button', { name: /copied to clipboard/i })
    ).toHaveTextContent('Copied!');
  });

  describe('copy confirmation timing', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('reverts to "Copy" after 2 seconds', () => {
      render(<OutputArea {...defaultProps} />);
      const copyBtn = screen.getByRole('button', {
        name: /copy to clipboard/i,
      });

      fireEvent.click(copyBtn);
      expect(
        screen.getByRole('button', { name: /copied to clipboard/i })
      ).toHaveTextContent('Copied!');

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(
        screen.getByRole('button', { name: /copy to clipboard/i })
      ).toHaveTextContent('Copy');
    });

    it('resets the 2-second timer on rapid re-clicks', () => {
      render(<OutputArea {...defaultProps} />);
      const copyBtn = screen.getByRole('button', {
        name: /copy to clipboard/i,
      });

      // First click
      fireEvent.click(copyBtn);
      expect(
        screen.getByRole('button', { name: /copied to clipboard/i })
      ).toHaveTextContent('Copied!');

      // Advance 1.5 seconds (not enough to revert)
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      expect(
        screen.getByRole('button', { name: /copied to clipboard/i })
      ).toHaveTextContent('Copied!');

      // Click again — should reset the timer
      fireEvent.click(
        screen.getByRole('button', { name: /copied to clipboard/i })
      );

      // Advance another 1.5 seconds (3s total from first click, but only 1.5s from second)
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      // Should still show "Copied!" because the timer was reset
      expect(
        screen.getByRole('button', { name: /copied to clipboard/i })
      ).toHaveTextContent('Copied!');

      // Advance the remaining 500ms to complete the 2s from the second click
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(
        screen.getByRole('button', { name: /copy to clipboard/i })
      ).toHaveTextContent('Copy');
    });
  });
});
