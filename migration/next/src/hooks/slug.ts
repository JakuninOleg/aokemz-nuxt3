import { APIError, type FieldHook, type PayloadRequest, type Where } from 'payload';
import { generateSlug, isValidSlug, normalizeSlugInput } from '../lib/slug.mjs';

type RelationID = number | string | { id?: number | string | null } | null | undefined;
type SlugCollection = 'products' | 'categories' | 'news';

function relationID(value: RelationID): number | string | null {
  if (value == null) return null;
  if (typeof value === 'object') {
    const id = value.id;
    return id == null ? null : id;
  }
  return value;
}

/** A category is part of the public product URL, not just a classification. */
export const immutableProductCategory: FieldHook = ({ value, originalDoc, operation }) => {
  if (operation !== 'update' || !originalDoc?.slug || value == null) return value;
  const previous = relationID(originalDoc.category as RelationID);
  const incoming = relationID(value as RelationID);
  if (previous != null && String(incoming) !== String(previous)) {
    throw new APIError('Смена категории меняет адрес товара. Сначала требуется 301-редирект.', 400);
  }
  return value;
};

async function slugTaken(args: {
  collection: SlugCollection;
  candidate: string;
  excludeID?: number | string;
  categoryID?: number | string | null;
  req: PayloadRequest;
}): Promise<boolean> {
  const conditions: Where[] = [{ slug: { equals: args.candidate } }];
  if (args.excludeID != null) {
    conditions.push({ id: { not_equals: args.excludeID } });
  }
  if (args.categoryID != null) {
    conditions.push({ category: { equals: args.categoryID } });
  }
  const found = await args.req.payload.find({
    collection: args.collection,
    where: { and: conditions },
    limit: 1,
    depth: 0,
    overrideAccess: false,
    req: args.req,
  });
  return found.docs.length > 0;
}

/**
 * Automatic readable slug for new records.
 * Catalog addresses stay immutable; news addresses can be edited explicitly.
 * Products are unique within (category, slug); news and categories within slug alone.
 */
export const automaticSlug: FieldHook = async ({
  value,
  data,
  originalDoc,
  req,
  collection,
  operation,
}) => {
  const existing = typeof originalDoc?.slug === 'string' ? originalDoc.slug : '';

  // Keep saved URLs stable when only the title changes. News may be renamed
  // deliberately; catalog URLs still require a redirect registry first.
  if (operation === 'update' && existing) {
    const incoming = typeof value === 'string' ? value.trim() : '';
    if (!incoming || incoming === existing) return existing;
    if (collection?.slug !== 'news') {
      throw new APIError(
        'Изменение опубликованного адреса пока закрыто: сначала требуется 301-редирект.',
        400,
      );
    }
  }

  const provided = normalizeSlugInput(value);
  const base = provided || generateSlug(String(data?.title || ''));
  if (!base) {
    throw new APIError('Введите название или адрес страницы.', 400);
  }
  if (!isValidSlug(base)) {
    throw new APIError('Адрес: только латинские буквы, цифры, дефис и подчёркивание.', 400);
  }

  const collectionSlug = collection!.slug as SlugCollection;
  const categoryScoped = collectionSlug === 'products';
  const categoryID = categoryScoped
    ? relationID((data?.category as RelationID) ?? (originalDoc?.category as RelationID))
    : null;

  if (categoryScoped && categoryID == null) {
    throw new APIError('Выберите категорию до сохранения адреса товара.', 400);
  }

  const excludeID = originalDoc?.id;
  const taken = (candidate: string) =>
    slugTaken({
      collection: collectionSlug,
      candidate,
      excludeID,
      categoryID: categoryScoped ? categoryID : null,
      req,
    });

  // Explicit editor-provided slug: keep as-is if free; never silently rename.
  if (provided) {
    if (await taken(base)) {
      throw new APIError(
        categoryScoped
          ? 'Такой адрес уже занят в этой категории. Укажите другой.'
          : 'Такой адрес уже занят. Укажите другой.',
        400,
      );
    }
    return base;
  }

  for (let suffix = 1; suffix <= 1000; suffix++) {
    const candidate = suffix === 1 ? base : `${base}-${suffix}`;
    if (!isValidSlug(candidate)) continue;
    if (!(await taken(candidate))) return candidate;
  }

  throw new APIError('Не удалось подобрать уникальный адрес страницы.', 400);
};
