import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

// Keep the full-resolution generated original and existing variants untouched.
const source = fileURLToPath(new URL('../../../.design/hero-quarry-mobile-v1-source.png', import.meta.url));
for (const width of [640, 832, 1024]) {
  const target = fileURLToPath(new URL(`../public/media/generated/hero-quarry-mobile-v2-${width}.avif`, import.meta.url));
  const result = await sharp(source).resize({ width, withoutEnlargement: true })
    .avif({ quality: 42, effort: 7 }).toFile(target);
  console.log(`${width}: ${result.width}×${result.height}, ${result.size} bytes`);
}
