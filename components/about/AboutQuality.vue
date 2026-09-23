<script setup lang="ts">
import { ABOUT_QUALITY } from "~/utils/aboutContent";

const titleLines = ABOUT_QUALITY.title.split("\n");
</script>

<template>
  <section class="abt-quality" aria-labelledby="about-quality-title">
    <div class="ref-container abt-quality__inner">
      <div class="abt-quality__card">
        <p class="ref-label">{{ ABOUT_QUALITY.tag }}</p>
        <h2 id="about-quality-title" class="ref-title">
          <template v-for="(line, i) in titleLines" :key="i">
            {{ line }}<br v-if="i < titleLines.length - 1" />
          </template>
        </h2>
        <p>{{ ABOUT_QUALITY.text }}</p>
        <HomeActionButton :to="ABOUT_QUALITY.cta.to">{{
          ABOUT_QUALITY.cta.label
        }}</HomeActionButton>
      </div>
      <img
        class="abt-quality__image"
        :src="ABOUT_QUALITY.image"
        :alt="ABOUT_QUALITY.imageAlt"
        width="1918"
        height="820"
        loading="lazy"
        decoding="async"
      />
      <ul class="abt-quality__points">
        <li v-for="point in ABOUT_QUALITY.points" :key="point.title">
          <HomeEngineeringIcon :name="point.icon" />
          <span>{{ point.title }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
