<template>
  <div class="kemz-light min-h-screen">
    <HomeTopbar />
    <main>
      <HomeHero />
      <HomeStats />
      <HomeDirections />
      <HomeProcess />
      <HomeCapabilities />
      <HomeGeography />
      <HomeContactLead />
    </main>
    <HomeSiteFooter />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@400;500&family=Source+Sans+3:wght@400;500;600;700&display=swap',
    },
  ],
})

useSeoMeta({
  title: 'ОАО КЭМЗ — электрические машины для карьера',
  description: 'Электрические машины и комплектные приводы для ЭКГ, ЭШ, буровых установок и шахтного оборудования.',
})
</script>

<style lang="scss" src="~/assets/css/home-light.scss"></style>
