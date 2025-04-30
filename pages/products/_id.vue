<template>
  <section class="section mt-8 lg:mt-24 mb-16">
    <h1 class="font-bold text-2xl lg:text-3xl lg:mb-16 mb-8">
      {{ category.fields.Name }}
    </h1>
    <img
      :src="'https:' + category.fields.image.fields.file.url"
      :alt="category.fields.Name"
      loading="lazy"
      class="h-80 rounded-t-lg mb-10"
    />
    <p class="text-lg mb-10">
      {{ category.fields.description }}
    </p>
    <h2 class="font-bold text-xl mb-8">Продукция</h2>
    <section class="mb-8">
      <div v-for="(fields, type, index) in products" :key="index" class="mb-6">
        <h3 class="font-semibold text-lg mb-6">{{ type }}</h3>
        <ul class="list-disc list-inside">
          <li v-for="(product, ind) in fields" :key="ind" class="mb-2">
            <NuxtLink
              :to="
                '/products/' + category.fields.url + '/' + product.fields.url
              "
              class="nuxt-link-active"
            >
              {{ product.fields.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div v-if="category.fields.files" class="grid gap-4 lg:gap-6">
        <h2 class="font-bold text-lg mt-4">Документы</h2>
        <a
          v-for="(file, index) in category.fields.files"
          :key="index"
          class="flex text-md xl:text-lg text-blue-500 hover:text-blue-600 mr-6 font-medium"
          target="_blank"
          :href="'https:' + file.fields.file.url"
        >
          <img
            v-if="file.fields.file.contentType === 'application/pdf'"
            src="~assets/images/pdf.png"
            alt="pdf"
            loading="lazy"
            class="w-10 object-contain mr-3"
          />
          <img
            v-else
            src="~assets/images/word.png"
            alt="word"
            loading="lazy"
            class="w-10 object-contain mr-3"
          />
          <p class="self-end">
            <span>{{ file.fields.title }}</span>
          </p>
        </a>
      </div>
    </section>
    <p
      class="text-lg font-light mr-2 hover:font-bold transition ease-out transition-duration-320"
    >
      <NuxtLink to="/products" class="flex items-center w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 mr-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Вернуться к каталогу
      </NuxtLink>
    </p>
  </section>
</template>

<script>
export default {
  computed: {
    category() {
      return this.$store.state.categories.filter((obj) => {
        return obj.fields.url === this.$route.params.id
      })[0]
    },
    products() {
      const products = this.$store.state.products.filter((obj) => {
        return obj.fields.category.fields.url === this.$route.params.id
      })

      const orderedProducts = products.sort(
        (a, b) => a.fields.order - b.fields.order
      )

      function groupBy(xs, prop) {
        const grouped = {}
        for (let i = 0; i < xs.length; i++) {
          const p = xs[i].fields[prop]
          if (!grouped[p]) {
            grouped[p] = []
          }
          grouped[p].push(xs[i])
        }
        return grouped
      }

      const sortedProducts = groupBy(orderedProducts, 'type')

      return sortedProducts
    },
  },
}
</script>
