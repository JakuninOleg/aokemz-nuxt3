/**
 * Pure signature checks for media allowlist (JPEG/PNG/WebP/PDF/DOCX).
 * Uses real Contentful archive bytes + synthetic spoofs. No DB / network / S3.
 *
 * Run from migration/next:
 *   node --import tsx scripts/test-media.ts [optional-snapshot-dir]
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  detectMediaPayloadKind,
  validateMediaBytes,
} from '../src/hooks/media';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../../..');
const defaultSnapshot = path.join(
  repoRoot,
  '.migration-private/contentful/2026-10-07T17-52-53-224Z-44354d52',
);
const snapshotDir = path.resolve(process.argv[2] || defaultSnapshot);

if (!snapshotDir.includes(`${path.sep}.migration-private${path.sep}`)) {
  throw new Error('Snapshot must live under .migration-private');
}

const assets = path.join(snapshotDir, 'assets');
const mediaCheck = path.join(repoRoot, '.migration-private/media-check');

async function load(rel: string): Promise<Buffer> {
  return readFile(path.join(assets, rel));
}

const results: Array<{ name: string; ok: boolean; detail?: string }> = [];

function check(name: string, fn: () => void) {
  try {
    fn();
    results.push({ name, ok: true });
  } catch (error) {
    results.push({
      name,
      ok: false,
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}

const jpeg = await load('2fhkQl7B7rMGdcOEQTzZQY-en-US.jpg');
const png = await load('1AmObzDTC9qhsUilkfW5N4-en-US.png');
const pdf = await load('1eEyUV2ky29XWbKaVEU3xW-en-US.pdf');
const docx = await load('17ds6csiPZmUvJjjHfuegu-en-US.docx');
const webp = await readFile(path.join(mediaCheck, '0-webp.webp'));

check('detect real jpeg', () => assert.equal(detectMediaPayloadKind(jpeg), 'jpeg'));
check('detect real png', () => assert.equal(detectMediaPayloadKind(png), 'png'));
check('detect real webp', () => assert.equal(detectMediaPayloadKind(webp), 'webp'));
check('detect real pdf', () => assert.equal(detectMediaPayloadKind(pdf), 'pdf'));
check('detect real docx', () => assert.equal(detectMediaPayloadKind(docx), 'docx'));

check('accept real jpeg mime', () =>
  assert.equal(validateMediaBytes('photo.jpg', 'image/jpeg', jpeg), null));
check('accept real png mime', () =>
  assert.equal(validateMediaBytes('photo.png', 'image/png', png), null));
check('accept real webp mime', () =>
  assert.equal(validateMediaBytes('photo.webp', 'image/webp', webp), null));
check('accept real pdf mime', () =>
  assert.equal(validateMediaBytes('doc.pdf', 'application/pdf', pdf), null));
check('accept real docx mime', () =>
  assert.equal(
    validateMediaBytes(
      'doc.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      docx,
    ),
    null,
  ));

const svgAsPng = Buffer.from(
  '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
  'utf8',
);
const htmlAsPng = Buffer.from('<!DOCTYPE html><html><body><script>alert(1)</script></body></html>', 'utf8');
const htmlAsJpeg = Buffer.from('<html><head></head><body>x</body></html>', 'utf8');
const bareXml = Buffer.from('<?xml version="1.0"?><root/>', 'utf8');
const randomBytes = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]);

check('reject svg renamed png', () => {
  const reason = validateMediaBytes('evil.png', 'image/png', svgAsPng);
  assert.ok(reason);
  assert.match(reason!, /SVG|HTML|XML|соответствует/i);
});
check('reject html renamed png', () => {
  const reason = validateMediaBytes('evil.png', 'image/png', htmlAsPng);
  assert.ok(reason);
});
check('reject html renamed jpeg', () => {
  const reason = validateMediaBytes('evil.jpg', 'image/jpeg', htmlAsJpeg);
  assert.ok(reason);
});
check('reject xml as pdf', () => {
  const reason = validateMediaBytes('x.pdf', 'application/pdf', bareXml);
  assert.ok(reason);
});
check('reject random as png', () => {
  assert.ok(validateMediaBytes('x.png', 'image/png', randomBytes));
});
check('reject jpeg bytes claimed as png', () => {
  assert.ok(validateMediaBytes('x.png', 'image/png', jpeg));
});
check('reject png bytes claimed as jpeg', () => {
  assert.ok(validateMediaBytes('x.jpg', 'image/jpeg', png));
});
check('reject svg extension even with png bytes', () => {
  assert.ok(validateMediaBytes('x.svg', 'image/png', png));
});
check('reject empty buffer', () => {
  assert.ok(validateMediaBytes('x.png', 'image/png', Buffer.alloc(0)));
});
check('reject gif mime', () => {
  assert.ok(validateMediaBytes('x.gif', 'image/gif', png));
});

// ZIP that is not DOCX (no word/ / Content_Types)
const fakeZip = Buffer.from('PK\u0003\u0004not-a-docx-archive-body', 'binary');
check('reject non-docx zip as docx', () => {
  assert.ok(
    validateMediaBytes(
      'x.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      fakeZip,
    ),
  );
});

const failed = results.filter((r) => !r.ok);
const report = {
  passed: failed.length === 0,
  snapshot: snapshotDir,
  checks: results.length,
  failed: failed.map((f) => ({ name: f.name, detail: f.detail })),
  kinds: {
    jpeg: detectMediaPayloadKind(jpeg),
    png: detectMediaPayloadKind(png),
    webp: detectMediaPayloadKind(webp),
    pdf: detectMediaPayloadKind(pdf),
    docx: detectMediaPayloadKind(docx),
    svgSpoof: detectMediaPayloadKind(svgAsPng),
    htmlSpoof: detectMediaPayloadKind(htmlAsPng),
  },
};

console.log(JSON.stringify(report, null, 2));
process.exitCode = failed.length === 0 ? 0 : 1;
process.exit(process.exitCode ?? 0);
