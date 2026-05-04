import { describe, it, expect, vi, beforeEach } from 'vitest';
import { copyToClipboard, readFromClipboard } from './clipboard';

describe('clipboard service', () => {
  beforeEach(() => {
    // Reset clipboard mock before each test
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn(),
        readText: vi.fn(),
      },
      writable: true,
      configurable: true,
    });
  });

  describe('copyToClipboard', () => {
    it('returns true when clipboard write succeeds', async () => {
      vi.mocked(navigator.clipboard.writeText).mockResolvedValue(undefined);

      const result = await copyToClipboard('hello');

      expect(result).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello');
    });

    it('returns false when clipboard write fails with permission error', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValue(
        new DOMException('Write permission denied', 'NotAllowedError')
      );

      const result = await copyToClipboard('hello');

      expect(result).toBe(false);
    });

    it('returns false when clipboard API throws any error', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValue(
        new Error('Unexpected error')
      );

      const result = await copyToClipboard('some text');

      expect(result).toBe(false);
    });

    it('passes the exact text to writeText', async () => {
      vi.mocked(navigator.clipboard.writeText).mockResolvedValue(undefined);

      await copyToClipboard('special chars: <>&"\'');

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'special chars: <>&"\''
      );
    });
  });

  describe('readFromClipboard', () => {
    it('returns clipboard text on success', async () => {
      vi.mocked(navigator.clipboard.readText).mockResolvedValue('clipboard content');

      const result = await readFromClipboard();

      expect(result).toBe('clipboard content');
    });

    it('returns empty string when clipboard read fails with permission error', async () => {
      vi.mocked(navigator.clipboard.readText).mockRejectedValue(
        new DOMException('Read permission denied', 'NotAllowedError')
      );

      const result = await readFromClipboard();

      expect(result).toBe('');
    });

    it('returns empty string when clipboard API throws any error', async () => {
      vi.mocked(navigator.clipboard.readText).mockRejectedValue(
        new Error('Unexpected error')
      );

      const result = await readFromClipboard();

      expect(result).toBe('');
    });
  });
});
