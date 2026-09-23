<template>
  <NewsPage />
</template>

<script setup lang="ts">
import { PAGE_SEO } from "~/utils/siteSeo";
import NewsPage from "~/components/news/NewsPage.vue";
import { NEWS_HERO } from "~/utils/newsContent";

usePageSeo(PAGE_SEO.news);

useHead({
  link: [
    {
      rel: "preload",
      as: "image",
      href: NEWS_HERO.image,
      type: "image/webp",
    },
  ],
});
</script>
