<script setup lang="ts">
import { NEWS_HERO } from "~/utils/newsContent";
</script>

<template>
  <section class="news-hero internal-hero internal-hero--mobile-surface" aria-labelledby="news-title">
    <img
      class="news-hero__image internal-hero__image"
      :src="NEWS_HERO.image"
      :alt="NEWS_HERO.imageAlt"
      width="1915"
      height="821"
      fetchpriority="high"
      decoding="async"
    />
    <div class="ref-container news-hero__content internal-hero__content">
      <nav class="news-hero__crumbs internal-hero__crumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/">Главная</NuxtLink><span aria-hidden="true">/</span
        ><span>Новости</span>
      </nav>

      <h1 id="news-title">{{ NEWS_HERO.title }}</h1>

      <p class="news-hero__lead">{{ NEWS_HERO.lead }}</p>

      <p class="news-hero__rail" aria-hidden="true">
        <span class="news-hero__rail-line" />
        <span class="news-hero__rail-text">
          <span v-for="line in NEWS_HERO.rail" :key="line">{{ line }}</span>
        </span>
      </p>
    </div>
  </section>
</template>
