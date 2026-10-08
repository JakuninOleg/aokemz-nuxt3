'use client';

import Link from 'next/link';
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { HomeEngineeringIcon } from '@/components/site/home/HomeEngineeringIcon';
import type { CategorySpecOption } from '@/lib/catalog-content';

export function CategorySpecPanel({
  id,
  active = false,
  children,
}: {
  id: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <div hidden={!active} data-spec-panel={id}>
      {children}
    </div>
  );
}

type Props = {
  options: CategorySpecOption[];
  selectedId?: string;
  children: ReactNode;
};

export function CategorySpecifications({ options, selectedId, children }: Props) {
  const [selected, setSelected] = useState(selectedId || options[0]?.id || '');

  useEffect(() => {
    if (selectedId && options.some((item) => item.id === selectedId)) {
      setSelected(selectedId);
    }
  }, [selectedId, options]);

  useEffect(() => {
    if (!options.some((item) => item.id === selected)) {
      setSelected(options[0]?.id || '');
    }
  }, [options, selected]);

  const current = options.find((item) => item.id === selected) || options[0];
  if (!current) return null;

  return (
    <section
      id="category-specifications"
      className="ref-container category-specifications"
      aria-labelledby="category-spec-title"
    >
      <div className="category-specifications__heading">
        <h2 id="category-spec-title">Технические характеристики</h2>
        {options.length > 1 && (
          <label htmlFor="category-model">
            Модель или комплект
            <select id="category-model" value={selected} onChange={(event) => setSelected(event.target.value)}>
              {options.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="category-specifications__layout">
        <div className="category-specifications__data">
          <h3>{current.name}</h3>
          <div
            className="category-specifications__table product-rich"
            role="region"
            aria-label={`Технические данные: ${current.name}`}
            tabIndex={0}
          >
            {Children.map(children, (child) => {
              if (!isValidElement(child)) return null;
              const panel = child as ReactElement<{ id: string; active?: boolean }>;
              return cloneElement(panel, { active: panel.props.id === selected });
            })}
          </div>
          <Link href={current.href} className="category-text-link">
            Описание и применение <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="category-specifications__visual">
          <Link href={current.href} className="category-specifications__image" aria-label={`Открыть: ${current.name}`}>
            {current.imageUrl ? (
              <img src={current.imageUrl} srcSet={current.imageSrcSet} sizes="(max-width: 720px) 90vw, 45vw" alt={current.imageAlt} width={640} height={480} loading="lazy" />
            ) : (
              <span>{current.name}</span>
            )}
          </Link>
          <aside className="category-selection-help">
            <HomeEngineeringIcon name="design" />
            <div>
              <h3>Подбор под вашу задачу</h3>
              <p>
                Укажите модель техники, назначение привода и условия эксплуатации. Специалисты помогут уточнить состав
                оборудования.
              </p>
              <Link href="/contacts" className="category-text-link">
                Обсудить подбор <span aria-hidden="true">→</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
