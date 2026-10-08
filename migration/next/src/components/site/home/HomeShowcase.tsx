import Link from 'next/link';
import { categories } from '@/lib/public-content';
import { HOME_SHOWCASE_TILES, matchShowcaseHref } from '@/lib/home-content';

export async function HomeShowcase() {
  const records = await categories();
  const tiles = matchShowcaseHref(
    HOME_SHOWCASE_TILES,
    records.map((item) => ({ title: item.title, slug: item.slug })),
  );

  return (
    <section className="ref-showcase" aria-labelledby="products-title">
      <header className="ref-container ref-showcase__heading">
        <div>
          <p className="ref-label">Направления деятельности</p>
          <h2 id="products-title" className="ref-title">
            Оборудование
            <br />
            для ключевых задач
          </h2>
        </div>
        <p className="ref-showcase__intro">
          Электрические машины и комплектующие
          <br />
          для горнодобывающей промышленности и транспортной отрасли.
        </p>
        <Link href="/products" className="ref-link">
          Смотреть всю продукцию <span aria-hidden="true">→</span>
        </Link>
      </header>
      <div className="ref-wide ref-showcase__grid">
        {tiles.map((product, index) => (
          <Link
            key={product.image}
            href={product.href}
            className={[
              'ref-product',
              `ref-product--${product.theme}`,
              index === 0 ? 'ref-product--featured' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <img
              src={`/media/generated/${product.image}-720.webp`}
              srcSet={`/media/generated/${product.image}-480.webp 480w, /media/generated/${product.image}-720.webp 720w`}
              sizes="(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 720px"
              alt={product.alt}
              width={720}
              height={480}
              loading="lazy"
              decoding="async"
            />
            <div className="ref-product__copy">
              <h3>{product.title}</h3>
              <p>{product.text}</p>
            </div>
            <span className="ref-product__more">
              Подробнее <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
