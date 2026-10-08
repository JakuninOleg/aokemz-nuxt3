import 'server-only';
import { cache } from 'react';
import { getPayload } from 'payload';
import config from '@payload-config';
import { publicMedia } from '@/lib/public-content';

const published = { _status: { equals: 'published' } };

export type CmsDocumentItem = {
  id: number;
  title: string;
  href: string;
  ext: 'PDF' | 'DOCX';
  note: string;
};

function extFromMedia(filename?: string | null, mimeType?: string | null): 'PDF' | 'DOCX' {
  const name = (filename || '').toLowerCase();
  if (name.endsWith('.docx') || mimeType?.includes('wordprocessingml') || mimeType?.includes('msword')) {
    return 'DOCX';
  }
  return 'PDF';
}

/** Published documents only; explicit public selects (no source* / admin fields). */
export const publishedDocuments = cache(async (): Promise<CmsDocumentItem[]> => {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'documents',
    overrideAccess: false,
    depth: 0,
    pagination: false,
    where: published,
    sort: ['sourceCreatedAt', 'id'],
    select: { names: true, file: true },
  });

  const items: CmsDocumentItem[] = [];
  for (const doc of result.docs) {
    if (!doc.file) continue;
    try {
      const media = await publicMedia(doc.file);
      if (!media?.url) continue;
      const title = doc.names?.find((n) => n?.trim())?.trim() || media.title || media.filename || 'Документ';
      const note = (doc.names || []).slice(1).map((n) => n?.trim()).filter(Boolean).join(' · ');
      items.push({
        id: doc.id,
        title,
        href: media.url,
        ext: extFromMedia(media.filename, media.mimeType),
        note,
      });
    } catch {
      // Skip broken media relationships; never invent files.
    }
  }
  return items;
});
