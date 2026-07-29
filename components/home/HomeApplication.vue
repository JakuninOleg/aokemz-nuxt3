<template>
  <section class="bg-kemz-ink text-white">
    <div class="section grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
      <div>
        <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">На технике в карьере</h2>
        <p class="mt-4 max-w-lg text-white/75 leading-relaxed">
          Комплекты под типы ЭКГ и ЭШ из каталога завода. Отдельно: тяговый ДПТ 590 кВт для
          самосвалов БЕЛАЗ грузоподъёмностью 130 т.
        </p>
        <ul class="mt-8 grid gap-3 text-sm text-white/85">
          <li class="flex gap-3 border-l-2 border-kemz-blue pl-4">ЭКГ-5А … ЭКГ-20К: приводы подъёма, поворота, напора, хода</li>
          <li class="flex gap-3 border-l-2 border-kemz-blue pl-4">ЭШ-6/45 … ЭШ-11/70: шагающие экскаваторы</li>
          <li class="flex gap-3 border-l-2 border-kemz-blue pl-4">Опция ИДС на главные приводы</li>
        </ul>
      </div>
      <div class="relative aspect-[4/3] overflow-hidden bg-kemz-graphite">
        <img
          src="~/assets/images/about_5.jpg"
          alt="Производство электрических машин на ОАО КЭМЗ"
          class="h-full w-full object-cover opacity-90"
        />
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-kemz-ink/50 to-transparent"
          aria-hidden="true"
        />
      </div>
    </div>
  </section>
</template>
