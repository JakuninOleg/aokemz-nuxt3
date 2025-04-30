<template>
  <div class="w-full">
    <Hero />
    <!-- <section class="mb-10 lg:mb-20 section">
      <div class="flex text-center flex-col justify-center">
        <h1 class="text-3xl font-bold mb-6">
          ОАО "Карпинский Электромашиностроительный Завод"
        </h1>
        <p class="text-xl font-semibold mb-6">Сайт находится в разработке</p>
        <div class="text-xl font-semibold mb-6 gap-2 grid">
          <p class="font-bold">Наши контакты:</p>
          <p>
            Россия, 624930, Свердловская обл., г. Карпинск, ул. Карпинского, 1
          </p>
          <p>тел. +7 (343-83) 3-28-51, факс (343-83) 3-28-22</p>
          <p>E-mail: info@aokemz.ru</p>
          <p>Отдел снабжения +7 (343-83) 3-31-19 , snab@aokemz.ru</p>
          <p>Отдел продаж тел. +7 (343) 278-37-43 , sales@aokemz.ru</p>
          <p>
            По вопросам трудоустройства контактное лицо: Архиреева Любовь
            Алексеевна
          </p>
          <p>Телефон: +7(343) 833-36-89, Email: laa@aokemz.ru</p>
        </div>
      </div>
    </section> -->
    <div class="section mb-4">
      <Form header="Свяжитесь с нами" />
    </div>
  </div>
</template>

<script>
import Hero from '~/components/Hero.vue'
import Form from '~/components/Form.vue'

export default {
  components: {
    Hero,
    Form,
  },
  data() {
    return {
      coords: [59.792604, 30.541579],
    }
  },
  computed: {
    articles() {
      return this.$store.state.articles.slice(0, 2)
    },
  },
}
</script>
