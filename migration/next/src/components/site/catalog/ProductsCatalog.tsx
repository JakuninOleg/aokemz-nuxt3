'use client';

import { useMemo, useState } from 'react';
import { HomeEngineeringIcon } from '@/components/site/home/HomeEngineeringIcon';
import type { CatalogFilterCategory, CatalogFilterItem } from '@/lib/catalog-content';
import { CatalogFilters } from './CatalogFilters';
import { CatalogProductCard } from './CatalogProductCard';

type Props = {
  categories: CatalogFilterCategory[];
  items: CatalogFilterItem[];
};

export function ProductsCatalog({ categories, items }: Props) {
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);
  const [typesSelected, setTypesSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('default');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [shown, setShown] = useState(6);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const types = useMemo(
    () => [...new Set(items.map((item) => item.type).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ru')),
    [items],
  );

  const filtered = useMemo(() => {
    const text = query.trim().toLocaleLowerCase('ru');
    const next = items.filter(
      (item) =>
        (!categoriesSelected.length || categoriesSelected.includes(item.categoryId)) &&
        (!typesSelected.length || typesSelected.includes(item.type)) &&
        (!text || `${item.name} ${item.type} ${item.categoryName}`.toLocaleLowerCase('ru').includes(text)),
    );
    if (sort !== 'default') {
      next.sort(
        (a, b) =>
          a.name.localeCompare(b.name, 'ru', { numeric: true }) * (sort === 'name-desc' ? -1 : 1),
      );
    }
    return next;
  }, [items, categoriesSelected, typesSelected, query, sort]);

  function reset() {
    setCategoriesSelected([]);
    setTypesSelected([]);
    setQuery('');
    setShown(6);
  }

  function updateFilters<T>(setter: (value: T) => void, value: T) {
    setter(value);
    setShown(6);
  }

  return (
    <>
      <section id="catalog" className="ref-container catalog" aria-label="Каталог оборудования">
        <div className={`catalog-sidebar${filtersOpen ? ' is-open' : ''}`}>
          <button
            className="catalog-mobile-toggle"
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="catalog-filters-panel"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            Фильтры и поиск <span aria-hidden="true">{filtersOpen ? '−' : '+'}</span>
          </button>
          <CatalogFilters
            id="catalog-filters-panel"
            categories={categories}
            types={types}
            count={filtered.length}
            categoriesSelected={categoriesSelected}
            typesSelected={typesSelected}
            query={query}
            onCategories={(value) => updateFilters(setCategoriesSelected, value)}
            onTypes={(value) => updateFilters(setTypesSelected, value)}
            onQuery={(value) => updateFilters(setQuery, value)}
            onReset={reset}
          />
        </div>
        <div className="catalog-results">
          <div className="catalog-toolbar">
            <p aria-live="polite">
              Найдено позиций: <strong>{filtered.length}</strong>
            </p>
            <div className="catalog-toolbar__controls">
              <label>
                Сортировка{' '}
                <select
                  value={sort}
                  onChange={(event) => {
                    setSort(event.target.value);
                    setShown(6);
                  }}
                >
                  <option value="default">По умолчанию</option>
                  <option value="name">По названию: А–Я</option>
                  <option value="name-desc">По названию: Я–А</option>
                </select>
              </label>
              <div className="catalog-view" role="group" aria-label="Вид каталога">
                <button type="button" aria-pressed={view === 'grid'} aria-label="Сетка" onClick={() => setView('grid')}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
                  </svg>
                </button>
                <button type="button" aria-pressed={view === 'list'} aria-label="Список" onClick={() => setView('list')}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 4h3v3H3zM3 11h3v3H3zM3 18h3v3H3zM10 5h11M10 12h11M10 19h11" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {filtered.length ? (
            <ul className={`catalog-grid${view === 'list' ? ' catalog-grid--list' : ''}`}>
              {filtered.slice(0, shown).map((item) => (
                <li key={item.id}>
                  <CatalogProductCard item={item} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="catalog-empty">
              <h3>Оборудование не найдено</h3>
              <p>Измените запрос или сбросьте фильтры.</p>
              <button type="button" onClick={reset}>
                Сбросить фильтры
              </button>
            </div>
          )}
          {shown < filtered.length && (
            <button type="button" className="catalog-load" onClick={() => setShown((value) => value + 6)}>
              Показать ещё <span aria-hidden="true">↓</span>
            </button>
          )}
        </div>
      </section>
      <section className="ref-container catalog-services" aria-label="Работа с заказчиком">
        <div>
          <HomeEngineeringIcon name="team" />
          <span>Помощь в подборе оборудования</span>
        </div>
        <div>
          <HomeEngineeringIcon name="design" />
          <span>Комплекты под параметры вашей машины</span>
        </div>
        <div>
          <HomeEngineeringIcon name="shield" />
          <span>Испытания на заводских стендах</span>
        </div>
        <div>
          <HomeEngineeringIcon name="globe" />
          <span>Поставка по России и странам СНГ</span>
        </div>
      </section>
    </>
  );
}
