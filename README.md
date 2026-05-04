# Dev Toolbox

A clean, fast, and private collection of developer utilities. No ads, no tracking, no sign-ups — just tools that work.

**Live:** [https://vinaybaviri.github.io/dev-tools/](https://vinaybaviri.github.io/dev-tools/)

## Why?

Every developer has been there — you need to quickly encode a URL, format some JSON, or generate a UUID, and you end up on a random website cluttered with ads, cookie banners, and tracking scripts. Dev Toolbox exists because daily development work deserves better.

## Features

- **27 developer tools** across 9 categories
- **Zero ads, zero tracking** — no analytics, no cookies, no data collection
- **Fully client-side** — all processing happens in your browser, nothing is sent to a server
- **Light & dark themes** with system preference detection
- **Responsive** — works on desktop, tablet, and mobile
- **Instant results** — real-time processing as you type

## Tools

| Category | Tools |
|----------|-------|
| URL | Encoder, Decoder, Parser |
| HTML | Encoder, Decoder, Previewer, Minifier, Prettifier |
| Markdown | Previewer, HTML to Markdown |
| JavaScript | Formatter, Minifier |
| JSON | Formatter, Validator, Minifier, JSON to CSV, Tree Viewer |
| Database | SQL Formatter, Mock Data Generator |
| Randomizers | UUID Generator, Password Generator, Random Number, Lorem Ipsum |
| Base64 | Encoder, Decoder, File Encoder |
| Utility | Jira ID Extractor |

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for bundling
- **React Router** (HashRouter) for client-side routing
- **CSS Modules** + CSS custom properties for theming
- **Vitest** + **fast-check** for unit and property-based testing
- Deployed on **GitHub Pages** via GitHub Actions

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## Testing

The project uses a dual testing approach:

- **Unit tests** — specific examples, edge cases, and UI behavior
- **Property-based tests** — universal correctness properties validated across random inputs (17 properties, 100+ iterations each)

```bash
# Run all tests
npm run test

# Run in watch mode
npm run test:watch
```

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via the included GitHub Actions workflow.

## License

MIT

---

Crafted by **Hari BVSP** © 2026
