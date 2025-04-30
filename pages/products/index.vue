<template>
  <div class="section mt-8 lg:mt-24">
    <h1 class="text-2xl lg:text-3xl font-bold mb-6 lg:mb-16">
      Каталог продукции
    </h1>
    <div class="grid xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-10 mb-10">
      <div v-for="(category, index) in filteredCategories" :key="index">
        <NuxtLink :to="'/products/' + category.fields.url">
          <div class="border-2 border-gray-200 rounded-lg min-w-50 h-64 transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
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
import { useContentStore } from '~/stores/content'

const contentStore = useContentStore()

// Если контент ещё не загружен — загружаем
if (!contentStore.categories) {
  await contentStore.fetchContent()
}

// Фильтрованные категории (аналог твоего computed)
const filteredCategories = computed(() => {
  return [...(contentStore.categories || [])]
    .filter(cat => cat.fields.display === true)
    .reverse()
})
</script>
