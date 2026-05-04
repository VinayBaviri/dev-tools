import { describe, it, expect } from 'vitest';
import {
  toolCategories,
  getAllTools,
  getToolCount,
} from './toolRegistry';
import type { ToolDefinition } from './toolRegistry';

describe('toolRegistry', () => {
  it('exports exactly 9 categories', () => {
    expect(toolCategories).toHaveLength(9);
  });

  it('contains exactly 29 tools across all categories', () => {
    expect(getToolCount()).toBe(29);
    expect(getAllTools()).toHaveLength(29);
  });

  it('each category has an id, name, icon, and at least one tool', () => {
    for (const category of toolCategories) {
      expect(category.id).toBeTruthy();
      expect(category.name).toBeTruthy();
      expect(category.icon).toBeTruthy();
      expect(category.tools.length).toBeGreaterThan(0);
    }
  });

  it('each tool has required fields populated', () => {
    for (const tool of getAllTools()) {
      expect(tool.id).toBeTruthy();
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.path).toBeTruthy();
      expect(tool.icon).toBeTruthy();
      expect(tool.category).toBeDefined();
      expect(tool.keywords.length).toBeGreaterThan(0);
    }
  });

  it('every tool path starts with /', () => {
    for (const tool of getAllTools()) {
      expect(tool.path).toMatch(/^\//);
    }
  });

  it('all tool ids are unique', () => {
    const ids = getAllTools().map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all tool paths are unique', () => {
    const paths = getAllTools().map((t) => t.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('each tool references its parent category correctly', () => {
    for (const category of toolCategories) {
      for (const tool of category.tools) {
        expect(tool.category).toBe(category);
      }
    }
  });

  it('has the expected category names in order', () => {
    const names = toolCategories.map((c) => c.name);
    expect(names).toEqual([
      'Base64 Tools',
      'Database Tools',
      'HTML Tools',
      'JavaScript Tools',
      'JSON Tools',
      'Markdown Tools',
      'Randomizer Tools',
      'URL Tools',
      'Utility Tools',
    ]);
  });

  it('has the expected tool counts per category', () => {
    const counts: Record<string, number> = {};
    for (const category of toolCategories) {
      counts[category.id] = category.tools.length;
    }
    expect(counts).toEqual({
      base64: 3,
      db: 2,
      html: 5,
      js: 2,
      json: 7,
      markdown: 2,
      random: 4,
      url: 3,
      utility: 1,
    });
  });

  it('getAllTools returns the same tools as iterating categories', () => {
    const fromCategories: ToolDefinition[] = [];
    for (const category of toolCategories) {
      fromCategories.push(...category.tools);
    }
    expect(getAllTools()).toEqual(fromCategories);
  });
});
