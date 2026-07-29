<template>
  <section class="section mt-8 lg:mt-24 mb-16 max-w-3xl">
    <h1 class="text-2xl lg:text-3xl font-bold mb-4">Документы</h1>
    <p class="text-kemz-muted mb-10 leading-relaxed">
      Презентация и опросные листы ОАО «КЭМЗ». Файлы открываются в новой вкладке.
    </p>
    <ul class="grid gap-4">
      <li v-for="doc in docs" :key="doc.href">
        <a
          :href="doc.href"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-start gap-3 border border-slate-200 px-4 py-3 hover:border-kemz-blue transition-colors"
        >
          <span class="text-kemz-blue font-semibold shrink-0">{{ doc.ext }}</span>
          <span>
            <span class="font-medium block">{{ doc.title }}</span>
            <span v-if="doc.note" class="text-sm text-kemz-muted">{{ doc.note }}</span>
          </span>
        </a>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
const docs = [
  {
    title: 'Презентация / каталог ОАО «КЭМЗ»',
    href: encodeURI('/docs/ОАО КЭМЗ.pdf'),
    ext: 'PDF',
    note: 'Номенклатура, комплекты, ТТХ',
  },
  {
    title: 'Возможности завода',
    href: encodeURI('/docs/Возможности КЭМЗ.docx'),
    ext: 'DOCX',
    note: 'Литьё, гальваника, механообработка',
  },
  {
    title: 'Опросный лист на электрические машины',
    href: encodeURI('/docs/Опросный лист на электрические машины ОАО КЭМЗ.pdf'),
    ext: 'PDF',
  },
  {
    title: 'Опросный лист высоковольтной аппаратуры',
    href: encodeURI('/docs/Опросный лист высоковольтной аппаратуры ОАО КЭМЗ.pdf'),
    ext: 'PDF',
  },
  {
    title: 'Перечень запасных частей',
    href: encodeURI('/docs/Перечень запасных частей ОАО КЭМЗ.pdf'),
    ext: 'PDF',
    note: 'Сканы; удобнее смотреть на десктопе',
  },
]

useSeoMeta({
  title: 'Документы | ОАО «КЭМЗ»',
  description:
    'Презентация, опросные листы и перечень ЗИП ОАО Карпинский электромашиностроительный завод',
})
</script>
