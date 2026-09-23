<script setup lang="ts">
import { ABOUT_PEOPLE } from "~/utils/aboutContent";

const titleLines = ABOUT_PEOPLE.title.split("\n");
</script>

<template>
  <section class="abt-people" aria-labelledby="about-people-title">
    <div class="abt-people__media">
      <img
        class="abt-people__image"
        :src="ABOUT_PEOPLE.image"
        :alt="ABOUT_PEOPLE.imageAlt"
        width="1600"
        height="900"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="abt-people__panel">
      <p class="ref-label">{{ ABOUT_PEOPLE.tag }}</p>
      <h2 id="about-people-title" class="ref-title">
        <template v-for="(line, i) in titleLines" :key="i">
          {{ line }}<br v-if="i < titleLines.length - 1" />
        </template>
      </h2>
      <p class="ref-body">{{ ABOUT_PEOPLE.text }}</p>
      <NuxtLink class="abt-text-link" :to="ABOUT_PEOPLE.cta.to"
        >{{ ABOUT_PEOPLE.cta.label }}
        <span aria-hidden="true">→</span></NuxtLink
      >
    </div>
  </section>
</template>
