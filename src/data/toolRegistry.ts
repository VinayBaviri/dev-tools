export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  path: string;
  category: ToolCategory;
  keywords: string[];
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  tools: ToolDefinition[];
}

function createCategory(id: string, name: string, icon: string): ToolCategory {
  return { id, name, icon, tools: [] };
}

function addTool(
  category: ToolCategory,
  id: string,
  name: string,
  description: string,
  path: string,
  keywords: string[],
): ToolDefinition {
  const tool: ToolDefinition = { id, name, description, path, category, keywords };
  category.tools.push(tool);
  return tool;
}

// --- URL Tools ---
const urlCategory = createCategory('url', 'URL Tools', '🔗');
addTool(urlCategory, 'url-encode', 'URL Encoder', 'Percent-encode a string for safe use in URLs', '/url/encode', ['url', 'encode', 'percent', 'encodeURIComponent', 'query string']);
addTool(urlCategory, 'url-decode', 'URL Decoder', 'Decode a percent-encoded URL string back to plain text', '/url/decode', ['url', 'decode', 'percent', 'decodeURIComponent', 'query string']);
addTool(urlCategory, 'url-parse', 'URL Parser', 'Parse a URL into its components: protocol, host, port, path, query, and fragment', '/url/parse', ['url', 'parse', 'protocol', 'host', 'port', 'path', 'query', 'fragment']);

// --- HTML Tools ---
const htmlCategory = createCategory('html', 'HTML Tools', '📄');
addTool(htmlCategory, 'html-encode', 'HTML Encoder', 'Convert special characters to HTML entities', '/html/encode', ['html', 'encode', 'entities', 'escape', 'special characters']);
addTool(htmlCategory, 'html-decode', 'HTML Decoder', 'Convert HTML entities back to their original characters', '/html/decode', ['html', 'decode', 'entities', 'unescape']);
addTool(htmlCategory, 'html-preview', 'HTML Previewer', 'Render HTML markup in a live sandboxed preview', '/html/preview', ['html', 'preview', 'render', 'live']);
addTool(htmlCategory, 'html-minify', 'HTML Minifier', 'Remove unnecessary whitespace from HTML markup', '/html/minify', ['html', 'minify', 'compress', 'whitespace']);
addTool(htmlCategory, 'html-prettify', 'HTML Prettifier', 'Format HTML markup with consistent indentation and line breaks', '/html/prettify', ['html', 'prettify', 'format', 'indent', 'beautify']);

// --- Markdown Tools ---
const markdownCategory = createCategory('markdown', 'Markdown Tools', '📝');
addTool(markdownCategory, 'markdown-preview', 'Markdown Previewer', 'Render Markdown text as styled HTML in a live preview', '/markdown/preview', ['markdown', 'preview', 'render', 'commonmark']);
addTool(markdownCategory, 'markdown-from-html', 'HTML to Markdown', 'Convert HTML content into equivalent Markdown text', '/markdown/from-html', ['markdown', 'html', 'convert', 'transform']);

// --- JavaScript Tools ---
const jsCategory = createCategory('js', 'JavaScript Tools', '⚡');
addTool(jsCategory, 'js-format', 'JS Formatter', 'Prettify JavaScript code with consistent indentation and spacing', '/js/format', ['javascript', 'js', 'format', 'prettify', 'indent', 'beautify']);
addTool(jsCategory, 'js-minify', 'JS Minifier', 'Minify JavaScript code by removing whitespace and comments', '/js/minify', ['javascript', 'js', 'minify', 'compress', 'uglify']);

// --- JSON Tools ---
const jsonCategory = createCategory('json', 'JSON Tools', '{}');
addTool(jsonCategory, 'json-format', 'JSON Formatter', 'Format and prettify JSON with syntax highlighting', '/json/format', ['json', 'format', 'prettify', 'indent', 'beautify']);
addTool(jsonCategory, 'json-validate', 'JSON Validator', 'Validate JSON syntax and report errors with location details', '/json/validate', ['json', 'validate', 'lint', 'check', 'syntax']);
addTool(jsonCategory, 'json-minify', 'JSON Minifier', 'Compact JSON by removing all unnecessary whitespace', '/json/minify', ['json', 'minify', 'compress', 'compact']);
addTool(jsonCategory, 'json-to-csv', 'JSON to CSV', 'Convert a JSON array of objects into CSV format', '/json/to-csv', ['json', 'csv', 'convert', 'export', 'table']);
addTool(jsonCategory, 'json-tree', 'JSON Tree Viewer', 'Display JSON as an interactive collapsible tree structure', '/json/tree', ['json', 'tree', 'viewer', 'explore', 'collapsible']);

// --- Database Tools ---
const dbCategory = createCategory('db', 'Database Tools', '🗄️');
addTool(dbCategory, 'db-sql-format', 'SQL Formatter', 'Format SQL queries with consistent indentation and keyword capitalization', '/db/sql-format', ['sql', 'format', 'prettify', 'query', 'database']);
addTool(dbCategory, 'db-mock-data', 'Mock Data Generator', 'Generate realistic mock data rows matching a table schema', '/db/mock-data', ['mock', 'data', 'generate', 'fake', 'seed', 'database', 'table']);

// --- Randomizer Tools ---
const randomCategory = createCategory('random', 'Randomizer Tools', '🎲');
addTool(randomCategory, 'random-uuid', 'UUID Generator', 'Generate RFC 4122 version 4 UUIDs', '/random/uuid', ['uuid', 'guid', 'random', 'generate', 'unique']);
addTool(randomCategory, 'random-password', 'Password Generator', 'Generate random passwords with configurable character types and length', '/random/password', ['password', 'random', 'generate', 'secure', 'credentials']);
addTool(randomCategory, 'random-number', 'Random Number Generator', 'Generate a random integer within a specified range', '/random/number', ['random', 'number', 'integer', 'range', 'generate']);
addTool(randomCategory, 'random-lorem', 'Lorem Ipsum Generator', 'Generate placeholder text in paragraphs, sentences, or words', '/random/lorem', ['lorem', 'ipsum', 'placeholder', 'text', 'generate']);

// --- Base64 Tools ---
const base64Category = createCategory('base64', 'Base64 Tools', '🔐');
addTool(base64Category, 'base64-encode', 'Base64 Encoder', 'Encode plain text to Base64 representation', '/base64/encode', ['base64', 'encode', 'convert', 'text']);
addTool(base64Category, 'base64-decode', 'Base64 Decoder', 'Decode a Base64 string back to plain text', '/base64/decode', ['base64', 'decode', 'convert', 'text']);
addTool(base64Category, 'base64-file', 'Base64 File Encoder', 'Encode a file to Base64 and display the encoded size', '/base64/file', ['base64', 'file', 'encode', 'upload', 'binary']);

// --- Exported registry ---
// --- Utility Tools ---
const utilityCategory = createCategory('utility', 'Utility Tools', '🛠️');
addTool(utilityCategory, 'jira-id-extractor', 'Jira ID Extractor', 'Extract Jira issue IDs from commit messages based on a project prefix', '/utility/jira-ids', ['jira', 'extract', 'commit', 'issue', 'id', 'ticket']);

// --- Exported registry ---
export const toolCategories: ToolCategory[] = [
  base64Category,
  dbCategory,
  htmlCategory,
  jsCategory,
  jsonCategory,
  markdownCategory,
  randomCategory,
  urlCategory,
  utilityCategory,
];

/** Returns a flat array of all tool definitions across every category. */
export function getAllTools(): ToolDefinition[] {
  return toolCategories.flatMap((category) => category.tools);
}

/** Returns the total number of tools in the registry. */
export function getToolCount(): number {
  return getAllTools().length;
}
