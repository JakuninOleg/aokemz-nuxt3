<template>
  <section class="section mt-8 lg:mt-24 mb-10 lg:mb-16">
    <!-- <h1 class="text-2xl lg:text-3xl mb-6 font-semibold">НОВОСТИ</h1>
    <div
      class="grid xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-10 mb-10"
    >
      <div v-for="(article, index) in articles" :key="index">
        <NuxtLink :to="'news/' + article.sys.id">
          <div
            class="border-2 border-gray-200 rounded-lg min-w-50 transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
          >
            <img
              :src="'https:' + article.fields.image.fields.file.url"
              :alt="article.fields.header"
              loading="lazy"
              class="w-full h-40 object-cover rounded-t-lg mb-2"
            />
            <span class="font-semibold pl-4">
              {{
                new Date(article.fields.date).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              }}
            </span>
            <h2 class="text-xl font-semibold pl-4 py-6">
              {{ article.fields.header }}
            </h2>
            <div class="pl-4 py-2">
              <NuxtLink
                :to="'news/' + article.sys.id"
                class="text-blue-300 hover:text-blue-400"
              >
                Читать далее
              </NuxtLink>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div> -->
    <!-- <ul class="mb-10 grid gap-2">
      <li v-for="(article, index) in articles" :key="index">
        <span>
          {{ article.fields.header }}
        </span>
        <span class="opacity-60">
          |
          {{
            new Date(article.fields.date).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'numeric',
            })
          }}
        </span>
        <NuxtLink
          :to="'news/' + article.sys.id"
          class="text-blue-300 hover:text-blue-400"
        >
          Читать далее
        </NuxtLink>
      </li>
    </ul> -->
  </section>
</template>

<script>
// export default {
//   computed: {
//     articles() {
//       return this.$store.state.news
//     },
//   },
// }
</script>
