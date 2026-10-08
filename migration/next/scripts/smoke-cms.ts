import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';
import EmbeddedPostgres from 'embedded-postgres';
import { createLocalReq, getPayload, type Payload } from 'payload';
import sharp from 'sharp';

// This script never accepts DATABASE_URL. Each run creates its own local cluster.
const snapshotDir = path.resolve(process.argv[2] || '');
if (!process.argv[2] || !snapshotDir.includes(`${path.sep}.migration-private${path.sep}`)) {
  throw new Error('Pass the private snapshot directory');
}
const plan = JSON.parse(await readFile(path.join(snapshotDir, 'import-plan.json'), 'utf8'));
const manifest = JSON.parse(await readFile(path.join(snapshotDir, 'manifest.json'), 'utf8'));
assert.equal(manifest.complete, true);
const server = net.createServer();
await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
const port = (server.address() as net.AddressInfo).port;
await new Promise<void>(resolve => server.close(() => resolve()));
const databaseDir = path.resolve('../../.migration-private/postgres', `smoke-${Date.now()}`);
await mkdir(databaseDir, { recursive: true });
const password = randomBytes(24).toString('hex');
process.env.PAYLOAD_SECRET = randomBytes(32).toString('hex');
process.env.DATABASE_URL = `postgresql://kemz:${password}@127.0.0.1:${port}/kemz_migration`;
// Testing must never contact an existing S3 bucket.
delete process.env.S3_BUCKET;
const pg = new EmbeddedPostgres({ databaseDir, user: 'kemz', password, port,
  persistent: true, authMethod: 'scram-sha-256', createPostgresUser: false,
  initdbFlags: ['--encoding=UTF8', '--locale=C'],
  postgresFlags: ['-h', '127.0.0.1'], onLog: message => console.log(message.trim()), onError: error => console.error(String(error)) });
let payload: Payload | undefined;
let failed = false;
const markFailed = () => {
  failed = true;
  process.exitCode = 1;
};
const watchdog = setTimeout(() => { console.error('CMS smoke test timed out'); markFailed(); }, 90000);
try {
  console.log('Initialising isolated PostgreSQL');
  await pg.initialise();
  console.log('Starting isolated PostgreSQL');
  await pg.start();
  console.log('Creating test database');
  const client = pg.getPgClient('postgres', '127.0.0.1');
  await client.connect();
  await client.query('CREATE DATABASE kemz_migration');
  await client.end();
  const config = (await import('../src/payload.config')).default;
  payload = await getPayload({ config });
  // Deliberate bypass only for initial administrator in this isolated test DB.
  const administrator = await payload.create({ collection: 'users', overrideAccess: true,
    data: { email: 'admin@example.test', password: randomBytes(24).toString('hex'), role: 'administrator' } });
  const adminReq = await createLocalReq({ user: { ...administrator, collection: 'users' } }, payload);
  const editor = await payload.create({ collection: 'users', req: adminReq, overrideAccess: false,
    data: { email: 'editor@example.test', password: randomBytes(24).toString('hex'), role: 'editor' } });
  const editorReq = await createLocalReq({ user: { ...editor, collection: 'users' } }, payload);
  const sourceProduct = plan.products.find((item: { title: string; categoryLegacyId: string }) => item.title && item.categoryLegacyId);
  const sourceCategory = plan.categories.find((item: { legacyId: string }) => item.legacyId === sourceProduct.categoryLegacyId);
  const category = await payload.create({ collection: 'categories', req: adminReq, overrideAccess: false,
    data: { title: sourceCategory.title, slug: sourceCategory.slug, legacyId: sourceCategory.legacyId, _status: 'published' } });
  const product = await payload.create({ collection: 'products', req: editorReq, overrideAccess: false,
    data: { title: sourceProduct.title, category: category.id, sourceDescription: sourceProduct.sourceDescription,
      sourceSpecifications: sourceProduct.sourceSpecifications, _status: 'draft' } });
  assert.match(product.slug, /^[a-z0-9-]+$/);
  const duplicate = await payload.create({ collection: 'products', req: editorReq, overrideAccess: false,
    data: { title: sourceProduct.title, category: category.id, _status: 'draft' } });
  assert.equal(duplicate.slug, `${product.slug}-2`);
  const anonymousDrafts = await payload.find({ collection: 'products', overrideAccess: false });
  assert.equal(anonymousDrafts.docs.length, 0);
  const published = await payload.update({ collection: 'products', id: product.id, req: editorReq, overrideAccess: false,
    data: { _status: 'published' } });
  const anonymousPublished = await payload.find({ collection: 'products', overrideAccess: false });
  assert.equal(anonymousPublished.docs.length, 1);
  await payload.update({ collection: 'products', id: published.id, req: editorReq, overrideAccess: false,
    data: { title: `${sourceProduct.title} — проверка сохранения адреса` } });
  const after = await payload.findByID({ collection: 'products', id: published.id, req: editorReq, overrideAccess: false });
  assert.equal(after.slug, product.slug);
  await payload.update({ collection: 'users', id: editor.id, req: editorReq, overrideAccess: false,
    data: { role: 'administrator' } });
  const editorAfter = await payload.findByID({ collection: 'users', id: editor.id, req: editorReq, overrideAccess: false });
  assert.equal(editorAfter.role, 'editor');
  await assert.rejects(() => payload!.update({ collection: 'products', id: product.id, req: editorReq, overrideAccess: false,
    data: { slug: 'changed-url' } }));
  const sourceNews = plan.news.find((item: { title: string }) => item.title);
  const news = await payload.create({ collection: 'news', req: editorReq, overrideAccess: false,
    data: { title: sourceNews.title, legacyId: sourceNews.legacyId, publishedAt: sourceNews.publishedAt, sourceBody: sourceNews.sourceBody, _status: 'draft' } });
  assert.equal(news.legacyId, sourceNews.legacyId);
  const image = manifest.files.find((file: { path: string }) => /\.(jpg|jpeg|png)$/i.test(file.path));
  const media = await payload.create({ collection: 'media', req: editorReq, overrideAccess: false,
    data: { title: 'Проверка обработки оригинального изображения Contentful' }, filePath: path.join(snapshotDir, image.path) });
  const sizes = Object.values(media.sizes || {}).filter(size => size?.filename);
  assert.ok(sizes.length > 0);
  for (const size of sizes) {
    assert.equal(size?.mimeType, 'image/webp');
    const metadata = await sharp(path.resolve('.data/media', size!.filename!)).metadata();
    assert.ok(metadata.width! <= 1600);
  }
  const beforeRejectedUploads = await payload.count({ collection: 'media', overrideAccess: true });
  const badUpload = (data: Buffer, size = data.length) => payload.create({ collection: 'media', req: editorReq, overrideAccess: false,
    data: { title: 'Этот файл не должен сохраниться' }, file: { name: 'rejected.png', mimetype: 'image/png', data, size } });
  await assert.rejects(badUpload(Buffer.from('<svg/>')), /SVG/);
  await assert.rejects(badUpload(Buffer.from('broken'), 10 * 1024 * 1024 + 1), /10 МБ/);
  const tooWide = await sharp({ create: { width: 10001, height: 1, channels: 3, background: '#fff' } }).png().toBuffer();
  await assert.rejects(badUpload(tooWide), /безопасной обработки/);
  const afterRejectedUploads = await payload.count({ collection: 'media', overrideAccess: true });
  assert.equal(afterRejectedUploads.totalDocs, beforeRejectedUploads.totalDocs);
  console.log(JSON.stringify({ passed: true, checks: ['local PostgreSQL', 'real category/product/news data',
    'automatic unique slug', 'stable URL after title update', 'draft isolation', 'publish visibility',
    'editor role escalation denied', 'URL change denied without redirect', 'WebP variants generated'],
    imageVariants: sizes.map(size => ({ width: size?.width, bytes: size?.filesize, format: size?.mimeType })) }, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Local PostgreSQL failed to start; check the operating-system user permissions.');
  markFailed();
} finally {
  clearTimeout(watchdog);
  const failureBeforeStop = failed || process.exitCode === 1;
  try {
    if (payload) await payload.destroy();
  } catch (destroyError) {
    if (!/Connection terminated|ECONNRESET|pool after calling end/i.test(String(destroyError))) {
      console.error(destroyError instanceof Error ? destroyError.message : destroyError);
      markFailed();
    }
  }
  try {
    await pg.stop();
  } catch (stopError) {
    console.error(stopError instanceof Error ? stopError.message : stopError);
    markFailed();
  }
  // pg.stop must not clear a prior test failure.
  if (failureBeforeStop) {
    failed = true;
    process.exitCode = 1;
  }
}

process.exit(process.exitCode ?? 0);
