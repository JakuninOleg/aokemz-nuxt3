import assert from 'node:assert/strict';
import { getPayload } from 'payload';
process.env.NODE_ENV = 'production';
const { default: config } = await import('../src/payload.config.ts');
const payload = await getPayload({ config });
const origin = 'http://127.0.0.1:3100';
let exitCode = 0;
try {
  const records = await payload.find({ collection: 'news', pagination: false, depth: 0,
    where: { _status: { equals: 'published' } }, overrideAccess: false });
  const allSlugs = new Set(records.docs.map(doc => doc.slug));
  assert.equal(allSlugs.size, records.docs.length);
  const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
  const index = await (await fetch(`${origin}/news`)).text();
  for (const record of records.docs) {
    const route = `/news/${record.slug}`;
    assert.match(record.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    const response = await fetch(origin + route, { redirect: 'manual' });
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.ok(html.includes(`rel="canonical" href="https://aokemz.ru${route}"`), `Canonical: ${route}`);
    assert.ok(sitemap.includes(`https://aokemz.ru${route}</loc>`), `Sitemap: ${route}`);
    assert.ok(index.includes(`href="${route}"`), `News list: ${route}`);
    for (const match of html.matchAll(/href="(\/news\/[^"?#]+)"/g)) {
      assert.ok(allSlugs.has(decodeURIComponent(match[1].slice('/news/'.length))), `Broken link: ${match[1]}`);
    }
    for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) {
      const schema = JSON.parse(match[1]);
      assert.ok(!record.legacyId || !JSON.stringify(schema).includes(`/news/${record.legacyId}`), 'Old URL in schema');
    }
    if (record.legacyId && record.legacyId !== record.slug) {
      assert.equal((await fetch(`${origin}/news/${record.legacyId}`, { redirect: 'manual' })).status, 404, 'Old URL must not redirect');
      assert.ok(!sitemap.includes(`/news/${record.legacyId}</loc>`));
    }
  }
  console.log(JSON.stringify({ verifiedNews: records.docs.length, newUrls200: true,
    oldUrls404: true, canonical: true, sitemap: true, newsLinks: true, schema: true }));
} catch (error) {
  exitCode = 1;
  console.error(error instanceof Error ? error.message : 'News URL verification failed');
} finally {
  await payload.destroy();
}
process.exit(exitCode);
