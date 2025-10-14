<template>
  <section class="section mt-8 lg:mt-24 mb-10 lg:mb-16">
    <!-- Загрузка -->
    <div v-if="pending" class="text-center">
      <p>Загрузка новости...</p>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="text-center text-red-500">
      <p>{{ error.message }}</p>
      <NuxtLink to="/news" class="text-blue-500">Вернуться к новостям</NuxtLink>
    </div>

    <!-- Если новость не найдена -->
    <div v-else-if="!article" class="text-center text-red-500">
      <p>Новость не найдена</p>
      <NuxtLink to="/news" class="text-blue-500">Вернуться к новостям</NuxtLink>
    </div>

    <!-- Контент новости -->
    <div v-else class="grid gap-4">
      <h2 class="font-semibold text-2xl">{{ article.fields.header }}</h2>
      <p>
        {{
          new Date(article.fields.date).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        }}
      </p>

      <img
        v-if="article.fields.image"
        class="xl:w-1/2 mb-4 rounded-lg"
        :src="'https:' + article.fields.image.fields.file.url"
        :alt="article.fields.header"
        loading="lazy"
      />

      <div class="grid gap-4 mb-5" v-html="richTextHtml" />

      <NuxtLink to="/news" class="flex items-center w-full text-blue-500 hover:text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Все новости
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import type { EntryCollection } from 'contentful'

interface NewsEntry {
  sys: { id: string }
  fields: {
    header: string
    date: string
    htmlText?: any
    image?: { fields: { file: { url: string } } }
  }
}

// Здесь ключевой момент: используем route.params.new
const route = useRoute()
const id = computed(() => String(route.params.new)) // <- именно здесь

const { data: article, pending, error } = await useAsyncData(
  `news-article-${id.value}`,
  async () => {
    const { $contentful } = useNuxtApp()
    const response: EntryCollection<NewsEntry> = await $contentful.getEntries({
      content_type: 'news',
      'sys.id[in]': [id.value], // <- массив с одним ID
      limit: 1,
    })

    console.log('ID из URL:', id.value)
    console.log('ID из Contentful:', response.items.map(i => i.sys.id))

    if (!response.items.length) {
      throw createError({
        statusCode: 404,
        message: 'Новость не найдена',
      })
    }

    return response.items[0]
  },
  { default: () => null }
)

const richTextHtml = computed(() =>
  article.value?.fields.htmlText ? documentToHtmlString(article.value.fields.htmlText) : ''
)

useHead(() => ({
  title: article.value?.fields.header || 'Новость',
  meta: [
    { name: 'description', content: article.value?.fields.header || 'Новость' },
  ],
}))
</script>
