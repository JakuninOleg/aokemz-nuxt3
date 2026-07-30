<template>
  <div class="kemz-light">
    <div class="cat-detail">
      <div class="wrap">
        <div v-if="pending" class="cat-status">
          <p>Загрузка категории…</p>
        </div>

        <div v-else-if="error" class="cat-status cat-status--error">
          <p>{{ error.message || 'Ошибка загрузки' }}</p>
          <NuxtLink to="/products" class="text-link">← К каталогу</NuxtLink>
        </div>

        <div v-else-if="!category" class="cat-status cat-status--error">
          <p>Категория не найдена</p>
          <NuxtLink to="/products" class="text-link">← К каталогу</NuxtLink>
        </div>

        <template v-else>
          <header class="cat-detail__head">
            <h1>{{ category.fields.Name }}</h1>
          </header>

          <figure
            v-if="category.fields.image?.fields?.file?.url"
            class="cat-detail__media"
          >
            <img
              :src="'https:' + category.fields.image.fields.file.url"
              :alt="category.fields.Name"
              loading="lazy"
              width="1280"
              height="720"
            />
          </figure>

          <p v-if="category.fields.description" class="cat-detail__lead">
            {{ category.fields.description }}
          </p>

          <h2 class="cat-detail__section-title">Продукция</h2>

          <div
            v-for="[type, fields] in Object.entries(products)"
            :key="type"
            class="cat-product-group"
          >
            <h3>{{ type }}</h3>
            <ul class="cat-product-list">
              <li v-for="product in fields" :key="product.sys.id">
                <NuxtLink
                  :to="'/products/' + category.fields.url + '/' + product.fields.url"
                >
                  {{ product.fields.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <template v-if="category.fields.files?.length">
            <h2 class="cat-detail__section-title">Документы</h2>
            <div class="cat-docs">
              <a
                v-for="file in category.fields.files"
                :key="file.sys.id"
                class="cat-doc"
                target="_blank"
                rel="noopener noreferrer"
                :href="'https:' + file.fields.file.url"
              >
                <img
                  v-if="file.fields.file.contentType === 'application/pdf'"
                  src="~/assets/images/pdf.png"
                  alt=""
                  loading="lazy"
                  width="28"
                  height="28"
                />
                <img
                  v-else
                  src="~/assets/images/word.png"
                  alt=""
                  loading="lazy"
                  width="28"
                  height="28"
                />
                <span>{{ file.fields.title }}</span>
              </a>
            </div>
          </template>

          <NuxtLink to="/products" class="text-link cat-detail__back cat-detail__back--end">
            ← Вернуться к каталогу
          </NuxtLink>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EntryCollection } from 'contentful'

interface ContentfulEntry {
  sys: { id: string; contentType: { sys: { id: string } } }
  fields: {
    Name?: string
    url?: string
    image?: { fields: { file: { url: string } } }
    description?: string
    files?: Array<{
      sys: { id: string }
      fields: { title: string; file: { url: string; contentType: string } }
    }>
    name?: string
    type?: string
    order?: number
    category?: { sys: { id: string }; fields: { url: string } }
  }
}

const route = useRoute()
const categoryId = route.params.category

const { data: categoryData, pending: categoryPending, error: categoryError } = await useAsyncData(
  `contentful-category-${categoryId}`,
  async () => {
    const { $contentful } = useNuxtApp()
    try {
      const data: EntryCollection<ContentfulEntry> = await $contentful.getEntries({
        content_type: 'Category',
        'fields.url': categoryId,
      })
      if (!data.items.length) {
        throw createError({
          statusCode: 404,
          message: 'Категория не найдена',
        })
      }
      return data.items[0]
    } catch (err) {
      throw createError({
        statusCode: 404,
        message: 'Категория не найдена',
      })
    }
  },
  {
    default: () => null,
  },
)

const { data: productsData, pending: productsPending, error: productsError } = await useAsyncData(
  `contentful-products-${categoryId}`,
  async () => {
    const { $contentful } = useNuxtApp()
    try {
      const categoryResponse: EntryCollection<ContentfulEntry> = await $contentful.getEntries({
        content_type: 'Category',
        'fields.url': categoryId,
      })
      if (!categoryResponse.items.length) {
        return []
      }
      const categorySysId = categoryResponse.items[0].sys.id

      const data: EntryCollection<ContentfulEntry> = await $contentful.getEntries({
        content_type: 'subcategory',
        'fields.category.sys.id': categorySysId,
      })
      return data.items
    } catch {
      return []
    }
  },
  {
    default: () => [],
  },
)

const pending = computed(() => categoryPending.value || productsPending.value)
const error = computed(() => categoryError.value || productsError.value)
const category = categoryData

const products = computed(() => {
  const orderedProducts = productsData.value?.sort(
    (a: ContentfulEntry, b: ContentfulEntry) => (a.fields.order || 0) - (b.fields.order || 0),
  )

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

useSeoMeta({
  title: () =>
    category.value?.fields.Name
      ? `${category.value.fields.Name} — каталог | ОАО «КЭМЗ»`
      : 'Категория продукции | ОАО «КЭМЗ»',
  description: () =>
    category.value?.fields.Name
      ? `${category.value.fields.Name}: электрические машины и приводы ОАО «КЭМЗ», Карпинск.`
      : 'Категория каталога продукции ОАО «Карпинский электромашиностроительный завод».',
})
</script>

<style lang="scss" src="~/assets/css/catalog-light.scss"></style>
