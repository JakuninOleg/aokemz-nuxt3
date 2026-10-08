'use client';

import Link from '@/components/site/PublicLink';
import { useMemo, useState } from 'react';
import type { CategoryEquipmentItem } from '@/lib/catalog-content';

type Props = {
  products: CategoryEquipmentItem[];
  hasDocuments: boolean;
  onInspect?: (id: string) => void;
};

export function CategoryEquipment({ products, hasDocuments, onInspect }: Props) {
  const [selectedType, setSelectedType] = useState('');
  const types = useMemo(
    () => [...new Set(products.map((item) => item.type).filter(Boolean))],
    [products],
  );
  const items = useMemo(
    () => products.filter((item) => !selectedType || item.type === selectedType),
    [products, selectedType],
  );
  const hasAnyParams = products.some((item) => item.hasParams);

  return (
    <section id="equipment" className="category-equipment" aria-labelledby="equipment-title">
      {types.length > 1 && (
        <div className="category-types">
          <div className="ref-container category-types__inner" role="group" aria-label="Тип оборудования">
            <span>Тип оборудования</span>
            <button type="button" aria-pressed={!selectedType} onClick={() => setSelectedType('')}>
              Все
            </button>
            {types.map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={selectedType === type}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="ref-container">
        <div className="category-equipment__head">
          <div>
            <h2 id="equipment-title">{selectedType || 'Оборудование категории'}</h2>
            <p>
              Выберите машину или комплект. Описание, состав и технические характеристики доступны в карточке
              оборудования.
            </p>
            <span className="category-equipment__count" aria-live="polite">
              Позиций: {items.length}
            </span>
          </div>
          <nav className="category-quicklinks" aria-label="Разделы категории">
            {hasAnyParams && (
              <a href="#category-specifications">
                Технические характеристики <span aria-hidden="true">→</span>
              </a>
            )}
            {hasDocuments && (
              <a href="#category-documents">
                Документация <span aria-hidden="true">→</span>
              </a>
            )}
            <Link href="/contacts">
              Запросить подбор <span aria-hidden="true">→</span>
            </Link>
          </nav>
        </div>
        {items.length ? (
          <ul className="category-equipment__grid">
            {items.map((item) => (
              <li key={item.id} className="category-machine">
                <Link href={item.href} className="category-machine__link">
                  {item.type ? <span className="category-machine__type">{item.type}</span> : null}
                  <h3>{item.name}</h3>
                  <div className="category-machine__image">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} srcSet={item.imageSrcSet} sizes="(max-width: 720px) 90vw, 30vw" alt={item.imageAlt} width={480} height={360} loading="lazy" />
                    ) : (
                      <span>Фото уточняется</span>
                    )}
                  </div>
                  <span className="category-machine__more">
                    Подробнее <span aria-hidden="true">→</span>
                  </span>
                </Link>
                {item.hasParams && (
                  <a
                    className="category-machine__spec-link"
                    href="#category-specifications"
                    onClick={() => onInspect?.(item.id)}
                  >
                    Характеристики
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="products-status">В этой категории пока нет опубликованных позиций.</p>
        )}
      </div>
    </section>
  );
}
