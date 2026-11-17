"""Create an installable ZIP from the extension's runtime files."""

import json
import re
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo


ROOT = Path(__file__).resolve().parent.parent
FILES = (
    "manifest.json",
    "content.js",
    "popup.html",
    "popup.js",
    "popup.css",
    "print.html",
    "print.js",
    "print.css",
    "README.md",
    "LICENSE",
    "icons/icon-16.png",
    "icons/icon-32.png",
    "icons/icon-48.png",
    "icons/icon-128.png",
)


def main():
    manifest = json.loads((ROOT / "manifest.json").read_text())
    version = manifest["version"]
    if not re.fullmatch(r"[0-9]+(?:\.[0-9]+){0,3}", version):
        raise SystemExit(f"Invalid manifest version: {version!r}")
    # Read every input before creating the archive so missing files fail early.
    sources = [(name, (ROOT / name).read_bytes()) for name in FILES]
    output = ROOT / "dist" / f"x-to-pdf-v{version}.zip"
    output.parent.mkdir(exist_ok=True)
    with ZipFile(output, "w", compression=ZIP_DEFLATED) as archive:
        for name, content in sources:
            entry = ZipInfo(f"x-to-pdf/{name}", date_time=(1980, 1, 1, 0, 0, 0))
            entry.compress_type = ZIP_DEFLATED
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, content)
    print(f"Created {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
