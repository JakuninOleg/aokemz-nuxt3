<template>
  <div class="kemz-light">
    <header class="cat-hero">
      <div class="wrap">
        <p class="section-tag cat-hero__tag">Связь</p>
        <h1>Контакты</h1>
        <address class="cat-address cat-hero__lead">
          624930, Свердловская обл., г. Карпинск, ул. Карпинского, 1
        </address>
      </div>
    </header>

    <div class="cat-body">
      <div class="wrap">
        <ul class="cat-contacts">
          <li v-for="(contact, index) in contacts" :key="index" class="cat-contacts__row">
            <div>
              <h2 class="cat-contacts__role">{{ contact.position }}</h2>
              <p v-if="contact.person" class="cat-contacts__person">{{ contact.person }}</p>
            </div>
            <div class="cat-contacts__links">
              <a
                v-for="tel in contact.phones"
                :key="tel.href"
                :href="tel.href"
              >
                {{ tel.label }}
              </a>
              <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
            </div>
          </li>
        </ul>

        <div class="cat-form-block">
          <p>Заявка уходит в отдел продаж. Ответ обычно в рабочие дни.</p>
          <Form header="Написать в отдел продаж" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PAGE_SEO } from '~/utils/siteSeo'

type Phone = { label: string; href: string }

type Contact = {
  position: string
  person?: string
  phones: Phone[]
  email: string
}

const contacts: Contact[] = [
  {
    position: 'Приёмная генерального директора',
    phones: [{ label: '+7 (34383) 3-28-51', href: 'tel:+73438332851' }],
    email: 'info@aokemz.ru',
  },
  {
    position: 'Отдел продаж',
    phones: [{ label: '+7 (343) 278-37-43', href: 'tel:+73432783743' }],
    email: 'sales@aokemz.ru',
  },
  {
    position: 'Отдел материально-технического снабжения',
    phones: [
      { label: '+7 (34383) 3-35-22', href: 'tel:+73438333522' },
      { label: '+7 (34383) 3-36-40', href: 'tel:+73438333640' },
      { label: '+7 (34383) 3-28-96', href: 'tel:+73438332896' },
    ],
    email: 'omts@aokemz.ru',
  },
  {
    position: 'Отдел технического контроля',
    phones: [{ label: '+7 (34383) 3-36-30', href: 'tel:+73438333630' }],
    email: 'otk@aokemz.ru',
  },
  {
    position: 'Начальник службы качества',
    person: 'Тягунов Антон Сергеевич',
    phones: [{ label: '+7 (34383) 3-36-30', href: 'tel:+73438333630' }],
    email: 'tas@aokemz.ru',
  },
  {
    position: 'Начальник отдела кадров',
    person: 'Архиреева Любовь Алексеевна',
    phones: [{ label: '+7 (343) 833-36-89', href: 'tel:+73438333689' }],
    email: 'laa@aokemz.ru',
  },
]

usePageSeo(PAGE_SEO.contacts)
</script>

<style lang="scss" src="~/assets/css/catalog-light.scss"></style>
