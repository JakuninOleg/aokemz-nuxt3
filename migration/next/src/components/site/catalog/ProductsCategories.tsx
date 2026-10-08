import Link from 'next/link';
import { categories, publicMedia } from '@/lib/public-content';
import { MediaImage } from '@/components/site/Content';

export async function ProductsCategories() {
  const records = await categories();
  return (
    <section className="products-cats" aria-labelledby="products-cats-title">
      <div className="ref-container">
        <header className="products-cats__head">
          <h2 id="products-cats-title">Категории продукции</h2>
        </header>
        {!records.length ? (
          <div className="products-status">Категории пока не опубликованы.</div>
        ) : (
          <div className="products-cats__grid">
            {await Promise.all(
              records.map(async (category) => {
                const media = await publicMedia(category.image);
                return (
                  <Link key={category.id} href={`/products/${category.slug}`} className="products-cat">
                    {media ? (
                      <MediaImage
                        className="products-cat__media"
                        media={media}
                        alt={category.title}
                        sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="products-cat__placeholder" aria-hidden="true" />
                    )}
                    <div className="products-cat__shade" aria-hidden="true" />
                    <div className="products-cat__body">
                      <h3>{category.title}</h3>
                      <span className="products-cat__more">
                        Подробнее <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                );
              }),
            )}
          </div>
        )}
      </div>
    </section>
  );
}
