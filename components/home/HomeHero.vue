<template>
  <section class="relative isolate min-h-[88vh] overflow-hidden bg-kemz-ink text-white">
    <img
      src="~/assets/images/newkemz.jpg"
      alt="Электрические машины ОАО КЭМЗ для карьерной техники"
      class="absolute inset-0 h-full w-full object-cover opacity-45 hero-media"
    />
    <div
      class="absolute inset-0 bg-gradient-to-r from-kemz-ink via-kemz-ink/85 to-kemz-ink/40"
      aria-hidden="true"
    />
    <div
      class="absolute inset-0 bg-gradient-to-t from-kemz-ink via-transparent to-kemz-ink/50"
      aria-hidden="true"
    />

    <div class="section relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28 lg:justify-center lg:pb-24 lg:pt-32">
      <p class="hero-fade mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/70">
        ОАО «КЭМЗ» · Карпинск
      </p>
      <h1
        class="hero-fade hero-fade-delay-1 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl"
      >
        Приводы для карьерных и шагающих экскаваторов
      </h1>
      <p class="hero-fade hero-fade-delay-2 mt-5 max-w-xl text-base text-white/80 sm:text-lg">
        Генераторы до 1250 кВт, двигатели комплектов ЭКГ и ЭШ. Испытания на стендах завода.
      </p>
      <div class="hero-fade hero-fade-delay-3 mt-8 flex flex-wrap gap-3">
        <NuxtLink
          to="/products"
          class="bg-kemz-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-kemz-blue-deep sm:text-base"
        >
          Каталог продукции
        </NuxtLink>
        <a
          href="#lead"
          class="border border-white/40 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/10 sm:text-base"
        >
          Заявка в отдел продаж
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-media {
  animation: hero-ken 18s ease-out forwards;
}

.hero-fade {
  opacity: 0;
  transform: translateY(12px);
  animation: hero-in 0.7s ease forwards;
}

.hero-fade-delay-1 {
  animation-delay: 0.12s;
}
.hero-fade-delay-2 {
  animation-delay: 0.24s;
}
.hero-fade-delay-3 {
  animation-delay: 0.36s;
}

@keyframes hero-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hero-ken {
  from {
    transform: scale(1.06);
  }
  to {
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-media,
  .hero-fade {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
