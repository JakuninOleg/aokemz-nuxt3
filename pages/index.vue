<template>
  <HomePage />
</template>

<script setup lang="ts">
import { PAGE_SEO } from '~/utils/siteSeo'
import HomePage from '~/components/home/HomePage.vue'

usePageSeo(PAGE_SEO.home)

// The image is the LCP candidate. Preload the exact responsive source so it
// competes neither with below-the-fold cards nor with route-prefetch work.
useHead({
  link: [
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/RobotoCondensed-Home.subset.woff2',
      type: 'font/woff2',
      crossorigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'image',
      href: '/media/generated/hero-quarry-dragline-wide-v11.webp',
      media: '(min-width: 601px)',
      fetchpriority: 'high',
    },
    {
      rel: 'preload',
      as: 'image',
      href: '/media/generated/hero-quarry-dragline-wide-v11-480.webp',
      media: '(max-width: 480px)',
      fetchpriority: 'high',
    },
    {
      rel: 'preload',
      as: 'image',
      href: '/media/generated/hero-quarry-dragline-wide-v11-640.webp',
      media: '(min-width: 481px) and (max-width: 600px)',
      fetchpriority: 'high',
    },
  ],
})
</script>
