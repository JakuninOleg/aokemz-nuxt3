import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categoryRoutes, categoryBySlug, productBySlug, productsForCategory, publicMedia } from '@/lib/public-content';
import { productLeadFromDescription, relatedProducts, specificationModels } from '@/lib/catalog-content';
import { ProductDetail } from '@/components/site/catalog/ProductDetail';
import { productSearchCopy } from '@/lib/catalog-seo';
import { pageMetadata } from '@/lib/static-content/page-seo';

type Props = { params: Promise<{ category: string; product: string }> };

export const revalidate = 60;
export async function generateStaticParams() {
  return (await Promise.all((await categoryRoutes()).map(async category =>
    (await productsForCategory(category.id)).map(record => ({ category: category.slug, product: record.slug }))
  ))).flat();
}

async function recordFor(params: Props['params']) {
  const route = await params;
  const category = await categoryBySlug(route.category);
  if (!category) notFound();
  const product = await productBySlug(category.id, route.product);
  if (!product) notFound();
  return { category, product };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product, category } = await recordFor(params);
  const lead = productLeadFromDescription(product.description);
  const media = await publicMedia(product.image);
  const path = `/products/${category.slug}/${product.slug}`;
  const copy = productSearchCopy(product, lead, specificationModels(product.specifications), category.title);
  return pageMetadata({ ...copy, title: `${copy.title} | ОАО «КЭМЗ»`, path,
    ...(media ? { ogImage: media.url } : {}) });
}

export default async function ProductPage({ params }: Props) {
  const { category, product } = await recordFor(params);
  const media = await publicMedia(product.image);
  const leadText = productLeadFromDescription(product.description);
  const related = await relatedProducts(category.slug, category.id, product.slug);
  return (
    <ProductDetail
      category={{ title: category.title, slug: category.slug }}
      product={product}
      media={media}
      leadText={leadText}
      related={related}
    />
  );
}
