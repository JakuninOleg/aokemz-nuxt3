<template>
  <section class="chapter about-lines">
    <div class="wrap">
      <div class="section-head">
        <div>
          <span class="section-tag">04 · Направления</span>
          <h2>Пять линий<br />одного завода</h2>
        </div>
        <p>
          Комплекты и машины под тип оборудования, мощность и условия эксплуатации.
        </p>
      </div>

      <ul class="about-lines__list">
        <li v-for="line in ABOUT_LINES" :key="line.title">
          <span class="about-lines__code">{{ line.code }}</span>
          <div>
            <h3>{{ line.title }}</h3>
            <p>{{ line.text }}</p>
          </div>
        </li>
      </ul>

      <NuxtLink to="/products" class="text-link">Открыть каталог <span>→</span></NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ABOUT_LINES } from '~/utils/aboutContent'
</script>
