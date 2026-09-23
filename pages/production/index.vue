<script setup lang="ts">
import ProductionPage from "~/components/production/ProductionPage.vue";
import { PRODUCTION_HERO } from "~/utils/productionContent";

usePageSeo({
  title: "Производство электрических машин | ОАО «КЭМЗ»",
  description:
    "Производственная площадка ОАО «КЭМЗ» в Карпинске: конструкторская подготовка, литьё, механообработка, сборка и испытания электрических машин.",
  path: "/production",
  ogImage: `https://aokemz.ru${PRODUCTION_HERO.image}`,
});

useHead({
  link: [
    {
      rel: "preload",
      as: "image",
      href: PRODUCTION_HERO.image,
      type: "image/webp",
    },
  ],
});
</script>

<template>
  <ProductionPage />
</template>
