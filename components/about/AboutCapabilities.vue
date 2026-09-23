<script setup lang="ts">
import { ABOUT_CAPABILITIES } from "~/utils/aboutContent";
</script>

<template>
  <section class="abt-caps ref-container" aria-labelledby="about-caps-title">
    <div class="abt-caps__head">
      <p class="ref-label">Возможности</p>
      <h2 id="about-caps-title" class="ref-title">
        Производственные возможности
      </h2>
      <NuxtLink class="abt-text-link" to="/production"
        >Все возможности <span aria-hidden="true">→</span></NuxtLink
      >
    </div>
    <ul class="abt-caps__grid">
      <li v-for="item in ABOUT_CAPABILITIES" :key="item.value">
        <img
          :src="item.image"
          :alt="item.alt"
          width="1200"
          height="800"
          loading="lazy"
          decoding="async"
        />
        <div class="abt-caps__meta">
          <strong
            >{{ item.value
            }}<small v-if="item.unit"> {{ item.unit }}</small></strong
          >
          <span class="abt-caps__description">{{ item.text }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>
