<script setup lang="ts">
import { ABOUT_TODAY } from "~/utils/aboutContent";
</script>

<template>
  <section class="abt-today" aria-labelledby="about-today-title">
    <div class="abt-today__media">
      <img
        :src="ABOUT_TODAY.image"
        :alt="ABOUT_TODAY.imageAlt"
        width="1600"
        height="1000"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="abt-today__copy">
      <p class="ref-label">{{ ABOUT_TODAY.tag }}</p>
      <h2 id="about-today-title" class="ref-title">{{ ABOUT_TODAY.title }}</h2>
      <p class="ref-body">{{ ABOUT_TODAY.lead }}</p>
      <ul class="abt-today__points">
        <li v-for="point in ABOUT_TODAY.points" :key="point.title">
          <AboutOutlineIcon :name="point.icon" />
          <div>
            <strong>{{ point.title }}</strong>
            <span>{{ point.text }}</span>
          </div>
        </li>
      </ul>
      <NuxtLink class="abt-text-link" to="/production"
        >Подробнее о заводе <span aria-hidden="true">→</span></NuxtLink
      >
    </div>
  </section>
</template>
