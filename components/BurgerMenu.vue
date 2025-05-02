<template>
  <nav class="burger-menu">
    <section class="burger-menu__section">
      <div class="burger-menu__header">
        <NuxtLink to="/" class="flex items-center w-full" @click="toggleMenu">
          <img src="~/assets/images/kemz-logo.png" class="w-8 mr-2" />
          <h1 class="text-md font-bold text-black">
            ОАО "Карпинский Электромашиностроительный Завод"
          </h1>
        </NuxtLink>
        <img
          src="~/assets/css/icons/cross.svg"
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
          <NuxtLink
            :to="link.link"
            :class="[
              'burger-menu__link',
              isActiveLink(link.link) ? 'nuxt-link-active' : ''
            ]"
          >
            {{ link.name }}
          </NuxtLink>
        </li>
      </ul>
    </section>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  links: { name: string; link: string }[]
}>()

const emit = defineEmits(['toggleMenu'])
const route = useRoute()

const toggleMenu = () => {
  emit('toggleMenu')
}

// Проверка активной ссылки
const isActiveLink = (linkPath: string) => {
  return route.path === linkPath || route.path.startsWith(linkPath + '/')
}
</script>

<style scoped>
.nuxt-link-active {
  color: rgb(96, 165, 250); /* Цвет для активной ссылки */
  font-weight: bold;
}

.burger-menu__link {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.burger-menu__link:hover {
  opacity: 1;
}
</style>
