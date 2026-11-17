# X to PDF v1.0.2 (unreleased)

- Add an **Include images** toggle, off each time the popup opens.
- Load article media from X’s image server into the PDF columns; wait for images before enabling Print and show a placeholder if loading fails.

# X to PDF v1.0.1

Convert an open X Article into a local, print-ready document with two columns, Letter paper, and 9 pt Times New Roman body text.

## Changes

- Inject the article reader on demand when an X tab was opened before extension installation; no manual page reload required.

## Install

1. Download `x-to-pdf-v1.0.1.zip` from the release assets.
2. Extract it into a permanent location. Keep the extracted folder after installation.
3. Open `chrome://extensions` and enable **Developer mode**.
4. Click **Load unpacked** and select the extracted `x-to-pdf` folder containing `manifest.json`.

## Use

Open an X Article and wait for it to load. Click the extension, then **Create PDF**. In the preview, click **Print / Save PDF**, choose **Save to PDF**, set Letter paper and 100% scale, and disable browser headers and footers.

Article processing stays local; the extension does not upload article text.

## Updates

Replace the installed folder contents with files from the new release, then click **Reload** on the extension at `chrome://extensions`. Updates are manual.

## License

MIT License.
