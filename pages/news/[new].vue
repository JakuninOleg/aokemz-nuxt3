<template>
  <div class="kemz-light">
    <div class="cat-detail">
      <div class="wrap">
        <div v-if="pending" class="cat-status">
          <p>Загрузка новости…</p>
        </div>

        <div v-else-if="error" class="cat-status cat-status--error">
          <p>{{ error.message || 'Ошибка загрузки' }}</p>
          <NuxtLink to="/news" class="text-link">← Все новости</NuxtLink>
        </div>

        <div v-else-if="!article" class="cat-status cat-status--error">
          <p>Новость не найдена</p>
          <NuxtLink to="/news" class="text-link">← Все новости</NuxtLink>
        </div>

        <template v-else>
          <header class="cat-detail__head">
            <h1>{{ article.fields.header }}</h1>
            <p class="cat-detail__meta">
              {{
                new Date(article.fields.date).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              }}
            </p>
          </header>

          <figure
            v-if="article.fields.image?.fields?.file?.url"
            class="cat-detail__media"
          >
            <img
              :src="'https:' + article.fields.image.fields.file.url"
              :alt="article.fields.header"
              loading="lazy"
              width="960"
              height="540"
            />
          </figure>

          <div class="kemz-richtext" v-html="richTextHtml" />

          <NuxtLink to="/news" class="text-link cat-detail__back cat-detail__back--end">
            ← Все новости
          </NuxtLink>
        </template>
      </div>
    </div>
  </div>
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

const route = useRoute()
const id = computed(() => String(route.params.new))

const { data: article, pending, error } = await useAsyncData(
  `news-article-${id.value}`,
  async () => {
    const { $contentful } = useNuxtApp()
    const response: EntryCollection<NewsEntry> = await $contentful.getEntries({
      content_type: 'news',
      'sys.id[in]': [id.value],
      limit: 1,
    })

    if (!response.items.length) {
      throw createError({
        statusCode: 404,
        message: 'Новость не найдена',
      })
    }

    return response.items[0]
  },
  { default: () => null },
)

const richTextHtml = computed(() =>
  article.value?.fields.htmlText
    ? documentToHtmlString(article.value.fields.htmlText)
    : '',
)

useSeoMeta({
  title: () =>
    article.value?.fields.header
      ? `${article.value.fields.header} | Новости ОАО «КЭМЗ»`
      : 'Новость | ОАО «КЭМЗ»',
  description: () =>
    article.value?.fields.header
      ? `${article.value.fields.header}. Новости ОАО «Карпинский электромашиностроительный завод».`
      : 'Новость ОАО «КЭМЗ».',
  ogType: 'article',
})
</script>

<style lang="scss" src="~/assets/css/catalog-light.scss"></style>
