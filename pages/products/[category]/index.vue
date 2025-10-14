<template>
  <section class="section mt-8 lg:mt-24 mb-16">
    <div v-if="pending" class="text-center">
      <p>Загрузка...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>{{ error.message }}</p>
      <NuxtLink to="/products" class="text-blue-500">Вернуться к каталогу</NuxtLink>
    </div>
    <div v-else-if="!category" class="text-center text-red-500">
      <p>Категория не найдена</p>
      <NuxtLink to="/products" class="text-blue-500">Вернуться к каталогу</NuxtLink>
    </div>
    <div v-else>
      <h1 class="font-bold text-2xl lg:text-3xl lg:mb-16 mb-8">
        {{ category.fields.Name }}
      </h1>
      <img
        :src="'https:' + category.fields.image.fields.file.url"
        :alt="category.fields.Name"
        loading="lazy"
        class="h-80 rounded-t-lg mb-10"
      />
      <p class="text-lg mb-10">
        {{ category.fields.description }}
      </p>
      <h2 class="font-bold text-xl mb-8">Продукция</h2>
      <section class="mb-8">
        <div v-for="[type, fields] in Object.entries(products)" :key="type" class="mb-6">
          <h3 class="font-semibold text-lg mb-6">{{ type }}</h3>
          <ul class="list-disc list-inside">
            <li v-for="product in fields" :key="product.sys.id" class="mb-2">
              <NuxtLink
                :to="'/products/' + category.fields.url + '/' + product.fields.url"
                class="link"
              >
                {{ product.fields.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div v-if="category.fields.files" class="grid gap-4 lg:gap-6">
          <h2 class="font-bold text-lg mt-4">Документы</h2>
          <a
            v-for="file in category.fields.files"
            :key="file.sys.id"
            class="flex text-md xl:text-lg text-blue-500 hover:text-blue-600 mr-6 font-medium"
            target="_blank"
            :href="'https:' + file.fields.file.url"
          >
            <img
              v-if="file.fields.file.contentType === 'application/pdf'"
              src="~/assets/images/pdf.png"
              alt="pdf"
              loading="lazy"
              class="w-10 object-contain mr-3"
            />
            <img
              v-else
              src="~/assets/images/word.png"
              alt="word"
              loading="lazy"
              class="w-10 object-contain mr-3"
            />
            <p class="self-end">
              <span>{{ file.fields.title }}</span>
            </p>
          </a>
        </div>
      </section>
      <p
        class="text-lg font-light mr-2 transition ease-out transition-duration-320"
      >
        <NuxtLink to="/products" class="flex items-center w-full link">
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
          Вернуться к каталогу
        </NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Entry, EntryCollection } from 'contentful'

// Типизация для Contentful
interface ContentfulEntry {
  sys: { id: string; contentType: { sys: { id: string } } }
  fields: {
    Name?: string
    url?: string
    image?: { fields: { file: { url: string } } }
    description?: string
    files?: Array<{ fields: { title: string; file: { url: string; contentType: string } } }>
    name?: string
    type?: string
    order?: number
    category?: { sys: { id: string }; fields: { url: string } }
  }
}

// Получаем параметр маршрута
const route = useRoute()
const categoryId = route.params.category

// Логирование для отладки
console.log('Category ID:', categoryId)

// Загрузка данных категории
const { data: categoryData, pending: categoryPending, error: categoryError } = await useAsyncData(
  `contentful-category-${categoryId}`,
  async () => {
    const { $contentful } = useNuxtApp()
    try {
      const data: EntryCollection<ContentfulEntry> = await $contentful.getEntries({
        content_type: 'Category',
        'fields.url': categoryId,
      })
      console.log('Contentful category response:', data)
      if (!data.items.length) {
        console.warn('No category found for fields.url:', categoryId)
        throw createError({
          statusCode: 404,
          message: 'Категория не найдена',
        })
      }
      return data.items[0]
    } catch (err) {
      console.error('Contentful category error:', err)
      throw createError({
        statusCode: 404,
        message: 'Категория не найдена',
      })
    }
  },
  {
    default: () => null,
  }
)

// Загрузка продуктов
const { data: productsData, pending: productsPending, error: productsError } = await useAsyncData(
  `contentful-products-${categoryId}`,
  async () => {
    const { $contentful } = useNuxtApp()
    try {
      // Получаем ID категории
      const categoryResponse: EntryCollection<ContentfulEntry> = await $contentful.getEntries({
        content_type: 'Category',
        'fields.url': categoryId,
      })
      if (!categoryResponse.items.length) {
        console.warn('No category found for products:', categoryId)
        return []
      }
      const categorySysId = categoryResponse.items[0].sys.id

      // Получаем продукты
      const data: EntryCollection<ContentfulEntry> = await $contentful.getEntries({
        content_type: 'subcategory',
        'fields.category.sys.id': categorySysId,
      })
      console.log('Contentful products response:', data)
      return data.items
    } catch (err) {
      console.error('Contentful products error:', err)
      return []
    }
  },
  {
    default: () => [],
  }
)

// Объединяем состояния загрузки и ошибок
const pending = computed(() => categoryPending.value || productsPending.value)
const error = computed(() => categoryError.value || productsError.value)

// Выбираем первую категорию
const category = categoryData

// Группировка продуктов по типу
const products = computed(() => {
  const orderedProducts = productsData.value
    ?.sort((a: ContentfulEntry, b: ContentfulEntry) => (a.fields.order || 0) - (b.fields.order || 0))

  const grouped: Record<string, ContentfulEntry[]> = {}
  orderedProducts?.forEach((product: ContentfulEntry) => {
    const type = product.fields.type || 'Без типа'
    if (!grouped[type]) {
      grouped[type] = []
    }
    grouped[type].push(product)
  })

  return grouped
})

// Настройка SEO
// useHead({
//   title: category?.fields.Name || 'Категория',
//   meta: [
//     {
//       name: 'description',
//       content: category?.fields.description || 'Описание категории продукции',
//     },
//   ],
// })
</script>