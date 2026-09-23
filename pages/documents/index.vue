<template>
  <DocumentsPage />
</template>

<script setup lang="ts">
import { PAGE_SEO } from "~/utils/siteSeo";
import DocumentsPage from "~/components/documents/DocumentsPage.vue";
import { DOCUMENTS_HERO } from "~/utils/documentsContent";

usePageSeo(PAGE_SEO.documents);

useHead({
  link: [
    {
      rel: "preload",
      as: "image",
      href: DOCUMENTS_HERO.image,
      type: "image/webp",
    },
  ],
});
</script>
