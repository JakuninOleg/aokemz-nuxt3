<script setup lang="ts">
import { ABOUT_GEO_SITES } from "~/utils/aboutContent";
</script>

<template>
  <section class="abt-geo ref-container" aria-labelledby="about-geo-title">
    <header class="abt-geo__copy">
      <h2 id="about-geo-title" class="ref-title">География и доверие</h2>
      <p class="ref-body">
        Электрические машины для горнодобывающих предприятий России и СНГ.
      </p>
    </header>
    <div class="abt-geo__map">
      <img
        src="/media/about/about-geography-map.webp"
        alt="Карта географии поставок КЭМЗ по России и странам СНГ"
        width="1918"
        height="820"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="abt-geo__trust">
      <h3>Площадки эксплуатации</h3>
      <ul>
        <li v-for="site in ABOUT_GEO_SITES" :key="site">{{ site }}</li>
      </ul>
      <NuxtLink class="abt-text-link" to="/contacts"
        >Стать партнёром <span aria-hidden="true">→</span></NuxtLink
      >
    </div>
  </section>
</template>
