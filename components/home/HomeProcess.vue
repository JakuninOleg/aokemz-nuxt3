<template>
  <section id="process" class="chapter process">
    <div class="wrap">
      <div class="section-head">
        <div>
          <span class="section-tag">02 · Цикл производства</span>
          <h2>От задания<br />до испытаний</h2>
        </div>
        <p>
          Конструкторский отдел, заготовительные операции, механообработка, сборка
          и стенды находятся на площадке в Карпинске.
        </p>
      </div>

      <ol class="process-list">
        <li v-for="(step, index) in HOME_PROCESS" :key="step.title">
          <span class="step-number">0{{ index + 1 }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </li>
      </ol>

      <div class="process-gallery">
        <figure v-for="photo in HOME_PROCESS_PHOTOS" :key="photo.src">
          <img
            :src="photo.src"
            :alt="photo.alt"
            width="800"
            height="600"
            loading="lazy"
            decoding="async"
          />
          <figcaption>{{ photo.caption }}</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { HOME_PROCESS, HOME_PROCESS_PHOTOS } from '~/utils/homeContent'
</script>
