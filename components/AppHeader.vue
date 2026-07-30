<template>
  <header class="site-header">
    <div class="site-header__bar">
      <NuxtLink to="/" class="site-header__brand" @click="closeMenu">
        <img
          src="~/assets/images/kemz-logo.webp"
          alt="Логотип ОАО КЭМЗ"
          class="site-header__logo"
          width="44"
          height="44"
          decoding="async"
        />
        <span class="site-header__brand-text">
          <strong>ОАО «КЭМЗ»</strong>
          <small>Карпинский электромашиностроительный завод</small>
        </span>
      </NuxtLink>

      <nav class="site-header__nav" aria-label="Основная навигация">
        <NuxtLink
          v-for="link in links"
          :key="link.link"
          :to="link.link"
          class="site-header__link"
          :class="{ 'is-active': isActiveLink(link.link, currentPath) }"
        >
          {{ link.name }}
        </NuxtLink>
      </nav>

      <div class="site-header__actions">
        <a :href="salesPhoneHref" class="site-header__phone">{{ salesPhoneDisplay }}</a>
        <NuxtLink to="/contacts" class="site-header__cta">Связаться</NuxtLink>
        <button
          type="button"
          class="site-header__burger"
          :aria-expanded="menuOpen"
          aria-controls="mobile-drawer"
          :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
          @click="toggleMenu"
        >
          <span class="site-header__burger-lines" :class="{ open: menuOpen }" aria-hidden="true">
            <span /><span /><span />
          </span>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-show="menuOpen"
        class="site-drawer-backdrop"
        aria-hidden="true"
        @click="closeMenu"
      />
      <nav
        id="mobile-drawer"
        class="site-drawer"
        :class="{ open: menuOpen }"
        :aria-hidden="!menuOpen"
        aria-label="Мобильное меню"
      >
        <div class="site-drawer__head">
          <span class="site-drawer__title">Меню</span>
          <button type="button" class="site-drawer__close" aria-label="Закрыть меню" @click="closeMenu">
            Закрыть
          </button>
        </div>

        <ul class="site-drawer__list">
          <li>
            <NuxtLink
              to="/"
              class="site-drawer__link"
              :class="{ 'is-active': currentPath === '/' }"
              @click="closeMenu"
            >
              Главная
            </NuxtLink>
          </li>
          <li v-for="link in links" :key="link.link">
            <NuxtLink
              :to="link.link"
              class="site-drawer__link"
              :class="{ 'is-active': isActiveLink(link.link, currentPath) }"
              @click="closeMenu"
            >
              {{ link.name }}
            </NuxtLink>
          </li>
        </ul>

        <div class="site-drawer__foot">
          <a :href="salesPhoneHref" class="site-drawer__phone">{{ salesPhoneDisplay }}</a>
          <a :href="`mailto:${salesEmail}`" class="site-drawer__mail">{{ salesEmail }}</a>
          <NuxtLink to="/contacts" class="site-drawer__cta" @click="closeMenu">
            Оставить заявку
          </NuxtLink>
        </div>
      </nav>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp()
const { links, salesPhoneDisplay, salesPhoneHref, salesEmail, isActiveLink } = useSiteNav()

const menuOpen = ref(false)
const currentPath = computed(() => nuxtApp._route?.path ?? '/')

const closeMenu = () => {
  menuOpen.value = false
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeMenu()
}

watch(menuOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
})

watch(currentPath, () => closeMenu())

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid #e8ecf1;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  color: #0b0d10;
}

.site-header__bar {
  display: flex;
  width: min(100% - 48px, 1280px);
  height: 4.5rem;
  margin-inline: auto;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-inline: 0;
}

@media (max-width: 640px) {
  .site-header__bar {
    width: min(100% - 32px, 1280px);
  }
}

.site-header__brand {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.75rem;
  color: inherit;
}

.site-header__logo {
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  object-fit: contain;
}

.site-header__brand-text {
  display: grid;
  min-width: 0;
  line-height: 1.1;
}

.site-header__brand-text strong {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.site-header__brand-text small {
  margin-top: 0.25rem;
  overflow: hidden;
  color: #6b7280;
  font-size: 0.65rem;
  letter-spacing: 0.04em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.site-header__nav {
  display: none;
  align-items: center;
  gap: 1.5rem;
}

.site-header__link {
  padding-block: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.15s ease;
}

.site-header__link:hover,
.site-header__link.is-active {
  color: #2f78cd;
}

.site-header__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.site-header__phone {
  display: none;
  color: #2f78cd;
  font-size: 0.875rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.site-header__cta {
  display: none;
  min-height: 2.5rem;
  align-items: center;
  justify-content: center;
  background: #2f78cd;
  padding: 0 1.1rem;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.site-header__cta:hover {
  background: #1e4f8c;
}

.site-header__burger {
  display: inline-flex;
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  padding: 0;
}

.site-header__burger-lines {
  position: relative;
  display: block;
  width: 1.15rem;
  height: 0.85rem;
}

.site-header__burger-lines span {
  position: absolute;
  left: 0;
  display: block;
  width: 100%;
  height: 2px;
  background: #0b0d10;
  transition: transform 0.2s ease, opacity 0.2s ease, top 0.2s ease;
}

.site-header__burger-lines span:nth-child(1) { top: 0; }
.site-header__burger-lines span:nth-child(2) { top: 50%; margin-top: -1px; }
.site-header__burger-lines span:nth-child(3) { bottom: 0; }

.site-header__burger-lines.open span:nth-child(1) {
  top: 50%;
  margin-top: -1px;
  transform: rotate(45deg);
}

.site-header__burger-lines.open span:nth-child(2) {
  opacity: 0;
}

.site-header__burger-lines.open span:nth-child(3) {
  bottom: auto;
  top: 50%;
  margin-top: -1px;
  transform: rotate(-45deg);
}

.site-drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(11, 13, 16, 0.45);
}

.site-drawer {
  position: fixed;
  inset: 0 0 0 auto;
  z-index: 70;
  display: flex;
  width: min(100%, 22rem);
  flex-direction: column;
  background: #fff;
  box-shadow: -12px 0 40px rgba(11, 13, 16, 0.12);
  transform: translateX(100%);
  transition: transform 0.28s ease;
}

.site-drawer.open {
  transform: translateX(0);
}

.site-drawer__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e8ecf1;
  padding: 1.1rem 1.25rem;
}

.site-drawer__title {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.site-drawer__close {
  min-height: 2.5rem;
  padding: 0 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 600;
}

.site-drawer__list {
  display: grid;
  gap: 0.35rem;
  margin: 0;
  padding: 0.85rem 1rem 0.5rem;
  list-style: none;
}

.site-drawer__link {
  display: block;
  padding: 0.55rem 0.75rem;
  color: #0b0d10;
  font-size: 1rem;
  font-weight: 600;
}

.site-drawer__link.is-active {
  background: #e8f1fb;
  color: #2f78cd;
}

.site-drawer__foot {
  display: grid;
  gap: 0.5rem;
  margin-top: auto;
  border-top: 1px solid #e8ecf1;
  padding: 1.25rem;
}

.site-drawer__phone {
  color: #2f78cd;
  font-size: 1.15rem;
  font-weight: 700;
}

.site-drawer__mail {
  color: #6b7280;
  font-size: 0.9rem;
}

.site-drawer__cta {
  display: inline-flex;
  min-height: 3rem;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
  background: #2f78cd;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

@media (min-width: 1024px) {
  .site-header__nav {
    display: flex;
  }

  .site-header__phone,
  .site-header__cta {
    display: inline-flex;
  }

  .site-header__burger,
  .site-drawer,
  .site-drawer-backdrop {
    display: none;
  }
}

@media (min-width: 640px) {
  .site-header__brand-text small {
    display: block;
  }
}

@media (max-width: 639px) {
  .site-header__brand-text small {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-drawer,
  .site-header__burger-lines span {
    transition: none;
  }
}
</style>
