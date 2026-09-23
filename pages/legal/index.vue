<template>
  <LegalPage />
</template>

<script setup lang="ts">
import { PAGE_SEO } from "~/utils/siteSeo";
import LegalPage from "~/components/legal/LegalPage.vue";
import { LEGAL_HERO } from "~/utils/legalContent";

usePageSeo(PAGE_SEO.legal);

useHead({
  link: [
    {
      rel: "preload",
      as: "image",
      href: LEGAL_HERO.image,
      type: "image/webp",
    },
  ],
});
</script>
