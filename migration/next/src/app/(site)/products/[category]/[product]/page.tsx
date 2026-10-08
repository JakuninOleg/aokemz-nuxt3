import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categoryBySlug, productBySlug, publicMedia } from '@/lib/public-content';
import { productLeadFromDescription, relatedProducts, specificationModels } from '@/lib/catalog-content';
import { ProductDetail } from '@/components/site/catalog/ProductDetail';

type Props = { params: Promise<{ category: string; product: string }> };

export const dynamic = 'force-dynamic';

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
  const lead =
    productLeadFromDescription(product.description) ||
    `${product.title}: технические данные и применение. ОАО «Карпинский электромашиностроительный завод», Карпинск.`;
  const media = await publicMedia(product.image);
  const path = `/products/${category.slug}/${product.slug}`;
  const models = specificationModels(product.specifications);
  const title = `${product.title}${models && !product.title.includes(models) ? ` (${models})` : ''} — ${category.title}`;
  return {
    title,
    description: lead,
    alternates: { canonical: `https://aokemz.ru${path}` },
    openGraph: {
      title: `${title} | ОАО «КЭМЗ»`,
      description: lead,
      url: `https://aokemz.ru${path}`,
      ...(media ? { images: [{ url: media.url }] } : {}),
    },
  };
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
