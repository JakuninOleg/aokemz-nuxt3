<template>
  <div class="kemz-light">
    <header class="cat-hero">
      <div class="wrap">
        <p class="section-tag cat-hero__tag">Поставки</p>
        <h1>Спецпредложения</h1>
        <p class="cat-hero__lead">
          Раздел в работе. Актуальные позиции и сроки уточняйте в отделе продаж.
        </p>
      </div>
    </header>

    <div class="cat-body">
      <div class="wrap">
        <div class="cat-contacts__links cat-special-links">
          <a href="tel:+73432783743">+7 (343) 278-37-43</a>
          <a href="mailto:sales@aokemz.ru">sales@aokemz.ru</a>
        </div>
        <NuxtLink to="/contacts" class="text-link cat-detail__back cat-detail__back--end">
          ← Все контакты
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PAGE_SEO } from '~/utils/siteSeo'

usePageSeo(PAGE_SEO.special)
</script>

<style lang="scss" src="~/assets/css/catalog-light.scss"></style>
