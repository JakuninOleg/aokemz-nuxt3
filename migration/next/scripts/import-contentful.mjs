import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { prepareImport } from '../../../scripts/migration/prepare-import.mjs';
import { contentfulToLexical } from '../src/lib/contentful-to-lexical.mjs';
import { generateSlug } from '../src/lib/slug.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const directory = path.resolve(process.argv[2] || '');
const privateRoot = path.join(root, '.migration-private/contentful');
if (!directory.startsWith(privateRoot + path.sep)) throw new Error('Use a private Contentful snapshot');
const sha = value => createHash('sha256').update(value).digest('hex');
const json = async name => JSON.parse(await readFile(path.join(directory, name), 'utf8'));
const manifest = await json('manifest.json');
if (!manifest.complete || manifest.errors.length || manifest.missingLinks.length) throw new Error('Incomplete archive');
for (const [name, checksum] of Object.entries(manifest.checksums)) {
  const filename = path.resolve(directory, name);
  if (!filename.startsWith(directory + path.sep)) throw new Error('Unsafe archive path');
  const bytes = await readFile(filename);
  if (bytes.length !== checksum.bytes || sha(bytes) !== checksum.sha256) throw new Error(`Archive checksum mismatch: ${name}`);
}
for (const file of manifest.files) {
  const filename = path.resolve(directory, file.path);
  if (!filename.startsWith(directory + path.sep)) throw new Error('Unsafe asset path');
  const bytes = await readFile(filename);
  if (bytes.length !== file.bytes || sha(bytes) !== file.sha256) throw new Error(`Asset checksum mismatch: ${file.assetId}`);
}
const content = await json('content.json');
const plan = prepareImport(content, manifest);
if (plan.issues.length) throw new Error('Import mapping has issues');
const entries = new Map(content.entries.map(entry => [entry.sys.id, entry]));
const assets = new Map(content.assets.map(asset => [asset.sys.id, asset]));
const urls = new Map(plan.routes.filter(route => route.legacyId).map(route => [route.legacyId, route.url]));
for (const item of plan.news) urls.set(item.legacyId, `/news/${generateSlug(item.title)}`);
const media = new Map();
const categories = new Map();
const texts = node => !node ? '' : node.nodeType === 'text' ? node.value : (node.content || []).map(texts).join('');
const lexicalTexts = node => !node ? '' : node.type === 'text' ? node.text : (node.children || []).map(lexicalTexts).join('');
const canonical = value => JSON.stringify(value, (key, node) => key === 'id' ? undefined :
  node && typeof node === 'object' && !Array.isArray(node)
    ? Object.fromEntries(Object.keys(node).sort().map(name => [name, node[name]])) : node);
function convert(source, dummy = false) {
  if (!source) return undefined;
  const result = contentfulToLexical(source, {
    resolveAsset: target => dummy ? assets.has(target.sys.id) ? 1 : undefined : media.get(target.sys.id),
    resolveEntry: target => urls.get(target.sys.id),
  });
  if (texts(source) !== lexicalTexts(result.root)) throw new Error('Rich text content was lost');
  return result;
}
for (const item of plan.products) { convert(item.sourceDescription, true); convert(item.sourceSpecifications, true); }
for (const item of plan.news) convert(item.sourceBody, true);
console.log(JSON.stringify({ preflight: 'passed', files: manifest.files.length, entries: content.entries.length, routes: plan.routes.length }));
if (!process.argv.includes('--apply') && !process.argv.includes('--verify')) process.exit(0);
// Refuse to write into an accidentally selected production database or bucket.
const database = new URL(process.env.DATABASE_URL);
if (database.hostname !== 'a1b261b9619c2200fd8955fe.twc1.net' || database.pathname !== '/default_db'
  || process.env.S3_BUCKET !== '322dbccb-407a-4979-91f5-bbc67222958a') throw new Error('Migration staging target mismatch');
const { getPayload } = await import('payload');
const { default: config } = await import('../src/payload.config.ts');
const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');
const { getStorageFilePath } = await import('@payloadcms/plugin-cloud-storage/utilities');
const { default: sharp } = await import('sharp');
const payload = await getPayload({ config });
const s3 = new S3Client({ endpoint: process.env.S3_ENDPOINT, region: process.env.S3_REGION,
  credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY } });
const report = { created: {}, reused: {}, counts: {}, routes: plan.routes, originals: [], variants: [], verified: false };
const apply = process.argv.includes('--apply');
const clean = data => Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
async function persist(collection, legacyId, sourceRecord, data, filePath) {
  const sourceHash = sha(JSON.stringify(sourceRecord));
  const found = await payload.find({ collection, where: { legacyId: { equals: legacyId } }, limit: 2, depth: 0, overrideAccess: true });
  if (found.docs.length > 1) throw new Error(`Duplicate legacy ID: ${collection}/${legacyId}`);
  if (found.docs[0]) {
    if (found.docs[0].sourceHash !== sourceHash) throw new Error(`Source changed; refusing overwrite: ${collection}/${legacyId}`);
    for (const [field, expected] of Object.entries(clean(data))) {
      const actual = found.docs[0][field];
      const equal = ['sourceCreatedAt', 'sourceUpdatedAt', 'publishedAt'].includes(field)
        ? new Date(actual).toISOString() === new Date(expected).toISOString() : canonical(actual) === canonical(expected);
      if (!equal) throw new Error(`Stored value changed: ${collection}/${legacyId}/${field}`);
    }
    report.reused[collection] = (report.reused[collection] || 0) + 1;
    if (report.reused[collection] % 10 === 0) console.log(`Verified ${collection}: ${report.reused[collection]}`);
    return found.docs[0];
  }
  if (!apply) throw new Error(`Missing imported record: ${collection}/${legacyId}`);
  const doc = await payload.create({ collection, overrideAccess: true, depth: 0,
    data: clean({ ...data, legacyId, sourceHash, sourceRecord }), ...(filePath ? { filePath } : {}) });
  report.created[collection] = (report.created[collection] || 0) + 1;
  console.log(`Imported ${collection}/${legacyId}`);
  return doc;
}
async function storedBytes(doc, filename) {
  const key = await getStorageFilePath({ doc, filename, collectionPrefix: 'kemz/media' });
  const response = await s3.send(new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
  return Buffer.from(await response.Body.transformToByteArray());
}
const resolveMedia = id => {
  if (!id) return undefined;
  const doc = media.get(id);
  if (!doc) throw new Error(`Unresolved media ${id}`);
  return doc.id;
};
try {
  for (const file of manifest.files) {
    const asset = assets.get(file.assetId);
    const fields = asset.fields;
    const legacyId = file.locale === plan.sourceLocale ? file.assetId : `${file.assetId}:${file.locale}`;
    const doc = await persist('media', legacyId, { asset, locale: file.locale, sha256: file.sha256 }, {
      title: fields.title?.[file.locale] || fields.title?.[plan.sourceLocale],
      alt: fields.description?.[file.locale] || fields.title?.[file.locale] || fields.title?.[plan.sourceLocale],
      sourceLocale: file.locale, originalName: file.originalName, originalSha256: file.sha256,
      sourceCreatedAt: asset.sys.createdAt, sourceUpdatedAt: asset.sys.updatedAt,
    }, path.join(directory, file.path));
    if (file.locale === plan.sourceLocale) media.set(file.assetId, doc);
    const original = await storedBytes(doc, doc.filename);
    if (sha(original) !== file.sha256) throw new Error(`S3 original checksum mismatch ${legacyId}`);
    report.originals.push({ legacyId, bytes: original.length, sha256: file.sha256 });
    if (doc.mimeType.startsWith('image/')) {
      for (const [name, size] of Object.entries(doc.sizes || {})) {
        if (!size.filename) throw new Error(`Missing WebP variant ${legacyId}/${name}`);
        const bytes = await storedBytes(doc, size.filename);
        const info = await sharp(bytes).metadata();
        const limit = { mobile: 480, content: 960, wide: 1600 }[name];
        if (info.format !== 'webp' || info.width > limit || info.width > doc.width || info.height > doc.height
          || bytes.length !== size.filesize) throw new Error(`Invalid WebP variant ${legacyId}/${name}`);
        report.variants.push({ legacyId, name, bytes: bytes.length, width: info.width, height: info.height, originalBytes: original.length });
      }
    }
  }
  const sourceDates = item => ({ sourceCreatedAt: item.sourceCreatedAt, sourceUpdatedAt: item.sourceUpdatedAt });
  for (const item of plan.categories) {
    const doc = await persist('categories', item.legacyId, entries.get(item.legacyId), {
      title: item.title, slug: item.slug, visible: item.visible, description: item.description,
      image: resolveMedia(item.imageLegacyId), files: item.filesLegacyIds.map(resolveMedia), ...sourceDates(item), _status: 'published',
    });
    if (doc.slug !== item.slug || doc.title !== item.title) throw new Error('Category verification failed');
    categories.set(item.legacyId, doc.id);
  }
  for (const item of plan.products) {
    const category = categories.get(item.categoryLegacyId);
    const doc = await persist('products', item.legacyId, entries.get(item.legacyId), {
      title: item.title, slug: item.slug, category, equipmentType: item.equipmentType, order: item.order,
      image: resolveMedia(item.imageLegacyId), description: convert(item.sourceDescription), specifications: convert(item.sourceSpecifications),
      sourceDescription: item.sourceDescription, sourceSpecifications: item.sourceSpecifications, ...sourceDates(item), _status: 'published',
    });
    if (doc.slug !== item.slug || doc.category !== category || doc.title !== item.title
      || texts(item.sourceDescription) !== lexicalTexts(doc.description?.root)
      || texts(item.sourceSpecifications) !== lexicalTexts(doc.specifications?.root)) throw new Error(`Product verification failed ${item.legacyId}`);
  }
  for (const item of plan.news) {
    const doc = await persist('news', item.legacyId, entries.get(item.legacyId), {
      title: item.title, slug: generateSlug(item.title), publishedAt: item.publishedAt, summary: item.summary,
      image: resolveMedia(item.imageLegacyId), body: convert(item.sourceBody), sourceBody: item.sourceBody, ...sourceDates(item), _status: 'published',
    });
    if (doc.slug !== generateSlug(item.title) || doc.title !== item.title || texts(item.sourceBody) !== lexicalTexts(doc.body?.root)) throw new Error('News verification failed');
  }
  for (const item of plan.documents) await persist('documents', item.legacyId, entries.get(item.legacyId), {
    names: item.names, file: resolveMedia(item.fileLegacyId), _status: 'published',
  });
  for (const [collection, expected] of Object.entries({ media: manifest.files.length, categories: plan.categories.length,
    products: plan.products.length, news: plan.news.length, documents: plan.documents.length })) {
    const count = await payload.count({ collection, overrideAccess: true });
    if (count.totalDocs !== expected) throw new Error(`Collection count mismatch: ${collection}`);
    report.counts[collection] = count.totalDocs;
  }
  report.verified = true;
  const totals = report.variants.reduce((sum, item) => { sum[item.name] = (sum[item.name] || 0) + item.bytes; return sum; }, {});
  console.log(JSON.stringify({ counts: report.counts, created: report.created, reused: report.reused, variants: report.variants.length,
    originalBytes: report.originals.reduce((sum, item) => sum + item.bytes, 0), variantBytes: totals, verified: true }));
} finally {
  await writeFile(path.join(directory, `import-report-${Date.now()}.json`), JSON.stringify(report, null, 2), { flag: 'wx' });
  s3.destroy();
  await payload.destroy();
}
// Payload 3's PostgreSQL reconnect listener retains a checked-out pool client.
// This is a one-shot CLI; all S3/DB operations and the report are awaited above.
process.exit(0);
