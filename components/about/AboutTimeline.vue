<script setup lang="ts">
import { ABOUT_TIMELINE } from "~/utils/aboutContent";
</script>

<template>
  <section class="abt-timeline" aria-label="Хронология завода">
    <ol class="ref-container abt-timeline__list">
      <li v-for="item in ABOUT_TIMELINE" :key="item.year">
        <strong>{{ item.year }}</strong>
        <span>{{ item.text }}</span>
      </li>
    </ol>
  </section>
</template>
