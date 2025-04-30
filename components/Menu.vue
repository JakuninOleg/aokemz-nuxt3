<template>
  <aside class="fixed hidden lg:block">
    <nav
      class="min-w-max bg-gray-300 h-screen pl-14 pt-20 pb-10 pr-12 static flex flex-col justify-between"
    >
      <div>
        <NuxtLink to="/" class="flex items-center mb-10 w-full">
          <img src="~assets/images/kemz-logo.png" class="w-20 mr-4" />
          <h1 class="text-2xl font-bold text-black">ОАО "КЭМЗ"</h1>
        </NuxtLink>
        <ul>
          <li
            v-for="link in links"
            :key="link.name"
            class="font-semibold text-2xl mb-2"
          >
            <NuxtLink
              :to="link.link"
              class="opacity-60 hover:opacity-100"
              >{{ link.name }}</NuxtLink
            >
            <ul
              v-if="$route.path === '/products'"
              class="mt-2 list-disc list-inside"
            >
              <li
                v-for="product in link.products"
                :key="product.fields.name"
                class="mb-2 font-light text-base max-w-xs opacity-80 hover:opacity-100 cursor-pointer pl-2"
                @click="changeCategory(product.fields.name)"
              >
                {{ product.fields.name }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <footer class="font-normal text-lg grid gap-4">
        <a
          class="flex text-md xl:text-lg text-blue-500 hover:text-blue-600 mr-6 font-medium mb-2"
          target="_blank"
          href="/ОАО КЭМЗ.pdf"
        >
          <img
            src="~assets/images/pdf.png"
            alt="pdf"
            loading="lazy"
            class="w-10 object-contain mr-3"
          />
          <p class="self-end">Презентация компании</p>
        </a>
        <a
          class="flex text-md xl:text-lg text-blue-500 hover:text-blue-600 mr-6 font-medium mb-2"
          target="_blank"
          href="/Возможности КЭМЗ.docx"
        >
          <img
            src="~assets/images/word.png"
            alt="pdf"
            loading="lazy"
            class="w-10 object-contain mr-3"
          />
          <p class="self-end">Возможности КЭМЗ</p>
        </a>
        <a href="tel:83432783743" class="font-bold text-3xl"
          >+7 (343) 278-37-43</a
        >
        <div>
          <p class="mt-4">(C) {{ new Date().getFullYear() }}</p>
          <p>ОАО "Карпинский</p>
          <p>Электромашиностроительный</p>
          <p>Завод"</p>
        </div>
      </footer>
    </nav>
  </aside>
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
    changeCategory(category) {
      this.$store.dispatch('setCategory', category)
    },
  },
}
</script>
