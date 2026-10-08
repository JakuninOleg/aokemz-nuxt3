import 'server-only';
import { cache } from 'react';
import { getPayload } from 'payload';
import config from '@payload-config';
import type { Product } from '@/payload-types';
import { categories, productsForCategory, publicMedia, type PublicMedia } from '@/lib/public-content';

const cms = cache(() => getPayload({ config }));
const published = { _status: { equals: 'published' as const } };

export const PRODUCTS_HERO = {
  title: 'Каталог продукции',
  lead: 'Электрические машины главных приводов для карьерной техники, буровых установок и шахтного оборудования.',
  points: ['Собственное производство', 'Комплекты под тип машины', 'Поставка по России и СНГ'] as const,
  rail: ['Технологии', 'Надёжность', 'Развитие'] as const,
  image: '/media/generated/hero-quarry-dragline-wide-v11.webp',
  mobileImage: '/media/generated/hero-quarry-dragline-wide-v11-960.webp',
  imageAlt: 'Карьерный экскаватор на фоне карьера в сумерках, промышленная иллюстрация',
} as const;

export const PRODUCTS_CTA = {
  title: 'Не нашли нужное оборудование?',
  lead: 'Опишите тип машины и привод: отдел продаж подскажет по номенклатуре и срокам.',
  button: 'Запросить подбор',
  aside: ['Опыт', 'Качество', 'Сотрудничество'] as const,
  image: '/media/documents/docs-cta-motors.webp',
  imageAlt: 'Электродвигатели в цехе и чертёж на синем фоне, промышленная иллюстрация',
} as const;

export const CATEGORY_CTA = {
  title: 'Нужна помощь в подборе оборудования?',
  lead: 'Укажите модель техники и условия эксплуатации. Специалисты помогут подобрать оборудование и ответят на вопросы.',
  button: 'Связаться с инженером',
  aside: ['Опыт', 'Технологии', 'Надёжность'] as const,
  image: '/media/about/about-engineer-blueprint.webp',
  imageAlt: 'Инженер с чертежом у промышленного оборудования, иллюстрация',
} as const;

export const CATEGORY_HERO_OVERRIDES = {
  mining: {
    image: '/media/products/heroes/category-mining-hero-v1.webp',
    alt: 'Горная машина в подземной выработке, иллюстрация',
  },
  belaz: {
    image: '/media/products/heroes/category-belaz-hero-v1.webp',
    alt: 'Карьерный самосвал на технологической дороге, иллюстрация',
  },
  'drilling-rigs': {
    image: '/media/products/heroes/category-drilling-rigs-hero-v1.webp',
    alt: 'Буровая установка на промышленной площадке, иллюстрация',
  },
  'railway-transport': {
    image: '/media/products/heroes/category-railway-transport-hero-v1.webp',
    alt: 'Грузовой электровоз на промышленных путях, иллюстрация',
  },
  'urban-electric-transport': {
    image: '/media/products/heroes/category-urban-electric-transport-hero-v1.webp',
    alt: 'Городской трамвай на путях, иллюстрация',
  },
  other: {
    image: '/media/products/heroes/category-other-hero-v1.webp',
    alt: 'Высоковольтные изоляторы и компоненты в цехе, иллюстрация',
  },
  'new-developments': {
    image: '/media/products/heroes/category-new-developments-hero-v1.webp',
    alt: 'Сборка электрической машины на испытательном участке, иллюстрация',
  },
} as const;

export const CATEGORY_HERO_LEAD_OVERRIDES: Record<string, string> = {
  'new-developments':
    'Новые разработки КЭМЗ для задач заказчиков. Доступные варианты и сроки уточняйте у специалистов.',
};

type LexNode = {
  type?: string;
  text?: string;
  children?: LexNode[];
};

function plainText(node?: LexNode | null): string {
  if (!node) return '';
  if (typeof node.text === 'string') return node.text;
  const joiner = node.type === 'paragraph' || node.type === 'linebreak' ? ' ' : '';
  return (node.children || [])
    .map(plainText)
    .join(joiner)
    .replace(/\s+/g, ' ')
    .trim();
}

export function lexicalPlainText(data: Product['description'] | Product['specifications']): string {
  return plainText(data?.root as LexNode | undefined);
}

/** Use the model names in the published specification, never infer them from a slug. */
export function specificationModels(data: Product['specifications']): string {
  function find(node: LexNode): string {
    if (node.type === 'tablerow' && /^(тип двигателя|тип машины|модель)$/i.test(plainText(node.children?.[0]))) {
      return (node.children || []).slice(1).map(plainText).filter(Boolean).join(', ');
    }
    return (node.children || []).map(find).find(Boolean) || '';
  }
  return data?.root ? find(data.root as LexNode) : '';
}

export function productLeadFromDescription(data: Product['description'], maxLen = 180): string {
  const text = lexicalPlainText(data);
  if (!text) return '';
  const sentence = text.match(/^[\s\S]+?[.!?…](?=\s|$)/)?.[0]?.trim();
  const lead = sentence || text;
  if (lead.length <= maxLen) return lead;
  const prefix = lead.slice(0, maxLen - 1);
  const boundary = prefix.lastIndexOf(' ');
  return `${prefix.slice(0, boundary > maxLen / 2 ? boundary : prefix.length).trimEnd()}…`;
}

function tableSpecs(node: LexNode): { label: string; value: string }[] {
  if (node.type !== 'table') return (node.children || []).flatMap(tableSpecs);
  const rows = node.children || [];
  if (rows.some((row) => (row.children || []).length !== 2)) return [];
  return rows
    .map((row) => {
      const cells = row.children || [];
      return { label: plainText(cells[0]), value: plainText(cells[1]) };
    })
    .filter(
      (row) =>
        row.label &&
        row.value &&
        !/значени[ея] параметр/i.test(row.value) &&
        row.label.length < 85 &&
        row.value.length < 65,
    );
}

export function catalogSpecs(data: Product['specifications']): { label: string; value: string }[] {
  if (!data?.root) return [];
  return tableSpecs(data.root as LexNode).slice(0, 3);
}

export function hasSpecifications(data: Product['specifications']): boolean {
  const children = (data?.root as LexNode | undefined)?.children || [];
  return children.some(
    (node) => node.type === 'table' || Boolean(node.children?.length),
  );
}

export type CatalogFilterCategory = { id: string; name: string };

/** Minimal public props for client-side catalog filters — no rich text / sourceRecord. */
export type CatalogFilterItem = {
  id: string;
  name: string;
  type: string;
  order: number;
  categoryId: string;
  categoryName: string;
  href: string;
  imageUrl: string | null;
  imageSrcSet?: string;
  imageAlt: string;
  description: string;
  specs: { label: string; value: string }[];
};

export type CategoryEquipmentItem = {
  id: string;
  name: string;
  type: string;
  href: string;
  imageUrl: string | null;
  imageSrcSet?: string;
  imageAlt: string;
  hasParams: boolean;
};

export type CategorySpecOption = {
  id: string;
  name: string;
  href: string;
  imageUrl: string | null;
  imageSrcSet?: string;
  imageAlt: string;
};

export type RelatedProductItem = {
  id: string;
  name: string;
  type: string;
  href: string;
  imageUrl: string | null;
  imageSrcSet?: string;
  imageAlt: string;
};

export function categoryHeroLead(slug: string, description?: string | null): string {
  if (CATEGORY_HERO_LEAD_OVERRIDES[slug]) return CATEGORY_HERO_LEAD_OVERRIDES[slug];
  const trimmed = description?.trim();
  if (trimmed) return trimmed;
  if (slug === 'excavator') {
    return 'Электрические машины и комплекты приводов для карьерных и шагающих экскаваторов.';
  }
  return 'Модели, технические характеристики и документация. Подбор оборудования под вашу задачу.';
}

export async function categoryHeroMedia(
  slug: string,
  categoryImage: Parameters<typeof publicMedia>[0],
  categoryTitle: string,
): Promise<{ src: string; alt: string }> {
  const override = CATEGORY_HERO_OVERRIDES[slug as keyof typeof CATEGORY_HERO_OVERRIDES];
  if (slug === 'excavator') {
    return { src: PRODUCTS_HERO.image, alt: categoryTitle || 'Оборудование КЭМЗ' };
  }
  if (override) return { src: override.image, alt: override.alt };
  const media = await publicMedia(categoryImage);
  return {
    src: media?.url || PRODUCTS_HERO.image,
    alt: media?.alt && /[А-Яа-яЁё]/.test(media.alt) ? media.alt : categoryTitle || 'Оборудование КЭМЗ',
  };
}

export const allCatalogProducts = cache(async (): Promise<{
  categories: CatalogFilterCategory[];
  items: CatalogFilterItem[];
}> => {
  const payload = await cms();
  const visible = await categories();
  const visibleIds = new Set(visible.map((item) => item.id));
  const byId = new Map(visible.map((item) => [item.id, item]));

  const result = await payload.find({
    collection: 'products',
    overrideAccess: false,
    depth: 0,
    pagination: false,
    where: published,
    sort: ['order', 'id'],
    select: {
      title: true,
      slug: true,
      category: true,
      equipmentType: true,
      order: true,
      image: true,
      description: true,
      specifications: true,
    },
  });

  // Resolve media concurrently, not one database round trip per card in series.
  const mediaByProduct = new Map(await Promise.all(result.docs.filter(product => {
    const categoryId = typeof product.category === 'number' ? product.category : product.category?.id;
    return categoryId && visibleIds.has(categoryId);
  }).map(async product => [product.id, await publicMedia(product.image)] as const)));
  const items: CatalogFilterItem[] = [];
  for (const product of result.docs) {
    const categoryId = typeof product.category === 'number' ? product.category : product.category?.id;
    if (!categoryId || !visibleIds.has(categoryId)) continue;
    const category = byId.get(categoryId);
    if (!category?.slug) continue;
    const media = mediaByProduct.get(product.id);
    const description = lexicalPlainText(product.description);
    items.push({
      id: String(product.id),
      name: product.title,
      type: product.equipmentType?.trim() || '',
      order: product.order ?? 0,
      categoryId: String(categoryId),
      categoryName: category.title,
      href: `/products/${category.slug}/${product.slug}`,
      imageUrl: media?.url || null,
      imageSrcSet: media?.srcSet,
      imageAlt: media?.alt && /[А-Яа-яЁё]/.test(media.alt) ? media.alt : product.title,
      description,
      specs: catalogSpecs(product.specifications),
    });
  }

  return {
    categories: visible.map((item) => ({ id: String(item.id), name: item.title })),
    items,
  };
});

export async function categoryEquipmentItems(
  categorySlug: string,
  products: Awaited<ReturnType<typeof productsForCategory>>,
): Promise<CategoryEquipmentItem[]> {
  return Promise.all(
    products.map(async (product) => {
      const media = await publicMedia(product.image);
      return {
        id: String(product.id),
        name: product.title,
        type: product.equipmentType?.trim() || '',
        href: `/products/${categorySlug}/${product.slug}`,
        imageUrl: media?.url || null,
        imageSrcSet: media?.srcSet,
        imageAlt: media?.alt && /[А-Яа-яЁё]/.test(media.alt) ? media.alt : product.title,
        hasParams: hasSpecifications(product.specifications),
      };
    }),
  );
}

export async function categorySpecOptions(
  categorySlug: string,
  products: Awaited<ReturnType<typeof productsForCategory>>,
): Promise<CategorySpecOption[]> {
  const withSpecs = products.filter((product) => hasSpecifications(product.specifications));
  return Promise.all(
    withSpecs.map(async (product) => {
      const media = await publicMedia(product.image);
      return {
        id: String(product.id),
        name: product.title,
        href: `/products/${categorySlug}/${product.slug}`,
        imageUrl: media?.url || null,
        imageSrcSet: media?.srcSet,
        imageAlt: media?.alt && /[А-Яа-яЁё]/.test(media.alt) ? media.alt : product.title,
      };
    }),
  );
}

export async function relatedProducts(
  categorySlug: string,
  categoryId: number,
  excludeSlug: string,
): Promise<RelatedProductItem[]> {
  const payload = await cms();
  const result = await payload.find({
    collection: 'products',
    overrideAccess: false,
    depth: 0,
    limit: 4,
    where: {
      and: [
        published,
        { category: { equals: categoryId } },
        { slug: { not_equals: excludeSlug } },
      ],
    },
    sort: ['order', 'id'],
    select: {
      title: true,
      slug: true,
      equipmentType: true,
      image: true,
    },
  });

  return Promise.all(
    result.docs.map(async (product) => {
      const media = await publicMedia(product.image);
      return {
        id: String(product.id),
        name: product.title,
        type: product.equipmentType?.trim() || '',
        href: `/products/${categorySlug}/${product.slug}`,
        imageUrl: media?.url || null,
        imageSrcSet: media?.srcSet,
        imageAlt: media?.alt && /[А-Яа-яЁё]/.test(media.alt) ? media.alt : product.title,
      };
    }),
  );
}

export type { PublicMedia };
