<template>
  <section class="bg-kemz-paper py-16 lg:py-24">
    <div class="section">
      <div class="max-w-2xl">
        <h2 class="text-2xl font-bold tracking-tight text-kemz-ink sm:text-3xl">Направления</h2>
        <p class="mt-3 text-kemz-muted">
          Номенклатура из заводского каталога: от комплектов экскаваторных приводов до вводов и ЗИП.
        </p>
      </div>

      <ul class="mt-10 grid gap-px bg-kemz-steel sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="item in directions"
          :key="item.title"
          class="bg-white p-6 transition-colors hover:bg-kemz-steel/40"
        >
          <h3 class="text-lg font-semibold text-kemz-ink">{{ item.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-kemz-muted">{{ item.text }}</p>
        </li>
      </ul>

      <NuxtLink
        to="/products"
        class="mt-8 inline-flex text-sm font-semibold text-kemz-brand hover:underline"
      >
        Смотреть каталог
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
const directions = [
  {
    title: 'Экскаваторные комплекты',
    text: 'Генераторные группы и двигатели подъёма, поворота, напора, хода для ЭКГ и ЭШ.',
  },
  {
    title: 'Шахтные машины',
    text: 'Тяговые ДПТ и взрывобезопасные асинхронные серии ДАТВ / ДАКВ / ДАРВ.',
  },
  {
    title: 'Буровые установки',
    text: 'Серия ДПБ до 1000 кВт, тормоза ТЭП и индукционные.',
  },
  {
    title: 'Железнодорожный транспорт',
    text: 'Тяговый ДПТ 810-2, реакторы, дроссели, разъединители, изоляторы.',
  },
  {
    title: 'Вводы и ВВ-аппаратура',
    text: 'Трансформаторные и конденсаторные вводы; классы 27,5 / 35 кВ.',
  },
  {
    title: 'Ремонт и ЗИП',
    text: 'Ремонт электрических машин, запасные части по перечню завода.',
  },
]
</script>
