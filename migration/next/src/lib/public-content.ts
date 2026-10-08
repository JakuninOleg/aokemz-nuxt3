import 'server-only';
import { cache } from 'react';
import { getPayload, createLocalReq } from 'payload';
import config from '@payload-config';
import { getStorageFilePath } from '@payloadcms/plugin-cloud-storage/utilities';
import type { Category, Product, News, Media } from '@/payload-types';
import { isUsableImageVariant } from './media-policy';

const cms = cache(() => getPayload({ config }));
const published = { _status: { equals: 'published' } };
// Include existing public URLs even when a category is hidden from navigation.
// This does not publish drafts or change the catalog's visibility rules.
export const categoryRoutes = cache(async () => (await (await cms()).find({
  collection: 'categories', overrideAccess: false, depth: 0, pagination: false,
  where: published, select: { slug: true },
})).docs);
export const categories = cache(async () => (await (await cms()).find({
  collection: 'categories', overrideAccess: false, depth: 0, pagination: false,
  where: { and: [published, { visible: { equals: true } }] }, sort: ['sourceCreatedAt', 'id'],
  select: { title: true, slug: true, description: true, image: true, files: true },
})).docs);
export const categoryBySlug = cache(async (slug: string) => {
  const result = await (await cms()).find({ collection: 'categories', depth: 0, overrideAccess: false,
    where: { and: [published, { slug: { equals: slug } }] }, limit: 1,
    select: { title: true, slug: true, description: true, image: true, files: true } });
  return result.docs[0] || null;
});
export const productsForCategory = cache(async (categoryID: number) => (await (await cms()).find({
  collection: 'products', overrideAccess: false, depth: 0, pagination: false,
  where: { and: [published, { category: { equals: categoryID } }] }, sort: ['order', 'id'],
  select: { title: true, slug: true, category: true, equipmentType: true, image: true, description: true, specifications: true },
})).docs);
export const productBySlug = cache(async (categoryID: number, slug: string) => {
  const result = await (await cms()).find({ collection: 'products', overrideAccess: false, depth: 0, limit: 1,
    where: { and: [published, { category: { equals: categoryID } }, { slug: { equals: slug } }] },
    select: { title: true, slug: true, category: true, equipmentType: true, image: true, description: true, specifications: true } });
  return result.docs[0] || null;
});
export const news = cache(async () => (await (await cms()).find({
  collection: 'news', overrideAccess: false, depth: 0, pagination: false, where: published,
  sort: ['-publishedAt', '-id'], select: { title: true, slug: true, legacyId: true, publishedAt: true, updatedAt: true, summary: true, image: true },
})).docs);
export const newsBySlug = cache(async (slug: string) => {
  const result = await (await cms()).find({ collection: 'news', overrideAccess: false, depth: 0, limit: 1,
    where: { and: [published, { slug: { equals: slug } }] },
    select: { title: true, slug: true, legacyId: true, publishedAt: true, updatedAt: true, summary: true, image: true, body: true } });
  return result.docs[0] || null;
});
export const newsPath = (record: Pick<News, 'slug'>) => `/news/${encodeURIComponent(record.slug)}`;

export type PublicMedia = Pick<Media, 'id' | 'alt' | 'title' | 'mimeType' | 'width' | 'height' | 'filename'> & {
  url: string; srcSet?: string;
};
const readMedia = cache(async (id: number): Promise<PublicMedia | null> => {
  // Called exclusively for a relationship from an already published public record.
  // Media's administrative REST collection remains private; no raw import fields are exposed.
  const payload = await cms();
  const doc = await payload.findByID({ collection: 'media', id, depth: 0, overrideAccess: true,
    select: { title: true, alt: true, filename: true, width: true, height: true, mimeType: true, sizes: true, prefix: true, _objectKey: true } });
  const req = await createLocalReq({}, payload);
  const collection = payload.collections.media.config;
  const urlFor = async (filename: string) => {
    const key = await getStorageFilePath({ doc: { id: doc.id, prefix: doc.prefix ?? undefined, _objectKey: doc._objectKey ?? undefined }, filename, collectionPrefix: 'kemz/media', collection, req });
    return new URL(`${process.env.S3_BUCKET}/${key.split('/').map(encodeURIComponent).join('/')}`, `${process.env.S3_ENDPOINT}/`).href;
  };
  const image = doc.mimeType?.startsWith('image/');
  const variants = [...new Map(Object.values(doc.sizes || {}).filter(isUsableImageVariant).map(size => [size.width, size])).values()];
  // Never silently serve a heavy original when image processing did not succeed.
  if (image && !isUsableImageVariant(doc.sizes?.content)) return null;
  const preferred = image ? doc.sizes!.content!.filename : doc.filename;
  if (!preferred) throw new Error('Published media has no filename');
  const srcSet = (await Promise.all(variants.map(async size => `${await urlFor(size.filename!)} ${size.width}w`))).join(', ');
  return { id: doc.id, alt: doc.alt, title: doc.title, mimeType: doc.mimeType, width: image ? doc.sizes!.content!.width : doc.width,
    height: image ? doc.sizes!.content!.height : doc.height, filename: doc.filename, url: await urlFor(preferred), srcSet: srcSet || undefined };
});
export async function publicMedia(value: Category['image']): Promise<PublicMedia | null> {
  return value ? readMedia(typeof value === 'number' ? value : value.id) : null;
}

export async function publicRichText(data: Product['description']) {
  if (!data) return null;
  // Work on a copy: never mutate Payload cache values or publish arbitrary media IDs from the client.
  const copy = structuredClone(data);
  const visit = async (node: Record<string, unknown>) => {
    if (node.type === 'upload' && node.relationTo === 'media' && node.value) {
      const value = node.value as number | { id: number };
      node.value = await readMedia(typeof value === 'number' ? value : value.id);
    }
    if (Array.isArray(node.children)) await Promise.all(node.children.map(child => visit(child)));
  };
  await visit(copy.root);
  return copy;
}
