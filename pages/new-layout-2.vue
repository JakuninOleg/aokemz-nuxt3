<template>
  <div class="min-h-screen bg-[#07090c] font-sans text-white antialiased">
    <header class="fixed inset-x-0 top-0 z-50">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:h-20 lg:px-10">
        <NuxtLink to="/" class="font-display text-2xl font-bold uppercase tracking-[0.08em]">
          КЭМЗ
        </NuxtLink>
        <nav class="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.18em] text-white/55 md:flex">
          <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="hover:text-white">{{ l.name }}</NuxtLink>
        </nav>
        <a
          href="#lead-b"
          class="border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:border-white hover:bg-white hover:text-kemz-ink"
        >
          Inquiry
        </a>
      </div>
    </header>

    <section class="relative flex min-h-screen items-end overflow-hidden pb-16 pt-28 lg:items-center lg:pb-0">
      <img
        :src="media.generatedExcavator"
        alt=""
        class="absolute inset-0 h-full w-full scale-105 object-cover opacity-40"
        aria-hidden="true"
      />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,transparent_0%,#07090c_70%)]" />
      <div class="relative mx-auto w-full max-w-7xl px-5 lg:px-10">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-kemz-blue">Since 1960 · Karpinsk</p>
        <h1
          class="mt-6 max-w-4xl font-display text-6xl font-bold uppercase leading-[0.9] tracking-tight sm:text-7xl lg:text-[6.5rem]"
        >
          Electric machines<br />for the quarry
        </h1>
        <p class="mt-8 max-w-md text-base text-white/60 lg:text-lg">
          Комплекты приводов ЭКГ / ЭШ. Генераторы до 1250 кВт. Климат −60…+40 °C.
        </p>
        <div class="mt-10 flex flex-wrap gap-4">
          <NuxtLink to="/products" class="bg-white px-7 py-3 text-sm font-bold uppercase tracking-wide text-kemz-ink">
            Catalog
          </NuxtLink>
          <NuxtLink
            to="/documents"
            class="border border-white/30 px-7 py-3 text-sm font-bold uppercase tracking-wide hover:border-white"
          >
            Specs PDF
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="border-y border-white/10">
      <div class="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
        <div v-for="item in trust" :key="item.label" class="bg-[#07090c] px-5 py-10 lg:px-10">
          <p class="font-display text-4xl font-bold text-kemz-blue lg:text-5xl">{{ item.value }}</p>
          <p class="mt-2 text-xs uppercase tracking-[0.2em] text-white/45">{{ item.label }}</p>
        </div>
      </div>
    </section>

    <section class="py-20 lg:py-28">
      <div class="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-12 lg:px-10">
        <div class="lg:col-span-4">
          <h2 class="font-display text-4xl font-bold uppercase leading-none lg:text-5xl">Product focus</h2>
          <p class="mt-5 text-sm leading-relaxed text-white/50">
            Медь обмоток, стальной корпус, заводской стенд. Не лендинг-абстракция, а машина.
          </p>
        </div>
        <div class="relative aspect-[4/3] overflow-hidden lg:col-span-8">
          <img :src="media.generatedMotor" alt="Электродвигатель, медные обмотки" class="h-full w-full object-cover" />
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <p class="font-display text-2xl font-bold uppercase">4ГПЭ / ДПЭ · до 1250 кВт</p>
          </div>
        </div>
      </div>
    </section>

    <section class="border-t border-white/10 py-20 lg:py-28">
      <div class="mx-auto max-w-7xl px-5 lg:px-10">
        <h2 class="font-display text-4xl font-bold uppercase lg:text-5xl">Directions</h2>
        <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(d, i) in directions"
            :key="d.title"
            class="group border-t border-white/15 pt-5 transition-colors hover:border-kemz-blue"
          >
            <p class="font-display text-3xl text-white/20 group-hover:text-kemz-blue">0{{ i + 1 }}</p>
            <h3 class="mt-3 text-lg font-semibold">{{ d.title }}</h3>
            <p class="mt-2 text-sm text-white/45 leading-relaxed">{{ d.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="relative overflow-hidden border-t border-white/10">
      <img :src="media.steel" alt="" class="absolute inset-0 h-full w-full object-cover opacity-25" aria-hidden="true" />
      <div class="absolute inset-0 bg-[#07090c]/80" />
      <div class="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
        <div>
          <h2 class="font-display text-4xl font-bold uppercase lg:text-5xl">Plant cycle</h2>
          <p class="mt-5 max-w-md text-white/55 leading-relaxed">
            От чертежа до отгрузки на одной площадке в Карпинске.
          </p>
        </div>
        <dl class="grid gap-6 sm:grid-cols-2">
          <div v-for="c in caps" :key="c.title" class="border border-white/10 bg-black/30 p-5 backdrop-blur-sm">
            <dt class="font-display text-xl font-bold uppercase text-kemz-blue">{{ c.title }}</dt>
            <dd class="mt-2 text-sm text-white/55">{{ c.text }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section id="lead-b" class="border-t border-white/10 bg-black scroll-mt-24">
      <div class="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
        <div>
          <h2 class="font-display text-5xl font-bold uppercase">Talk to sales</h2>
          <p class="mt-4 text-white/50">+7 (343) 278-37-43 · sales@aokemz.ru</p>
        </div>
        <div class="bg-white p-6 text-kemz-ink sm:p-8">
          <Form header="Lead form" />
        </div>
      </div>
    </section>

    <footer class="border-t border-white/10 py-8 text-center text-xs text-white/35">
      Вариант 2 · Awwards dark · portfolio mood
    </footer>
    <DemosDemoSwitcher />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { trust, directions, caps, media } = useHomeDemoContent()
const { links: nav } = useSiteNav()
const links = computed(() =>
  nav.slice(0, 4).map((l) => ({
    name: l.name,
    to: l.link,
  })),
)

useSeoMeta({
  title: 'Макет 2 · Awwards dark | КЭМЗ',
  description: 'Демо главной: полный тёмный marketing shell.',
})
</script>
