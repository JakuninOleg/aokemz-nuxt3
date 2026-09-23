<template>
  <header class="site-header site-header--reference">
    <div class="site-header__bar">
      <NuxtLink to="/" class="site-header__brand" @click="closeMenu">
        <img
          src="~/assets/images/kemz-logo.webp"
          alt="Логотип ОАО КЭМЗ"
          class="site-header__logo"
          width="44"
          height="50"
          decoding="async"
        />
        <span class="site-header__brand-text">
          <strong>КЭМЗ</strong>
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
        <NuxtLink to="/contacts" class="site-header__link">Контакты</NuxtLink>
      </nav>

      <div class="site-header__actions">
        <a :href="salesPhoneHref" class="site-header__phone">{{
          salesPhoneDisplay
        }}</a>
        <HomeActionButton
          :to="isHome ? '/#technical-request' : '/contacts'"
          class="site-header__cta"
          >Связаться</HomeActionButton
        >
        <button
          ref="drawerToggle"
          type="button"
          class="site-header__burger"
          :aria-expanded="menuOpen"
          aria-controls="mobile-drawer"
          :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
          @click="toggleMenu"
        >
          <span
            class="site-header__burger-lines"
            :class="{ open: menuOpen }"
            aria-hidden="true"
          >
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
        ref="drawerPanel"
        id="mobile-drawer"
        class="site-drawer"
        role="dialog"
        aria-modal="true"
        :class="{ open: menuOpen }"
        :aria-hidden="!menuOpen"
        :inert="!menuOpen"
        aria-label="Мобильное меню"
      >
        <div class="site-drawer__head">
          <NuxtLink to="/" class="site-drawer__brand" @click="closeMenu">
            <img
              src="~/assets/images/kemz-logo.webp"
              alt="Логотип ОАО КЭМЗ"
              width="44"
              height="50"
            />
            <span>
              <strong>КЭМЗ</strong>
              <small>Карпинский электромашиностроительный завод</small>
            </span>
          </NuxtLink>
          <button
            ref="drawerClose"
            type="button"
            class="site-drawer__close"
            aria-label="Закрыть меню"
            @click="closeMenu"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        <p class="site-drawer__title">Меню</p>
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
          <li>
            <NuxtLink
              to="/contacts"
              class="site-drawer__link"
              :class="{ 'is-active': currentPath === '/contacts' }"
              @click="closeMenu"
            >
              Контакты
            </NuxtLink>
          </li>
        </ul>

        <div class="site-drawer__foot">
          <a :href="salesPhoneHref" class="site-drawer__contact">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.7 9 6.1 7.5 9.4a15.5 15.5 0 0 0 7.1 7.1l3.3-1.5 2.4 2.4-1.2 3.1c-.3.8-1.2 1.2-2 .9C9.5 18.9 5.1 14.5 2.6 6.9c-.3-.8.1-1.7.9-2Z" /></svg>
            <span>{{ salesPhoneDisplay }}</span>
          </a>
          <a :href="`mailto:${salesEmail}`" class="site-drawer__contact">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3zM3 6l9 7 9-7" /></svg>
            <span>{{ salesEmail }}</span>
          </a>
          <HomeActionButton to="/contacts" class="site-drawer__cta" @click="closeMenu">
            Связаться
          </HomeActionButton>
          <p class="site-drawer__tagline">Надёжные решения<br />для реальных задач</p>
        </div>
        <div class="site-drawer__blueprint" aria-hidden="true"></div>
      </nav>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { links, salesPhoneDisplay, salesPhoneHref, salesEmail, isActiveLink } =
  useSiteNav();

const menuOpen = ref(false);
const drawerToggle = ref<HTMLButtonElement | null>(null);
const drawerPanel = ref<HTMLElement | null>(null);
const drawerClose = ref<HTMLButtonElement | null>(null);
let restoreFocusTo: HTMLElement | null = null;
const currentPath = computed(() => {
  const raw = nuxtApp._route?.path ?? "/";
  if (raw.length > 1 && raw.endsWith("/")) return raw.slice(0, -1);
  return raw;
});
const isHome = computed(() => currentPath.value === "/");
const closeMenu = () => {
  menuOpen.value = false;
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const onKeydown = (event: KeyboardEvent) => {
  if (!menuOpen.value) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeMenu();
    return;
  }
  if (event.key !== "Tab") return;

  const panel = drawerPanel.value;
  if (!panel) return;
  const candidates = panel.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  ) as NodeListOf<HTMLElement>;
  const focusable = [...candidates].filter(
    (element) => element.getClientRects().length > 0,
  );
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

watch(menuOpen, async (open: boolean) => {
  if (!import.meta.client) return;
  if (open) {
    restoreFocusTo = document.activeElement instanceof HTMLElement ? document.activeElement : drawerToggle.value;
    document.body.style.overflow = "hidden";
    await nextTick();
    drawerClose.value?.focus();
    return;
  }

  document.body.style.overflow = "";
  await nextTick();
  restoreFocusTo?.focus();
  restoreFocusTo = null;
});

watch(currentPath, () => closeMenu());

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  if (import.meta.client) document.body.style.overflow = "";
});
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
  height: auto;
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
  transition:
    transform 0.2s ease,
    opacity 0.2s ease,
    top 0.2s ease;
}

.site-header__burger-lines span:nth-child(1) {
  top: 0;
}
.site-header__burger-lines span:nth-child(2) {
  top: 50%;
  margin-top: -1px;
}
.site-header__burger-lines span:nth-child(3) {
  bottom: 0;
}

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
  z-index: 1000;
  background: rgba(3, 17, 36, 0.68);
  backdrop-filter: blur(3px);
}

.site-drawer {
  position: fixed;
  inset: 0 0 0 auto;
  z-index: 1001;
  display: flex;
  width: min(100vw, 22rem);
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  background: #f8fbfe;
  box-shadow: -18px 0 50px rgba(2, 19, 42, 0.26);
  transform: translateX(100%);
  transition: transform 0.28s ease;
}

.site-drawer.open {
  transform: translateX(0);
}

.site-drawer__head {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 2.75rem;
  align-items: center;
  gap: 0.5rem;
  padding: 1.4rem 1.5rem 1.15rem;
}

.site-drawer__brand {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.65rem;
  color: #082f52;
  text-decoration: none;
}

.site-drawer__brand img {
  width: 2.8rem;
  height: auto;
  flex: 0 0 auto;
  object-fit: contain;
}

.site-drawer__brand > span {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 0.35rem;
}

.site-drawer__brand strong {
  font-family: "KEMZ Condensed", "Arial Narrow", sans-serif;
  font-size: 1.45rem;
  line-height: 1;
}

.site-drawer__brand small {
  max-width: 6.4rem;
  padding-left: 0.4rem;
  border-left: 1px solid #cddded;
  color: #416087;
  font-size: 0.55rem;
  font-weight: 600;
  line-height: 1.22;
}

.site-drawer__title {
  position: relative;
  z-index: 1;
  margin: 0;
  padding: 0.2rem 1.5rem 0.75rem;
  color: #5d7faa;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.site-drawer__close {
  position: relative;
  width: 2.75rem;
  height: 2.75rem;
  flex: 0 0 auto;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.site-drawer__close span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1.55rem;
  height: 2px;
  background: #082f52;
}

.site-drawer__close span:first-child { transform: translate(-50%, -50%) rotate(45deg); }
.site-drawer__close span:last-child { transform: translate(-50%, -50%) rotate(-45deg); }

.site-drawer__close:hover span,
.site-drawer__close:focus-visible span {
  background: #0056b9;
}

.site-drawer__list {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 0.3rem;
  margin: 0;
  padding: 0 1.5rem 1.25rem;
  list-style: none;
}

.site-drawer__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 3.1rem;
  padding: 0.35rem 1rem 0.35rem 1.25rem;
  color: #061638;
  font-family: "KEMZ Condensed", "Arial Narrow", sans-serif;
  font-size: clamp(1.1rem, 5vw, 1.35rem);
  font-weight: 700;
  line-height: 1;
  text-decoration: none;
  transition: color var(--kemz-motion-duration) var(--kemz-motion-ease), background-color var(--kemz-motion-duration) var(--kemz-motion-ease), padding var(--kemz-motion-duration) var(--kemz-motion-ease);
}

.site-drawer__link::after {
  content: "→";
  color: #5d7faa;
  font-family: var(--home-body, Arial, sans-serif);
  font-size: 1.35rem;
  font-weight: 400;
  transition: transform var(--kemz-motion-duration) var(--kemz-motion-ease), color var(--kemz-motion-duration) var(--kemz-motion-ease);
}

.site-drawer__link.is-active {
  border-left: 3px solid #0056b9;
  padding-left: calc(1.25rem - 3px);
  background: linear-gradient(90deg, #e7f2ff, rgba(231, 242, 255, 0));
  color: #0056b9;
}

.site-drawer__link:hover,
.site-drawer__link:focus-visible {
  color: #0056b9;
  background: #eef6fd;
}

.site-drawer__link:hover::after,
.site-drawer__link:focus-visible::after {
  color: #0056b9;
  transform: translateX(4px);
}

.site-drawer__foot {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 1rem;
  /* Keep the contact area low on tall screens without forcing a blank band on compact phones. */
  margin-top: clamp(0.9rem, 4vh, 2.5rem);
  border-top: 1px solid #cddded;
  padding: 1.25rem 1.5rem 1.7rem;
  isolation: isolate;
}

.site-drawer__contact {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  color: #082f52;
  font-size: 1.08rem;
  font-weight: 650;
  line-height: 1.2;
  text-decoration: none;
  font-variant-numeric: tabular-nums;
}

.site-drawer__contact svg {
  width: 1.8rem;
  height: 1.8rem;
  flex: 0 0 auto;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.65;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.site-drawer__cta {
  z-index: 1;
  width: min(100%, 18rem);
  min-height: 3.2rem;
  margin-top: 0.15rem;
  justify-content: space-between;
  text-decoration: none;
}

.site-drawer__tagline {
  z-index: 1;
  margin: 0.85rem 0 0;
  padding-top: 0.9rem;
  border-top: 1px solid #b8cee4;
  color: #315c91;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.35;
}

.site-drawer__blueprint {
  position: absolute;
  right: -1rem;
  bottom: -1rem;
  z-index: 0;
  width: 25rem;
  height: 28rem;
  background-repeat: no-repeat;
  /* Keep the supplied drawing's lower-right engineering detail fully in frame. */
  background-position: right bottom;
  background-size: 100% auto;
  opacity: 0.8;
  pointer-events: none;
}

/* The artwork is decorative and only needed after the drawer opens. */
.site-drawer.open .site-drawer__blueprint {
  background-image: url("/media/drawer-blueprint.webp");
}

/* Compact phone height: preserve every action, reduce only visual rhythm. */
@media (max-width: 400px), (max-height: 700px) {
  .site-drawer__head {
    padding: 0.75rem 1.1rem 0.55rem;
  }

  .site-drawer__brand img {
    width: 2.2rem;
    height: auto;
  }

  .site-drawer__brand strong {
    font-size: 1.22rem;
  }

  .site-drawer__brand small {
    max-width: 5.6rem;
    font-size: 0.48rem;
  }

  .site-drawer__close {
    width: 2.25rem;
    height: 2.25rem;
  }

  .site-drawer__title {
    padding: 0.15rem 1.1rem 0.4rem;
    font-size: 0.68rem;
  }

  .site-drawer__list {
    gap: 0;
    padding: 0 1.1rem 0.55rem;
  }

  .site-drawer__link {
    min-height: 2.65rem;
    padding-block: 0.22rem;
    font-size: 1rem;
  }

  .site-drawer__link::after {
    font-size: 1.15rem;
  }

  .site-drawer__foot {
    gap: 0.6rem;
    margin-top: clamp(0.5rem, 3vh, 1.25rem);
    padding: 0.7rem 1.1rem 1rem;
  }

  .site-drawer__contact {
    gap: 0.7rem;
    font-size: 0.88rem;
  }

  .site-drawer__contact svg {
    width: 1.35rem;
    height: 1.35rem;
  }

  .site-drawer__cta {
    min-height: 2.75rem;
    margin-top: 0;
    padding: 0.55rem 0.8rem;
    font-size: 0.85rem;
  }

  .site-drawer__tagline {
    margin-top: 0.25rem;
    padding-top: 0.5rem;
    font-size: 0.78rem;
  }

  .site-drawer__blueprint {
    right: -0.8rem;
    bottom: -0.8rem;
    width: 20rem;
    height: 22rem;
    background-size: 100% auto;
    opacity: 0.72;
  }
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
