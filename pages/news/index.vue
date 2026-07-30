<template>
  <div class="kemz-light">
    <header class="cat-hero">
      <div class="wrap">
        <p class="section-tag cat-hero__tag">Новости</p>
        <h1>События завода</h1>
        <p class="cat-hero__lead">
          Поставки, испытания и работа с карьерной техникой.
        </p>
      </div>
    </header>

    <div class="cat-body">
      <div class="wrap">
        <div v-if="pending" class="cat-status">
          <p>Загрузка новостей…</p>
        </div>

        <div v-else-if="error" class="cat-status cat-status--error">
          <p>Не удалось загрузить новости.</p>
          <NuxtLink to="/" class="text-link">На главную</NuxtLink>
        </div>

        <div v-else-if="!articles?.length" class="cat-status">
          <p>Новости отсутствуют</p>
        </div>

        <div v-else class="cat-grid">
          <NuxtLink
            v-for="article in articles"
            :key="article.sys.id"
            :to="`/news/${article.sys.id}`"
            class="cat-card"
          >
            <img
              v-if="article.fields.image?.fields?.file?.url"
              :src="'https:' + article.fields.image.fields.file.url"
              :alt="article.fields.header"
              loading="lazy"
              width="640"
              height="360"
              class="cat-card__media"
            />
            <div class="cat-card__body">
              <time class="cat-card__date" :datetime="article.fields.date">
                {{ formatDate(article.fields.date) }}
              </time>
              <h2 class="cat-card__title">{{ article.fields.header }}</h2>
              <span class="cat-card__more">Читать →</span>
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
    return response.items
  },
  { default: () => [] },
)

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString('ru-RU')
  } catch {
    return value
  }
}

usePageSeo(PAGE_SEO.news)
</script>

<style lang="scss" src="~/assets/css/catalog-light.scss"></style>
