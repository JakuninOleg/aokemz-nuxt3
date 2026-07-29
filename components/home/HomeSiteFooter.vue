<template>
  <footer>
    <div class="wrap footer-row">
      <span>ОАО «КЭМЗ» · Карпинск · с 1960 года</span>
      <nav class="footer-nav" aria-label="Нижнее меню">
        <NuxtLink v-for="link in links" :key="link.link" :to="link.link">{{ link.name }}</NuxtLink>
        <NuxtLink to="/legal">Правовая информация</NuxtLink>
      </nav>
      <span>© {{ year }} aokemz.ru</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { links } = useSiteNav()
const year = new Date().getFullYear()
</script>
