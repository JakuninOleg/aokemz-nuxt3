<template>
  <section class="chapter about-cycle">
    <div class="wrap">
      <div class="section-head">
        <div>
          <span class="section-tag">02 · Производственный цикл</span>
          <h2>От задания<br />до стенда</h2>
        </div>
        <p>
          Конструкция, заготовка, сборка и испытания идут на одной площадке в Карпинске.
        </p>
      </div>

      <ol class="about-cycle__list">
        <li v-for="(step, index) in ABOUT_CYCLE" :key="step.title">
          <span class="about-cycle__num">0{{ index + 1 }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ABOUT_CYCLE } from '~/utils/aboutContent'
</script>
