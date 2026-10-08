import assert from 'node:assert/strict';

process.env.SITE_INDEXABLE = 'false';
const { default: config } = await import('../next.config.mjs');
const rules = await config.headers();
const all = rules.flatMap(rule => rule.headers);
assert.ok(!all.some(header => header.key.toLowerCase() === 'critical-ch'));
assert.ok(!all.some(header => header.key.toLowerCase() === 'accept-ch'));
for (const key of ['X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy']) {
  assert.ok(all.some(header => header.key === key), `${key} preserved`);
}
assert.ok(rules.find(rule => rule.source === '/:path*').headers.some(header => header.key === 'X-Robots-Tag' && /noindex/.test(header.value)));
assert.ok(rules.find(rule => rule.source === '/media/:path*').headers.some(header => header.key === 'Cache-Control'));
assert.ok(rules.find(rule => rule.source === '/admin/:path*').headers.some(header => header.key === 'X-Robots-Tag'));
console.log('Delivery headers PASS: no theme replay; security, cache and preview noindex preserved.');
