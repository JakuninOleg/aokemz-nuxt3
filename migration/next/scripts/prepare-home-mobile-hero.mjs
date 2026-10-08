import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';

const source = process.argv[2];
if (!source) throw new Error('Pass the generated portrait PNG path.');
const archive = path.resolve('../../.design/hero-quarry-mobile-v1-source.png');
await mkdir(path.dirname(archive), { recursive: true });
await copyFile(source, archive);
for (const width of [640, 1024]) {
  const output = `public/media/generated/hero-quarry-mobile-v1-${width}.webp`;
  const info = await sharp(source).resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 }).toFile(output);
  console.log(`${output}: ${info.width}×${info.height}, ${Math.round(info.size / 1024)} KiB`);
  const avif = await sharp(source).resize({ width, withoutEnlargement: true })
    .avif({ quality: 55, effort: 6 }).toFile(output.replace('.webp', '.avif'));
  console.log(`AVIF: ${avif.width}×${avif.height}, ${Math.round(avif.size / 1024)} KiB`);
}
