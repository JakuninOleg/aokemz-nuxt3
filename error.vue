<template>
  <div class="flex min-h-screen flex-col bg-white text-kemz-ink">
    <AppHeader />
    <main class="section flex-1 py-16 lg:py-24">
      <h1 class="text-3xl font-bold mb-4">{{ title }}</h1>
      <p class="text-kemz-muted mb-10">{{ description }}</p>
      <NuxtLink to="/" class="text-kemz-brand font-semibold hover:underline">На главную</NuxtLink>
      <div class="mt-12 max-w-xl">
        <Form header="Свяжитесь с нами" />
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number; statusMessage?: string } }>()

const title = computed(() => {
  if (props.error?.statusCode === 404) return 'Страница не найдена'
  return props.error?.statusMessage || 'Ошибка'
})

const description = computed(() => {
  if (props.error?.statusCode === 404) {
    return 'Проверьте адрес или перейдите в каталог с главной.'
  }
  return 'Попробуйте обновить страницу или напишите в отдел продаж.'
})
</script>
