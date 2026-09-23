<script setup lang="ts">
import { HOME_STATS } from "~/utils/homeContent";
const facts = [
  { ...HOME_STATS[1], icon: "energy" },
  { ...HOME_STATS[4], icon: "pulse" },
  { value: "Россия и СНГ", label: "география поставок", icon: "globe" },
  {
    value: "Полный цикл",
    label: "Проектирование, производство, испытания",
    icon: "document",
  },
];
</script>

<template>
  <section class="ref-hero" aria-labelledby="home-title">
    <picture>
      <source
        media="(max-width: 480px)"
        srcset="/media/generated/hero-quarry-dragline-wide-v11-480.webp"
      />
      <source
        media="(max-width: 600px)"
        srcset="/media/generated/hero-quarry-dragline-wide-v11-640.webp"
      />
      <img
        class="ref-hero__image"
        src="/media/generated/hero-quarry-dragline-wide-v11.webp"
        sizes="100vw"
        width="1600"
        height="533"
        alt="Карьерный экскаватор ЭКГ в центре открытой выработки"
        fetchpriority="high"
        decoding="sync"
      />
    </picture>
    <div class="ref-container ref-hero__content">
      <p class="ref-hero__eyebrow">С 1960 года <span>|</span> Карпинск</p>
      <h1 id="home-title">
        Электрические<br />машины для<br />горнодобывающей<br />техники
      </h1>
      <p class="ref-hero__description">
        Проектируем, производим и испытываем двигатели и генераторы для
        экскаваторов, карьерных самосвалов и шахтной техники.
      </p>
      <div class="ref-hero__actions">
        <HomeActionButton to="/products" on-dark
          >Перейти в каталог</HomeActionButton
        >
      </div>
    </div>
  </section>
  <section class="ref-facts" aria-label="Оборудование и поставки">
    <div class="ref-container ref-facts__grid">
      <div v-for="fact in facts" :key="fact.value" class="ref-fact">
        <HomeEngineeringIcon :name="fact.icon" />
        <div>
          <strong>{{ fact.value }}</strong
          ><span>{{ fact.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
