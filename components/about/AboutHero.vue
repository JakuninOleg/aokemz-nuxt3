<template>
  <section class="about-hero">
    <div class="about-hero__media" aria-hidden="true">
      <img
        :src="ABOUT_HERO.imageSm"
        :srcset="`${ABOUT_HERO.imageSm} 640w, ${ABOUT_HERO.image} 1280w`"
        sizes="100vw"
        :alt="ABOUT_HERO.imageAlt"
        width="1280"
        height="720"
        decoding="async"
        fetchpriority="high"
      />
    </div>
    <div class="about-hero__front">
      <div class="about-hero__copy">
        <p class="eyebrow">{{ ABOUT_HERO.eyebrow }}</p>
        <p class="brand-line">{{ ABOUT_HERO.brand }}</p>
        <h1>{{ ABOUT_HERO.title }}</h1>
        <p class="about-hero__lead">{{ ABOUT_HERO.lead }}</p>
        <div class="about-hero__actions">
          <NuxtLink to="/products" class="button button-solid">Каталог</NuxtLink>
          <NuxtLink to="/contacts" class="button button-ghost">Связаться</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ABOUT_HERO } from '~/utils/aboutContent'

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: ABOUT_HERO.imageSm,
      type: 'image/webp',
      imagesrcset: `${ABOUT_HERO.imageSm} 640w, ${ABOUT_HERO.image} 1280w`,
      imagesizes: '100vw',
    },
  ],
})
</script>
