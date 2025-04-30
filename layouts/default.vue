<template>
  <div class="lg:grid grid-main">
    <Nav />
    <main class="lg:flex flex-1 w-full">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import Nav from '~/components/Nav.vue'
</script>