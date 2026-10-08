import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSlug } from '../../migration/next/src/lib/slug.mjs';

test('readable Russian equipment URLs without changing model numbers', () => {
  assert.equal(generateSlug('Электродвигатель ДПЭ-560 для ЭКГ-10'), 'elektrodvigatel-dpe-560-dlya-ekg-10');
  assert.equal(generateSlug('  Щётки / Ёмкость — 35 кВ  '), 'shchyotki-yomkost-35-kv');
  assert.equal(generateSlug('!!!'), '');
  assert.ok(generateSlug('а'.repeat(150)).length <= 100);
});
