import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categoryRoutes, categoryBySlug, productsForCategory, publicMedia } from '@/lib/public-content';
import {
  categoryEquipmentItems,
  categoryHeroLead,
  categoryHeroMedia,
  categorySpecOptions,
  hasSpecifications,
} from '@/lib/catalog-content';
import { RichContent, JsonLd } from '@/components/site/Content';
import { CategoryHero } from '@/components/site/catalog/CategoryHero';
import { CategoryPageView } from '@/components/site/catalog/CategoryPageView';
import { CategorySpecPanel } from '@/components/site/catalog/CategorySpecifications';
import { CategoryDocuments } from '@/components/site/catalog/CategoryDocuments';
import { CategoryCta } from '@/components/site/catalog/CategoryCta';
import { categorySearchCopy } from '@/lib/catalog-seo';
import { pageMetadata } from '@/lib/static-content/page-seo';

type Props = { params: Promise<{ category: string }> };

export const revalidate = 60;
export async function generateStaticParams() {
  return (await categoryRoutes()).map(record => ({ category: record.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const record = await categoryBySlug(slug);
  if (!record) notFound();
  const hero = await categoryHeroMedia(record.slug, record.image, record.title);
  const copy = categorySearchCopy(record);
  return pageMetadata({ ...copy, title: `${copy.title} | ОАО «КЭМЗ»`,
    path: `/products/${record.slug}`, ogImage: hero.src });
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const record = await categoryBySlug(slug);
  if (!record) notFound();

  const products = await productsForCategory(record.id);
  const lead = categoryHeroLead(record.slug, record.description);
  const hero = await categoryHeroMedia(record.slug, record.image, record.title);
  const equipment = await categoryEquipmentItems(record.slug, products);
  const specOptions = await categorySpecOptions(record.slug, products);
  const files = (await Promise.all((record.files || []).map(publicMedia))).filter(
    (file): file is NonNullable<typeof file> => Boolean(file),
  );
  const withSpecs = products.filter((product) => hasSpecifications(product.specifications));
  const path = `/products/${record.slug}`;

  return (
    <div className="kemz-home kemz-products kemz-category">
      <CategoryHero title={record.title} lead={lead} image={hero.src} imageAlt={hero.alt || record.title} />
      <CategoryPageView
        equipment={equipment}
        hasDocuments={files.length > 0}
        specOptions={specOptions}
        specPanels={withSpecs.map((product) => (
          <CategorySpecPanel key={product.id} id={String(product.id)}>
            <RichContent data={product.specifications} />
          </CategorySpecPanel>
        ))}
      />
      <CategoryDocuments files={files} />
      <CategoryCta />
      <JsonLd
        value={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://aokemz.ru/' },
            { '@type': 'ListItem', position: 2, name: 'Продукция', item: 'https://aokemz.ru/products' },
            { '@type': 'ListItem', position: 3, name: record.title, item: `https://aokemz.ru${path}` },
          ],
        }}
      />
    </div>
  );
}
