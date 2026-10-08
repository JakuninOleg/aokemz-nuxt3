import sharp from 'sharp';

// Decorative background only; keep the original file untouched.
const source = 'public/media/about/about-blueprint-wide.png';
const target = 'public/media/about/about-blueprint-background.webp';
const result = await sharp(source).resize({ width: 1200, withoutEnlargement: true })
  .webp({ quality: 78, effort: 6 }).toFile(target);
console.log(`${target}: ${result.width}×${result.height}, ${Math.round(result.size / 1024)} KiB`);
