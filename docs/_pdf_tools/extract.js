const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const staticDir = path.join(__dirname, '..', '..', 'static');
const outDir = path.join(__dirname, '..', '_extract_static');

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const files = fs.readdirSync(staticDir).filter((f) => f.toLowerCase().endsWith('.pdf'));
  for (const file of files) {
    const full = path.join(staticDir, file);
    const parser = new PDFParse({ data: fs.readFileSync(full) });
    const result = await parser.getText();
    const text = typeof result === 'string' ? result : result?.text || JSON.stringify(result).slice(0, 500);
    const out = path.join(outDir, file.replace(/\.pdf$/i, '.txt'));
    const payload = typeof result === 'string' ? result : (result.text || '');
    fs.writeFileSync(out, payload, 'utf8');
    const pages = result.total || result.numpages || '?';
    console.log(`${file}: pages=${pages}, chars=${payload.length}`);
    await parser.destroy();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
