<template>
  <section class="section mt-8 lg:mt-24 grid gap-10 mb-16">
    <div v-if="pending" class="text-center">
      <p>Загрузка...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>{{ error.message }}</p>
      <NuxtLink to="/products" class="text-kemz-blue">Вернуться к каталогу</NuxtLink>
    </div>
    <div v-else-if="!product" class="text-center text-red-500">
      <p>Продукт не найден</p>
      <NuxtLink to="/products" class="text-kemz-blue">Вернуться к каталогу</NuxtLink>
    </div>
    <div v-else class="min-w-0">
      <h1 class="text-xl md:text-3xl font-bold mb-10">
        {{ product.fields.name }}
      </h1>
      <img
        v-if="product.fields.image"
        :src="'https:' + product.fields.image.fields.file.url"
        :alt="product.fields.name"
        loading="lazy"
        class="h-80 max-w-full object-contain rounded-t-lg mb-6"
      />
      <div class="kemz-richtext grid gap-4 min-w-0" v-html="descriptionHtml" />
      <h2 class="text-xl font-bold mt-8">Технические данные</h2>
      <div class="kemz-richtext grid gap-4 min-w-0" v-html="paramsHtml" />
      <p class="text-lg font-light mr-2 mt-10">
        <NuxtLink
          :to="'/products/' + route.params.category"
          class="flex items-center w-full link text-kemz-blue"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 mr-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Вернуться к категории
        </NuxtLink>
      </p>
    </div>
  </section>
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
  `contentful-product-${productId}`,
  async () => {
    const { $contentful } = useNuxtApp()
    const data: EntryCollection<ContentfulEntry> = await $contentful.getEntries({
      content_type: 'subcategory',
      'fields.url': productId,
    })
    if (!data.items.length) {
      throw createError({
        statusCode: 404,
        message: 'Продукт не найден',
      })
    }
    return data.items[0]
  },
  { default: () => null }
)

const descriptionHtml = computed(() =>
  renderContentfulHtml(product.value?.fields.description)
)
const paramsHtml = computed(() => renderContentfulHtml(product.value?.fields.params))

useSeoMeta({
  title: () =>
    product.value?.fields.name
      ? `${product.value.fields.name} | ОАО «КЭМЗ»`
      : 'Продукт | ОАО «КЭМЗ»',
  description: () =>
    product.value?.fields.name
      ? `${product.value.fields.name}: технические данные, ОАО Карпинский электромашиностроительный завод`
      : 'Каталог продукции ОАО КЭМЗ',
})
</script>
