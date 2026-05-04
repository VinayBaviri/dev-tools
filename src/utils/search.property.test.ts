// Feature: dev-toolbox, Property 16: Search filter completeness and correctness
// **Validates: Requirements 1.5**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { filterTools } from '../utils/search';
import { toolCategories, getAllTools } from '../data/toolRegistry';

/**
 * Helper: checks whether a tool matches a query by case-insensitive substring
 * against its name, description, or any keyword.
 */
function toolMatchesQuery(
  tool: { name: string; description: string; keywords: string[] },
  query: string,
): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return (
    tool.name.toLowerCase().includes(q) ||
    tool.description.toLowerCase().includes(q) ||
    tool.keywords.some((kw) => kw.toLowerCase().includes(q))
  );
}

describe('Property 16: Search filter completeness and correctness', () => {
  it('for any query, filtered results include every matching tool and exclude every non-matching tool', () => {
    fc.assert(
      fc.property(fc.string(), (query) => {
        const filtered = filterTools(toolCategories, query);
        const filteredToolIds = new Set(
          filtered.flatMap((cat) => cat.tools.map((t) => t.id)),
        );

        const allTools = getAllTools();
        const normalizedQuery = query.toLowerCase().trim();

        for (const tool of allTools) {
          const shouldMatch = toolMatchesQuery(tool, query);

          if (shouldMatch) {
            // Completeness: every matching tool must appear in filtered results
            expect(filteredToolIds.has(tool.id)).toBe(true);
          } else {
            // Correctness: every non-matching tool must be excluded
            expect(filteredToolIds.has(tool.id)).toBe(false);
          }
        }

        // Empty/whitespace query returns all tools
        if (!normalizedQuery) {
          expect(filteredToolIds.size).toBe(allTools.length);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('filtered results only contain tools that actually match the query', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (query) => {
          const filtered = filterTools(toolCategories, query);
          const normalizedQuery = query.toLowerCase().trim();

          // Every tool in the filtered output must match the query
          for (const category of filtered) {
            for (const tool of category.tools) {
              if (normalizedQuery) {
                expect(toolMatchesQuery(tool, query)).toBe(true);
              }
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('filtered categories preserve correct category-tool associations', () => {
    fc.assert(
      fc.property(fc.string(), (query) => {
        const filtered = filterTools(toolCategories, query);

        for (const filteredCat of filtered) {
          // Find the original category
          const originalCat = toolCategories.find((c) => c.id === filteredCat.id);
          expect(originalCat).toBeDefined();

          // Every tool in the filtered category must exist in the original category
          for (const tool of filteredCat.tools) {
            const originalTool = originalCat!.tools.find((t) => t.id === tool.id);
            expect(originalTool).toBeDefined();
          }

          // Filtered category must have at least one tool
          expect(filteredCat.tools.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 },
    );
  });
});
