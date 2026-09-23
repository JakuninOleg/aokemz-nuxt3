<script setup lang="ts">
import { contentfulAssetUrl } from "~/utils/productsContent";
import type { ContentfulEntries as EntryCollection } from "~/utils/contentfulTypes";

type CategoryEntry = {
  sys: { id: string };
  fields: {
    url: string;
    Name: string;
    image?: { fields: { file: { url: string } } };
    display: boolean;
  };
};

const {
  data: categories,
  pending,
  error,
  refresh,
} = await useAsyncData(
  "contentful-categories-ref",
  async () => {
    const { $contentful } = useNuxtApp();
    const data: EntryCollection<CategoryEntry> = await $contentful.getEntries({
      content_type: "Category",
      order: "-sys.createdAt",
    });
    return data.items;
  },
  { default: () => [] as CategoryEntry[] },
);

const filteredCategories = computed(() =>
  (categories.value || [])
    .filter((cat) => cat.fields.display === true)
    .reverse(),
);
</script>

<template>
  <section class="products-cats" aria-labelledby="products-cats-title">
    <div class="ref-container">
      <header class="products-cats__head">
        <h2 id="products-cats-title">Категории продукции</h2>
      </header>

      <div v-if="pending" class="products-status" role="status">
        Загрузка каталога…
      </div>
      <div v-else-if="error" class="products-status">
        <p>Не удалось загрузить категории.</p>
        <button type="button" class="products-status__retry" @click="refresh()">
          Попробовать ещё раз →
        </button>
      </div>
      <div v-else-if="!filteredCategories.length" class="products-status">
        Категории пока не опубликованы.
      </div>

      <div v-else class="products-cats__grid">
        <NuxtLink
          v-for="category in filteredCategories"
          :key="category.sys.id"
          :to="`/products/${category.fields.url}`"
          class="products-cat"
        >
          <img
            v-if="contentfulAssetUrl(category.fields.image?.fields?.file?.url)"
            class="products-cat__media"
            :src="contentfulAssetUrl(category.fields.image?.fields?.file?.url)"
            :alt="category.fields.Name"
            width="960"
            height="640"
            loading="lazy"
            decoding="async"
          />
          <div v-else class="products-cat__placeholder" aria-hidden="true" />
          <div class="products-cat__shade" aria-hidden="true" />
          <div class="products-cat__body">
            <h3>{{ category.fields.Name }}</h3>
            <span class="products-cat__more"
              >Подробнее <span aria-hidden="true">→</span></span
            >
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
