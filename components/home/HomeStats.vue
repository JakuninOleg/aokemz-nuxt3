<template>
  <section class="stats" aria-label="Факты о продукции">
    <div class="wrap stats-grid">
      <div
        v-for="stat in HOME_STATS"
        :key="stat.label"
        class="stat"
        :class="{ 'stat--long': stat.long }"
      >
        <strong>{{ stat.value }}</strong>
        <span>{{ stat.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { HOME_STATS } from '~/utils/homeContent'
</script>
