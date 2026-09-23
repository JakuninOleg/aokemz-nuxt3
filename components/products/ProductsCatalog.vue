<script setup lang="ts">
import { catalogItem, type CatalogCategory, type CatalogEntry } from '~/utils/catalog';
import CatalogFilters from './CatalogFilters.vue';
import CatalogProductCard from './CatalogProductCard.vue';

const { $contentful } = useNuxtApp();
const { data, pending, error, refresh } = await useAsyncData('contentful-full-catalog-v1', async () => {
  const [categories, first] = await Promise.all([
    $contentful.getEntries<CatalogCategory>({ content_type: 'Category', order: 'sys.createdAt', limit: 1000 }),
    $contentful.getEntries<CatalogEntry>({ content_type: 'subcategory', include: 2, limit: 1000, order: 'fields.order,sys.id' }),
  ]);
  const entries = [...first.items];
  for (let skip = first.items.length; skip < first.total; skip += 1000) {
    const page = await $contentful.getEntries<CatalogEntry>({ content_type: 'subcategory', include: 2, limit: 1000, skip, order: 'fields.order,sys.id' });
    entries.push(...page.items);
  }
  const visibleCategories = categories.items.filter(item => item.fields?.display && item.fields.url);
  const visibleIds = new Set(visibleCategories.map(item => item.sys.id));
  return { categories: visibleCategories, items: entries.filter(item => item.fields?.url && item.fields.name && item.fields.category?.fields?.url && visibleIds.has(item.fields.category.sys.id)).map(catalogItem) };
}, { default: () => ({ categories: [] as CatalogCategory[], items: [] as ReturnType<typeof catalogItem>[] }) });

const categoriesSelected = ref<string[]>([]);
const typesSelected = ref<string[]>([]);
const query = ref('');
const sort = ref('default');
const view = ref('grid');
const shown = ref(6);
const filtersOpen = ref(false);
const types = computed(() => [...new Set(data.value.items.map(item => item.type).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ru')));
const filtered = computed(() => {
  const text = query.value.trim().toLocaleLowerCase('ru');
  const items = data.value.items.filter(item => (!categoriesSelected.value.length || categoriesSelected.value.includes(item.categoryId)) && (!typesSelected.value.length || typesSelected.value.includes(item.type)) && (!text || `${item.name} ${item.type} ${item.categoryName}`.toLocaleLowerCase('ru').includes(text)));
  if (sort.value !== 'default') items.sort((a, b) => a.name.localeCompare(b.name, 'ru', { numeric: true }) * (sort.value === 'name-desc' ? -1 : 1));
  return items;
});
watch([categoriesSelected, typesSelected, query, sort], () => { shown.value = 6; });
function reset() { categoriesSelected.value = []; typesSelected.value = []; query.value = ''; }
</script>

<template>
  <section id="catalog" class="ref-container catalog" aria-label="Каталог оборудования">
    <div v-if="pending" class="products-status" role="status">Загрузка продукции…</div>
    <div v-else-if="error" class="products-status" role="alert"><p>Не удалось загрузить продукцию.</p><button type="button" class="products-status__retry" @click="refresh()">Повторить загрузку</button></div>
    <template v-else>
      <div class="catalog-sidebar" :class="{ 'is-open': filtersOpen }"><button class="catalog-mobile-toggle" type="button" :aria-expanded="filtersOpen" aria-controls="catalog-filters-panel" @click="filtersOpen = !filtersOpen">Фильтры и поиск <span aria-hidden="true">{{ filtersOpen ? '−' : '+' }}</span></button><CatalogFilters id="catalog-filters-panel" v-model:categories-selected="categoriesSelected" v-model:types-selected="typesSelected" v-model:query="query" :categories="data.categories" :types="types" :count="filtered.length" @reset="reset" /></div>
      <div class="catalog-results">
        <div class="catalog-toolbar"><p aria-live="polite">Найдено позиций: <strong>{{ filtered.length }}</strong></p><div class="catalog-toolbar__controls"><label>Сортировка <select v-model="sort"><option value="default">По умолчанию</option><option value="name">По названию: А–Я</option><option value="name-desc">По названию: Я–А</option></select></label><div class="catalog-view" role="group" aria-label="Вид каталога"><button type="button" :aria-pressed="view === 'grid'" aria-label="Сетка" @click="view = 'grid'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" /></svg></button><button type="button" :aria-pressed="view === 'list'" aria-label="Список" @click="view = 'list'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h3v3H3zM3 11h3v3H3zM3 18h3v3H3zM10 5h11M10 12h11M10 19h11" /></svg></button></div></div></div>
        <ul v-if="filtered.length" class="catalog-grid" :class="{ 'catalog-grid--list': view === 'list' }"><li v-for="item in filtered.slice(0, shown)" :key="item.id"><CatalogProductCard :item="item" /></li></ul>
        <div v-else class="catalog-empty"><h3>Оборудование не найдено</h3><p>Измените запрос или сбросьте фильтры.</p><button type="button" @click="reset">Сбросить фильтры</button></div>
        <button v-if="shown < filtered.length" type="button" class="catalog-load" @click="shown += 6">Показать ещё <span aria-hidden="true">↓</span></button>
      </div>
    </template>
  </section>
  <section class="ref-container catalog-services" aria-label="Работа с заказчиком"><div><HomeEngineeringIcon name="team" /><span>Помощь в подборе оборудования</span></div><div><HomeEngineeringIcon name="design" /><span>Комплекты под параметры вашей машины</span></div><div><HomeEngineeringIcon name="shield" /><span>Испытания на заводских стендах</span></div><div><HomeEngineeringIcon name="globe" /><span>Поставка по России и странам СНГ</span></div></section>
</template>
