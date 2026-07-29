<template>
  <section class="bg-white py-16 lg:py-24">
    <div class="section grid items-start gap-12 lg:grid-cols-2">
      <div class="relative aspect-[5/4] overflow-hidden bg-kemz-paper">
        <img
          src="~/assets/images/about_1.jpg"
          alt="Цех ОАО КЭМЗ в Карпинске"
          class="h-full w-full object-cover"
        />
      </div>
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-kemz-ink sm:text-3xl">Площадка в Карпинске</h2>
        <p class="mt-4 text-kemz-muted leading-relaxed">
          Собственная конструкция, литьё, гальваника, механообработка и стендовые испытания.
          Полный цикл от чертежа до отгрузки.
        </p>
        <dl class="mt-8 grid gap-6 sm:grid-cols-2">
          <div v-for="cap in caps" :key="cap.title">
            <dt class="font-semibold text-kemz-ink">{{ cap.title }}</dt>
            <dd class="mt-1 text-sm text-kemz-muted leading-relaxed">{{ cap.text }}</dd>
          </div>
        </dl>
        <NuxtLink
          to="/about"
          class="mt-10 inline-flex text-sm font-semibold text-kemz-brand hover:underline"
        >
          О заводе
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const caps = [
  {
    title: 'Литьё',
    text: 'Алюминий, медь, бронза, сталь и чугун: давление, кокиль, песок.',
  },
  {
    title: 'Гальваника',
    text: 'Zn, Cd, Ni, Sn и сплавы; линия до 1000×600×600 мм.',
  },
  {
    title: 'Механообработка',
    text: 'Вал и вал-шестерня Ø до 250 мм, длина до 5000 мм (HECKERT).',
  },
  {
    title: 'Испытания',
    text: 'Стенды завода под агрегаты главных приводов.',
  },
]
</script>
