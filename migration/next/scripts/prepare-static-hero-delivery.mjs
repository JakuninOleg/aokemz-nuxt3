import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

// Preserve the existing imagery and full resolution; only change delivery codec.
for (const [source, target] of [
  ['generated/hero-quarry-dragline-wide-v11.webp', 'generated/hero-quarry-dragline-wide-v12.avif'],
  ['about/about-hero-archive-clean.webp', 'about/about-hero-archive-delivery-v2.avif'],
]) {
  const result = await sharp(fileURLToPath(new URL(`../public/media/${source}`, import.meta.url)))
    .avif({ quality: 55, effort: 7 })
    .toFile(fileURLToPath(new URL(`../public/media/${target}`, import.meta.url)));
  console.log(`${target}: ${result.width}×${result.height}, ${result.size} bytes`);
}
