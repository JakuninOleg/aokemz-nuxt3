<template>
  <section class="border-b border-kemz-steel bg-white">
    <div class="section grid grid-cols-2 gap-8 py-10 lg:grid-cols-4 lg:gap-6 lg:py-12">
      <div v-for="item in items" :key="item.label" class="min-w-0">
        <p class="text-2xl font-bold tabular-nums text-kemz-brand sm:text-3xl">{{ item.value }}</p>
        <p class="mt-1 text-sm text-kemz-muted">{{ item.label }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const items = [
  { value: '1960', label: 'год основания завода' },
  { value: '1250 кВт', label: 'генераторы 4ГПЭ / 4ГПЭС' },
  { value: '−60…+40 °C', label: 'климат эксплуатации' },
  { value: '8000 м', label: 'бурение (машины ДПБ)' },
]
</script>
