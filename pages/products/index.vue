<template>
  <div class="kemz-light">
    <header class="cat-hero">
      <div class="wrap">
        <p class="section-tag cat-hero__tag">Каталог</p>
        <h1>Продукция завода</h1>
        <p class="cat-hero__lead">
          Электрические машины и комплекты приводов для карьерной техники, буровых установок и
          шахтного оборудования.
        </p>
      </div>
    </header>

    <div class="cat-body">
      <div class="wrap">
        <div v-if="pending" class="cat-status">
          <p>Загрузка каталога…</p>
        </div>

        <div v-else-if="error" class="cat-status cat-status--error">
          <p>{{ error.message || 'Не удалось загрузить категории' }}</p>
          <NuxtLink to="/" class="text-link">На главную</NuxtLink>
        </div>

        <div v-else-if="!filteredCategories.length" class="cat-status">
          <p>Категории пока не опубликованы</p>
        </div>

        <div v-else class="cat-grid">
          <NuxtLink
            v-for="category in filteredCategories"
            :key="category.sys.id"
            :to="'/products/' + category.fields.url"
            class="cat-card"
          >
            <img
              v-if="category.fields.image?.fields?.file?.url"
              :src="'https:' + category.fields.image.fields.file.url"
              :alt="category.fields.Name"
              loading="lazy"
              width="640"
              height="400"
              class="cat-card__media"
            />
            <div class="cat-card__body">
              <h2 class="cat-card__title">{{ category.fields.Name }}</h2>
              <span class="cat-card__more">Открыть →</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EntryCollection } from 'contentful'
import { PAGE_SEO } from '~/utils/siteSeo'

interface ContentfulEntry {
  sys: { id: string }
  fields: {
    url: string
    Name: string
    image: { fields: { file: { url: string } } }
    display: boolean
  }
}

const { data: categories, pending, error } = await useAsyncData(
  'contentful-categories',
  async () => {
    const { $contentful } = useNuxtApp()
    try {
      const data: EntryCollection<ContentfulEntry> = await $contentful.getEntries({
        content_type: 'Category',
        order: '-sys.createdAt',
      })
      return data.items
    } catch {
      throw createError({
        statusCode: 500,
        message: 'Не удалось загрузить категории',
      })
    }
  },
  {
    default: () => [],
  },
)

const filteredCategories = computed(() => {
  return (
    categories.value
      ?.filter((cat: ContentfulEntry) => cat.fields.display === true)
      .reverse() || []
  )
})

usePageSeo(PAGE_SEO.products)
</script>

<style lang="scss" src="~/assets/css/catalog-light.scss"></style>
