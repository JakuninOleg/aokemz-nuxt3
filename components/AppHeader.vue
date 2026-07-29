<template>
  <header
    class="sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300"
    :class="
      scrolled
        ? 'border-kemz-steel/80 bg-white/95 shadow-sm backdrop-blur'
        : 'border-transparent bg-kemz-ink text-white'
    "
  >
    <div
      class="section flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]"
      :class="scrolled ? 'text-kemz-ink' : 'text-white'"
    >
      <NuxtLink to="/" class="flex min-w-0 items-center gap-3">
        <img
          src="~/assets/images/kemz-logo.png"
          alt="Логотип ОАО КЭМЗ"
          class="h-9 w-9 object-contain lg:h-11 lg:w-11"
          :class="scrolled ? '' : 'brightness-0 invert'"
        />
        <span class="min-w-0 leading-tight">
          <span class="block text-sm font-bold tracking-wide lg:text-base">ОАО «КЭМЗ»</span>
          <span
            class="hidden text-xs font-normal sm:block"
            :class="scrolled ? 'text-kemz-muted' : 'text-white/70'"
          >
            Карпинск · с 1960
          </span>
        </span>
      </NuxtLink>

      <nav class="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Основная навигация">
        <NuxtLink
          v-for="link in links"
          :key="link.link"
          :to="link.link"
          class="text-sm font-medium tracking-wide transition-opacity hover:opacity-100"
          :class="[
            isActiveLink(link.link, route.path) ? 'opacity-100' : 'opacity-70',
            scrolled
              ? isActiveLink(link.link, route.path)
                ? 'text-kemz-brand'
                : 'text-kemz-ink'
              : 'text-white',
          ]"
        >
          {{ link.name }}
        </NuxtLink>
      </nav>

      <div class="hidden items-center gap-4 lg:flex">
        <a
          :href="salesPhoneHref"
          class="text-sm font-semibold tabular-nums"
          :class="scrolled ? 'text-kemz-brand' : 'text-white'"
        >
          {{ salesPhoneDisplay }}
        </a>
        <NuxtLink
          to="/contacts"
          class="bg-kemz-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-kemz-blue-deep"
        >
          Заявка
        </NuxtLink>
      </div>

      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center lg:hidden"
        :aria-expanded="menuOpen"
        aria-controls="mobile-nav"
        aria-label="Открыть меню"
        @click="menuOpen = true"
      >
        <span class="sr-only">Меню</span>
        <span class="flex flex-col gap-1.5" aria-hidden="true">
          <span
            class="block h-0.5 w-5"
            :class="scrolled ? 'bg-kemz-ink' : 'bg-white'"
          />
          <span
            class="block h-0.5 w-5"
            :class="scrolled ? 'bg-kemz-ink' : 'bg-white'"
          />
          <span
            class="block h-0.5 w-5"
            :class="scrolled ? 'bg-kemz-ink' : 'bg-white'"
          />
        </span>
      </button>
    </div>

    <Teleport to="body">
      <div
        v-show="menuOpen"
        class="fixed inset-0 z-[60] bg-kemz-ink/50 lg:hidden"
        @click="menuOpen = false"
      />
      <nav
        id="mobile-nav"
        class="fixed inset-y-0 right-0 z-[70] flex w-[min(100%,20rem)] flex-col bg-white text-kemz-ink shadow-xl transition-transform duration-300 lg:hidden"
        :class="menuOpen ? 'translate-x-0' : 'translate-x-full'"
        aria-label="Мобильное меню"
      >
        <div class="flex items-center justify-between border-b border-kemz-steel px-5 py-4">
          <span class="font-bold">Меню</span>
          <button
            type="button"
            class="px-2 py-1 text-sm text-kemz-muted hover:text-kemz-ink"
            aria-label="Закрыть"
            @click="menuOpen = false"
          >
            Закрыть
          </button>
        </div>
        <ul class="flex flex-1 flex-col gap-1 px-3 py-4">
          <li v-for="link in links" :key="link.link">
            <NuxtLink
              :to="link.link"
              class="block px-3 py-3 text-base font-medium"
              :class="isActiveLink(link.link, route.path) ? 'text-kemz-brand' : 'text-kemz-ink'"
              @click="menuOpen = false"
            >
              {{ link.name }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/special"
              class="block px-3 py-3 text-base font-medium text-kemz-ink"
              @click="menuOpen = false"
            >
              Спецпредложения
            </NuxtLink>
          </li>
        </ul>
        <div class="border-t border-kemz-steel px-5 py-5">
          <a :href="salesPhoneHref" class="block text-lg font-bold text-kemz-brand">
            {{ salesPhoneDisplay }}
          </a>
          <a :href="`mailto:${salesEmail}`" class="mt-1 block text-sm text-kemz-muted">
            {{ salesEmail }}
          </a>
        </div>
      </nav>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const { links, salesPhoneDisplay, salesPhoneHref, salesEmail, isActiveLink } = useSiteNav()

const menuOpen = ref(false)
const scrollPast = ref(false)

/** Dark translucent bar only over home hero; solid light on other routes / after scroll */
const scrolled = computed(() => route.path !== '/' || scrollPast.value)

const onScroll = () => {
  scrollPast.value = window.scrollY > 24
}

watch(
  () => route.path,
  () => {
    menuOpen.value = false
    scrollPast.value = false
    if (import.meta.client) onScroll()
  },
)

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
