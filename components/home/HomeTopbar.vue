<template>
  <header class="topbar">
    <div class="wrap nav-row">
      <NuxtLink to="/" class="brand">
        <img src="~/assets/images/kemz-logo.png" alt="" class="brand-mark" />
        <span class="brand-copy">
          <strong>ОАО «КЭМЗ»</strong>
          <small>Карпинский электромашиностроительный завод</small>
        </span>
      </NuxtLink>

      <nav class="nav-links" aria-label="Основная навигация">
        <NuxtLink
          v-for="link in links"
          :key="link.link"
          :to="link.link"
          class="nav-link"
        >
          {{ link.name }}
        </NuxtLink>
      </nav>

      <div class="nav-actions">
        <a href="#contact" class="button button-solid nav-cta">Связаться</a>
        <button
          type="button"
          class="menu-toggle"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav"
          aria-label="Меню"
          @click="menuOpen = !menuOpen"
        >
          <span /><span /><span />
        </button>
      </div>
    </div>

    <nav
      id="mobile-nav"
      class="mobile-nav"
      :class="{ open: menuOpen }"
      aria-label="Мобильная навигация"
    >
      <NuxtLink
        v-for="link in links"
        :key="link.link"
        :to="link.link"
        class="mobile-nav-link"
        @click="menuOpen = false"
      >
        {{ link.name }}
      </NuxtLink>
      <a href="#contact" class="mobile-nav-link" @click="menuOpen = false">Заявка на главной</a>
    </nav>
  </header>
</template>

<script setup lang="ts">
const { links } = useSiteNav()
const menuOpen = ref(false)
</script>
