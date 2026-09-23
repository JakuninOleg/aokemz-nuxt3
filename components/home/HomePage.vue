<script setup lang="ts">
import HomeHero from "./HomeHero.vue";
import HomeShowcase from "./HomeShowcase.vue";
</script>

<template>
  <div class="kemz-home">
    <HomeHero />
    <HomeShowcase />
    <LazyHomeProduction />
    <LazyHomeCapabilities />
    <LazyHomeGeography />
    <LazyHomeRequest />
    <LazyHomeNews />
  </div>
</template>

<style lang="scss" src="~/assets/css/home.scss"></style>
