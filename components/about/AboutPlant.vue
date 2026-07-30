<template>
  <section class="chapter about-plant">
    <div class="wrap">
      <div class="section-head">
        <div>
          <span class="section-tag">03 · Площадка</span>
          <h2>Участки и<br />размеры деталей</h2>
        </div>
        <p>
          Параметры по документам производственной площадки. Технологию согласуем по чертежу.
        </p>
      </div>

      <div class="about-plant__grid">
        <article v-for="item in ABOUT_PLANT" :key="item.title">
          <span>{{ item.tag }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ABOUT_PLANT } from '~/utils/aboutContent'
</script>
