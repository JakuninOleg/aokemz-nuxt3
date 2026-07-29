<template>
  <footer class="border-t border-kemz-steel bg-kemz-paper text-kemz-ink">
    <div class="section grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      <div>
        <p class="text-lg font-bold">ОАО «КЭМЗ»</p>
        <p class="mt-2 text-sm text-kemz-muted leading-relaxed">
          Карпинский электромашиностроительный завод. Электрические машины и комплекты приводов
          для карьерной техники с 1960 года.
        </p>
      </div>

      <div>
        <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-kemz-muted">Разделы</p>
        <ul class="grid gap-2 text-sm">
          <li v-for="link in links" :key="link.link">
            <NuxtLink :to="link.link" class="hover:text-kemz-brand">{{ link.name }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-kemz-muted">Отдел продаж</p>
        <a :href="salesPhoneHref" class="block font-semibold text-kemz-brand">
          {{ salesPhoneDisplay }}
        </a>
        <a :href="`mailto:${salesEmail}`" class="mt-1 block text-sm hover:text-kemz-brand">
          {{ salesEmail }}
        </a>
        <NuxtLink to="/documents" class="mt-4 inline-block text-sm text-kemz-brand hover:underline">
          Документы и опросные листы
        </NuxtLink>
      </div>

      <div>
        <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-kemz-muted">Адрес</p>
        <p class="text-sm leading-relaxed text-kemz-muted">
          624930, Свердловская обл., г. Карпинск,<br />
          ул. Карпинского, 1
        </p>
      </div>
    </div>

    <div class="border-t border-kemz-steel">
      <div class="section flex flex-wrap items-center justify-between gap-2 py-4 text-xs text-kemz-muted">
        <p>© {{ year }} ОАО «Карпинский электромашиностроительный завод»</p>
        <p>aokemz.ru</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { links, salesPhoneDisplay, salesPhoneHref, salesEmail } = useSiteNav()
const year = new Date().getFullYear()
</script>
