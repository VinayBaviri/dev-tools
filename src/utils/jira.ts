/**
 * Jira ID extraction utility.
 * Extracts Jira issue IDs from text (e.g., commit messages) based on a project prefix.
 */

/**
 * Extracts unique Jira issue IDs from the given text that match the specified prefix.
 * 
 * @param text - The text to search (e.g., commit messages).
 * @param prefix - The Jira project prefix (e.g., "M3-", "PROJ-"). Case-insensitive.
 * @returns An array of unique Jira IDs found, in the order they first appear.
 */
export function extractJiraIds(text: string, prefix: string): string[] {
  if (!text.trim() || !prefix.trim()) {
    return [];
  }

  // Escape special regex characters in the prefix
  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Match the prefix followed by one or more digits
  const pattern = new RegExp(`${escapedPrefix}\\d+`, 'gi');
  const matches = text.match(pattern);

  if (!matches) {
    return [];
  }

  // Deduplicate while preserving order, normalize to uppercase
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const match of matches) {
    const normalized = match.toUpperCase();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      unique.push(normalized);
    }
  }

  return unique;
}
