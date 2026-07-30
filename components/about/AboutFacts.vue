<template>
  <section class="about-facts" aria-label="Факты о заводе">
    <div class="wrap about-facts__grid">
      <div v-for="fact in ABOUT_FACTS" :key="fact.label" class="about-fact">
        <strong>{{ fact.value }}</strong>
        <span>{{ fact.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ABOUT_FACTS } from '~/utils/aboutContent'
</script>
