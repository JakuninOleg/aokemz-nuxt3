<script setup lang="ts">
import {
  PRODUCTION_CAPABILITIES,
  PRODUCTION_CTA,
  PRODUCTION_GALLERY,
  PRODUCTION_HERO,
  PRODUCTION_QUALITY,
  PRODUCTION_STAGES,
} from "~/utils/productionContent";
</script>

<template>
  <main class="kemz-home kemz-production">
    <section class="production-hero internal-hero internal-hero--mobile-surface internal-hero--mobile-about" aria-labelledby="production-title">
      <picture>
        <source media="(max-width: 767px)" :srcset="PRODUCTION_HERO.mobileImage" />
        <img
          class="production-hero__image internal-hero__image"
          :src="PRODUCTION_HERO.image"
          :alt="PRODUCTION_HERO.imageAlt"
          width="1280"
          height="720"
          fetchpriority="high"
          decoding="async"
        />
      </picture>
      <div class="ref-container production-hero__content internal-hero__content">
        <nav class="production-hero__crumbs internal-hero__crumbs" aria-label="Хлебные крошки">
          <NuxtLink to="/">Главная</NuxtLink><span aria-hidden="true">/</span
          ><span>Производство</span>
        </nav>

        <h1 id="production-title">{{ PRODUCTION_HERO.title }}</h1>
        <p class="production-hero__lead">{{ PRODUCTION_HERO.lead }}</p>

        <p class="production-hero__rail" aria-hidden="true">
          <span class="production-hero__rail-line" />
          <span class="production-hero__rail-text">
            <span v-for="line in PRODUCTION_HERO.rail" :key="line">{{
              line
            }}</span>
          </span>
        </p>

        <ul class="production-hero__points" aria-label="Ориентиры производства">
          <li v-for="point in PRODUCTION_HERO.points" :key="point.title">
            <ProductionLineIcon :name="point.icon" />
            <span>{{ point.title }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section
      class="production-section ref-container"
      aria-labelledby="production-stages-title"
    >
      <div class="production-section__head">
        <div>
          <h2 id="production-stages-title">Этапы производства</h2>
          <p>
            От конструкции до стенда: ключевые процессы площадки в Карпинске.
          </p>
        </div>
        <NuxtLink to="/products" class="production-link"
          >Подробнее <span aria-hidden="true">→</span></NuxtLink
        >
      </div>
      <ol class="production-stages">
        <li v-for="stage in PRODUCTION_STAGES" :key="stage.number">
          <div class="production-stages__media">
            <img
              :src="stage.image"
              :alt="stage.alt"
              width="800"
              height="600"
              loading="lazy"
              decoding="async"
            />
            <strong>{{ stage.number }}</strong>
          </div>
          <h3>{{ stage.title }}</h3>
          <p>{{ stage.text }}</p>
        </li>
      </ol>
    </section>

    <section
      class="production-section ref-container"
      aria-labelledby="production-capabilities-title"
    >
      <div class="production-inline-head">
        <h2 id="production-capabilities-title">Производственные возможности</h2>
        <NuxtLink to="/products" class="production-link"
          >Подробнее <span aria-hidden="true">→</span></NuxtLink
        >
      </div>
      <ul class="production-capabilities">
        <li v-for="item in PRODUCTION_CAPABILITIES" :key="item.value">
          <ProductionLineIcon :name="item.icon" />
          <h3>{{ item.value }}</h3>
          <p>{{ item.label }}</p>
        </li>
      </ul>
    </section>

    <section
      class="production-section ref-container"
      aria-labelledby="production-gallery-title"
    >
      <h2 id="production-gallery-title">Наше производство</h2>
      <div class="production-gallery">
        <figure
          v-for="item in PRODUCTION_GALLERY"
          :key="item.title"
          :class="{ 'is-featured': item.featured }"
        >
          <img
            :src="item.image"
            :alt="item.alt"
            width="1200"
            height="800"
            loading="lazy"
            decoding="async"
          />
          <figcaption>{{ item.title }}</figcaption>
        </figure>
      </div>
    </section>

    <section class="production-quality" aria-labelledby="quality-title">
      <div class="ref-container production-quality__grid">
        <div>
          <h2 id="quality-title">Контроль качества</h2>
          <p>
            Машины проходят электрические и механические испытания на стендах
            завода. Продукция соответствует требованиям ГОСТ и ТУ.
          </p>
        </div>
        <ul>
          <li v-for="item in PRODUCTION_QUALITY" :key="item.title">
            <ProductionLineIcon :name="item.icon" />
            <span>{{ item.title }}</span>
          </li>
        </ul>
      </div>
    </section>

    <HomeCtaBand
      :title="PRODUCTION_CTA.title"
      :lead="PRODUCTION_CTA.lead"
      :image="PRODUCTION_CTA.image"
      :image-alt="PRODUCTION_CTA.imageAlt"
      :button-label="PRODUCTION_CTA.button"
      :aside="PRODUCTION_CTA.aside"
      title-id="production-cta-title"
    />
  </main>
</template>

<style lang="scss" src="~/assets/css/home.scss"></style>
<style lang="scss" src="~/assets/css/production.scss"></style>
