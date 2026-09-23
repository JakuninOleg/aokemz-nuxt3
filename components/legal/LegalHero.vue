<script setup lang="ts">
import { LEGAL_HERO } from "~/utils/legalContent";
</script>

<template>
  <section class="legal-hero internal-hero internal-hero--mobile-surface" aria-labelledby="legal-title">
    <img
      class="legal-hero__image internal-hero__image"
      :src="LEGAL_HERO.image"
      :alt="LEGAL_HERO.imageAlt"
      width="2048"
      height="900"
      fetchpriority="high"
      decoding="async"
    />
    <div class="ref-container legal-hero__content internal-hero__content">
      <nav class="legal-hero__crumbs internal-hero__crumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/">Главная</NuxtLink><span aria-hidden="true">/</span
        ><span>Обработка персональных данных</span>
      </nav>
      <h1 id="legal-title">{{ LEGAL_HERO.title }}</h1>
      <p class="legal-hero__lead">{{ LEGAL_HERO.lead }}</p>
      <p class="legal-hero__rail" aria-hidden="true">{{ LEGAL_HERO.rail }}</p>
    </div>
  </section>
</template>
