<template>
  <div class="min-h-screen bg-white font-sans text-kemz-ink antialiased">
    <header
      class="sticky top-0 z-50 border-b transition-colors duration-300"
      :class="scrolled ? 'border-kemz-steel bg-white/95 backdrop-blur' : 'border-transparent bg-transparent text-white'"
    >
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:h-20 lg:px-8">
        <NuxtLink to="/" class="flex items-center gap-3">
          <img
            src="~/assets/images/kemz-logo.png"
            alt="КЭМЗ"
            class="h-9 w-9 object-contain"
            :class="scrolled ? '' : 'brightness-0 invert'"
          />
          <span>
            <span class="block font-display text-xl font-bold uppercase tracking-wide">ОАО КЭМЗ</span>
            <span class="hidden text-[11px] sm:block" :class="scrolled ? 'text-kemz-muted' : 'text-white/65'">
              Карпинск · с 1960
            </span>
          </span>
        </NuxtLink>
        <nav class="hidden gap-7 text-sm font-medium lg:flex">
          <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="opacity-75 hover:opacity-100">
            {{ l.name }}
          </NuxtLink>
        </nav>
        <a
          href="tel:+73432783743"
          class="hidden text-sm font-semibold tabular-nums lg:block"
          :class="scrolled ? 'text-kemz-brand' : ''"
        >
          +7 (343) 278-37-43
        </a>
      </div>
    </header>

    <section class="relative isolate -mt-16 min-h-[92vh] overflow-hidden bg-kemz-ink text-white lg:-mt-20">
      <img
        :src="media.generatedExcavator"
        alt="Карьерный экскаватор на закате"
        class="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-kemz-ink via-kemz-ink/80 to-transparent" />
      <div class="absolute inset-0 bg-gradient-to-t from-kemz-ink via-transparent to-kemz-ink/40" />
      <div class="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-5 pb-20 pt-32 lg:justify-center lg:px-8 lg:pb-28">
        <p class="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
          Карпинский электромашиностроительный завод
        </p>
        <h1 class="max-w-3xl font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
          Приводы для карьерных и шагающих экскаваторов
        </h1>
        <p class="mt-6 max-w-lg text-base text-white/75 sm:text-lg">
          Генераторы до 1250 кВт. Комплекты ЭКГ и ЭШ. Стендовые испытания в Карпинске.
        </p>
        <div class="mt-9 flex flex-wrap gap-3">
          <NuxtLink to="/products" class="bg-kemz-blue px-6 py-3 text-sm font-semibold hover:bg-kemz-blue-deep">
            Каталог
          </NuxtLink>
          <a href="#lead-a" class="border border-white/35 px-6 py-3 text-sm font-semibold hover:border-white">
            Заявка
          </a>
        </div>
      </div>
    </section>

    <section class="border-b border-kemz-steel bg-white">
      <div class="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 py-12 lg:grid-cols-4 lg:px-8">
        <div v-for="item in trust" :key="item.label">
          <p class="font-display text-3xl font-bold tabular-nums text-kemz-brand sm:text-4xl">{{ item.value }}</p>
          <p class="mt-1 text-sm text-kemz-muted">{{ item.label }}</p>
        </div>
      </div>
    </section>

    <section class="bg-kemz-paper py-16 lg:py-24">
      <div class="mx-auto max-w-6xl px-5 lg:px-8">
        <div class="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 class="font-display text-4xl font-bold uppercase tracking-tight">Направления</h2>
            <p class="mt-3 max-w-xl text-kemz-muted">Номенклатура заводского каталога: от комплектов приводов до ЗИП.</p>
          </div>
          <NuxtLink to="/products" class="text-sm font-semibold text-kemz-brand hover:underline">Весь каталог</NuxtLink>
        </div>
        <ul class="mt-10 grid gap-px bg-kemz-steel sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="d in directions" :key="d.title" class="bg-white p-6">
            <h3 class="text-lg font-semibold">{{ d.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-kemz-muted">{{ d.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="bg-kemz-ink text-white">
      <div class="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <h2 class="font-display text-4xl font-bold uppercase tracking-tight">На технике в карьере</h2>
          <p class="mt-4 text-white/70 leading-relaxed">
            Комплекты под ЭКГ и ЭШ. Тяговый ДПТ 590 кВт для самосвалов БЕЛАЗ 130 т.
          </p>
          <ul class="mt-8 space-y-3 text-sm text-white/85">
            <li class="border-l-2 border-kemz-blue pl-4">ЭКГ-5А … ЭКГ-20К: подъём, поворот, напор, ход</li>
            <li class="border-l-2 border-kemz-blue pl-4">ЭШ-6/45 … ЭШ-11/70: шагающие экскаваторы</li>
            <li class="border-l-2 border-kemz-blue pl-4">Опция ИДС на главные приводы</li>
          </ul>
        </div>
        <div class="relative aspect-[4/3] overflow-hidden">
          <img :src="media.heavy" alt="Тяжёлая промышленная техника" class="h-full w-full object-cover" />
        </div>
      </div>
    </section>

    <section class="bg-white py-16 lg:py-24">
      <div class="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <img :src="media.factory" alt="Производственный цех" class="aspect-[5/4] w-full object-cover" />
        <div>
          <h2 class="font-display text-4xl font-bold uppercase tracking-tight">Площадка в Карпинске</h2>
          <p class="mt-4 text-kemz-muted leading-relaxed">
            Конструкция, литьё, гальваника, механообработка, стендовые испытания. Полный цикл до отгрузки.
          </p>
          <dl class="mt-8 grid gap-6 sm:grid-cols-2">
            <div v-for="c in caps" :key="c.title">
              <dt class="font-semibold">{{ c.title }}</dt>
              <dd class="mt-1 text-sm text-kemz-muted">{{ c.text }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <section id="lead-a" class="bg-kemz-graphite scroll-mt-24">
      <div class="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div class="text-white">
          <h2 class="font-display text-4xl font-bold uppercase">Заявка в отдел продаж</h2>
          <p class="mt-4 text-white/70">Тип машины, привод, сроки. sales@aokemz.ru</p>
          <a href="tel:+73432783743" class="mt-8 inline-block text-2xl font-bold">+7 (343) 278-37-43</a>
        </div>
        <div class="bg-white p-6 sm:p-8">
          <Form header="Контактные данные" />
        </div>
      </div>
    </section>

    <footer class="border-t border-kemz-steel bg-kemz-paper py-8 text-center text-xs text-kemz-muted">
      Вариант 1 · Precision plant · Barlow Condensed + Manrope
    </footer>
    <DemosDemoSwitcher />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { trust, directions, caps, media } = useHomeDemoContent()
const { links: nav } = useSiteNav()
const links = computed(() => nav.map((l) => ({ name: l.name, to: l.link })))

const scrolled = ref(false)
onMounted(() => {
  const onScroll = () => {
    scrolled.value = window.scrollY > 40
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
})

useSeoMeta({
  title: 'Макет 1 · Precision plant | КЭМЗ',
  description: 'Демо главной: hybrid industrial, верхний header, тёмный hero.',
})
</script>
