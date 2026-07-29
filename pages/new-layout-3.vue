<template>
  <div class="min-h-screen bg-kemz-paper font-sans text-kemz-ink antialiased lg:grid lg:grid-cols-[280px_1fr]">
    <!-- Clean rewrite of old Menu/Nav rail -->
    <aside class="hidden border-r border-kemz-steel bg-kemz-ink text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:px-8 lg:py-10">
      <div>
        <NuxtLink to="/" class="flex items-center gap-3">
          <img
            src="~/assets/images/kemz-logo.png"
            alt="КЭМЗ"
            class="h-10 w-10 object-contain brightness-0 invert"
          />
          <span>
            <span class="block font-display text-xl font-bold uppercase">ОАО КЭМЗ</span>
            <span class="text-[11px] text-white/50">Карпинск</span>
          </span>
        </NuxtLink>
        <nav class="mt-12 grid gap-1" aria-label="Боковое меню">
          <NuxtLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            class="border-l-2 px-3 py-2 text-sm font-medium transition-colors"
            :class="
              isActive(l.to)
                ? 'border-kemz-blue text-white'
                : 'border-transparent text-white/55 hover:text-white'
            "
          >
            {{ l.name }}
          </NuxtLink>
        </nav>
      </div>
      <div class="text-sm">
        <a href="tel:+73432783743" class="block font-semibold text-kemz-blue">+7 (343) 278-37-43</a>
        <a
          :href="encodeURI('/docs/ОАО КЭМЗ.pdf')"
          target="_blank"
          rel="noopener"
          class="mt-4 block text-white/55 hover:text-white"
        >
          Презентация PDF
        </a>
        <p class="mt-6 text-xs text-white/35">© {{ year }} ОАО КЭМЗ</p>
      </div>
    </aside>

    <!-- Mobile top bar (replaces old burger chaos) -->
    <div class="sticky top-0 z-40 flex items-center justify-between border-b border-kemz-steel bg-white px-4 py-3 lg:hidden">
      <NuxtLink to="/" class="font-display text-lg font-bold uppercase">ОАО КЭМЗ</NuxtLink>
      <button type="button" class="text-sm font-semibold text-kemz-brand" @click="open = !open">
        {{ open ? 'Закрыть' : 'Меню' }}
      </button>
    </div>
    <nav
      v-show="open"
      class="border-b border-kemz-steel bg-white px-4 py-3 lg:hidden"
    >
      <NuxtLink
        v-for="l in links"
        :key="l.to"
        :to="l.to"
        class="block py-2 text-sm font-medium"
        @click="open = false"
      >
        {{ l.name }}
      </NuxtLink>
    </nav>

    <main class="min-w-0">
      <section class="relative overflow-hidden bg-kemz-ink text-white">
        <img
          :src="media.generatedExcavator"
          alt="Карьерная техника"
          class="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-kemz-ink via-kemz-ink/85 to-kemz-ink/30" />
        <div class="relative px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
          <p class="text-xs font-semibold uppercase tracking-[0.25em] text-white/55">Вариант 3 · Ink rail</p>
          <h1 class="mt-4 max-w-2xl font-display text-4xl font-bold uppercase leading-none sm:text-5xl lg:text-6xl">
            Электромашины для экскаваторов
          </h1>
          <p class="mt-5 max-w-lg text-white/70">
            Сайдбар остаётся рабочим инструментом каталога. Контент справа: светлый, плотный, читаемый.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/products" class="bg-kemz-blue px-5 py-2.5 text-sm font-semibold">Каталог</NuxtLink>
            <a href="#lead-c" class="border border-white/30 px-5 py-2.5 text-sm font-semibold">Заявка</a>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-2 gap-6 border-b border-kemz-steel bg-white px-6 py-10 sm:px-10 lg:grid-cols-4 lg:px-14">
        <div v-for="item in trust" :key="item.label">
          <p class="font-display text-3xl font-bold text-kemz-brand">{{ item.value }}</p>
          <p class="mt-1 text-sm text-kemz-muted">{{ item.label }}</p>
        </div>
      </section>

      <section class="px-6 py-14 sm:px-10 lg:px-14">
        <h2 class="font-display text-3xl font-bold uppercase">Направления</h2>
        <ul class="mt-8 grid gap-4 sm:grid-cols-2">
          <li v-for="d in directions" :key="d.title" class="border border-kemz-steel bg-white p-5">
            <h3 class="font-semibold">{{ d.title }}</h3>
            <p class="mt-2 text-sm text-kemz-muted leading-relaxed">{{ d.text }}</p>
          </li>
        </ul>
      </section>

      <section class="grid gap-0 border-y border-kemz-steel lg:grid-cols-2">
        <img :src="media.copper" alt="Промышленное оборудование" class="h-72 w-full object-cover lg:h-full" />
        <div class="bg-white px-6 py-12 sm:px-10 lg:px-12">
          <h2 class="font-display text-3xl font-bold uppercase">Площадка</h2>
          <dl class="mt-6 grid gap-5">
            <div v-for="c in caps" :key="c.title">
              <dt class="font-semibold text-kemz-brand">{{ c.title }}</dt>
              <dd class="mt-1 text-sm text-kemz-muted">{{ c.text }}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="lead-c" class="bg-kemz-graphite px-6 py-14 sm:px-10 lg:px-14 scroll-mt-8">
        <div class="grid gap-8 lg:grid-cols-2">
          <div class="text-white">
            <h2 class="font-display text-3xl font-bold uppercase">Отдел продаж</h2>
            <p class="mt-3 text-white/65">Rail удобен для снабжения: меню всегда на виду.</p>
          </div>
          <div class="bg-white p-6">
            <Form header="Заявка" />
          </div>
        </div>
      </section>

      <footer class="px-6 py-6 text-xs text-kemz-muted sm:px-10 lg:px-14">
        Вариант 3 · Restyled left rail (чистая замена старых Menu/Nav)
      </footer>
    </main>

    <DemosDemoSwitcher />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const open = ref(false)
const year = new Date().getFullYear()
const { trust, directions, caps, media } = useHomeDemoContent()
const { links: nav, isActiveLink } = useSiteNav()
const links = computed(() => nav.map((l) => ({ name: l.name, to: l.link })))
const isActive = (to: string) => isActiveLink(to, route.path)

useSeoMeta({
  title: 'Макет 3 · Ink rail | КЭМЗ',
  description: 'Демо главной: тёмный боковой rail вместо старых Menu/Nav.',
})
</script>
