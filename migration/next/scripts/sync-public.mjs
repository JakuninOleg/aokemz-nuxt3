// Mechanical copy of approved Nuxt delivery assets/styles; source site stays untouched.
import { readFile, mkdir, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('../..');
const target = path.resolve('public');
const css = path.resolve('src/styles/legacy');
await mkdir(css, { recursive: true });
for (const name of ['home', 'products', 'category', 'product', 'news', 'internal-hero']) {
  await copyFile(path.join(root, 'assets/css', `${name}.scss`), path.join(css, `${name}.scss`));
}
// Unscoped shell base rules come from the existing Vue shell, before the existing reference overrides.
const header = await readFile(path.join(root, 'components/AppHeader.vue'), 'utf8');
await writeFile(path.join(css, 'header.scss'), header.match(/<style scoped>([\s\S]*?)<\/style>/)[1]);
const assets = ['fonts/RobotoCondensed-Variable.subset.woff2', 'media/generated/hero-quarry-dragline-wide-v11.webp',
  'media/generated/hero-quarry-dragline-wide-v11-960.webp', 'news/news-hero.webp',
  'media/about/about-blueprint-wide.png', 'media/documents/docs-cta-motors.webp', 'media/documents/docs-cta-machinery.webp'];
for (const name of assets) {
  await mkdir(path.dirname(path.join(target, name)), { recursive: true });
  await copyFile(path.join(root, 'public', name), path.join(target, name));
}
await mkdir(path.join(target, 'media'), { recursive: true });
await copyFile(path.join(root, 'assets/images/kemz-logo.webp'), path.join(target, 'media/kemz-logo.webp'));
for (const weight of ['Regular', 'Semibold', 'Bold', 'Extrabld']) {
  await copyFile(path.join(root, 'assets/css/fonts', `ProximaNova-${weight}.woff`), path.join(target, 'fonts', `ProximaNova-${weight}.woff`));
}
console.log('Approved styles, logo, fonts and selected delivery images synchronized.');
