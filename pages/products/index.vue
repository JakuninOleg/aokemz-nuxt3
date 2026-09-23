<template>
  <ProductsPage />
</template>

<script setup lang="ts">
import ProductsPage from "~/components/products/ProductsPage.vue";
import { PAGE_SEO } from "~/utils/siteSeo";
import { PRODUCTS_HERO } from "~/utils/productsContent";

usePageSeo(PAGE_SEO.products);

useHead({
  link: [
    {
      rel: "preload",
      as: "image",
      href: PRODUCTS_HERO.image,
      media: "(min-width: 768px)",
      fetchpriority: "high",
    },
    {
      rel: "preload",
      as: "image",
      href: PRODUCTS_HERO.mobileImage,
      media: "(max-width: 767px)",
      fetchpriority: "high",
    },
  ],
});
</script>
