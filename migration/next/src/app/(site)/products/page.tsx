import type { Metadata } from 'next';
import { allCatalogProducts, PRODUCTS_HERO } from '@/lib/catalog-content';
import { ProductsHero } from '@/components/site/catalog/ProductsHero';
import { ProductsCategories } from '@/components/site/catalog/ProductsCategories';
import { ProductsCatalog } from '@/components/site/catalog/ProductsCatalog';
import { ProductsCta } from '@/components/site/catalog/ProductsCta';
import { JsonLd } from '@/components/site/Content';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Каталог продукции — электродвигатели и приводы',
  description:
    'Каталог электрических машин КЭМЗ: экскаваторные комплекты, буровые двигатели, шахтные, тяговые машины и высоковольтная аппаратура.',
  alternates: { canonical: 'https://aokemz.ru/products' },
  openGraph: {
    title: 'Каталог продукции | ОАО «КЭМЗ»',
    description: PRODUCTS_HERO.lead,
    url: 'https://aokemz.ru/products',
    images: [{ url: PRODUCTS_HERO.image }],
  },
};

export default async function CatalogPage() {
  const catalog = await allCatalogProducts();
  return (
    <div className="kemz-home kemz-products">
      <ProductsHero />
      <ProductsCategories />
      <ProductsCatalog categories={catalog.categories} items={catalog.items} />
      <ProductsCta />
      <JsonLd
        value={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Каталог продукции ОАО «КЭМЗ»',
          url: 'https://aokemz.ru/products',
          description: PRODUCTS_HERO.lead,
        }}
      />
    </div>
  );
}
