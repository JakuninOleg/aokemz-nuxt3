<script setup lang="ts">
import NewsHero from "./NewsHero.vue";
import NewsList from "./NewsList.vue";
import NewsCta from "./NewsCta.vue";
</script>

<template>
  <div class="kemz-home kemz-news">
    <NewsHero />
    <NewsList />
    <NewsCta />
  </div>
</template>

<style lang="scss" src="~/assets/css/home.scss"></style>
<style lang="scss" src="~/assets/css/news.scss"></style>
