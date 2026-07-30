<template>
  <footer class="site-footer border-t border-kemz-steel bg-kemz-paper text-kemz-ink">
    <div class="site-footer__inner site-footer__grid">
      <div class="site-footer__brand">
        <p class="text-lg font-bold">ОАО «КЭМЗ»</p>
        <p class="mt-3 text-sm text-kemz-muted leading-relaxed">
          Карпинский электромашиностроительный завод. Электрические машины и комплекты приводов
          для карьерной техники с 1960 года.
        </p>
      </div>

      <div>
        <p class="mb-4 text-xs font-semibold uppercase tracking-wider text-kemz-muted">Разделы</p>
        <ul class="grid gap-2.5 text-sm">
          <li v-for="link in links" :key="link.link">
            <NuxtLink :to="link.link" class="hover:text-kemz-brand">{{ link.name }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <p class="mb-4 text-xs font-semibold uppercase tracking-wider text-kemz-muted">Отдел продаж</p>
        <a :href="salesPhoneHref" class="block font-semibold text-kemz-brand">
          {{ salesPhoneDisplay }}
        </a>
        <a :href="`mailto:${salesEmail}`" class="mt-2 block text-sm hover:text-kemz-brand">
          {{ salesEmail }}
        </a>
        <NuxtLink to="/documents" class="mt-5 inline-block text-sm text-kemz-brand hover:underline">
          Документы и опросные листы
        </NuxtLink>
        <NuxtLink to="/legal" class="mt-2 block text-sm text-kemz-muted hover:text-kemz-brand">
          Правовая информация
        </NuxtLink>
      </div>

      <div>
        <p class="mb-4 text-xs font-semibold uppercase tracking-wider text-kemz-muted">Адрес</p>
        <p class="text-sm leading-relaxed text-kemz-muted">
          624930, Свердловская обл., г. Карпинск,<br />
          ул. Карпинского, 1
        </p>
      </div>
    </div>

    <div class="border-t border-kemz-steel">
      <div class="site-footer__inner flex flex-wrap items-center justify-between gap-2 py-4 text-xs text-kemz-muted">
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

<style scoped>
.site-footer__inner {
  width: min(100% - 48px, 1280px);
  margin-inline: auto;
}

.site-footer__grid {
  display: grid;
  gap: 2.5rem;
  padding-block: 3rem;
}

@media (min-width: 768px) {
  .site-footer__grid {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem 3rem;
  }
}

@media (min-width: 1024px) {
  .site-footer__grid {
    grid-template-columns: 1.35fr 0.85fr 1.15fr 1fr;
    gap: 3rem 4rem;
  }
}

@media (max-width: 640px) {
  .site-footer__inner {
    width: min(100% - 32px, 1280px);
  }
}
</style>
