<template>
  <div class="kemz-light">
    <AboutHero />
    <AboutFacts />
    <AboutStory />
    <AboutCycle />
    <AboutPlant />
    <AboutLines />
    <AboutGallery />
    <AboutCta />
  </div>
</template>

<script setup lang="ts">
import { PAGE_SEO } from '~/utils/siteSeo'

usePageSeo(PAGE_SEO.about)
</script>

<style lang="scss" src="~/assets/css/about-light.scss"></style>
