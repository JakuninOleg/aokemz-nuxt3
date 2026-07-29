<template>
  <div class="section mt-8 lg:mt-24">
    <h1 class="text-2xl lg:text-3xl font-bold mb-6 lg:mb-16">
      Каталог продукции
    </h1>
    <div v-if="pending" class="text-center">
      <p>Загрузка...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>{{ error.message }}</p>
      <NuxtLink to="/" class="text-blue-500">Вернуться на главную</NuxtLink>
    </div>
    <div v-else class="grid gap-6 mb-16 sm:grid-cols-2 xl:grid-cols-3">
      <div v-for="category in filteredCategories" :key="category.sys.id">
        <NuxtLink :to="'/products/' + category.fields.url" class="group block">
          <div class="overflow-hidden border border-kemz-steel bg-white transition-colors group-hover:border-kemz-blue">
            <img
              :src="'https:' + category.fields.image.fields.file.url"
              :alt="category.fields.Name"
              loading="lazy"
              class="w-full h-44 object-cover"
            />
            <h2 class="text-lg font-semibold px-4 py-5 text-kemz-ink">
              {{ category.fields.Name }}
            </h2>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EntryCollection } from 'contentful'

interface ContentfulEntry {
  sys: { id: string }
  fields: {
    url: string
    Name: string
    image: { fields: { file: { url: string } } }
    display: boolean
  }
}

// Загрузка категорий
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
    } catch (err) {
      throw createError({
        statusCode: 500,
        message: 'Не удалось загрузить категории',
      })
    }
  },
  {
    default: () => [],
  }
)

// Фильтрованные категории
const filteredCategories = computed(() => {
  return (
    categories.value
      ?.filter((cat: ContentfulEntry) => cat.fields.display === true)
      .reverse() || []
  )
})
</script>