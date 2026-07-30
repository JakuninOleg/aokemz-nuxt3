<template>
  <div class="kemz-light">
    <header class="cat-hero">
      <div class="wrap">
        <p class="section-tag cat-hero__tag">Материалы</p>
        <h1>Документы</h1>
        <p class="cat-hero__lead">
          Презентация, возможности завода и опросные листы. Файлы открываются в новой вкладке.
        </p>
      </div>
    </header>

    <div class="cat-body">
      <div class="wrap">
        <ul class="cat-files">
          <li v-for="doc in docs" :key="doc.href" class="cat-files__item">
            <a
              class="cat-files__link"
              :href="doc.href"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="cat-files__ext">{{ doc.ext }}</span>
              <span>
                <span class="cat-files__title">{{ doc.title }}</span>
                <span v-if="doc.note" class="cat-files__note">{{ doc.note }}</span>
              </span>
            </a>
          </li>
        </ul>

        <NuxtLink to="/contacts" class="text-link cat-detail__back cat-detail__back--end">
          ← Контакты отдела продаж
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PAGE_SEO } from '~/utils/siteSeo'

const docs = [
  {
    title: 'Презентация / каталог ОАО «КЭМЗ»',
    href: '/docs/kemz-catalog.pdf',
    ext: 'PDF',
    note: 'Номенклатура, комплекты, ТТХ',
  },
  {
    title: 'Возможности завода',
    href: '/docs/kemz-capabilities.docx',
    ext: 'DOCX',
    note: 'Литьё, гальваника, механообработка',
  },
  {
    title: 'Опросный лист на электрические машины',
    href: '/docs/kemz-questionnaire-machines.pdf',
    ext: 'PDF',
  },
  {
    title: 'Опросный лист высоковольтной аппаратуры',
    href: '/docs/kemz-questionnaire-hv.pdf',
    ext: 'PDF',
  },
  {
    title: 'Перечень запасных частей',
    href: '/docs/kemz-spare-parts.pdf',
    ext: 'PDF',
    note: 'Сканы; удобнее смотреть на десктопе',
  },
]

usePageSeo(PAGE_SEO.documents)
</script>

<style lang="scss" src="~/assets/css/catalog-light.scss"></style>
