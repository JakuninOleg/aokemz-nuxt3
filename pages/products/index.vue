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
    <div v-else class="grid xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-10 mb-10">
      <div v-for="category in filteredCategories" :key="category.sys.id">
        <NuxtLink :to="'/products/' + category.fields.url">
          <div
            class="border-2 border-gray-200 rounded-lg min-w-50 h-64 transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
          >
            <img
              :src="'https:' + category.fields.image.fields.file.url"
              :alt="category.fields.Name"
              loading="lazy"
              class="w-full h-40 object-cover rounded-t-lg"
            />
            <h2 class="text-xl font-semibold pl-4 py-6">
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