<template>
  <section class="section mt-8 lg:mt-24 mb-10 lg:mb-16">
    <h1 class="text-2xl lg:text-3xl mb-6 font-semibold">НОВОСТИ</h1>

    <!-- Загрузка -->
    <div v-if="pending" class="text-center">
      <p>Загрузка новостей...</p>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="text-center text-red-500">
      <p>Ошибка загрузки новостей: {{ error.message }}</p>
      <NuxtLink to="/" class="text-blue-500">Вернуться на главную</NuxtLink>
    </div>

    <!-- Нет новостей -->
    <div v-else-if="!articles?.length" class="text-center">
      <p>Новости отсутствуют</p>
    </div>

    <!-- Список новостей -->
    <div v-else class="grid xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-10 mb-10">
      <div
        v-for="article in articles"
        :key="article.sys.id"
        class="border-2 border-gray-200 rounded-lg transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg h-[22rem] overflow-hidden"
      >
        <!-- Ссылка только вокруг содержимого -->
        <NuxtLink :to="`/news/${article.sys.id}`" class="block h-full">
          <img
            v-if="article.fields.image"
            :src="'https:' + article.fields.image.fields.file.url"
            :alt="article.fields.header"
            loading="lazy"
            class="w-full h-40 object-cover rounded-t-lg mb-2"
          />
          <div class="px-4 pb-4 flex flex-col justify-between h-[calc(100%-10rem)]">
            <div>
              <span class="font-semibold text-sm text-gray-600">
                {{
                  new Date(article.fields.date).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                }}
              </span>
              <h2 class="text-lg font-semibold py-3 leading-snug">{{ article.fields.header }}</h2>
            </div>
            <span class="text-blue-400 hover:text-blue-500 font-medium">Читать далее →</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { EntryCollection } from 'contentful'

interface NewsEntry {
  sys: { id: string }
  fields: {
    header: string
    date: string
    image?: { fields: { file: { url: string } } }
  }
}

const { data: articles, pending, error } = await useAsyncData(
  'news-articles',
  async () => {
    const { $contentful } = useNuxtApp()
    const response: EntryCollection<NewsEntry> = await $contentful.getEntries({
      content_type: 'news',
      order: '-fields.date',
    })

    // Выводим реальные sys.id в консоль для проверки
    console.log('Все sys.id новостей:', response.items.map(i => i.sys.id))

    return response.items
  },
  { default: () => [] }
)
</script>
