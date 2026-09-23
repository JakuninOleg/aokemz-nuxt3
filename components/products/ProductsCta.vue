<script setup lang="ts">
import { PRODUCTS_CTA } from "~/utils/productsContent";
</script>

<template>
  <HomeCtaBand
    class="catalog-cta"
    :title="PRODUCTS_CTA.title"
    :lead="PRODUCTS_CTA.lead"
    :image="PRODUCTS_CTA.image"
    :image-alt="PRODUCTS_CTA.imageAlt"
    :button-label="PRODUCTS_CTA.button"
    title-id="products-cta-title"
  />
</template>
