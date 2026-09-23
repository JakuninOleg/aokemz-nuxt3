<script setup lang="ts">
import { DOCUMENTS_CTA } from "~/utils/documentsContent";
</script>

<template>
  <HomeCtaBand
    :title="DOCUMENTS_CTA.title"
    :lead="DOCUMENTS_CTA.lead"
    :image="DOCUMENTS_CTA.image"
    :image-alt="DOCUMENTS_CTA.imageAlt"
    :button-label="DOCUMENTS_CTA.button"
    :aside="DOCUMENTS_CTA.aside"
    title-id="docs-cta-title"
  />
</template>
