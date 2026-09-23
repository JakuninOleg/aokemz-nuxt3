<script setup lang="ts">
import { HOME_GEO_REGIONS } from "~/utils/homeContent";
const customers = HOME_GEO_REGIONS.filter((region) => region.name !== "Экспорт")
  .flatMap((region) => region.sites)
  .slice(0, 6);
</script>

<template>
  <section
    class="ref-geography ref-container"
    aria-labelledby="geography-title"
  >
    <div class="ref-geography__copy">
      <p class="ref-label">География</p>
      <h2 id="geography-title" class="ref-title">
        КЭМЗ работает<br />там, где идёт добыча
      </h2>
      <p class="ref-body">
        Электрические машины для горнодобывающих предприятий России и зарубежных
        площадок.
      </p>
      <HomeActionButton to="/about">О заводе</HomeActionButton>
    </div>
    <div class="ref-geography__map">
      <picture>
        <source
          media="(max-width: 720px)"
          srcset="/media/generated/supply-geography-map-v2-800.webp"
        />
        <img
          src="/media/generated/supply-geography-map-v2.webp"
          alt="Карта поставок КЭМЗ: Карпинск, Россия, Казахстан, Узбекистан, Индия"
          width="1600"
          height="800"
          loading="lazy"
          decoding="async"
        />
      </picture>
    </div>
    <div class="ref-geography__trust">
      <h3>География эксплуатации</h3>
      <ul>
        <li v-for="customer in customers" :key="customer">{{ customer }}</li>
      </ul>
    </div>
  </section>
</template>
