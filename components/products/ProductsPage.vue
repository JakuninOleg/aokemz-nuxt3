<script setup lang="ts">
import ProductsHero from "./ProductsHero.vue";
import ProductsCategories from "./ProductsCategories.vue";
import ProductsCta from "./ProductsCta.vue";
import ProductsCatalog from "./ProductsCatalog.vue";
</script>

<template>
  <div class="kemz-home kemz-products">
    <ProductsHero />
    <ProductsCategories />
    <ProductsCatalog />
    <ProductsCta />
  </div>
</template>

<style lang="scss" src="~/assets/css/home.scss"></style>
<style lang="scss" src="~/assets/css/products.scss"></style>
