<template>
  <div class="kemz-light">
    <HomeHero />
    <HomeStats />
    <HomeDirections />
    <HomeProcess />
    <HomeCapabilities />
    <HomeGeography />
    <HomeContactLead />
  </div>
</template>

<script setup lang="ts">
import { PAGE_SEO } from '~/utils/siteSeo'

usePageSeo(PAGE_SEO.home)
</script>

<style lang="scss" src="~/assets/css/home-light.scss"></style>
