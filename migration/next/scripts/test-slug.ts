/**
 * Pure unit checks for Russian slug helpers. No DB / Payload / network.
 * Run from migration/next: `npx tsx scripts/test-slug.ts`
 */
import assert from 'node:assert/strict';
import { generateSlug, isValidSlug, normalizeSlugInput } from '../src/lib/slug.mjs';
import { automaticSlug } from '../src/hooks/slug';
import type { FieldHook } from 'payload';

const cases: Array<[string, string]> = [
  ['Электродвигатель ДПЭ-560 для ЭКГ-10', 'elektrodvigatel-dpe-560-dlya-ekg-10'],
  ['  Щётки / Ёмкость — 35 кВ  ', 'shchyotki-yomkost-35-kv'],
  ['Щётки', 'shchyotki'],
  ['Новость КЭМЗ 2026', 'novost-kemz-2026'],
  ['!!!', ''],
  ['', ''],
];

for (const [input, expected] of cases) {
  assert.equal(generateSlug(input), expected, `generateSlug(${JSON.stringify(input)})`);
}

assert.ok(generateSlug('а'.repeat(150)).length <= 100);
assert.equal(generateSlug('а'.repeat(150)).endsWith('-'), false);

assert.equal(isValidSlug('elektrodvigatel-dpe-560'), true);
assert.equal(isValidSlug('Imported_URL-1'), true); // preserved Contentful-style
assert.equal(isValidSlug(''), false);
assert.equal(isValidSlug('with space'), false);
assert.equal(isValidSlug('кириллица'), false);
assert.equal(isValidSlug('a'.repeat(101)), false);

assert.equal(normalizeSlugInput('  Imported_URL-1  '), 'Imported_URL-1');
assert.equal(normalizeSlugInput('Новый товар ДПЭ'), 'novyy-tovar-dpe');
assert.equal(normalizeSlugInput('   '), '');
assert.equal(normalizeSlugInput(null), '');

// Exercise URL policy using a fake uniqueness lookup, never a real database.
const hookArgs = (collection: string, value: string, duplicate = false) => ({
  operation: 'update', value, data: { title: 'Новая версия заголовка' },
  originalDoc: { id: 1, slug: 'old-url' }, collection: { slug: collection },
  req: { payload: { find: async () => ({ docs: duplicate ? [{ id: 2 }] : [] }) } },
}) as unknown as Parameters<FieldHook>[0];
assert.equal(await automaticSlug(hookArgs('news', 'Читаемая новость')), 'chitaemaya-novost');
assert.equal(await automaticSlug(hookArgs('news', 'old-url')), 'old-url');
assert.equal(await automaticSlug(hookArgs('news', '')), 'old-url');
await assert.rejects(() => automaticSlug(hookArgs('news', 'occupied', true)), /уже занят/);
await assert.rejects(() => automaticSlug(hookArgs('products', 'changed')), /301/);
await assert.rejects(() => automaticSlug(hookArgs('categories', 'changed')), /301/);

console.log(JSON.stringify({ passed: true, checks: cases.length + 16 }, null, 2));
