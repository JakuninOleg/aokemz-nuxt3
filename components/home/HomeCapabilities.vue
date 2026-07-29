<template>
  <section id="capabilities" class="chapter capabilities">
    <div class="wrap">
      <div class="section-head">
        <div>
          <span class="section-tag">03 · Производственные возможности</span>
          <h2>Участки и<br />размеры деталей</h2>
        </div>
        <p>
          Параметры приведены по документам производственной площадки. Конкретную
          технологию согласуем по чертежу.
        </p>
      </div>

      <div class="capability-grid">
        <article v-for="item in HOME_CAPABILITIES" :key="item.title">
          <span>{{ item.tag }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { HOME_CAPABILITIES } from '~/utils/homeContent'
</script>
