<template>
  <section class="section mt-8 lg:mt-24 grid gap-10 mb-16">
    <div v-if="pending" class="text-center">
      <p>Загрузка...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>{{ error.message }}</p>
      <NuxtLink to="/products" class="text-blue-500">Вернуться к каталогу</NuxtLink>
    </div>
    <div v-else-if="!product" class="text-center text-red-500">
      <p>Продукт не найден</p>
      <NuxtLink to="/products" class="text-blue-500">Вернуться к каталогу</NuxtLink>
    </div>
    <div v-else>
      <h1 class="text-xl md:text-3xl font-bold mb-10">
        {{ product.fields.name }}
      </h1>
      <img
        v-if="product.fields.image"
        :src="'https:' + product.fields.image.fields.file.url"
        :alt="product.fields.name"
        loading="lazy"
        class="h-80 rounded-t-lg"
      />
      <div class="grid gap-4" v-html="richTextHtml" />
      <h2 class="text-xl font-bold">Технические данные</h2>
      <div class="grid gap-4" v-html="richTextHtml2" />
      <p
        class="text-lg font-light mr-2 transition ease-out transition-duration-320"
      >
        <NuxtLink :to="'/products/' + route.params.category" class="flex items-center w-full link">
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
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types'
import type { EntryCollection } from 'contentful'

// Типизация для Contentful
interface ContentfulEntry {
  sys: { id: string }
  fields: {
    name: string
    url: string
    image?: { fields: { file: { url: string } } }
    description?: any // Rich Text
    params?: any // Rich Text
    category?: { sys: { id: string }; fields: { url: string } }
  }
}

// Получаем параметры маршрута
const route = useRoute()
const productId = route.params.product
const categoryId = route.params.category

// Логирование для отладки
console.log('Category ID:', categoryId, 'Product ID:', productId)

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
      [INLINES.ENTRY_HYPERLINK]: (node) =>
            `<a class="link" href="/products/another/${node.data.target.fields.url}">${node.content[0].value}</a>`,
    // [INLINES.ENTRY_HYPERLINK]: (node: any) => {
    //   const linkedProduct = node.data.target
    //   console.log('Linked product:', linkedProduct)
    //   const linkedCategoryUrl = linkedProduct.fields.category?.fields?.url
    //     ? slugify(linkedProduct.fields.category.fields.url)
    //     : 'unknown'
    //   const linkedProductUrl = linkedProduct.fields.url ? slugify(linkedProduct.fields.url) : 'unknown'
    //   const link = `/products/${linkedCategoryUrl}/${linkedProductUrl}`
    //   console.log('Generated link:', link)
    //   return `<a class="link" href="${link}">${node.content[0].value}</a>`
    // },
    [BLOCKS.TABLE]: (node: any, children: any) =>
      `<table class="table-fixed border-collapse border-spacing-4 border-slate-500"><tbody>${children(node.content)}</tbody></table>`,
    [BLOCKS.TABLE_HEADER_CELL]: (node: any, children: any) =>
      `<th class="bg-gray-300 px-4 border border-slate-700">${children(node.content)}</th>`,
    [BLOCKS.TABLE_CELL]: (node: any, children: any) =>
      `<td class="px-4 border border-slate-700">${children(node.content)}</td>`,
  },
}

// Загрузка данных продукта
const { data: product, pending, error } = await useAsyncData(
  `contentful-product-${productId}`,
  async () => {
    const { $contentful } = useNuxtApp()
    try {
      // Получаем продукт по fields.url
      const data: EntryCollection<ContentfulEntry> = await $contentful.getEntries({
        content_type: 'subcategory',
        'fields.url': productId,
      })
      console.log('Contentful product response:', data)
      if (!data.items.length) {
        console.warn('No product found for fields.url:', productId)
        throw createError({
          statusCode: 404,
          message: 'Продукт не найден',
        })
      }

      // // Проверяем категорию продукта
      // const productCategoryUrl = data.items[0].fields.category?.fields?.url
      // if (productCategoryUrl && slugify(productCategoryUrl) !== categoryId) {
      //   console.warn(
      //     `Product category (${productCategoryUrl}) does not match URL category (${categoryId})`
      //   )
      //   // Перенаправляем на правильную категорию
      //   navigateTo(`/products/${slugify(productCategoryUrl)}/${productId}`)
      //   return null
      // }

      return data.items[0]
    } catch (err) {
      console.error('Contentful product error:', err)
      throw createError({
        statusCode: 404,
        message: 'Продукт не найден',
      })
    }
  },
  {
    default: () => null,
  }
)

// Рендеринг Rich Text
const richTextHtml = computed(() =>
  product.value && product.value.fields.description
    ? documentToHtmlString(product.value.fields.description, options)
    : ''
)
const richTextHtml2 = computed(() =>
  product.value && product.value.fields.params
    ? documentToHtmlString(product.value.fields.params, options)
    : ''
)

// Настройка SEO
// useHead({
//   title: product.value?.fields.name || 'Продукт',
//   meta: [
//     {
//       name: 'description',
//       content: 'Описание продукта',
//     },
//   ],
// })
</script>

<style>
td {
  width: 20%;
}
</style>