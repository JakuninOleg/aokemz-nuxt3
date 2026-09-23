<script setup lang="ts">
import { DOCUMENTS_HERO } from "~/utils/documentsContent";
</script>

<template>
  <section class="docs-hero" aria-labelledby="docs-title">
    <img
      class="docs-hero__schematic"
      :src="DOCUMENTS_HERO.image"
      :alt="DOCUMENTS_HERO.imageAlt"
      width="1600"
      height="900"
      fetchpriority="high"
      decoding="async"
    />
    <div class="ref-container docs-hero__content">
      <nav class="docs-hero__crumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/">Главная</NuxtLink><span aria-hidden="true">/</span
        ><span>Документы</span>
      </nav>
      <p class="docs-hero__label">{{ DOCUMENTS_HERO.label }}</p>
      <h1 id="docs-title">{{ DOCUMENTS_HERO.title }}</h1>
      <p class="docs-hero__lead">{{ DOCUMENTS_HERO.lead }}</p>
      <p class="docs-hero__rail">
        <span aria-hidden="true" />
        <strong>Надёжные решения<br />для реальных задач</strong>
      </p>
    </div>
  </section>
</template>
