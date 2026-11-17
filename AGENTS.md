# Repository Guidelines

## Project Structure & Module Organization

The extension runtime lives at the repository root. `manifest.json` defines Manifest V3 permissions and entry points. `content.js` extracts and sanitizes X Article content; keep article container selectors in `ARTICLE_SELECTORS`. `popup.html`, `popup.js`, and `popup.css` implement URL entry and extraction controls. `print.html`, `print.js`, and `print.css` render the printable document. Installation and usage instructions are in `README.md`; release notes are in `RELEASE_NOTES.md`. `scripts/package.py` creates release ZIPs in `dist/`. Runtime icons are in `icons/`; store artwork and design sources are in `docs/store/` and `docs/design/`. There is no dedicated test directory.

## Build, Test, and Development Commands

No dependency installation or build step is required.

- Load the repository root through **Load unpacked** at `chrome://extensions` with Developer mode enabled.
- After editing, reload the extension and refresh the article tab to test updated content scripts.
- `node --check content.js` checks JavaScript syntax; repeat for `popup.js` and `print.js` when Node.js is available.
- `python -m json.tool manifest.json` validates manifest JSON syntax.

## Coding Style & Naming Conventions

Follow existing plain JavaScript, HTML, and CSS conventions: two-space indentation, semicolons, double-quoted JavaScript strings, and `const` unless reassignment is needed. Use camelCase for functions and variables, uppercase snake_case for constants, and descriptive lowercase filenames. Keep scripts separate from HTML. No formatter or linter is configured; preserve surrounding formatting and avoid adding dependencies without a clear need.

## Testing Guidelines

No automated framework or coverage threshold exists. Manually test a fully loaded X Article, invalid URLs, incomplete content, and a tab opened before extension installation. Verify headings, emphasis, links, lists, quotations, and code in the preview. Save a PDF using Letter paper, 100% scale, and disabled browser headers/footers; inspect the two-column layout and 9 pt body text.

## Commit & Pull Request Guidelines

Git history is unavailable in this checkout, so no established commit convention can be confirmed. Use concise imperative subjects, such as `Fix article selector fallback`. PRs should describe the change, link relevant issues, record manual checks, and include preview or PDF screenshots for layout changes. Update the manifest version and README changelog for releases.

## Privacy & Configuration

Preserve local-only processing and temporary storage cleanup. Keep permissions narrowly scoped, escape extracted text, and retain HTTP/HTTPS link filtering before rendering article HTML.
