# X to PDF

Save an X Article as a clean, easy-to-read PDF for offline reading or printing.

Repository: [ssojoodi/x-to-pdf](https://github.com/ssojoodi/x-to-pdf).

Get a compact two-column layout with the article's headings, emphasis, links, quotations, lists, and code preserved. Your article stays on your computer—no uploads or tracking.

## Install

1. Download the release package, `x-to-pdf-v1.0.1.zip`. In this checkout it is in `dist/`.
2. Extract it into a permanent folder.
3. Open `chrome://extensions` and enable **Developer mode**.
4. Click **Load unpacked** and select the extracted `x-to-pdf` folder containing `manifest.json`.

Keep the extracted folder after installation. Choose the release ZIP rather than GitHub's **Source code** downloads.

## Save an article as a PDF

1. Open an X long-form Article and wait for it to finish loading.
2. Click the extension, then **Create PDF**.
3. Review the preview and click **Print / Save PDF**.
4. Choose **Save to PDF** in Chrome's print dialog.

For the intended layout, choose **Letter** paper, **100%** scale, and turn off browser headers and footers. The PDF uses two columns and 9 pt Times New Roman text.

You can also paste an X Article's status URL into the extension and click **Open**. Once the article loads, open the extension on that tab to create the PDF.

## Update

Download and extract the new release, replace the files in your installed extension folder, then click **Reload** for X to PDF at `chrome://extensions`. Updates are manual.

## Privacy

The extension reads the active X/Twitter page when you click **Create PDF**. It does not upload article text or make network requests. Article data is held briefly in local extension storage and deleted when the preview loads.

## How it works

X to PDF is a dependency-free Manifest V3 Chrome extension. It extracts the article, builds a local print preview, and uses Chrome's native print dialog to save the PDF. No server or compilation step is required.

## Development

Clone this repository and load its root folder through **Load unpacked** at `chrome://extensions`. No dependency installation or compilation is required. After changes, reload the extension and refresh the article tab.

Check JavaScript syntax with `node --check content.js`, `node --check popup.js`, and `node --check print.js`. Manually verify extraction and the printed PDF before releasing.

## Project layout

- Root HTML, CSS, JavaScript, `manifest.json`, and `icons/`: installable extension.
- `scripts/package.py`: dependency-free release packager.
- `dist/`: generated release ZIPs.
- `web-page/`: standalone product website, including its downloadable release ZIP.
- `docs/store/` and `docs/design/`: store artwork and design sources.
- `RELEASE_NOTES.md`: release history and local installation instructions.

## Packaging & Releases

Run the packaging script with Python 3:

```bash
python3 scripts/package.py
```

The script reads the version from `manifest.json` and creates `dist/x-to-pdf-v<version>.zip`. Only runtime files, the README, and the MIT license are included, inside an installable `x-to-pdf/` folder. Generated packages are ignored by Git.

Preserve any ZIP already submitted to the Chrome Web Store. Repackaging after source or documentation changes can change its contents even when the version is unchanged; use a new version for the next release.

For a release, update the manifest version, README changelog, and `RELEASE_NOTES.md`; commit and push the source, then package it. Publish the matching tag and attach the ZIP with GitHub CLI (example for version 1.0.1):

```bash
gh release create v1.0.1 dist/x-to-pdf-v1.0.1.zip --title "X to PDF v1.0.1" --notes-file RELEASE_NOTES.md
```

Use the uploaded ZIP as the installation download; GitHub's automatically generated source archives contain the development repository.

## Maintenance

X's four known long-form container selectors are intentionally isolated at the top of `content.js`. If X changes its DOM, update that short list first.

## Changelog

- **1.0.1** - Inject the article reader on demand when an X tab predates extension installation; no manual reload required.

## License

MIT License. See [LICENSE](LICENSE).

## Website deployment

`web-page/` contains the complete static website: home page, release notes, CSS, images, and the release ZIP. All required files use relative links; no build step, external fonts, or JavaScript is needed.

Copy its contents into the server directory served as `https://sojoodi.com/apps/XtoPDF/`:

```bash
scp -r web-page/. user@sojoodi.com:/your/webroot/apps/XtoPDF/
```

Replace the SSH user and webroot with your server details; create the destination directory first if needed. The existing `/apps/` catalog is maintained separately.

For future releases, copy the approved ZIP into `web-page/downloads/`, update the download links and version text in both HTML pages, and update the release notes. The website ZIP is deliberately tracked so a fresh clone includes everything needed for deployment. The current website download is an unchanged copy of the submitted 1.0.1 archive.
