<template>
  <section id="lead" class="bg-kemz-graphite scroll-mt-24">
    <div class="section grid gap-10 py-16 lg:grid-cols-2 lg:items-start lg:gap-16 lg:py-24">
      <div class="text-white">
        <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Заявка в отдел продаж</h2>
        <p class="mt-4 max-w-md text-white/70 leading-relaxed">
          Опишите тип машины, привод и сроки. Ответят по телефону или почте sales@aokemz.ru.
        </p>
        <p class="mt-8">
          <a
            href="tel:+73432783743"
            class="text-2xl font-bold text-white transition-colors hover:text-kemz-blue"
          >
            +7 (343) 278-37-43
          </a>
        </p>
        <NuxtLink
          to="/documents"
          class="mt-6 inline-flex text-sm font-medium text-kemz-blue hover:underline"
        >
          Скачать опросные листы
        </NuxtLink>
      </div>
      <div class="bg-white p-6 sm:p-8">
        <Form header="Контактные данные" />
      </div>
    </div>
  </section>
</template>
