import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareImport } from './prepare-import.mjs';

const entry = (id, type, fields) => ({ sys: { id, contentType: { sys: { id: type } } }, fields: Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, { 'en-US': value }])) });
const category = entry('cat', 'Category', { Name: 'Двигатели', url: 'engines', display: false });
const product = entry('p', 'subcategory', { name: 'Двигатель', url: 'AC_engines_EKG15', category: { sys: { id: 'cat' } } });
const content = entries => ({ entries, assets: [], locales: [{ code: 'en-US', default: true }, { code: 'ru-RU', default: false }] });
test('preserves case-sensitive product URLs, hidden category URLs and legacy news IDs', () => {
  const data = prepareImport(content([category, product, entry('legacyNews', 'news', { header: 'Новость' })]), { complete: true, files: [], scope: 'published-only' });
  assert.equal(data.sourceLocale, 'en-US');
  assert.equal(data.categories[0].visible, false);
  assert.ok(data.routes.some(route => route.url === '/products/engines/AC_engines_EKG15'));
  assert.ok(data.routes.some(route => route.url === '/news/legacyNews'));
  assert.deepEqual(data.issues, []);
});
test('missing relations block import rather than inventing category', () => {
  assert.equal(prepareImport(content([product]), { complete: true, files: [] }).issues.length, 1);
  assert.throws(() => prepareImport(content([]), { complete: false }), /integrity/);
});
test('duplicate URLs are reported', () => {
  assert.equal(prepareImport(content([category, product, { ...product, sys: { ...product.sys, id: 'p2' } }]), { complete: true, files: [] }).issues.length, 1);
});
