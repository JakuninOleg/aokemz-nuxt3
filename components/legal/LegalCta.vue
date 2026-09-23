<script setup lang="ts">
import { LEGAL_CTA } from "~/utils/legalContent";
</script>

<template>
  <HomeCtaBand
    :title="LEGAL_CTA.title"
    :lead="LEGAL_CTA.lead"
    :image="LEGAL_CTA.image"
    :image-alt="LEGAL_CTA.imageAlt"
    button-label="Связаться"
    :aside="LEGAL_CTA.aside"
    title-id="legal-cta-title"
  />
</template>
