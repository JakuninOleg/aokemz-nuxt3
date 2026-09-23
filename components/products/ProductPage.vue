<script setup lang="ts">
import { setResponseStatus } from "h3";
import { contentfulAssetUrl, CATEGORY_CTA } from "~/utils/productsContent";
import type { ContentfulEntries as EntryCollection } from "~/utils/contentfulTypes";
import { renderContentfulHtml } from "~/utils/contentfulRichText";
import { catalogItem, type CatalogEntry } from "~/utils/catalog";
import { absoluteSiteUrl, breadcrumbJsonLd, canonicalUrl, productJsonLd } from "~/utils/siteSeo";

type ProductFields = {
  name: string;
  url: string;
  type?: string;
  category?: { fields?: { url?: string } };
  image?: { fields: { file: { url: string } } };
  description?: unknown;
  params?: unknown;
};

type Entry = { sys: { id: string }; fields: ProductFields };

const route = useRoute();
const productId = computed(() => String(route.params.product));
const categorySlug = computed(() => String(route.params.category));

const { data: categoryMeta } = await useAsyncData(
  () => `contentful-category-name-${categorySlug.value}`,
  async () => {
    const { $contentful } = useNuxtApp();
    const data = await $contentful.getEntries<{ fields: { Name?: string } }>({
      content_type: "Category",
      "fields.url": categorySlug.value,
      limit: 1,
      select: ["fields.Name"],
    });
    return (data.items[0]?.fields as { Name?: string } | undefined)?.Name || "";
  },
  { default: () => "" },
);

const {
  data: product,
  pending,
  error,
} = await useAsyncData(
  () => `contentful-product-ref-${categorySlug.value}-${productId.value}`,
  async () => {
    const { $contentful } = useNuxtApp();
    const data: EntryCollection<Entry> = await $contentful.getEntries({
      content_type: "subcategory",
      "fields.url": productId.value,
      include: 3,
    });
    if (!data.items.length) {
      throw createError({ statusCode: 404, message: "Продукт не найден" });
    }
    const entry = data.items[0];
    const entryCategory = entry.fields.category?.fields?.url;
    if (entryCategory && entryCategory !== categorySlug.value) {
      throw createError({ statusCode: 404, message: "Продукт не найден" });
    }
    return entry;
  },
  { default: () => null },
);

if (import.meta.server && error.value?.statusCode === 404) {
  const event = useRequestEvent();
  if (event) setResponseStatus(event, 404);
}

const { data: relatedProducts } = await useAsyncData(
  () => `contentful-product-related-${categorySlug.value}-${productId.value}`,
  async () => {
    const { $contentful } = useNuxtApp();
    const categories = await $contentful.getEntries<{ sys: { id: string } }>({
      content_type: "Category", "fields.url": categorySlug.value, limit: 1,
    });
    if (!categories.items[0]) return [];
    const result = await $contentful.getEntries<CatalogEntry>({
      content_type: "subcategory",
      "fields.category.sys.id": categories.items[0].sys.id,
      "fields.url[ne]": productId.value,
      order: "fields.order,sys.id", limit: 4, include: 2,
    });
    return result.items.filter(item => item.fields?.name && item.fields?.url)
      .map(item => ({ ...catalogItem(item), href: `/products/${categorySlug.value}/${item.fields.url}` }));
  },
  { default: () => [] },
);

const descriptionHtml = computed(() =>
  renderContentfulHtml(product.value?.fields.description),
);
const paramsHtml = computed(() =>
  renderContentfulHtml(product.value?.fields.params),
);

const imageUrl = computed(() =>
  contentfulAssetUrl(product.value?.fields.image?.fields?.file?.url),
);

const leadText = computed(() => {
  if (!descriptionHtml.value) return "";
  const text = descriptionHtml.value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  const sentence = text.match(/^[\s\S]+?[.!?…](?=\s|$)/)?.[0]?.trim();
  const lead = sentence || text;
  return lead.length > 180 ? lead.slice(0, 177).trimEnd() : lead;
});

useSeoMeta({
  robots: () => error.value?.statusCode === 404 ? "noindex, nofollow" : undefined,
  title: () =>
    product.value?.fields.name
      ? `${product.value.fields.name} — каталог | ОАО «КЭМЗ»`
      : "Продукт | ОАО «КЭМЗ»",
  description: () =>
    leadText.value ||
    (product.value?.fields.name
      ? `${product.value.fields.name}: технические данные и применение. ОАО «Карпинский электромашиностроительный завод», Карпинск.`
      : "Карточка продукции ОАО «КЭМЗ»."),
  ogTitle: () =>
    product.value?.fields.name
      ? `${product.value.fields.name} | ОАО «КЭМЗ»`
      : "Продукт | ОАО «КЭМЗ»",
  ogDescription: () => leadText.value || undefined,
  ogUrl: () => canonicalUrl(`/products/${categorySlug.value}/${productId.value}`),
  ogImage: () => absoluteSiteUrl(imageUrl.value),
  twitterCard: "summary_large_image",
  twitterTitle: () => product.value?.fields.name ? `${product.value.fields.name} | ОАО «КЭМЗ»` : "Продукт | ОАО «КЭМЗ»",
  twitterDescription: () => leadText.value || undefined,
  twitterImage: () => absoluteSiteUrl(imageUrl.value),
});

useHead(() => {
  const name = product.value?.fields.name;
  if (!name) return {};
  const path = `/products/${categorySlug.value}/${productId.value}`;
  const description = leadText.value || undefined;
  const image = absoluteSiteUrl(imageUrl.value);
  return {
    link: [{ rel: "canonical", href: canonicalUrl(path) }],
    script: [
      {
        key: "product-breadcrumb-jsonld",
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd([
            { name: "Главная", path: "/" },
            { name: "Продукция", path: "/products" },
            { name: categoryMeta.value || "Категория", path: `/products/${categorySlug.value}` },
            { name, path },
          ]),
        ),
      },
      {
        key: "product-jsonld",
        type: "application/ld+json",
        children: JSON.stringify(productJsonLd({ name, path, description, image })),
      },
    ],
  };
});
</script>

<template>
  <div class="kemz-home kemz-products kemz-product-detail">
    <div v-if="pending" class="ref-container products-status" role="status">
      Загрузка…
    </div>
    <div v-else-if="error || !product" class="ref-container products-status">
      <p>{{ error?.message || "Продукт не найден" }}</p>
      <NuxtLink to="/products" class="product-back">← К каталогу</NuxtLink>
    </div>

    <template v-else>
      <section class="product-top">
        <div class="ref-container">
          <nav class="product-top__crumbs" aria-label="Хлебные крошки">
            <NuxtLink to="/">Главная</NuxtLink
            ><span aria-hidden="true">/</span>
            <NuxtLink to="/products">Продукция</NuxtLink
            ><span aria-hidden="true">/</span>
            <NuxtLink :to="`/products/${categorySlug}`">{{
              categoryMeta || "Категория"
            }}</NuxtLink
            ><span aria-hidden="true">/</span>
            <span aria-current="page">{{ product.fields.name }}</span>
          </nav>

          <div class="product-top__grid">
            <figure class="product-top__media">
              <img
                v-if="imageUrl"
                :src="imageUrl"
                :alt="product.fields.name"
                width="800"
                height="600"
                fetchpriority="high"
                decoding="async"
              />
              <span v-else class="product-image-empty">Изображение уточняется</span>
            </figure>

            <div>
              <p v-if="categoryMeta" class="product-top__label">
                {{ categoryMeta }}
              </p>
              <h1>{{ product.fields.name }}</h1>
              <p v-if="product.fields.type && product.fields.type.trim().toLowerCase() !== categoryMeta.trim().toLowerCase()" class="product-top__sub">{{ product.fields.type }}</p>
              <p v-if="leadText" class="product-top__lead">{{ leadText }}</p>
              <div class="product-top__actions">
                <HomeActionButton to="/contacts"
                  >Запросить подбор</HomeActionButton
                >
              </div>
              <ul class="product-assurances">
                <li><HomeEngineeringIcon name="factory" /><span>Собственное производство</span></li>
                <li><HomeEngineeringIcon name="test" /><span>Испытания на заводских стендах</span></li>
                <li><HomeEngineeringIcon name="globe" /><span>Россия и страны СНГ</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div class="ref-container product-layout">
        <nav class="product-nav" aria-label="Разделы карточки">
          <a v-if="descriptionHtml" href="#description">Описание</a>
          <a v-if="paramsHtml" href="#specifications">Технические данные</a>
          <NuxtLink
            :to="`/products/${categorySlug}`"
            class="product-back"
            style="margin-top: 12px"
            >← К списку продукции</NuxtLink
          >
        </nav>

        <div>
          <section
            v-if="descriptionHtml"
            id="description"
            class="product-section"
          >
            <h2>Описание</h2>
            <div class="product-section__grid">
              <div class="product-rich" v-html="descriptionHtml" />
              <figure class="product-aside-figure">
                <img
                  :src="imageUrl || '/media/documents/docs-cta-motors.webp'"
                  :alt="imageUrl ? product.fields.name : 'Электрические машины, промышленная иллюстрация'"
                  width="640"
                  height="480"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>Надёжность в каждой детали</figcaption>
              </figure>
            </div>
          </section>

        </div>
      </div>

      <section v-if="paramsHtml" id="specifications" class="ref-container product-specifications">
        <h2><HomeEngineeringIcon name="document" />Технические данные</h2>
        <div class="product-specifications__scroll" role="region" aria-label="Технические характеристики изделия" tabindex="0">
          <div class="product-rich" v-html="paramsHtml" />
        </div>
      </section>

      <HomeCtaBand
        class="product-detail-cta ref-container"
        :title="CATEGORY_CTA.title"
        lead="Укажите модель техники и условия эксплуатации. Специалисты помогут подобрать оборудование и ответят на вопросы."
        :image="'/media/documents/docs-cta-motors.webp'"
        image-alt="Электродвигатели в цехе и чертёж на синем фоне"
        button-label="Связаться с инженером"
        :aside="CATEGORY_CTA.aside"
        title-id="product-cta-title"
      />
      <section v-if="relatedProducts.length" class="ref-container product-related" aria-labelledby="product-related-title">
        <header>
          <h2 id="product-related-title">Другие продукты в категории</h2>
          <NuxtLink :to="`/products/${categorySlug}`" class="ref-link">Перейти в категорию <span aria-hidden="true">→</span></NuxtLink>
        </header>
        <div class="product-related__grid">
          <NuxtLink v-for="item in relatedProducts" :key="item.id" :to="item.href" class="product-related__card">
            <div class="product-related__image">
              <img v-if="item.image" :src="item.image" :alt="item.name" width="420" height="300" loading="lazy" />
              <span v-else>Изображение уточняется</span>
            </div>
            <h3>{{ item.name }}</h3>
            <p v-if="item.type">{{ item.type }}</p>
            <span class="ref-link">Подробнее <span aria-hidden="true">→</span></span>
          </NuxtLink>
        </div>
      </section>
    </template>
  </div>
</template>

<style lang="scss" src="~/assets/css/home.scss"></style>
<style lang="scss" src="~/assets/css/products.scss"></style>
<style lang="scss" src="~/assets/css/product.scss"></style>
