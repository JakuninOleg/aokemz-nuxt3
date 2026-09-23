<script setup lang="ts">
import { PRODUCTS_HERO } from "~/utils/productsContent";
</script>

<template>
  <section class="products-hero internal-hero internal-hero--mobile-surface internal-hero--mobile-about" aria-labelledby="products-title">
    <picture>
      <source media="(max-width: 767px)" :srcset="PRODUCTS_HERO.mobileImage" />
      <img
        class="products-hero__image internal-hero__image"
        :src="PRODUCTS_HERO.image"
        :alt="PRODUCTS_HERO.imageAlt"
        width="1600"
        height="533"
        fetchpriority="high"
        decoding="async"
      />
    </picture>
    <div class="ref-container products-hero__content internal-hero__content">
      <nav class="products-hero__crumbs internal-hero__crumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/">Главная</NuxtLink><span aria-hidden="true">/</span
        ><span>Продукция</span>
      </nav>

      <h1 id="products-title">{{ PRODUCTS_HERO.title }}</h1>

      <p class="products-hero__lead">{{ PRODUCTS_HERO.lead }}</p>

      <ul class="products-hero__points" aria-label="Особенности каталога">
        <li v-for="(point, index) in PRODUCTS_HERO.points" :key="point"><HomeEngineeringIcon :name="['factory', 'design', 'globe'][index]" /><span>{{ point }}</span></li>
      </ul>

      <p class="products-hero__rail" aria-hidden="true">
        <span
          v-for="line in PRODUCTS_HERO.rail"
          :key="line"
          class="products-hero__rail-item"
          >{{ line }}</span
        >
      </p>
    </div>
  </section>
</template>
