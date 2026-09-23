# -*- coding: utf-8 -*-
from pathlib import Path
import zipfile
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
STATIC = ROOT / "static"
OUT = ROOT / "docs" / "_extract_static"


def extract_docx(path: Path) -> str:
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml").decode("utf-8")
    text = re.sub(r"</w:p>", "\n", xml)
    text = re.sub(r"<[^>]+>", "", text)
    for a, b in (
        ("&amp;", "&"),
        ("&lt;", "<"),
        ("&gt;", ">"),
        ("&#xa0;", " "),
        ("&quot;", '"'),
    ):
        text = text.replace(a, b)
    return re.sub(r"\n{3,}", "\n\n", text).strip()


def extract_pdf(path: Path) -> str:
    try:
        from pypdf import PdfReader
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf", "-q"])
        from pypdf import PdfReader

    reader = PdfReader(str(path))
    parts = []
    for i, page in enumerate(reader.pages):
        t = page.extract_text() or ""
        parts.append(f"--- page {i + 1} ---\n{t}")
    return "\n\n".join(parts).strip()


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for path in sorted(STATIC.iterdir()):
        if path.suffix.lower() == ".docx":
            text = extract_docx(path)
            out = OUT / (path.stem + ".txt")
            out.write_text(text, encoding="utf-8")
            print(f"OK docx {path.name}: {len(text)} chars -> {out.name}")
        elif path.suffix.lower() == ".pdf":
            text = extract_pdf(path)
            out = OUT / (path.stem + ".txt")
            # Cap huge extractions for the big presentation: keep full but report size
            out.write_text(text, encoding="utf-8")
            print(f"OK pdf  {path.name}: {len(text)} chars, pages~ -> {out.name}")


if __name__ == "__main__":
    main()
