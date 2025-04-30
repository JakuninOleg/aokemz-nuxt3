<template>
  <div>
    <Menu :links="links" />
    <div class="2xl:hidden px-6 sm:px-10 lg:p-0 lg:w-0 flex mb-5">
      <NuxtLink to="/" class="flex items-center w-full pt-6">
        <img src="~assets/images/kemz-logo.png" class="w-8 mr-2" />
        <h1 class="text-xl font-bold text-black">ОАО "КЭМЗ"</h1>
      </NuxtLink>
      <button aria-label="Меню" @click="toggleMenu">
        <img src="~assets/css/icons/menu.svg" class="pt-6" />
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

<script>
import BurgerMenu from '~/components/BurgerMenu.vue'
import Menu from '~/components/Menu.vue'
export default {
  components: {
    BurgerMenu,
    Menu,
  },
  data() {
    return {
      menuOpened: false,
    }
  },
  computed: {
    links() {
      return [
        {
          name: 'О заводе',
          link: 'about',
        },
        {
          name: 'Спецпредложения',
          link: 'special',
        },
        {
          name: 'Каталог продукции',
          link: 'products',
        },
        {
          name: 'Новости',
          link: 'news',
        },
        {
          name: 'Контакты',
          link: 'contacts',
        },
        {
          name: 'Документы',
          link: 'documents',
        },
      ]
    },
  },
  methods: {
    toggleMenu() {
      this.menuOpened = !this.menuOpened
    },
  },
}
</script>
