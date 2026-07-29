<!--
  Legacy sidebar chrome (pre hybrid redesign).
  Replaced on production shell by AppHeader/AppFooter.
  Concept rewritten as Option C demo: /new-layout-3
  Safe to delete after Option A/B is chosen and catalog secondary nav is decided.
-->
<template>
  <div>
    <Menu :links="links" />
    <div class="2xl:hidden px-6 sm:px-10 lg:p-0 lg:w-0 flex mb-5">
      <NuxtLink to="/" class="flex items-center w-full pt-6">
        <img src="~/assets/images/kemz-logo.png" class="w-8 mr-2" alt="КЭМЗ" />
        <h1 class="text-xl font-bold text-black">ОАО "КЭМЗ"</h1>
      </NuxtLink>
      <button aria-label="Меню" type="button" @click="toggleMenu">
        <img src="~/assets/css/icons/menu.svg" class="pt-6" alt="" />
      </button>
      <BurgerMenu
        :links="links"
        :class="menuOpened ? 'burger-menu--active' : ''"
        @toggleMenu="toggleMenu"
      />
      <div
        :class="menuOpened ? 'burger-menu__overlay--active' : ''"
        class="burger-menu__overlay"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BurgerMenu from '~/components/BurgerMenu.vue'
import Menu from '~/components/Menu.vue'

const menuOpened = ref(false)
const { links: siteLinks } = useSiteNav()
const links = computed(() =>
  siteLinks.map((l) => ({ name: l.name, link: l.link })),
)

const toggleMenu = () => {
  menuOpened.value = !menuOpened.value
}
</script>
