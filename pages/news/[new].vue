<template>
  <section class="section mt-8 lg:mt-24 mb-10 lg:mb-16">
    <div v-if="pending" class="text-center">
      <p>Загрузка...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>{{ error.message }}</p>
      <NuxtLink to="/news" class="text-blue-500">Вернуться к новостям</NuxtLink>
    </div>
    <div v-else-if="!article" class="text-center text-red-500">
      <p>Новость не найдена</p>
      <NuxtLink to="/news" class="text-blue-500">Вернуться к новостям</NuxtLink>
    </div>
    <div v-else class="grid gap-2">
      <h2 class="font-semibold text-2xl">
        {{ article.fields.header }}
      </h2>
      <p>
        {{
          new Date(article.fields.date).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'numeric',
          })
        }}
      </p>
      <img
        v-if="article.fields.image"
        class="xl:w-1/2 mb-4"
        :src="'https:' + article.fields.image.fields.file.url"
        :alt="article.fields.header"
        loading="lazy"
      />
      <div class="grid gap-4 mb-5" v-html="richTextHtml" />
      <NuxtLink to="/news" class="flex items-center w-full">
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
        Все новости
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types'
import type { EntryCollection } from 'contentful'

// Типизация для Contentful
interface NewsEntry {
  sys: { id: string }
  fields: {
    header: string
    date: string
    slug?: string
    htmlText?: any // Rich Text (возможно, content или body)
    image?: { fields: { file: { url: string } } }
  }
}

// Получаем параметр маршрута
const route = useRoute()
const id = route.params.id

// Нормализация URL
const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')

// Опции для рендеринга Rich Text
const options = {
  renderMark: {
    [MARKS.BOLD]: (text: string) => `<span class="font-bold">${text}</span>`,
    [MARKS.ITALIC]: (text: string) => `<p class="article__red">${text}</p>`,
  },
  renderNode: {
    [BLOCKS.HEADING_2]: (node: any, children: any) =>
      `<h2 class="heading-2">${children(node.content)}</h2>`,
    [BLOCKS.UL_LIST]: (node: any, children: any) =>
      `<ul class="ul mt-4">${children(node.content)}</ul>`,
    [BLOCKS.LIST_ITEM]: (node: any, children: any) =>
      `<li class="">${children(node.content)}</li>`,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) =>
      `<img class="image-article" src="${node.data.target.fields.file.url}"/>`,
    [INLINES.ENTRY_HYPERLINK]: (node: any) => {
      const linkedProduct = node.data.target
      console.log('Linked product:', linkedProduct)
      const linkedProductUrl = linkedProduct.fields.url ? slugify(linkedProduct.fields.url) : 'unknown'
      const link = `/products/another/${linkedProductUrl}`
      console.log('Generated link:', link)
      return `<a class="link" href="${link}">${node.content[0].value}</a>`
    },
    [BLOCKS.TABLE]: (node: any, children: any) =>
      `<table class="table-fixed border-collapse border-spacing-4 border-slate-500"><tbody>${children(node.content)}</tbody></table>`,
    [BLOCKS.TABLE_HEADER_CELL]: (node: any, children: any) =>
      `<th class="bg-gray-300 px-4 border border-slate-700">${children(node.content)}</th>`,
    [BLOCKS.TABLE_CELL]: (node: any, children: any) =>
      `<td class="px-4 border border-slate-700">${children(node.content)}</td>`,
  },
}

// Загрузка новости
const { data: article, pending, error } = await useAsyncData(
  `news-article-${id}`,
  async () => {
    const { $contentful } = useNuxtApp()
    try {
      const response: EntryCollection<NewsEntry> = await $contentful.getEntries({
        content_type: 'news',
        'sys.id': id,
      })
      console.log('Contentful article response:', response)
      if (!response.items.length) {
        throw createError({
          statusCode: 404,
          message: 'Новость не найдена',
        })
      }
      return response.items[0]
    } catch (err) {
      console.error('Contentful article error:', err)
      throw createError({
        statusCode: 404,
        message: 'Новость не найдена',
      })
    }
  },
  {
    default: () => null,
  }
)

// Рендеринг Rich Text
const richTextHtml = computed(() =>
  article.value && article.value.fields.htmlText
    ? documentToHtmlString(article.value.fields.htmlText, options)
    : ''
)

// Настройка SEO
useHead({
  title: article.value?.fields.header || 'Новость',
  meta: [
    {
      name: 'description',
      content: article.value?.fields.header || 'Новость',
    },
  ],
})
</script>