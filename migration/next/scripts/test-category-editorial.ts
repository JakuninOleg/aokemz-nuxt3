import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CATEGORY_EDITORIAL } from '../src/lib/category-editorial';

test('all nine existing categories have distinct useful editorial copy', () => {
  assert.equal(Object.keys(CATEGORY_EDITORIAL).length, 9);
  assert.equal(new Set(Object.values(CATEGORY_EDITORIAL).map(copy => copy.heading)).size, 9);
  for (const [slug, copy] of Object.entries(CATEGORY_EDITORIAL)) {
    assert.equal(copy.paragraphs.length, 2);
    assert.ok(copy.paragraphs.every(paragraph => paragraph.length > 80));
    assert.ok(copy.related.length >= 2 && copy.related.length <= 3);
    assert.ok(copy.related.every(related => related !== slug && CATEGORY_EDITORIAL[related]));
    assert.ok(copy.featured.length > 0 && copy.featured.length <= 3);
    assert.ok(!copy.paragraphs.join(' ').includes('—'));
  }
});
