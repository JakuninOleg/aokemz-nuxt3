import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import config from '../next.config.mjs';

const require = createRequire(import.meta.url);
const { matchHas } = require('next/dist/shared/lib/router/utils/prepare-destination');
const original = { url: process.env.PUBLIC_SITE_URL, indexable: process.env.SITE_INDEXABLE };
try {
  process.env.PUBLIC_SITE_URL = 'https://aokemz.ru';
  process.env.SITE_INDEXABLE = 'true';
  const rule = (await config.redirects()).find(item => item.has?.some(condition => condition.type === 'host' && condition.value === 'www\\.aokemz\\.ru'));
  assert.ok(rule);
  assert.equal(rule.source, '/:path*');
  assert.equal(rule.destination, 'https://aokemz.ru/:path*');
  assert.equal(rule.permanent, true);
  assert.ok(matchHas({ headers: { host: 'www.aokemz.ru' } }, {}, rule.has));
  assert.equal(matchHas({ headers: { host: 'aokemz.ru' } }, {}, rule.has), false);
  assert.equal(matchHas({ headers: { host: 'wwwXaokemzXru' } }, {}, rule.has), false);
  process.env.PUBLIC_SITE_URL = 'https://staging.aokemz.ru';
  process.env.SITE_INDEXABLE = 'false';
  assert.ok(!(await config.redirects()).some(item => item.has?.some(condition => condition.type === 'host')));
  console.log('Canonical www mirror redirect and staging exclusion passed. No network requests.');
} finally {
  for (const [key, value] of [['PUBLIC_SITE_URL', original.url], ['SITE_INDEXABLE', original.indexable]]) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}
