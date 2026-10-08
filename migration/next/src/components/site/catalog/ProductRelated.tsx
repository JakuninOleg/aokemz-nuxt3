import Link from '@/components/site/PublicLink';
import type { RelatedProductItem } from '@/lib/catalog-content';

export function ProductRelated({
  categoryHref,
  items,
}: {
  categoryHref: string;
  items: RelatedProductItem[];
}) {
  if (!items.length) return null;
  return (
    <section className="ref-container product-related" aria-labelledby="product-related-title">
      <header>
        <h2 id="product-related-title">Другие продукты в категории</h2>
        <Link href={categoryHref} className="ref-link">
          Перейти в категорию <span aria-hidden="true">→</span>
        </Link>
      </header>
      <div className="product-related__grid">
        {items.map((item) => (
          <Link key={item.id} href={item.href} className="product-related__card">
            <div className="product-related__image">
              {item.imageUrl ? (
                <img src={item.imageUrl} srcSet={item.imageSrcSet} sizes="(max-width: 720px) 90vw, 25vw" alt={item.imageAlt} width={420} height={300} loading="lazy" />
              ) : (
                <span>Изображение уточняется</span>
              )}
            </div>
            <h3>{item.name}</h3>
            {item.type ? <p>{item.type}</p> : null}
            <span className="ref-link">
              Подробнее <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
