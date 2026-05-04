import type { ToolCategory } from '../data/toolRegistry';

/**
 * Filters tool categories by matching a search query against each tool's
 * name, description, and keywords. Matching is case-insensitive substring.
 *
 * Returns only categories that contain at least one matching tool,
 * with non-matching tools removed from each category.
 * An empty or whitespace-only query returns all categories unchanged.
 */
export function filterTools(
  categories: ToolCategory[],
  query: string,
): ToolCategory[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return categories;
  }

  return categories
    .map((category) => {
      const matchingTools = category.tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(normalizedQuery) ||
          tool.description.toLowerCase().includes(normalizedQuery) ||
          tool.keywords.some((kw) =>
            kw.toLowerCase().includes(normalizedQuery),
          ),
      );
      return { ...category, tools: matchingTools };
    })
    .filter((category) => category.tools.length > 0);
}
