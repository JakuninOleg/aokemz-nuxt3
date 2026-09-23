<script setup lang="ts">
import type { CatalogItem } from '~/utils/catalog';
defineProps<{ item: CatalogItem }>();
</script>

<template>
  <NuxtLink :to="item.href" class="catalog-card">
    <div class="catalog-card__image">
      <img v-if="item.image" :src="item.image" :alt="item.name" width="480" height="360" loading="lazy" decoding="async" />
      <span v-else>Изображение уточняется</span>
    </div>
    <div class="catalog-card__body">
      <p class="catalog-card__category">{{ item.categoryName }}</p>
      <h3>{{ item.name }}</h3>
      <p class="catalog-card__description">{{ item.type || item.description }}</p>
      <dl v-if="item.specs.length"><div v-for="spec in item.specs" :key="spec.label"><dt>{{ spec.label }}</dt><dd>{{ spec.value }}</dd></div></dl>
      <span class="catalog-card__more">Подробнее <span aria-hidden="true">→</span></span>
    </div>
  </NuxtLink>
</template>
