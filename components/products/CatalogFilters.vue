<script setup lang="ts">
import type { CatalogCategory } from '~/utils/catalog';
defineProps<{ categories: CatalogCategory[]; types: string[]; count: number }>();
const categoriesModel = defineModel<string[]>('categoriesSelected', { required: true });
const typesModel = defineModel<string[]>('typesSelected', { required: true });
const query = defineModel<string>('query', { required: true });
defineEmits<{ reset: [] }>();
</script>

<template>
  <aside class="catalog-filters" aria-label="Фильтры каталога">
    <div class="catalog-filters__head"><h2>Фильтры</h2><button type="button" @click="$emit('reset')">Сбросить</button></div>
    <label class="catalog-search">Поиск по названию<input v-model="query" type="search" placeholder="Например, ДПТ" /></label>
    <details open><summary>Категория</summary><div class="catalog-filter-options"><label v-for="category in categories" :key="category.sys.id"><input v-model="categoriesModel" type="checkbox" :value="category.sys.id" /><span>{{ category.fields.Name }}</span></label></div></details>
    <details v-if="types.length" open><summary>Тип оборудования</summary><div class="catalog-filter-options"><label v-for="type in types" :key="type"><input v-model="typesModel" type="checkbox" :value="type" /><span>{{ type }}</span></label></div></details>
    <p class="catalog-filters__hint">Подходящих позиций: {{ count }}</p>
  </aside>
</template>
