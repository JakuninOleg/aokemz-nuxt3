import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const staticPaths = ['/', '/about', '/production', '/contacts', '/documents', '/legal', '/news', '/products'];
export function prepareImport(content, manifest) {
  if (!manifest.complete) throw new Error('Snapshot integrity must pass before import');
  const locale = content.locales.find(item => item.default)?.code;
  if (!locale) throw new Error('Missing default locale');
  // Russian content is actually stored in en-US. Do not translate or pick another
  // locale based on its name: preserve the values used by the existing website.
  const field = (entry, key) => entry.fields?.[key]?.[locale];
  const categoryEntries = content.entries.filter(entry => entry.sys.contentType.sys.id === 'Category');
  const categories = categoryEntries.map(entry => ({
    legacyId: entry.sys.id, title: field(entry, 'Name'), slug: field(entry, 'url'),
    visible: field(entry, 'display') === true, description: field(entry, 'description'),
    imageLegacyId: field(entry, 'image')?.sys.id,
    filesLegacyIds: (field(entry, 'files') || []).map(item => item.sys.id),
    sourceCreatedAt: entry.sys.createdAt, sourceUpdatedAt: entry.sys.updatedAt,
  }));
  const categoryMap = new Map(categories.map(category => [category.legacyId, category]));
  const products = content.entries.filter(entry => entry.sys.contentType.sys.id === 'subcategory').map(entry => ({
    legacyId: entry.sys.id, title: field(entry, 'name'), slug: field(entry, 'url'),
    categoryLegacyId: field(entry, 'category')?.sys.id,
    equipmentType: field(entry, 'type'), order: field(entry, 'order'),
    imageLegacyId: field(entry, 'image')?.sys.id,
    sourceDescription: field(entry, 'description'), sourceSpecifications: field(entry, 'params'),
    sourceCreatedAt: entry.sys.createdAt, sourceUpdatedAt: entry.sys.updatedAt,
  }));
  const news = content.entries.filter(entry => entry.sys.contentType.sys.id === 'news').map(entry => ({
    legacyId: entry.sys.id, title: field(entry, 'header'), publishedAt: field(entry, 'date'),
    imageLegacyId: field(entry, 'image')?.sys.id, summary: field(entry, 'text'),
    sourceBody: field(entry, 'htmlText'), sourceCreatedAt: entry.sys.createdAt, sourceUpdatedAt: entry.sys.updatedAt,
  }));
  const documents = content.entries.filter(entry => entry.sys.contentType.sys.id === '1').map(entry => ({
    legacyId: entry.sys.id, names: field(entry, 'name') || [], fileLegacyId: field(entry, 'doc')?.sys.id,
  }));
  const media = content.assets.map(asset => ({
    legacyId: asset.sys.id, title: field(asset, 'title'), description: field(asset, 'description'),
    files: manifest.files.filter(file => file.assetId === asset.sys.id),
  }));
  const issues = [];
  const paths = new Set(staticPaths);
  const routes = staticPaths.map(url => ({ url, kind: 'static' }));
  const route = (url, kind, legacyId) => {
    if (paths.has(url)) issues.push({ legacyId, reason: 'Duplicate public URL', url });
    paths.add(url); routes.push({ url, kind, legacyId });
  };
  const validSegment = value => typeof value === 'string' && /^[a-zA-Z0-9_-]+$/.test(value);
  for (const category of categories) {
    if (!category.title || !validSegment(category.slug)) issues.push({ legacyId: category.legacyId, reason: 'Category missing title or valid URL' });
    else route(`/products/${category.slug}`, 'category', category.legacyId);
  }
  for (const product of products) {
    const category = categoryMap.get(product.categoryLegacyId);
    if (!category || !validSegment(category.slug) || !product.title || !validSegment(product.slug)) {
      issues.push({ legacyId: product.legacyId, reason: 'Product missing category/title/valid URL' });
    } else route(`/products/${category.slug}/${product.slug}`, 'product', product.legacyId);
  }
  for (const article of news) {
    if (!article.title) issues.push({ legacyId: article.legacyId, reason: 'News missing title' });
    route(`/news/${article.legacyId}`, 'news', article.legacyId);
  }
  const nodeTypes = new Set();
  const walk = value => {
    if (!value || typeof value !== 'object') return;
    if (value.nodeType) nodeTypes.add(value.nodeType);
    Object.values(value).forEach(walk);
  };
  products.forEach(item => { walk(item.sourceDescription); walk(item.sourceSpecifications); });
  news.forEach(item => walk(item.sourceBody));
  return { formatVersion: 1, sourceLocale: locale, scope: manifest.scope,
    categories, products, news, documents, media, routes, issues, richTextNodes: [...nodeTypes].sort() };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = process.argv[2];
  if (!directory) throw new Error('Pass the private snapshot directory');
  const data = prepareImport(JSON.parse(await readFile(path.join(directory, 'content.json'), 'utf8')),
    JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8')));
  await writeFile(path.join(directory, 'import-plan.json'), JSON.stringify(data, null, 2), { flag: 'wx' });
  console.log(JSON.stringify({ sourceLocale: data.sourceLocale, categories: data.categories.length,
    products: data.products.length, news: data.news.length, documents: data.documents.length,
    routes: data.routes.length, issues: data.issues, richTextNodes: data.richTextNodes }, null, 2));
  if (data.issues.length) process.exitCode = 1;
}
