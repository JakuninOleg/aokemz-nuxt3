import Link from 'next/link';
import { HomeEngineeringIcon } from '@/components/site/home/HomeEngineeringIcon';
import { PRODUCTS_HERO } from '@/lib/catalog-content';

const pointIcons = ['factory', 'design', 'globe'] as const;

export function ProductsHero() {
  return (
    <section className="products-hero internal-hero internal-hero--mobile-surface internal-hero--mobile-about" aria-labelledby="products-title">
      <picture>
        <source media="(max-width: 767px)" srcSet={PRODUCTS_HERO.mobileImage} />
        <img
          className="products-hero__image internal-hero__image"
          src={PRODUCTS_HERO.image}
          alt={PRODUCTS_HERO.imageAlt}
          width={1600}
          height={533}
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="ref-container products-hero__content internal-hero__content">
        <nav className="products-hero__crumbs internal-hero__crumbs" aria-label="Хлебные крошки">
          <Link href="/">Главная</Link>
          <span aria-hidden="true">/</span>
          <span>Продукция</span>
        </nav>
        <h1 id="products-title">{PRODUCTS_HERO.title}</h1>
        <p className="products-hero__lead">{PRODUCTS_HERO.lead}</p>
        <ul className="products-hero__points" aria-label="Особенности каталога">
          {PRODUCTS_HERO.points.map((point, index) => (
            <li key={point}>
              <HomeEngineeringIcon name={pointIcons[index]} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <p className="products-hero__rail" aria-hidden="true">
          {PRODUCTS_HERO.rail.map((line) => (
            <span key={line} className="products-hero__rail-item">{line}</span>
          ))}
        </p>
      </div>
    </section>
  );
}
