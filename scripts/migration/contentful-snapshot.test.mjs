import test from 'node:test';
import assert from 'node:assert/strict';
import { collectLinks, auditSnapshot, assetUrl } from './contentful-snapshot.mjs';

test('links retain Entry and Asset types, including embedded rich text', () => {
  const link = { sys: { type: 'Link', linkType: 'Asset', id: 'photo' } };
  assert.deepEqual(collectLinks({ document: { content: [{ data: { target: link } }] } }), [{ type: 'Asset', id: 'photo' }]);
});
test('audit detects dangling references and counts exact CMS types', () => {
  const entry = { sys: { id: 'one', contentType: { sys: { id: 'subcategory' } } }, fields: { image: { sys: { type: 'Link', linkType: 'Asset', id: 'missing' } } } };
  assert.deepEqual(auditSnapshot([entry], []).counts, { subcategory: 1 });
  assert.equal(auditSnapshot([entry], []).missingLinks.length, 1);
  assert.throws(() => auditSnapshot([entry, entry], []), /Duplicate/);
});
test('asset downloads only use known HTTPS Contentful hosts', () => {
  assert.equal(assetUrl('//images.ctfassets.net/space/photo/file.jpg').protocol, 'https:');
  assert.throws(() => assetUrl('https://example.com/file.jpg'), /Unexpected/);
  assert.throws(() => assetUrl('http://images.ctfassets.net/file.jpg'), /Unexpected/);
});
