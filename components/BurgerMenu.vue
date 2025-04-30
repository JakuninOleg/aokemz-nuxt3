<template>
  <nav class="burger-menu">
    <section class="burger-menu__section">
      <div class="burger-menu__header">
        <NuxtLink to="/" class="flex items-center w-full">
          <img
            src="~assets/images/kemz-logo.png"
            class="w-8 mr-2"
            @click="toggleMenu"
          />
          <h1 class="text-md font-bold text-black" @click="toggleMenu">
            ОАО "Карпинский Электромашиностроительный Завод"
          </h1>
        </NuxtLink>
        <img
          src="~assets/css/icons/cross.svg"
          class="burger-menu__cross"
          @click="toggleMenu"
        />
      </div>
    </section>
    <section class="burger-menu__section">
      <ul class="burger-menu__list">
        <li
          v-for="link in links"
          :key="link.name"
          class="burger-menu__list-item"
          @click="toggleMenu"
        >
          <NuxtLink :to="'/' + link.link">{{ link.name }}</NuxtLink>
        </li>
      </ul>
    </section>
  </nav>
</template>

<script>
export default {
  props: {
    links: {
      type: Array,
      required: true,
    },
  },
  methods: {
    toggleMenu() {
      this.$emit('toggleMenu')
    },
  },
}
</script>
