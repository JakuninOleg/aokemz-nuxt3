'use client';

import type { CatalogFilterCategory } from '@/lib/catalog-content';

type Props = {
  id?: string;
  categories: CatalogFilterCategory[];
  types: string[];
  count: number;
  categoriesSelected: string[];
  typesSelected: string[];
  query: string;
  onCategories: (value: string[]) => void;
  onTypes: (value: string[]) => void;
  onQuery: (value: string) => void;
  onReset: () => void;
};

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function CatalogFilters({
  id,
  categories,
  types,
  count,
  categoriesSelected,
  typesSelected,
  query,
  onCategories,
  onTypes,
  onQuery,
  onReset,
}: Props) {
  return (
    <aside id={id} className="catalog-filters" aria-label="Фильтры каталога">
      <div className="catalog-filters__head">
        <h2>Фильтры</h2>
        <button type="button" onClick={onReset}>
          Сбросить
        </button>
      </div>
      <label className="catalog-search">
        Поиск по названию
        <input
          type="search"
          value={query}
          placeholder="Например, ДПТ"
          onChange={(event) => onQuery(event.target.value)}
        />
      </label>
      <details open>
        <summary>Категория</summary>
        <div className="catalog-filter-options">
          {categories.map((category) => (
            <label key={category.id}>
              <input
                type="checkbox"
                checked={categoriesSelected.includes(category.id)}
                onChange={() => onCategories(toggle(categoriesSelected, category.id))}
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </details>
      {types.length > 0 && (
        <details open>
          <summary>Тип оборудования</summary>
          <div className="catalog-filter-options">
            {types.map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={typesSelected.includes(type)}
                  onChange={() => onTypes(toggle(typesSelected, type))}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </details>
      )}
      <p className="catalog-filters__hint">Подходящих позиций: {count}</p>
    </aside>
  );
}
