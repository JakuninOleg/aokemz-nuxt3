<script setup lang="ts">
import { NEWS_CTA } from "~/utils/newsContent";
</script>

<template>
  <HomeCtaBand
    :title="NEWS_CTA.title"
    :lead="NEWS_CTA.lead"
    :image="NEWS_CTA.image"
    :image-alt="NEWS_CTA.imageAlt"
    :button-label="NEWS_CTA.button"
    :aside="NEWS_CTA.aside"
    title-id="news-cta-title"
  />
</template>
