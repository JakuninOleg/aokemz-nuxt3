import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createLocalReq, getPayload } from 'payload';
import { generateSlug, isValidSlug } from '../src/lib/slug.mjs';

// Explicit one-time content migration. Never accepts an arbitrary target.
const target = new URL(process.env.DATABASE_URL);
assert.equal(target.hostname, 'a1b261b9619c2200fd8955fe.twc1.net');
assert.equal(target.pathname, '/default_db');
const apply = process.argv.includes('--apply');
process.env.NODE_ENV = 'production';
const { default: config } = await import('../src/payload.config.ts');
const payload = await getPayload({ config });
let exitCode = 0;
try {
  const { docs } = await payload.find({ collection: 'news', pagination: false, depth: 0,
    sort: 'id', overrideAccess: true });
  const used = new Set();
  const plan = docs.map(doc => {
    const base = generateSlug(doc.title);
    assert.ok(base, `Missing title: ${doc.id}`);
    let slug = base;
    for (let suffix = 2; used.has(slug); suffix++) {
      const tail = `-${suffix}`;
      slug = `${base.slice(0, 100 - tail.length).replace(/-+$/, '')}${tail}`;
    }
    assert.ok(isValidSlug(slug));
    used.add(slug);
    return { id: doc.id, title: doc.title, before: doc.slug, after: slug };
  });
  console.log(JSON.stringify({ apply, count: docs.length, plan }, null, 2));
  if (apply) {
    const administrators = await payload.find({ collection: 'users',
      where: { role: { equals: 'administrator' } }, depth: 0, limit: 1, overrideAccess: true });
    assert.ok(administrators.docs[0], 'Administrator required');
    const req = await createLocalReq({ user: { ...administrators.docs[0], collection: 'users' } }, payload);
    const directory = path.resolve('../../.migration-private/news-slugs');
    await mkdir(directory, { recursive: true });
    const backup = path.join(directory, `before-${Date.now()}.json`);
    await writeFile(backup, JSON.stringify({ plan, docs }, null, 2), { flag: 'wx' });
    console.log(`Backup: ${backup}`);
    for (const item of plan) {
      if (item.before === item.after) continue;
      const original = docs.find(doc => doc.id === item.id);
      const updated = await payload.update({ collection: 'news', id: item.id, req,
        overrideAccess: false, depth: 0, data: { slug: item.after } });
      assert.equal(updated.slug, item.after);
      for (const field of ['title', 'body', 'summary', 'image', 'publishedAt', '_status', 'legacyId']) {
        assert.deepEqual(updated[field], original[field], `Content changed: ${item.id}/${field}`);
      }
    }
    console.log('News slugs migrated; content and publication state preserved. No redirects created.');
  }
} catch (error) {
  exitCode = 1;
  console.error(error instanceof Error ? error.message : 'News slug migration failed');
} finally {
  await payload.destroy();
}
process.exit(exitCode);
