import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import sharp from 'sharp';

const sources = [
  'generated/hero-quarry-dragline-wide-v11.webp',
  ...['mining', 'belaz', 'drilling-rigs', 'railway-transport',
    'urban-electric-transport', 'other', 'new-developments']
    .map(category => `products/heroes/category-${category}-hero-v1.webp`),
];
test('all static responsive hero files exist and their width descriptors are accurate', async () => {
  for (const source of sources) {
    const original = await sharp(await readFile(new URL(`../public/media/${source}`, import.meta.url))).metadata();
    for (const width of [640, 960, 1600]) {
      const target = source.replace(/\.webp$/, `-delivery-${width}.webp`);
      const buffer = await readFile(new URL(`../public/media/${target}`, import.meta.url));
      const metadata = await sharp(buffer).metadata();
      assert.equal(metadata.format, 'webp', target);
      assert.equal(metadata.width, width, target);
      assert.ok(metadata.width <= original.width, target);
      assert.ok(Math.abs(metadata.height - width * original.height / original.width) <= 1, target);
      await sharp(buffer).raw().toBuffer();
    }
  }
});
test('validated CMS variants and static hero srcsets bypass request-time recompression', async () => {
  const content = await readFile(new URL('../src/components/site/Content.tsx', import.meta.url), 'utf8');
  const category = await readFile(new URL('../src/components/site/catalog/CategoryHero.tsx', import.meta.url), 'utf8');
  assert.ok(content.includes('srcSet={media.srcSet}'));
  assert.ok(category.includes('srcSet={imageSrcSet}'));
  assert.ok(!content.includes("from 'next/image'"));
  assert.ok(!category.includes("from 'next/image'"));
  for (const file of ['catalog/CatalogProductCard.tsx', 'catalog/CategoryEquipment.tsx', 'catalog/CategorySpecifications.tsx', 'news/NewsHero.tsx']) {
    const source = await readFile(new URL(`../src/components/site/${file}`, import.meta.url), 'utf8');
    assert.ok(source.includes('srcSet='), file);
    assert.ok(!source.includes("from 'next/image'"), file);
  }
  for (const width of [640, 960, 1600]) {
    const file = new URL(`../public/news/news-hero-delivery-${width}.webp`, import.meta.url);
    assert.equal((await sharp(await readFile(file)).metadata()).width, width);
  }
});
