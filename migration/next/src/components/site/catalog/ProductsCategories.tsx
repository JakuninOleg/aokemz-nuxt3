import Link from '@/components/site/PublicLink';
import { categories, categoryRoutes, publicMedia } from '@/lib/public-content';
import { CATEGORY_EDITORIAL } from '@/lib/category-editorial';
import { MediaImage } from '@/components/site/Content';

export async function ProductsCategories() {
  const records = await categories();
  const additionalRoutes = (await categoryRoutes()).filter(category =>
    !records.some(record => record.slug === category.slug) && CATEGORY_EDITORIAL[category.slug]);
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
                        sizes="(max-width: 720px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
        {additionalRoutes.length > 0 && (
          <nav className="products-status" aria-label="Серийные характеристики оборудования">
            {additionalRoutes.map(category => (
              <Link key={category.slug} href={`/products/${category.slug}`}>
                {CATEGORY_EDITORIAL[category.slug].label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
