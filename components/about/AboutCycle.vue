<script setup lang="ts">
import { ABOUT_CYCLE, ABOUT_CYCLE_MEDIA } from "~/utils/aboutContent";
</script>

<template>
  <section class="abt-cycle" aria-labelledby="about-cycle-title">
    <div class="abt-cycle__inner">
      <div class="ref-container abt-cycle__head">
        <p class="ref-label">Производство</p>
        <h2 id="about-cycle-title" class="ref-title">
          Полный цикл на одной площадке
        </h2>
        <p class="ref-body">
          Все ключевые этапы, от разработки до испытаний, выполняются на
          территории завода.<br />Контролируем качество на каждом шаге и
          отвечаем за результат перед заказчиком.
        </p>
        <NuxtLink class="abt-text-link" to="/production"
          >Как мы работаем <span aria-hidden="true">→</span></NuxtLink
        >
      </div>
      <div class="abt-cycle__visual">
        <img
          class="abt-cycle__shaft"
          :src="ABOUT_CYCLE_MEDIA.image"
          :alt="ABOUT_CYCLE_MEDIA.imageAlt"
          width="2172"
          height="724"
          loading="lazy"
          decoding="async"
        />
      </div>
      <ol
        class="ref-container abt-cycle__steps"
        aria-label="Этапы производства"
      >
        <li v-for="step in ABOUT_CYCLE" :key="step.icon">
          <strong>{{ step.title }}</strong>
          <span>{{ step.text }}</span>
        </li>
      </ol>
    </div>
  </section>
</template>
