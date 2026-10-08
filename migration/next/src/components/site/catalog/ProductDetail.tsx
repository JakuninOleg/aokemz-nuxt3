import Link from '@/components/site/PublicLink';
import { HomeActionButton } from '@/components/site/home/HomeActionButton';
import { HomeEngineeringIcon } from '@/components/site/home/HomeEngineeringIcon';
import { Breadcrumbs, JsonLd, MediaImage, RichContent } from '@/components/site/Content';
import type { PublicMedia } from '@/lib/public-content';
import type { Product } from '@/payload-types';
import { CATEGORY_CTA } from '@/lib/catalog-content';
import { CatalogCtaBand } from './CatalogCtaBand';
import { ProductRelated } from './ProductRelated';
import type { RelatedProductItem } from '@/lib/catalog-content';

type Props = {
  category: { title: string; slug: string };
  product: Pick<Product, 'title' | 'slug' | 'equipmentType' | 'description' | 'specifications'>;
  media: PublicMedia | null;
  leadText: string;
  related: RelatedProductItem[];
};

export async function ProductDetail({ category, product, media, leadText, related }: Props) {
  const path = `/products/${category.slug}/${product.slug}`;
  const url = `https://aokemz.ru${path}`;
  const typeLabel = product.equipmentType?.trim() || '';
  const showType =
    typeLabel && typeLabel.toLowerCase() !== category.title.trim().toLowerCase();

  return (
    <div className="kemz-home kemz-products kemz-product-detail">
      <link rel="preload" as="image" href="/media/about/about-blueprint-product-v2.webp" />
      <section className="product-top">
        <div className="ref-container">
          <div className="product-top__crumbs">
            <Breadcrumbs
              items={[
                ['Главная', '/'],
                ['Продукция', '/products'],
                [category.title, `/products/${category.slug}`],
                [product.title],
              ]}
            />
          </div>
          <div className="product-top__grid">
            <figure className="product-top__media">
              {media ? (
                <MediaImage media={media} alt={product.title} priority sizes="(max-width: 720px) 100vw, 50vw" />
              ) : (
                <span className="product-image-empty">Изображение уточняется</span>
              )}
            </figure>
            <div>
              <p className="product-top__label">{category.title}</p>
              <h1>{product.title}</h1>
              {showType ? <p className="product-top__sub">{typeLabel}</p> : null}
              {leadText ? <p className="product-top__lead">{leadText}</p> : null}
              <div className="product-top__actions">
                <HomeActionButton href="/contacts">Запросить подбор</HomeActionButton>
              </div>
              <ul className="product-assurances">
                <li>
                  <HomeEngineeringIcon name="factory" />
                  <span>Собственное производство</span>
                </li>
                <li>
                  <HomeEngineeringIcon name="test" />
                  <span>Испытания на заводских стендах</span>
                </li>
                <li>
                  <HomeEngineeringIcon name="globe" />
                  <span>Россия и страны СНГ</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="ref-container product-layout">
        <nav className="product-nav" aria-label="Разделы карточки">
          {product.description ? <a href="#description">Описание</a> : null}
          {product.specifications ? <a href="#specifications">Технические данные</a> : null}
          <Link href={`/products/${category.slug}`} className="product-back" style={{ marginTop: 12 }}>
            ← К списку продукции
          </Link>
        </nav>
        <div>
          {product.description ? (
            <section id="description" className="product-section">
              <h2>Описание</h2>
              <div className="product-section__grid">
                <RichContent data={product.description} />
                <figure className="product-aside-figure">
                  <img
                    src={media?.url || '/media/documents/docs-cta-motors.webp'}
                    alt={
                      media
                        ? product.title
                        : 'Электрические машины, промышленная иллюстрация'
                    }
                    width={640}
                    height={480}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>Надёжность в каждой детали</figcaption>
                </figure>
              </div>
            </section>
          ) : null}
        </div>
      </div>

      {product.specifications ? (
        <section id="specifications" className="ref-container product-specifications">
          <h2>
            <HomeEngineeringIcon name="document" />
            Технические данные
          </h2>
          <div
            className="product-specifications__scroll"
            role="region"
            aria-label="Технические характеристики изделия"
            tabIndex={0}
          >
            <RichContent data={product.specifications} />
          </div>
        </section>
      ) : null}

      <CatalogCtaBand
        className="product-detail-cta ref-container"
        title={CATEGORY_CTA.title}
        lead={CATEGORY_CTA.lead}
        image="/media/documents/docs-cta-motors.webp"
        imageAlt="Электродвигатели в цехе и чертёж на синем фоне"
        buttonLabel="Связаться с инженером"
        aside={CATEGORY_CTA.aside}
        titleId="product-cta-title"
      />

      <ProductRelated categoryHref={`/products/${category.slug}`} items={related} />

      <JsonLd
        value={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://aokemz.ru/' },
            { '@type': 'ListItem', position: 2, name: 'Продукция', item: 'https://aokemz.ru/products' },
            {
              '@type': 'ListItem',
              position: 3,
              name: category.title,
              item: `https://aokemz.ru/products/${category.slug}`,
            },
            { '@type': 'ListItem', position: 4, name: product.title, item: url },
          ],
        }}
      />
      <JsonLd
        value={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.title,
          url,
          ...(leadText ? { description: leadText } : {}),
          ...(media ? { image: media.url } : {}),
        }}
      />
    </div>
  );
}
