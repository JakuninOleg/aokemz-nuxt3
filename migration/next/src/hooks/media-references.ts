import { APIError, type CollectionBeforeDeleteHook } from 'payload';

/** Relationship values can be IDs or populated documents. Never search arbitrary text. */
export function referencesMedia(value: unknown, id: string | number): boolean {
  const matches = (relation: unknown): boolean => Array.isArray(relation)
    ? relation.some(matches)
    : relation !== null && relation !== undefined && String(typeof relation === 'object' ? (relation as { id?: unknown }).id : relation) === String(id);
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.some(child => referencesMedia(child, id));
  const record = value as Record<string, unknown>;
  if (['image', 'file', 'files'].some(key => matches(record[key]))) return true;
  if (record.type === 'upload' && record.relationTo === 'media' && matches(record.value)) return true;
  return Object.values(record).some(child => referencesMedia(child, id));
}

/** Protect published content, drafts and recoverable revisions, not just the open UI snapshot. */
export const protectReferencedMedia: CollectionBeforeDeleteHook = async ({ req, id }) => {
  for (const collection of ['categories', 'products', 'news', 'documents'] as const) {
    const [published, drafts, versions] = await Promise.all([
      req.payload.find({ collection, depth: 0, pagination: false, overrideAccess: true, req }),
      req.payload.find({ collection, depth: 0, pagination: false, draft: true, overrideAccess: true, req }),
      req.payload.findVersions({ collection, depth: 0, pagination: false, overrideAccess: true, req }),
    ]);
    if ([published.docs, drafts.docs, versions.docs.map(item => item.version)].some(records => referencesMedia(records, id))) {
      throw new APIError('Файл используется в материале, черновике или сохранённой версии. Удаление запрещено.', 409);
    }
  }
};
