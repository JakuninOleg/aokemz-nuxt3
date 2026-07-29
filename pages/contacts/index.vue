<template>
  <section class="section py-12 lg:py-16 mb-8">
    <h1 class="text-3xl font-bold tracking-tight text-kemz-ink">Контакты</h1>
    <p class="mt-3 max-w-xl text-kemz-muted">
      624930, Свердловская обл., г. Карпинск, ул. Карпинского, 1
    </p>

    <ul class="mt-12 grid gap-0 divide-y divide-kemz-steel border-y border-kemz-steel">
      <li v-for="(contact, index) in contacts" :key="index" class="grid gap-4 py-8 sm:grid-cols-[1fr_auto]">
        <div>
          <h2 class="text-lg font-semibold text-kemz-ink">{{ contact.position }}</h2>
          <p v-if="contact.person" class="mt-1 text-kemz-muted">{{ contact.person }}</p>
        </div>
        <div class="sm:text-right">
          <a
            v-for="tel in contact.phones"
            :key="tel.href"
            :href="tel.href"
            class="block font-medium text-kemz-brand hover:underline"
          >
            {{ tel.label }}
          </a>
          <a
            :href="`mailto:${contact.email}`"
            class="mt-2 block text-sm text-kemz-muted hover:text-kemz-brand"
          >
            {{ contact.email }}
          </a>
        </div>
      </li>
    </ul>

    <div class="mt-12 max-w-xl">
      <Form header="Написать в отдел продаж" />
    </div>
  </section>
</template>

<script setup lang="ts">
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

useSeoMeta({
  title: 'Контакты | ОАО «КЭМЗ»',
  description:
    'Контакты ОАО КЭМЗ в Карпинске: отдел продаж, снабжение, ОТК, кадры. Телефон продаж +7 (343) 278-37-43.',
})
</script>
