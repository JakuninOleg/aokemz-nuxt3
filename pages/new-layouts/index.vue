<template>
  <div class="min-h-screen bg-kemz-paper font-sans text-kemz-ink">
    <div class="mx-auto max-w-5xl px-5 py-14 lg:px-8 lg:py-20">
      <p class="text-xs font-semibold uppercase tracking-[0.25em] text-kemz-muted">Redesign previews</p>
      <h1 class="mt-3 font-display text-5xl font-bold uppercase tracking-tight">Три варианта главной</h1>
      <p class="mt-4 max-w-2xl text-kemz-muted leading-relaxed">
        Сравни макеты на отдельных URL. Контент общий (факты завода), отличается оболочка, ритм и настроение.
        Текущий `/` тоже hybrid, но эти страницы намеренно «громче» по типографике и фото.
      </p>

      <ol class="mt-12 grid gap-6">
        <li v-for="item in variants" :key="item.to" class="overflow-hidden border border-kemz-steel bg-white">
          <div class="grid lg:grid-cols-[1.1fr_1fr]">
            <img :src="item.image" :alt="item.title" class="h-52 w-full object-cover lg:h-full" />
            <div class="flex flex-col justify-between p-6 lg:p-8">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-kemz-blue">{{ item.tag }}</p>
                <h2 class="mt-2 font-display text-3xl font-bold uppercase">{{ item.title }}</h2>
                <p class="mt-3 text-sm leading-relaxed text-kemz-muted">{{ item.text }}</p>
              </div>
              <NuxtLink
                :to="item.to"
                class="mt-6 inline-flex w-fit bg-kemz-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-kemz-blue"
              >
                Открыть {{ item.to }}
              </NuxtLink>
            </div>
          </div>
        </li>
      </ol>

      <p class="mt-10 text-sm text-kemz-muted">
        Рекомендация агента: <strong class="text-kemz-ink">вариант 1</strong> для продакшена RU B2B.
        Вариант 2 силён для портфолио западным работодателям. Вариант 3, если нужен привычный rail для каталога.
      </p>
      <NuxtLink to="/" class="mt-6 inline-block text-sm font-semibold text-kemz-brand hover:underline">
        Вернуться на текущую главную
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { media } = useHomeDemoContent()

const variants = [
  {
    to: '/new-layout-1',
    tag: 'Option A',
    title: 'Precision plant',
    text: 'Верхний sticky header, тёмный cinematic hero, светлые рабочие секции, Barlow Condensed + Manrope.',
    image: media.generatedExcavator,
  },
  {
    to: '/new-layout-2',
    tag: 'Option B',
    title: 'Awwards dark',
    text: 'Почти полностью тёмный marketing shell, крупная display-типографика, акцент на mood и фото машины.',
    image: media.generatedMotor,
  },
  {
    to: '/new-layout-3',
    tag: 'Option C',
    title: 'Ink rail',
    text: 'Чистая замена старых Menu/Nav: тёмный боковой rail + светлый контент. Меньше «вау», удобнее для каталога.',
    image: media.excavator,
  },
]

useSeoMeta({
  title: 'Сравнение макетов главной | КЭМЗ',
  description: 'Три варианта редизайна главной страницы ОАО КЭМЗ.',
})
</script>
