<script setup lang="ts">
import { setResponseStatus } from "h3";
import {
  contentfulAssetUrl,
  CATEGORY_HERO_OVERRIDES,
  CATEGORY_HERO_LEAD_OVERRIDES,
  CATEGORY_CTA,
  PRODUCTS_HERO,
} from "~/utils/productsContent";
import { absoluteSiteUrl, breadcrumbJsonLd, canonicalUrl } from "~/utils/siteSeo";
import type { CatalogCategory, CatalogEntry } from "~/utils/catalog";
import CategoryEquipment from "./CategoryEquipment.vue";
import CategorySpecifications from "./CategorySpecifications.vue";

type Category = CatalogCategory & {
  fields: {
    description?: string;
    files?: Array<{
      sys: { id: string };
      fields?: {
        title?: string;
        file?: { url?: string; contentType?: string };
      };
    }>;
  };
};

const route = useRoute();
const categorySlug = computed(() => String(route.params.category));
const { data, pending, error, refresh } = await useAsyncData(
  () => `contentful-category-page-${categorySlug.value}`,
  async () => {
    const { $contentful } = useNuxtApp();
    const categories = await $contentful.getEntries<Category>({
      content_type: "Category",
      "fields.url": categorySlug.value,
      limit: 1,
    });
    const category = categories.items[0];
    if (!category)
      throw createError({ statusCode: 404, message: "Категория не найдена" });
    const query = {
      content_type: "subcategory",
      "fields.category.sys.id": category.sys.id,
      order: "fields.order,sys.id",
      limit: 1000,
      include: 3,
    };
    const first = await $contentful.getEntries<CatalogEntry>(query);
    const products = [...first.items];
    while (products.length < first.total) {
      const next = await $contentful.getEntries<CatalogEntry>({
        ...query,
        skip: products.length,
      });
      if (!next.items.length) break;
      products.push(...next.items);
    }
    return {
      category,
      products: products
        .filter((item) => item.fields?.name && item.fields?.url)
        .map((item) => ({ ...item, fields: { ...item.fields, category } })),
    };
  },
);

if (import.meta.server && error.value?.statusCode === 404) {
  const event = useRequestEvent();
  if (event) setResponseStatus(event, 404);
}
const category = computed(() => data.value?.category);
const products = computed(() => data.value?.products || []);
const documents = computed(
  () =>
    category.value?.fields.files?.filter(
      (file: NonNullable<Category["fields"]["files"]>[number]) =>
        file.fields?.file?.url,
    ) ||
    [],
);
const selectedProduct = ref("");
const lead = computed(
  () =>
    CATEGORY_HERO_LEAD_OVERRIDES[categorySlug.value] ||
    category.value?.fields.description?.trim() ||
    (categorySlug.value === "excavator"
      ? "Электрические машины и комплекты приводов для карьерных и шагающих экскаваторов."
      : "Модели, технические характеристики и документация. Подбор оборудования под вашу задачу."),
);
const categoryHero = computed(
  () =>
    CATEGORY_HERO_OVERRIDES[
      categorySlug.value as keyof typeof CATEGORY_HERO_OVERRIDES
    ],
);
const heroImage = computed(() =>
  categorySlug.value === "excavator"
    ? PRODUCTS_HERO.image
    : categoryHero.value?.image || contentfulAssetUrl(category.value?.fields.image?.fields?.file?.url),
);
const heroImageAlt = computed(
  () => categoryHero.value?.alt || category.value?.fields.Name || "Оборудование КЭМЗ",
);
useSeoMeta({
  robots: () => error.value?.statusCode === 404 ? "noindex, nofollow" : undefined,
  title: () =>
    `${category.value?.fields.Name || "Категория продукции"} — каталог | ОАО «КЭМЗ»`,
  description: () => lead.value,
  ogTitle: () => `${category.value?.fields.Name || "Продукция"} | ОАО «КЭМЗ»`,
  ogDescription: () => lead.value,
  ogUrl: () => canonicalUrl(`/products/${categorySlug.value}`),
  ogImage: () => absoluteSiteUrl(heroImage.value),
  twitterCard: "summary_large_image",
  twitterTitle: () => `${category.value?.fields.Name || "Продукция"} | ОАО «КЭМЗ»`,
  twitterDescription: () => lead.value,
  twitterImage: () => absoluteSiteUrl(heroImage.value),
});

useHead(() => {
  if (!category.value?.fields.Name) return {};
  const path = `/products/${categorySlug.value}`;
  return {
    link: [{ rel: "canonical", href: canonicalUrl(path) }],
    script: [
      {
        key: "category-breadcrumb-jsonld",
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd([
            { name: "Главная", path: "/" },
            { name: "Продукция", path: "/products" },
            { name: category.value.fields.Name, path },
          ]),
        ),
      },
    ],
  };
});
</script>

<template>
  <div class="kemz-home kemz-products kemz-category">
    <div v-if="pending" class="ref-container products-status" role="status">
      Загрузка категории…
    </div>
    <div v-else-if="error || !category" class="ref-container products-status">
      <h1>
        {{
          error?.statusCode === 404
            ? "Категория не найдена"
            : "Не удалось загрузить категорию"
        }}
      </h1>
      <button
        v-if="error?.statusCode !== 404"
        type="button"
        class="products-status__retry"
        @click="refresh()"
      >
        Повторить загрузку
      </button>
      <NuxtLink to="/products" class="product-back">← К каталогу</NuxtLink>
    </div>
    <template v-else>
      <section class="category-hero internal-hero internal-hero--mobile-surface internal-hero--mobile-about" aria-labelledby="category-title">
        <img
          v-if="heroImage"
          class="category-hero__image internal-hero__image"
          :src="heroImage"
          :alt="heroImageAlt"
          width="1920"
          height="800"
          fetchpriority="high"
        />
        <div class="ref-container category-hero__content internal-hero__content">
          <nav class="category-hero__crumbs internal-hero__crumbs" aria-label="Хлебные крошки">
            <NuxtLink to="/">Главная</NuxtLink><span aria-hidden="true">/</span
            ><NuxtLink to="/products">Продукция</NuxtLink
            ><span aria-hidden="true">/</span
            ><span aria-current="page">{{ category.fields.Name }}</span>
          </nav>
          <h1 id="category-title">{{ category.fields.Name }}</h1>
          <p class="category-hero__lead">{{ lead }}</p>
          <ul class="category-hero__benefits">
            <li>
              <HomeEngineeringIcon name="factory" /><span
                >Собственное<br />производство</span
              >
            </li>
            <li>
              <HomeEngineeringIcon name="test" /><span
                >Испытания<br />на стендах завода</span
              >
            </li>
            <li>
              <HomeEngineeringIcon name="globe" /><span
                >Поставка по России<br />и странам СНГ</span
              >
            </li>
          </ul>
        </div>
      </section>
      <CategoryEquipment
        :key="category.sys.id"
        :products="products"
        :has-documents="Boolean(documents.length)"
        @inspect="selectedProduct = $event"
      />
      <CategorySpecifications v-model="selectedProduct" :products="products" />
      <section
        v-if="documents.length"
        id="category-documents"
        class="ref-container category-documents"
        aria-labelledby="category-docs-title"
      >
        <h2 id="category-docs-title">Документация</h2>
        <p>
          Опросные листы и справочные материалы для подбора и эксплуатации
          оборудования.
        </p>
        <div class="category-documents__grid">
          <a
            v-for="file in documents"
            :key="file.sys.id"
            :href="contentfulAssetUrl(file.fields?.file?.url)"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HomeEngineeringIcon name="document" /><span>{{
              file.fields?.title || "Документ"
            }}</span
            ><span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
      <HomeCtaBand
        class="category-cta"
        :title="CATEGORY_CTA.title"
        lead="Укажите модель техники и условия эксплуатации. Специалисты помогут подобрать оборудование и ответят на вопросы."
        :image="CATEGORY_CTA.image"
        :image-alt="CATEGORY_CTA.imageAlt"
        :button-label="CATEGORY_CTA.button"
        :aside="CATEGORY_CTA.aside"
        title-id="category-cta-title"
      />
    </template>
  </div>
</template>

<style lang="scss" src="~/assets/css/home.scss"></style>
<style lang="scss" src="~/assets/css/products.scss"></style>
<style lang="scss" src="~/assets/css/category.scss"></style>
