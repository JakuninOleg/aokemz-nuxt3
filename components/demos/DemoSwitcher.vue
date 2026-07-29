<template>
  <div class="fixed bottom-4 left-4 z-[100] max-w-xs rounded border border-kemz-steel bg-white/95 p-3 text-xs shadow-lg backdrop-blur">
    <p class="font-semibold text-kemz-ink">Сравнение макетов</p>
    <ul class="mt-2 grid gap-1">
      <li v-for="item in items" :key="item.to">
        <NuxtLink
          :to="item.to"
          class="hover:text-kemz-brand"
          :class="route.path === item.to ? 'font-bold text-kemz-brand' : 'text-kemz-muted'"
        >
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const items = [
  { to: '/new-layouts', label: 'Хаб сравнения' },
  { to: '/new-layout-1', label: '1 · Precision plant' },
  { to: '/new-layout-2', label: '2 · Awwards dark' },
  { to: '/new-layout-3', label: '3 · Ink rail' },
  { to: '/', label: 'Текущая /' },
]
</script>
