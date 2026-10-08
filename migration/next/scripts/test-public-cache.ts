import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { Categories, Documents, Media, News, Products } from '../src/collections';
import { publicContentChanged, publicContentDeleted } from '../src/hooks/public-cache';

test('all public content changes invalidate the public layout cache', () => {
  for (const collection of [Categories, Documents, Media, News, Products]) {
    assert.ok(collection.hooks?.afterChange?.includes(publicContentChanged), `${collection.slug}: save invalidation`);
    assert.ok(collection.hooks?.afterDelete?.includes(publicContentDeleted), `${collection.slug}: delete invalidation`);
  }
});

test('public ISR uses an hourly safety expiry, not minute-by-minute rebuilds', async () => {
  for (const route of ['page.tsx', 'products/page.tsx', 'products/[category]/page.tsx',
    'products/[category]/[product]/page.tsx', 'news/page.tsx', 'news/[article]/page.tsx', 'documents/page.tsx']) {
    const source = await readFile(new URL(`../src/app/(site)/${route}`, import.meta.url), 'utf8');
    assert.match(source, /export const revalidate = 3600;/, route);
  }
});
