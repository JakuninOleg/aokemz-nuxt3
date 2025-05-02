<template>
  <section class="section mt-8 lg:mt-24 mb-10 lg:mb-16">
    <h1 class="text-2xl lg:text-3xl mb-6 font-semibold">НОВОСТИ</h1>
    <div v-if="pending" class="text-center">
      <p>Загрузка новостей...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>Ошибка загрузки новостей: {{ error.message }}</p>
      <NuxtLink to="/" class="text-blue-500">Вернуться на главную</NuxtLink>
    </div>
    <div v-else-if="!articles?.length" class="text-center">
      <p>Новости отсутствуют</p>
    </div>
    <div
      v-else
      class="grid xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-10 mb-10"
    >
      <div v-for="article in articles" :key="article.sys.id">
        <NuxtLink :to="`/news/${article.fields.slug || article.sys.id}`">
          <div
            class="border-2 border-gray-200 rounded-lg min-w-50 transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg h-[22rem]"
          >
            <img
              v-if="article.fields.image"
              :src="'https:' + article.fields.image.fields.file.url"
              :alt="article.fields.header"
              loading="lazy"
              class="w-full h-40 object-cover rounded-t-lg mb-2"
            />
            <span class="font-semibold pl-4">
              {{
                new Date(article.fields.date).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              }}
            </span>
            <h2 class="text-xl font-semibold pl-4 py-6">
              {{ article.fields.header }}
            </h2>
            <div class="pl-4 py-2">
              <NuxtLink
                :to="`/news/${article.fields.slug || article.sys.id}`"
                class="text-blue-300 hover:text-blue-400"
              >
                Читать далее
              </NuxtLink>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { EntryCollection } from 'contentful'

// Типизация для Contentful
interface NewsEntry {
  sys: { id: string }
  fields: {
    header: string
    date: string
    slug?: string
    image?: { fields: { file: { url: string } } }
  }
}

// Нормализация URL (для slug)
const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')

// Загрузка новостей
const { data: articles, pending, error } = await useAsyncData(
  'news-articles',
  async () => {
    const { $contentful } = useNuxtApp()
    try {
      const response: EntryCollection<NewsEntry> = await $contentful.getEntries({
        content_type: 'news', // Замените на ваш content_type, если отличается
        order: '-fields.date', // Сортировка по дате (от новых к старым)
      })
      console.log('Contentful news response:', response)
      return response.items
    } catch (err) {
      console.error('Contentful news error:', err)
      throw createError({
        statusCode: 500,
        message: 'Не удалось загрузить новости',
      })
    }
  },
  {
    default: () => [],
  }
)
</script>