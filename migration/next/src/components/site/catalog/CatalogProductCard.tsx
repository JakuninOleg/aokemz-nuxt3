import Link from '@/components/site/PublicLink';
import Image from 'next/image';
import type { CatalogFilterItem } from '@/lib/catalog-content';

export function CatalogProductCard({ item }: { item: CatalogFilterItem }) {
  return (
    <Link href={item.href} className="catalog-card">
      <div className="catalog-card__image">
        {item.imageUrl ? (
          <Image src={item.imageUrl} sizes="(max-width: 720px) 90vw, (max-width: 1100px) 45vw, 30vw" alt={item.imageAlt} width={480} height={360} quality={80} loading="lazy" />
        ) : (
          <span>Изображение уточняется</span>
        )}
      </div>
      <div className="catalog-card__body">
        <p className="catalog-card__category">{item.categoryName}</p>
        <h3>{item.name}</h3>
        <p className="catalog-card__description">{item.type || item.description}</p>
        {item.specs.length > 0 && (
          <dl>
            {item.specs.map((spec) => (
              <div key={spec.label}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <span className="catalog-card__more">
          Подробнее <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
