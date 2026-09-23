<script setup lang="ts">
import { ABOUT_HERO } from "~/utils/aboutContent";

const titleLines = ABOUT_HERO.title.split("\n");
</script>

<template>
  <section class="abt-hero" aria-labelledby="about-title">
    <img
      class="abt-hero__image"
      :src="ABOUT_HERO.image"
      :alt="ABOUT_HERO.imageAlt"
      width="2048"
      height="768"
      fetchpriority="high"
      decoding="async"
    />
    <div class="ref-container abt-hero__content">
      <nav class="abt-hero__crumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/">Главная</NuxtLink><span aria-hidden="true">/</span
        ><span>О заводе</span>
      </nav>
      <h1 id="about-title">
        <template v-for="(line, i) in titleLines" :key="i">
          {{ line }}<br v-if="i < titleLines.length - 1" />
        </template>
      </h1>
      <p class="abt-hero__lead">{{ ABOUT_HERO.lead }}</p>
      <div class="abt-hero__actions">
        <HomeActionButton to="/products">Каталог</HomeActionButton>
      </div>
    </div>
    <p class="abt-hero__aside">
      Надёжное<br />оборудование<br />для ваших<br />задач
    </p>
  </section>
</template>
