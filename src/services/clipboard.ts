/**
 * Clipboard service providing copy and read operations
 * using the browser Clipboard API with graceful error handling.
 */

/**
 * Copies the given text to the system clipboard.
 * @param text - The text to copy
 * @returns true on success, false on failure (e.g., permission denied)
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads text content from the system clipboard.
 * @returns The clipboard text content, or an empty string on failure
 */
export async function readFromClipboard(): Promise<string> {
  try {
    return await navigator.clipboard.readText();
  } catch {
    return '';
  }
}
