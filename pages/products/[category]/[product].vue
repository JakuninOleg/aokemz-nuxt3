<template>
  <div class="kemz-light">
    <div class="cat-detail">
      <div class="wrap">
        <div v-if="pending" class="cat-status">
          <p>Загрузка…</p>
        </div>

        <div v-else-if="error" class="cat-status cat-status--error">
          <p>{{ error.message || 'Ошибка загрузки' }}</p>
          <NuxtLink to="/products" class="text-link">← К каталогу</NuxtLink>
        </div>

        <div v-else-if="!product" class="cat-status cat-status--error">
          <p>Продукт не найден</p>
          <NuxtLink to="/products" class="text-link">← К каталогу</NuxtLink>
        </div>

        <template v-else>
          <header class="cat-detail__head">
            <h1>{{ product.fields.name }}</h1>
          </header>

          <figure
            v-if="product.fields.image?.fields?.file?.url"
            class="cat-detail__media"
          >
            <img
              :src="'https:' + product.fields.image.fields.file.url"
              :alt="product.fields.name"
              loading="lazy"
              width="800"
              height="600"
            />
          </figure>

          <div class="kemz-richtext" v-html="descriptionHtml" />

          <h2 class="cat-detail__section-title">Технические данные</h2>
          <div class="kemz-richtext" v-html="paramsHtml" />

          <NuxtLink
            :to="'/products/' + route.params.category"
            class="text-link cat-detail__back cat-detail__back--end"
          >
            ← Вернуться к категории
          </NuxtLink>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EntryCollection } from 'contentful'
import { renderContentfulHtml } from '~/utils/contentfulRichText'

interface ContentfulEntry {
  sys: { id: string }
  fields: {
    name: string
    url: string
    image?: { fields: { file: { url: string } } }
    description?: unknown
    params?: unknown
    category?: { sys: { id: string }; fields: { url: string } }
  }
}

const route = useRoute()
const productId = route.params.product as string

const { data: product, pending, error } = await useAsyncData(
  `contentful-product-${productId}-inc3`,
  async () => {
    const { $contentful } = useNuxtApp()
    const data: EntryCollection<ContentfulEntry> = await $contentful.getEntries({
      content_type: 'subcategory',
      'fields.url': productId,
      include: 3,
    })
    if (!data.items.length) {
      throw createError({
        statusCode: 404,
        message: 'Продукт не найден',
      })
    }
    return data.items[0]
  },
  { default: () => null },
)

const descriptionHtml = computed(() =>
  renderContentfulHtml(product.value?.fields.description),
)
const paramsHtml = computed(() => renderContentfulHtml(product.value?.fields.params))

useSeoMeta({
  title: () =>
    product.value?.fields.name
      ? `${product.value.fields.name} — каталог | ОАО «КЭМЗ»`
      : 'Продукт | ОАО «КЭМЗ»',
  description: () =>
    product.value?.fields.name
      ? `${product.value.fields.name}: технические данные и применение. ОАО «Карпинский электромашиностроительный завод», Карпинск.`
      : 'Карточка продукции ОАО «КЭМЗ»: электрические машины и комплекты приводов.',
  ogTitle: () =>
    product.value?.fields.name
      ? `${product.value.fields.name} | ОАО «КЭМЗ»`
      : 'Продукт | ОАО «КЭМЗ»',
  ogDescription: () =>
    product.value?.fields.name
      ? `${product.value.fields.name}: технические данные ОАО «КЭМЗ».`
      : 'Каталог продукции ОАО «КЭМЗ».',
})
</script>

<style lang="scss" src="~/assets/css/catalog-light.scss"></style>
