<template>
  <article class="bg-white">
    <header class="border-b border-kemz-steel bg-kemz-paper">
      <div class="section py-12 lg:py-16">
        <p class="text-sm font-medium uppercase tracking-[0.18em] text-kemz-muted">О заводе</p>
        <h1 class="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-kemz-ink sm:text-4xl">
          ОАО «Карпинский электромашиностроительный завод»
        </h1>
        <p class="mt-4 max-w-2xl text-kemz-muted leading-relaxed">
          Карпинск, Свердловская область. С 18 июня 1960 года: электрические машины постоянного и
          переменного тока, комплекты приводов для карьерной техники.
        </p>
      </div>
    </header>

    <div class="section grid gap-12 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
      <div class="space-y-5 text-base leading-relaxed text-kemz-ink/90">
        <p>
          Завод ведёт полный цикл: конструкция, изготовление, стендовые испытания и сопровождение
          после отгрузки. Параметры машин подстраивают под ТЗ заказчика.
        </p>
        <p>
          База: литьё, гальваника, механообработка, собственный конструкторский отдел. Сборка и
          испытания идут на специализированных стендах.
        </p>
      </div>
      <img
        src="~/assets/images/about_1.jpg"
        alt="Производственный корпус ОАО КЭМЗ в Карпинске"
        class="h-72 w-full object-cover lg:h-full lg:min-h-[20rem]"
      />
    </div>

    <section class="bg-kemz-paper py-12 lg:py-16">
      <div class="section">
        <h2 class="text-2xl font-bold text-kemz-ink">Направления производства</h2>
        <ul class="mt-8 grid gap-4 sm:grid-cols-2">
          <li
            v-for="item in lines"
            :key="item.title"
            class="border border-kemz-steel bg-white p-5"
          >
            <h3 class="font-semibold text-kemz-ink">{{ item.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-kemz-muted">{{ item.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <div class="section grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:py-16">
      <img
        src="~/assets/images/about_2.png"
        alt="Цех ОАО КЭМЗ"
        class="h-56 w-full object-cover"
        loading="lazy"
      />
      <img
        src="~/assets/images/about_3.jpg"
        alt="Оборудование на площадке КЭМЗ"
        class="h-56 w-full object-cover"
        loading="lazy"
      />
      <img
        src="~/assets/images/about_4.png"
        alt="Производство электрических машин"
        class="h-56 w-full object-cover"
        loading="lazy"
      />
      <img
        src="~/assets/images/about_5.jpg"
        alt="Испытания и сборка на КЭМЗ"
        class="h-56 w-full object-cover sm:col-span-2 lg:col-span-1"
        loading="lazy"
      />
    </div>

    <section class="section max-w-3xl pb-16 lg:pb-24">
      <p class="leading-relaxed text-kemz-ink/90">
        Продукция проходит контроль качества. Заявленное соответствие ГОСТ/ТУ и система менеджмента
        качества в духе ISO: формулировки сверяйте с актуальными сертификатами в разделе документов.
      </p>
      <div class="mt-10 flex flex-wrap gap-4">
        <NuxtLink
          to="/products"
          class="bg-kemz-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-kemz-blue-deep"
        >
          Каталог
        </NuxtLink>
        <NuxtLink
          to="/documents"
          class="border border-kemz-steel px-5 py-2.5 text-sm font-semibold text-kemz-ink hover:border-kemz-blue"
        >
          Документы
        </NuxtLink>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
const lines = [
  {
    title: 'Экскаваторные приводы',
    text: 'Двигатели и генераторы главных приводов карьерных и шагающих экскаваторов ЭКГ и ЭШ.',
  },
  {
    title: 'Буровые установки',
    text: 'Машины постоянного тока для СБШ и установок с бурением до 8000 м (порядка 90–1000 кВт), тормоза ТЭП и индукционные.',
  },
  {
    title: 'Шахта',
    text: 'Взрывозащищённые асинхронные двигатели для вагонов, комбайнов и конвейеров.',
  },
  {
    title: 'БЕЛАЗ и ж/д',
    text: 'Тяговый ДПТ 590-2 УХЛ2 (590 кВт) для мотор-колеса БЕЛАЗ 130 т; машины для электровозов.',
  },
  {
    title: 'Горэлектротранспорт и краны',
    text: 'Тяговые асинхронные двигатели с частотным регулированием; крановые машины по ТЗ.',
  },
  {
    title: 'ДГУ',
    text: 'Синхронные генераторы переменного тока для дизель-генераторных установок.',
  },
]

useSeoMeta({
  title: 'О заводе | ОАО «КЭМЗ»',
  description:
    'История и направления ОАО Карпинский электромашиностроительный завод: экскаваторные приводы, буровые и шахтные машины, Карпинск с 1960.',
})
</script>
