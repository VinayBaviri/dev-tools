# Implementation Plan: Dev Toolbox

## Overview

Build a React 18 + TypeScript SPA with Vite that provides 27 developer utility tools across 8 categories. The implementation proceeds bottom-up: project scaffolding → shared infrastructure (theme, clipboard, layout) → pure utility modules with property tests → tool page components → home page and search → responsive polish. Each task builds on the previous, ensuring no orphaned code.

## Tasks

- [x] 1. Scaffold project and configure tooling
  - Initialize a Vite + React + TypeScript project
  - Install dependencies: `react-router-dom`, `marked`, `sql-formatter`, `prettier` (standalone browser build), `vitest`, `fast-check`, `@testing-library/react`, `@testing-library/jest-dom`
  - Configure Vitest in `vite.config.ts` with `test` block
  - Set up CSS custom properties for light/dark themes in `src/styles/variables.css`
  - Create base `src/styles/global.css` with reset, typography, and spacing tokens
  - Configure `HashRouter` in `src/main.tsx`
  - _Requirements: 3.1, 3.3, 3.4, 2.7_

- [x] 2. Implement tool registry and theme system
  - [x] 2.1 Create the tool registry data module
    - Create `src/data/toolRegistry.ts` with `ToolDefinition` and `ToolCategory` interfaces
    - Populate all 27 tools across 8 categories with id, name, description, path, and keywords
    - Export a helper to compute total tool count
    - _Requirements: 1.2, 13.1, 13.3_

  - [x] 2.2 Implement ThemeProvider context and persistence
    - Create `src/contexts/ThemeContext.tsx` with `Theme` type, `ThemeContextValue` interface
    - Read from `localStorage` key `dev-toolbox-theme` on mount
    - Fall back to `prefers-color-scheme` media query when no stored preference
    - Set `data-theme` attribute on `<html>` element
    - Persist on toggle to `localStorage`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 2.3 Write unit tests for ThemeProvider
    - Test localStorage read/write
    - Test fallback to prefers-color-scheme
    - Test toggle behavior
    - _Requirements: 2.1, 2.3, 2.4, 2.5_

- [x] 3. Implement shared UI components
  - [x] 3.1 Create clipboard service
    - Create `src/services/clipboard.ts` with `copyToClipboard` and `readFromClipboard` functions
    - Handle Clipboard API permission errors gracefully
    - _Requirements: 4.3, 4.8_

  - [x] 3.2 Create InputArea component
    - Create `src/components/InputArea.tsx` with textarea, Paste, and Clear buttons
    - Wire Paste button to clipboard service `readFromClipboard`
    - Wire Clear button to reset input value
    - Use CSS Modules for scoped styling
    - _Requirements: 4.5, 4.7, 4.8_

  - [x] 3.3 Create OutputArea component
    - Create `src/components/OutputArea.tsx` with output display and Copy button
    - Show error message when `error` prop is set
    - Show 2-second copy confirmation on successful copy
    - Use CSS Modules for scoped styling
    - _Requirements: 4.2, 4.3, 4.4, 4.6_

  - [x] 3.4 Create ToolPageLayout component
    - Create `src/components/ToolPageLayout.tsx` with title, description, and children slot
    - Apply consistent spacing and typography
    - _Requirements: 2.7, 4.1_

  - [x] 3.5 Write unit tests for InputArea, OutputArea, and ToolPageLayout
    - Test paste and clear button interactions
    - Test copy confirmation timing
    - Test error display in OutputArea
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

- [x] 4. Implement Navigation Sidebar and Search
  - [x] 4.1 Create Sidebar component
    - Create `src/components/Sidebar.tsx` with collapsible category groups
    - Render tool links from the tool registry
    - Highlight active tool via React Router's `NavLink`
    - Use CSS Modules; support `isOpen` prop for mobile toggle
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 4.2 Create SearchBar component and search filtering logic
    - Create `src/components/SearchBar.tsx` at the top of the Sidebar
    - Implement case-insensitive substring matching against tool name, description, and keywords
    - Filter visible tools in the Sidebar based on query
    - _Requirements: 1.4, 1.5_

  - [x] 4.3 Write property test for search filter completeness
    - **Property 16: Search filter completeness and correctness**
    - **Validates: Requirements 1.5**

  - [x] 4.4 Write unit tests for Sidebar and SearchBar
    - Test category rendering and tool link navigation
    - Test search filtering with various queries
    - _Requirements: 1.2, 1.4, 1.5_

- [x] 5. Implement App Shell with routing and responsive layout
  - [x] 5.1 Create App shell component with layout
    - Create `src/App.tsx` composing ThemeProvider, HashRouter, Sidebar, and `<Outlet />`
    - Define all 27 routes plus the home route in route configuration
    - Implement hamburger menu toggle for viewports below 768px
    - _Requirements: 1.1, 1.3, 1.6, 1.7, 3.4_

  - [x] 5.2 Write unit tests for App shell routing
    - Test navigation between routes without full page reload
    - Test responsive sidebar collapse behavior
    - _Requirements: 1.3, 1.6, 1.7_

- [x] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement URL utility functions and tool pages
  - [x] 7.1 Implement URL utility functions
    - Create `src/utils/url.ts` with `urlEncode`, `urlDecode`, and `parseURL` functions
    - Use `encodeURIComponent` / `decodeURIComponent` for encode/decode
    - Use the `URL` constructor for parsing; throw descriptive errors on malformed URLs
    - _Requirements: 5.1, 5.2, 5.4, 5.5_

  - [x] 7.2 Write property tests for URL utilities
    - **Property 1: URL encode/decode round-trip** — `urlDecode(urlEncode(s)) === s`
    - **Validates: Requirements 5.1, 5.2, 5.3**
    - **Property 2: URL parsing extracts correct components**
    - **Validates: Requirements 5.4**

  - [x] 7.3 Create URL Encoder, Decoder, and Parser tool pages
    - Create `src/pages/url/URLEncoderPage.tsx`, `URLDecoderPage.tsx`, `URLParserPage.tsx`
    - Each page uses ToolPageLayout, InputArea, OutputArea
    - URL Parser displays parsed components (protocol, host, port, path, query params, fragment)
    - Process input in real-time on change
    - _Requirements: 5.1, 5.2, 5.4, 5.5, 4.1_

  - [x] 7.4 Write unit tests for URL utility functions
    - Test specific encoding/decoding examples and edge cases
    - Test URL parsing with various URL formats
    - Test error handling for malformed URLs
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 8. Implement HTML utility functions and tool pages
  - [x] 8.1 Implement HTML utility functions
    - Create `src/utils/html.ts` with `htmlEncode`, `htmlDecode`, `htmlMinify`, `htmlPrettify`
    - Use native `DOMParser` and `XMLSerializer` for minify/prettify
    - Encode special characters: `&`, `<`, `>`, `"`, `'`
    - _Requirements: 6.1, 6.2, 6.5, 6.6_

  - [x] 8.2 Write property tests for HTML utilities
    - **Property 3: HTML encode/decode round-trip** — `htmlDecode(htmlEncode(s)) === s`
    - **Validates: Requirements 6.1, 6.2, 6.3**
    - **Property 4: HTML minify/prettify semantic equivalence**
    - **Validates: Requirements 6.5, 6.6, 6.7**

  - [x] 8.3 Create HTML tool pages
    - Create `src/pages/html/HTMLEncoderPage.tsx`, `HTMLDecoderPage.tsx`, `HTMLPreviewerPage.tsx`, `HTMLMinifierPage.tsx`, `HTMLPrettifierPage.tsx`
    - HTML Previewer renders markup in a sandboxed iframe
    - Process input in real-time on change
    - _Requirements: 6.1, 6.2, 6.4, 6.5, 6.6, 4.1_

  - [x] 8.4 Write unit tests for HTML utility functions
    - Test encoding/decoding of special characters
    - Test minify/prettify with various HTML structures
    - Test error handling for malformed HTML
    - _Requirements: 6.1, 6.2, 6.3, 6.5, 6.6, 6.7_

- [x] 9. Implement Markdown utility functions and tool pages
  - [x] 9.1 Implement Markdown utility functions
    - Create `src/utils/markdown.ts` with `markdownToHTML` (using `marked`) and `htmlToMarkdown`
    - Configure `marked` for CommonMark compliance
    - Implement `htmlToMarkdown` with basic element conversion (headings, paragraphs, lists, links, bold, italic, blockquotes, code blocks)
    - _Requirements: 7.1, 7.2, 7.4_

  - [x] 9.2 Write property tests for Markdown utilities
    - **Property 5: Markdown to HTML produces valid HTML**
    - **Validates: Requirements 7.1**
    - **Property 6: HTML to Markdown content preservation**
    - **Validates: Requirements 7.4**

  - [x] 9.3 Create Markdown tool pages
    - Create `src/pages/markdown/MarkdownPreviewerPage.tsx` and `HTMLToMarkdownPage.tsx`
    - Markdown Previewer updates preview within 300ms of last keystroke (debounce)
    - Render preview in a styled area with proper Markdown CSS
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 4.1_

  - [x] 9.4 Write unit tests for Markdown utility functions
    - Test CommonMark elements: headings, lists, links, images, code blocks, bold, italic, blockquotes
    - Test HTML to Markdown conversion for basic elements
    - _Requirements: 7.1, 7.2, 7.4_

- [ ] 10. Implement JavaScript utility functions and tool pages
  - [x] 10.1 Implement JavaScript utility functions
    - Create `src/utils/javascript.ts` with async `formatJS` and `minifyJS` using Prettier standalone browser build
    - Throw descriptive errors with syntax error location on invalid JS
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 10.2 Create JavaScript tool pages
    - Create `src/pages/js/JSFormatterPage.tsx` and `JSMinifierPage.tsx`
    - Display syntax error location in error messages
    - Process input in real-time on change
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 4.1_

  - [x] 10.3 Write unit tests for JavaScript utility functions
    - Test formatting and minification with valid JS
    - Test error messages for syntactically invalid JS
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Implement JSON utility functions and tool pages
  - [x] 12.1 Implement JSON utility functions
    - Create `src/utils/json.ts` with `jsonParse`, `jsonStringify`, `jsonMinify`, `jsonFormat`, `jsonValidate`, `jsonToCSV`
    - Use native `JSON.parse` / `JSON.stringify`
    - `jsonValidate` returns `{ valid, error }` with error location and description
    - `jsonToCSV` handles arrays of flat objects, producing header row + data rows
    - _Requirements: 9.1, 9.2, 9.4, 9.5, 9.6, 9.7, 9.9_

  - [x] 12.2 Write property tests for JSON utilities
    - **Property 7: JSON parse/stringify round-trip**
    - **Validates: Requirements 9.1, 9.2, 9.3**
    - **Property 8: JSON minify/format semantic equivalence**
    - **Validates: Requirements 9.7, 9.8**
    - **Property 9: JSON validation correctness**
    - **Validates: Requirements 9.5**
    - **Property 10: JSON to CSV structural correctness**
    - **Validates: Requirements 9.9**

  - [x] 12.3 Create JSON tool pages
    - Create `src/pages/json/JSONFormatterPage.tsx`, `JSONValidatorPage.tsx`, `JSONMinifierPage.tsx`, `JSONToCSVPage.tsx`, `JSONTreeViewerPage.tsx`
    - JSON Formatter displays prettified JSON with syntax highlighting
    - JSON Tree Viewer renders an interactive collapsible tree
    - JSON Validator shows error location and description for invalid input
    - Process input in real-time on change
    - _Requirements: 9.4, 9.5, 9.6, 9.7, 9.9, 9.10, 4.1_

  - [x] 12.4 Write unit tests for JSON utility functions
    - Test formatting, minification, validation with specific examples
    - Test CSV conversion with various object shapes
    - Test error messages for invalid JSON
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_

- [x] 13. Implement Database utility functions and tool pages
  - [x] 13.1 Implement SQL formatter and mock data generator
    - Create `src/utils/sql.ts` with `formatSQL` using `sql-formatter` library
    - Create `src/utils/mockdata.ts` with `generateMockData` function
    - Support column types: string, integer, float, boolean, date, email, uuid
    - Support output formats: JSON and CSV
    - Validate row count between 1 and 1000
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 13.2 Write property test for mock data generation
    - **Property 11: Mock data generation matches schema**
    - **Validates: Requirements 10.3**

  - [x] 13.3 Create Database tool pages
    - Create `src/pages/db/SQLFormatterPage.tsx` and `MockDataGeneratorPage.tsx`
    - SQL Formatter shows error message for malformed SQL
    - Mock Data Generator provides UI for defining columns (name + type), row count, and output format
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 4.1_

  - [x] 13.4 Write unit tests for SQL formatter and mock data generator
    - Test SQL formatting with various query types
    - Test mock data generation with different schemas
    - Test error handling for malformed SQL
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 14. Implement Randomizer utility functions and tool pages
  - [x] 14.1 Implement randomizer utility functions
    - Create `src/utils/random.ts` with `generateUUIDs`, `generatePassword`, `randomInteger`, `generateLoremIpsum`
    - Use `crypto.randomUUID()` for UUID generation
    - Password generator defaults to length 16 with all character types enabled
    - UUID generator supports 1–100 UUIDs per operation
    - Lorem Ipsum supports paragraphs, sentences, or words
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [x] 14.2 Write property tests for randomizer utilities
    - **Property 12: UUID v4 format compliance**
    - **Validates: Requirements 11.1**
    - **Property 13: Password generation meets criteria**
    - **Validates: Requirements 11.3**
    - **Property 14: Random number within range**
    - **Validates: Requirements 11.5**
    - **Property 17: Lorem Ipsum generates correct quantity**
    - **Validates: Requirements 11.6**

  - [x] 14.3 Create Randomizer tool pages
    - Create `src/pages/random/UUIDGeneratorPage.tsx`, `PasswordGeneratorPage.tsx`, `RandomNumberPage.tsx`, `LoremIpsumPage.tsx`
    - UUID page allows specifying count (1–100)
    - Password page provides checkboxes for character types and length input, defaults to 16 with all types
    - Random Number page provides min/max inputs
    - Lorem Ipsum page provides quantity input and unit selector (paragraphs/sentences/words)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 4.1_

  - [x] 14.4 Write unit tests for randomizer utility functions
    - Test UUID format with specific examples
    - Test password generation edge cases
    - Test random number boundary conditions
    - Test Lorem Ipsum output structure
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [x] 15. Implement Base64 utility functions and tool pages
  - [x] 15.1 Implement Base64 utility functions
    - Create `src/utils/base64.ts` with `base64Encode`, `base64Decode`, `base64EncodeFile`, `getEncodedSize`
    - Throw descriptive error for invalid Base64 input
    - `base64EncodeFile` accepts `ArrayBuffer` and returns Base64 string
    - `getEncodedSize` returns byte count of encoded string
    - _Requirements: 12.1, 12.2, 12.4, 12.5, 12.6_

  - [x] 15.2 Write property test for Base64 utilities
    - **Property 15: Base64 encode/decode round-trip** — `base64Decode(base64Encode(s)) === s`
    - **Validates: Requirements 12.1, 12.2, 12.3**

  - [x] 15.3 Create Base64 tool pages
    - Create `src/pages/base64/Base64EncoderPage.tsx`, `Base64DecoderPage.tsx`, `Base64FilePage.tsx`
    - Base64 Decoder shows error for invalid Base64 input
    - Base64 File Encoder provides file upload input and displays encoded output size in bytes
    - Process input in real-time on change
    - _Requirements: 12.1, 12.2, 12.4, 12.5, 12.6, 4.1_

  - [x] 15.4 Write unit tests for Base64 utility functions
    - Test encoding/decoding with specific examples
    - Test error handling for invalid Base64
    - Test file encoding and size calculation
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [x] 16. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 17. Implement Home Page
  - [x] 17.1 Create Home Page component
    - Create `src/pages/HomePage.tsx` displaying all tool categories as a card grid
    - Each card shows tool name and brief description
    - Display total tool count derived from the tool registry
    - Cards link to corresponding tool pages via React Router
    - Responsive grid layout adapting to viewport width
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [x] 17.2 Write unit tests for Home Page
    - Test that all tools are rendered as cards
    - Test card click navigation
    - Test total tool count display
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [x] 18. Responsive layout and final polish
  - [x] 18.1 Implement responsive breakpoints and mobile layout
    - Ensure layout renders correctly from 320px to 2560px
    - Sidebar collapses to hamburger menu below 768px
    - Tool pages stack input/output vertically on narrow viewports
    - Test across breakpoints
    - _Requirements: 1.6, 1.7_

  - [x] 18.2 Verify zero ads, tracking, and promotional content
    - Audit the build output for any third-party tracking scripts
    - Ensure no advertisements or promotional banners exist in any component
    - _Requirements: 2.6_

- [x] 19. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate the 17 universal correctness properties defined in the design
- Unit tests validate specific examples, edge cases, and UI behavior
- All tool logic lives in pure function modules (`src/utils/`) separate from UI components
- The tool registry is the single source of truth for sidebar, home page, and search
