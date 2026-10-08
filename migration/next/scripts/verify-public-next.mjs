import assert from 'node:assert/strict';
import { getPayload } from 'payload';
// An audit must never invoke development schema push against the imported DB.
process.env.NODE_ENV = 'production';
const { default: config } = await import('../src/payload.config.ts');
const origin = new URL(process.env.AUDIT_ORIGIN || 'http://127.0.0.1:3100').origin;
const payload = await getPayload({ config });
const published = { _status: { equals: 'published' } };
const { docs: categories } = await payload.find({ collection: 'categories', overrideAccess: false, depth: 0, pagination: false, where: published });
const { docs: products } = await payload.find({ collection: 'products', overrideAccess: false, depth: 0, pagination: false, where: published });
const { docs: news } = await payload.find({ collection: 'news', overrideAccess: false, depth: 0, pagination: false, where: published });
const categorySlug = (product) => {
  const categoryId = product.category && typeof product.category === 'object' ? product.category.id : product.category;
  const category = categories.find((item) => item.id === categoryId);
  assert.ok(category, `published product ${product.id} missing category ${categoryId}`);
  return category.slug;
};
const routes = ['/', '/about', '/production', '/contacts', '/documents', '/legal', '/special', '/products', '/news', ...categories.map(doc => `/products/${doc.slug}`),
  ...products.map(doc => `/products/${categorySlug(doc)}/${doc.slug}`),
  ...news.map(doc => `/news/${doc.slug}`)];
let tables = 0;
const links = new Set(), assets = new Set(), titles = new Map();
for (const route of routes) {
  const response = await fetch(`${origin}${route}`);
  assert.equal(response.status, 200, route);
  assert.match(response.headers.get('x-robots-tag'), /noindex/);
  const html = await response.text();
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, route);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(canonical, `canonical absent: ${route}`);
  assert.equal(new URL(canonical).origin, 'https://aokemz.ru', `canonical host: ${route}`);
  assert.equal(new URL(canonical).pathname, route, `canonical path: ${route}`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title, `title: ${route}`);
  assert.ok(!titles.has(title), `duplicate title: ${route}, ${titles.get(title)}`);
  titles.set(title, route);
  assert.match(html, /<meta name="description" content="[^"]+"/, `description: ${route}`);
  assert.ok(!html.includes('sourceRecord') && !html.includes('sourceHash'), `private fields: ${route}`);
  if (html.includes('<table')) tables++;
  for (const value of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) JSON.parse(value[1]);
  for (const match of html.matchAll(/<a\b[^>]*href="([^"#]+)[^"]*"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), origin);
    if (url.origin === origin || url.origin === 'https://aokemz.ru') links.add(url.pathname);
  }
  for (const match of html.matchAll(/(?:src|href)="(\/(?:media|fonts|news|docs|files|_next\/static)\/[^"?#]+)[^"]*"/g)) assets.add(match[1]);
  for (const match of html.matchAll(/srcset="([^"]+)"/gi)) for (const candidate of match[1].split(',')) {
    const src = candidate.trim().split(/\s/)[0];
    if (src.startsWith('/')) assets.add(src);
  }
}
for (const route of links) { const response = await fetch(`${origin}${route}`); assert.equal(response.status,200,`internal link: ${route}`); }
for (const asset of assets) { const response = await fetch(`${origin}${asset}`, {method:'HEAD'}); assert.equal(response.status,200,`asset: ${asset}`); }
const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.ok(sitemapUrls.length > 60);
assert.equal(new Set(sitemapUrls).size,sitemapUrls.length);
for (const url of sitemapUrls) {
  assert.ok(url.startsWith('https://aokemz.ru/'), `sitemap host: ${url}`);
  const response = await fetch(`${origin}${new URL(url).pathname}`);
  assert.equal(response.status,200,`sitemap route: ${url}`);
}
for (const route of ['/does-not-exist', '/products/does-not-exist', '/products/excavator/does-not-exist', '/news/does-not-exist']) {
  const response = await fetch(`${origin}${route}`);
  assert.equal(response.status, 404, `Not found: ${route}`);
}
const robots = await (await fetch(`${origin}/robots.txt`)).text();
assert.match(robots, /Disallow: \//);
console.log(JSON.stringify({ publicRoutesVerified: routes.length, internalLinks:links.size, assets:assets.size, sitemapUrls:sitemapUrls.length, pagesWithTables: tables, status200: true,
  missingRoutes404: true, canonical: true, noindexPreview: true, privateImportMetadataAbsent: true }));
await payload.destroy();
// Payload's standalone CLI workers do not release all Windows handles promptly.
setTimeout(() => process.exit(0), 200);
