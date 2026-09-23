<template>
  <footer v-if="isPublicSite" class="site-footer">
    <div class="site-footer__top">
      <NuxtLink to="/" class="site-footer__brand"
        ><img
          src="~/assets/images/kemz-logo.webp"
          alt="Логотип КЭМЗ"
          width="44"
          height="50"
        /><strong>КЭМЗ</strong
        ><span
          >Карпинский<br />электромашиностроительный<br />завод</span
        ></NuxtLink
      >
      <nav aria-label="Навигация в подвале">
        <NuxtLink v-for="link in links" :key="link.link" :to="link.link">{{
          link.name
        }}</NuxtLink
        ><NuxtLink to="/contacts">Контакты</NuxtLink>
      </nav>
      <address>
        <a :href="salesPhoneHref">{{ salesPhoneDisplay }}</a
        ><a :href="`mailto:${salesEmail}`">{{ salesEmail }}</a>
      </address>
    </div>
    <div class="site-footer__bottom">
      <p>© {{ year }} КЭМЗ. Все права защищены.</p>
      <NuxtLink to="/legal">Правовая информация</NuxtLink
      ><NuxtLink to="/legal#cookies">Cookie</NuxtLink
      ><NuxtLink to="/contacts">Контакты предприятия</NuxtLink>
      <a
        class="site-footer__credit"
        href="https://jakuninoleg.dev"
        target="_blank"
        rel="noopener noreferrer"
      >
        Дизайн и разработка — Jakunin Oleg<span aria-hidden="true">↗</span>
      </a>
    </div>
  </footer>
  <footer
    v-else
    class="site-footer border-t border-kemz-steel bg-kemz-paper text-kemz-ink"
  >
    <div class="site-footer__inner site-footer__grid">
      <div class="site-footer__brand">
        <p class="text-lg font-bold">ОАО «КЭМЗ»</p>
        <p class="mt-3 text-sm text-kemz-muted leading-relaxed">
          Карпинский электромашиностроительный завод. Электрические машины и
          комплекты приводов для карьерной техники с 1960 года.
        </p>
      </div>

      <div>
        <p
          class="mb-4 text-xs font-semibold uppercase tracking-wider text-kemz-muted"
        >
          Разделы
        </p>
        <ul class="grid gap-2.5 text-sm">
          <li v-for="link in links" :key="link.link">
            <NuxtLink :to="link.link" class="hover:text-kemz-brand">{{
              link.name
            }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <p
          class="mb-4 text-xs font-semibold uppercase tracking-wider text-kemz-muted"
        >
          Отдел продаж
        </p>
        <a :href="salesPhoneHref" class="block font-semibold text-kemz-brand">
          {{ salesPhoneDisplay }}
        </a>
        <a
          :href="`mailto:${salesEmail}`"
          class="mt-2 block text-sm hover:text-kemz-brand"
        >
          {{ salesEmail }}
        </a>
        <NuxtLink
          to="/documents"
          class="mt-5 inline-block text-sm text-kemz-brand hover:underline"
        >
          Документы и опросный лист
        </NuxtLink>
        <NuxtLink
          to="/legal"
          class="mt-2 block text-sm text-kemz-muted hover:text-kemz-brand"
        >
          Правовая информация
        </NuxtLink>
      </div>

      <div>
        <p
          class="mb-4 text-xs font-semibold uppercase tracking-wider text-kemz-muted"
        >
          Адрес
        </p>
        <p class="text-sm leading-relaxed text-kemz-muted">
          624930, Свердловская обл., г. Карпинск,<br />
          ул. Карпинского, 1
        </p>
      </div>
    </div>

    <div class="border-t border-kemz-steel">
      <div
        class="site-footer__inner flex flex-wrap items-center justify-between gap-2 py-4 text-xs text-kemz-muted"
      >
        <p>© {{ year }} ОАО «Карпинский электромашиностроительный завод»</p>
        <a
          class="site-footer__credit inline-flex items-center gap-1 hover:text-kemz-brand"
          href="https://jakuninoleg.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Дизайн и разработка — Jakunin Oleg<span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { links, salesPhoneDisplay, salesPhoneHref, salesEmail } = useSiteNav();
const year = new Date().getFullYear();
const route = useRoute();
const normalizedPath = computed(() => {
  const raw = route.path || "/";
  if (raw.length > 1 && raw.endsWith("/")) return raw.slice(0, -1);
  return raw;
});
const isPublicSite = computed(
  () =>
    normalizedPath.value === "/" ||
    normalizedPath.value === "/production" ||
    normalizedPath.value === "/about" ||
    normalizedPath.value === "/legal" ||
    normalizedPath.value === "/documents" ||
    normalizedPath.value === "/news" ||
    normalizedPath.value.startsWith("/news/") ||
    normalizedPath.value === "/contacts" ||
    normalizedPath.value === "/products" ||
    normalizedPath.value.startsWith("/products/"),
);
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

<style lang="scss" src="~/assets/css/home.scss"></style>
