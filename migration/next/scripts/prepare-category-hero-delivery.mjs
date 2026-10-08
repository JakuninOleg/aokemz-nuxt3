import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

// Static category artwork is resized once, not on the first visitor's request.
const sources = [
  'generated/hero-quarry-dragline-wide-v11.webp',
  ...['mining', 'belaz', 'drilling-rigs', 'railway-transport',
    'urban-electric-transport', 'other', 'new-developments']
    .map(category => `products/heroes/category-${category}-hero-v1.webp`),
];
for (const source of sources) {
  for (const width of [640, 960, 1600]) {
    const target = source.replace(/\.webp$/, `-delivery-${width}.webp`);
    const result = await sharp(fileURLToPath(new URL(`../public/media/${source}`, import.meta.url)))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(fileURLToPath(new URL(`../public/media/${target}`, import.meta.url)));
    console.log(`${target}: ${result.width}×${result.height}, ${result.size} bytes`);
  }
}
for (const width of [640, 960, 1600]) {
  const result = await sharp(fileURLToPath(new URL('../public/news/news-hero.webp', import.meta.url)))
    .resize({ width, withoutEnlargement: true }).webp({ quality: 80, effort: 6 })
    .toFile(fileURLToPath(new URL(`../public/news/news-hero-delivery-${width}.webp`, import.meta.url)));
  console.log(`news/news-hero-delivery-${width}.webp: ${result.width}×${result.height}, ${result.size} bytes`);
}
