<template>
  <AboutPage />
</template>

<script setup lang="ts">
import { PAGE_SEO } from "~/utils/siteSeo";
import AboutPage from "~/components/about/AboutPage.vue";
import { ABOUT_HERO } from "~/utils/aboutContent";

usePageSeo(PAGE_SEO.about);

useHead({
  link: [
    {
      rel: "preload",
      as: "image",
      href: ABOUT_HERO.image,
      type: "image/webp",
    },
  ],
});
</script>
