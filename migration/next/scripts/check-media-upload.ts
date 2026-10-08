/** Explicit opt-in smoke test against the migration CMS; creates/deletes ONLY its own unreferenced test file. */
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { getPayload, createLocalReq } from 'payload';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getStorageFilePath } from '@payloadcms/plugin-cloud-storage/utilities';
import config from '../src/payload.config';
import { isUsableImageVariant } from '../src/lib/media-policy';

assert.equal(process.env.KEMZ_ALLOW_MEDIA_SMOKE, '1', 'Explicit opt-in required for the migration CMS test');
// This is the separately provisioned migration database, not the live Nuxt/Contentful site.
assert.equal(new URL(process.env.DATABASE_URL!).hostname, 'a1b261b9619c2200fd8955fe.twc1.net');
const payload = await getPayload({ config });
const storage = new S3Client({ endpoint: process.env.S3_ENDPOINT, region: process.env.S3_REGION,
  credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! } });
let ownID: number | undefined;
try {
  const admins = await payload.find({ collection: 'users', overrideAccess: true, where: { role: { equals: 'administrator' } }, limit: 1 });
  assert.ok(admins.docs[0]);
  const req = await createLocalReq({ user: { ...admins.docs[0]!, collection: 'users' } }, payload);
  const before = await payload.count({ collection: 'media', overrideAccess: true });
  const name = `media-policy-smoke-${randomUUID()}.png`;
  const invalid = await sharp({ create: { width: 10001, height: 1, channels: 3, background: '#fff' } }).png().toBuffer();
  await assert.rejects(payload.create({ collection: 'media', req, overrideAccess: false, data: { title: name },
    file: { name, mimetype: 'image/png', data: invalid, size: invalid.length } }), /10 000/);
  assert.equal((await payload.count({ collection: 'media', overrideAccess: true })).totalDocs, before.totalDocs);
  const bytes = await sharp({ create: { width: 1800, height: 1200, channels: 3, background: '#1760a0' } }).png().toBuffer();
  const doc = await payload.create({ collection: 'media', req, overrideAccess: false, data: { title: name, alt: 'Тест обработки медиа' },
    file: { name, mimetype: 'image/png', data: bytes, size: bytes.length } });
  ownID = doc.id;
  for (const [size, variant] of Object.entries(doc.sizes || {})) {
    assert.ok(isUsableImageVariant(variant));
    const key = await getStorageFilePath({ doc, filename: variant.filename, collectionPrefix: 'kemz/media', collection: payload.collections.media.config, req });
    const stored = await storage.send(new HeadObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
    assert.equal(stored.ContentLength, variant.filesize);
    assert.equal(stored.ContentType, 'image/webp');
    console.log(`${size}: WebP ${variant.width}×${variant.height}, ${variant.filesize} bytes; S3 confirmed`);
  }
  console.log('Integration passed: invalid upload not saved, valid original processed, all WebP copies present in S3.');
} finally {
  try {
    if (ownID !== undefined) {
      await payload.delete({ collection: 'media', id: ownID, overrideAccess: true });
      console.log('Only the test-created, unreferenced media record and its files were removed.');
    }
  } finally {
    storage.destroy();
    await payload.destroy();
  }
}
// Payload's background reconnect timer can outlive destroy() in a standalone CLI.
process.exit(0);
