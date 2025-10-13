<template>
  <section class="section mt-8 lg:mt-24 mb-10 lg:mb-16">
    <h1 class="font-bold text-3xl mb-6 lg:mb-12">Контакты</h1>
    <ul class="grid gap-6 divide-y divide-slate-700">
      <li
        v-for="(contact, index) in contacts"
        :key="index"
        class="grid gap-2 pt-6"
      >
        <h2 class="font-semibold text-xl">{{ contact.position }}</h2>
        <h2 v-if="contact.surname" class="font-semibold text-xl mb-2">
          {{ contact.surname }}
        </h2>
        <div class="grid gap-4 lg:flex">
          <div class="lg:mr-60 grid gap-2">
            <p class="text-lg font-medium">Телефон:</p>
            <a
              v-for="(tel, ind) in contact.tel"
              :key="ind"
              :href="'tel: +7' + tel"
              class="nuxt-link-active"
              >+7 {{ tel }}</a
            >
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-lg font-medium">E-mail:</p>
            <a :href="'mailto:' + contact.email" class="nuxt-link-active">{{
              contact.email
            }}</a>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  data() {
    return {
      contacts: [
        {
          position: 'Приёмная генерального директора',
          tel: ['(34383) 3-28-51'],
          email: 'info@aokemz.ru',
        },
        {
          position: 'Начальник отдела кадров',
          surname: 'Архиреева Любовь Алексеевна',
          tel: ['(343) 833-36-89'],
          email: 'laa@aokemz.ru',
        },
        {
          position: 'Отдел продаж',
          tel: ['(343) 278-37-43'],
          email: 'sales@aokemz.ru',
        },
        {
          position: 'Отдел материально-технического снабжения',
          tel: ['(34383) 3-35-22', '(34383) 3-36-40', '(34383) 3-28-96'],
          email: 'omts@aokemz.ru',
        },
        {
          position: 'Отдел технического контроля',
          tel: ['(34383) 3-36-30'],
          email: 'otk@aokemz.ru',
        },
        {
          position: 'Начальник службы качества',
          surname: 'Тягунов Антон Сергеевич',
          tel: ['(34383) 3-36-30'],
          email: 'tas@aokemz.ru',
        },
      ],
    }
  },
}
</script>
