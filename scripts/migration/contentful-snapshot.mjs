import { createHash } from 'node:crypto';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const hash = data => createHash('sha256').update(data).digest('hex');
const safe = value => {
  if (!/^[a-zA-Z0-9_-]+$/.test(value)) throw new Error('Unsafe Contentful identifier');
  return value;
};

export function collectLinks(value, result = []) {
  if (!value || typeof value !== 'object') return result;
  if (value.sys?.type === 'Link' && ['Entry', 'Asset'].includes(value.sys.linkType)) {
    result.push({ type: value.sys.linkType, id: value.sys.id });
  }
  for (const child of Object.values(value)) collectLinks(child, result);
  return result;
}

export function auditSnapshot(entries, assets) {
  const ids = { Entry: new Set(entries.map(item => item.sys.id)), Asset: new Set(assets.map(item => item.sys.id)) };
  const counts = {};
  const missingLinks = [];
  for (const entry of entries) {
    const type = entry.sys.contentType?.sys.id || 'unknown';
    counts[type] = (counts[type] || 0) + 1;
    for (const link of collectLinks(entry.fields)) {
      if (!ids[link.type].has(link.id)) missingLinks.push({ sourceId: entry.sys.id, ...link });
    }
  }
  if (ids.Entry.size !== entries.length || ids.Asset.size !== assets.length) throw new Error('Duplicate IDs in snapshot');
  return { entries: entries.length, assets: assets.length, counts, missingLinks };
}

export function assetUrl(raw) {
  const url = new URL(raw.startsWith('//') ? `https:${raw}` : raw);
  if (url.protocol !== 'https:' || !/^(images|assets|downloads|videos)\.(eu\.)?ctfassets\.net$/.test(url.hostname)) {
    throw new Error('Unexpected asset host');
  }
  return url;
}

export async function snapshot({ space, token, environment = 'master', root, fetcher = fetch }) {
  safe(space); safe(environment);
  if (!token) throw new Error('CTF_CDA_ACCESS_TOKEN is required');
  // Every run has a separate directory. Never overwrite an earlier backup.
  const directory = path.join(root, `${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto.randomUUID().slice(0, 8)}`);
  await mkdir(path.join(directory, 'assets'), { recursive: true });
  const base = `https://cdn.contentful.com/spaces/${space}/environments/${environment}/`;
  const request = async raw => {
    const url = new URL(raw, base);
    if (url.origin !== 'https://cdn.contentful.com' || !url.pathname.startsWith(new URL(base).pathname)) throw new Error('Unexpected API pagination URL');
    url.searchParams.delete('access_token');
    for (let attempt = 0; attempt < 4; attempt++) {
      const response = await fetcher(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(30000), redirect: 'error' });
      if (response.status === 429 && attempt < 3) {
        const delay = Math.min(10, Math.max(1, Number(response.headers.get('x-contentful-ratelimit-reset')) || 1));
        await new Promise(resolve => setTimeout(resolve, delay * 1000));
        continue;
      }
      if (!response.ok) throw new Error(`Contentful ${url.pathname.split('/').at(-1)}: HTTP ${response.status}`);
      return response.json();
    }
  };
  const checksums = {};
  const save = async (name, data) => {
    const bytes = typeof data === 'string' ? Buffer.from(data) : data;
    await writeFile(path.join(directory, name), bytes, { flag: 'wx' });
    checksums[name] = { bytes: bytes.length, sha256: hash(bytes) };
  };
  const items = [];
  let next = 'sync?initial=true&limit=100';
  let page = 0;
  const seen = new Set();
  while (next) {
    if (seen.has(next) || page >= 10000) throw new Error('Invalid sync pagination');
    seen.add(next);
    const response = await request(next);
    if (!Array.isArray(response.items)) throw new Error('Invalid sync response');
    // Preserve raw metadata, but never write a URL containing a credential.
    for (const key of ['nextPageUrl', 'nextSyncUrl']) {
      if (response[key]) {
        const url = new URL(response[key]);
        url.searchParams.delete('access_token');
        response[key] = url.href;
      }
    }
    await save(`sync-${++page}.json`, JSON.stringify(response, null, 2));
    items.push(...response.items);
    next = response.nextPageUrl;
  }
  const list = async endpoint => {
    const result = [];
    let total;
    do {
      const response = await request(`${endpoint}?limit=100&skip=${result.length}`);
      if (!Array.isArray(response.items) || !Number.isInteger(response.total)) throw new Error(`Invalid ${endpoint} response`);
      if (total !== undefined && total !== response.total) throw new Error(`${endpoint} changed during export`);
      total = response.total;
      if (!response.items.length && result.length < total) throw new Error(`Incomplete ${endpoint}`);
      result.push(...response.items);
    } while (result.length < total);
    return result;
  };
  const entries = items.filter(item => item.sys.type === 'Entry');
  const assets = items.filter(item => item.sys.type === 'Asset');
  const contentTypes = await list('content_types');
  const locales = await list('locales');
  await save('content.json', JSON.stringify({ entries, assets, contentTypes, locales }, null, 2));
  const audit = auditSnapshot(entries, assets);
  const files = [];
  const errors = [];
  for (const asset of assets) {
    for (const [locale, file] of Object.entries(asset.fields?.file || {})) {
      if (!file?.url) { errors.push({ assetId: asset.sys.id, locale, reason: 'No file URL' }); continue; }
      try {
        const url = assetUrl(file.url);
        const response = await fetcher(url, { signal: AbortSignal.timeout(60000), redirect: 'error' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const bytes = Buffer.from(await response.arrayBuffer());
        if (!bytes.length || (file.details?.size !== undefined && bytes.length !== file.details.size)) throw new Error('File size mismatch');
        const extension = path.extname(url.pathname).replace(/[^.a-zA-Z0-9]/g, '').slice(0, 16);
        const name = `assets/${safe(asset.sys.id)}-${safe(locale)}${extension}`;
        await save(name, bytes);
        files.push({ assetId: asset.sys.id, locale, sourceUrl: url.href, originalName: file.fileName, path: name, ...checksums[name] });
      } catch (error) {
        // Do not log request objects or authorization headers.
        errors.push({ assetId: asset.sys.id, locale, reason: error.message });
      }
    }
  }
  const manifest = {
    formatVersion: 1, createdAt: new Date().toISOString(), environment,
    source: 'Contentful Delivery API', scope: 'published-only', draftsIncluded: false,
    complete: errors.length === 0 && audit.missingLinks.length === 0,
    ...audit, files, errors, checksums,
  };
  await save('manifest.json', JSON.stringify(manifest, null, 2));
  // Re-read saved bytes: verify the archive, not merely the download buffers.
  for (const [name, expected] of Object.entries(checksums)) {
    if (hash(await readFile(path.join(directory, name))) !== expected.sha256) throw new Error(`Checksum mismatch: ${name}`);
  }
  return { directory, manifest };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  snapshot({ space: process.env.CTF_SPACE_ID, token: process.env.CTF_CDA_ACCESS_TOKEN,
    environment: process.env.CTF_ENVIRONMENT || 'master', root: path.resolve('.migration-private/contentful') })
    .then(({ directory, manifest }) => {
      console.log(JSON.stringify({ directory, entries: manifest.entries, assets: manifest.assets,
        counts: manifest.counts, downloaded: manifest.files.length, missingLinks: manifest.missingLinks.length,
        errors: manifest.errors, scope: manifest.scope, complete: manifest.complete }, null, 2));
      if (!manifest.complete) process.exitCode = 1;
    }).catch(error => { console.error(error.message); process.exitCode = 1; });
}
