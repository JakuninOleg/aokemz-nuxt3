<template>
  <section id="geography" class="chapter geography">
    <div class="wrap">
      <div class="section-head">
        <div>
          <span class="section-tag">04 · География поставок</span>
          <h2>Работает там,<br />где идёт добыча</h2>
        </div>
        <p>
          Оборудование КЭМЗ стоит на карьерных и шахтных площадках России и поставляется
          в страны СНГ и дальнее зарубежье.
        </p>
      </div>

      <div class="geo-layout">
        <HomeSupplyMap />

        <div class="geo-regions">
          <article v-for="region in HOME_GEO_REGIONS" :key="region.name">
            <span class="geo-region-tag">{{ region.name }}</span>
            <ul>
              <li v-for="site in region.sites" :key="site">{{ site }}</li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { HOME_GEO_REGIONS } from '~/utils/homeContent'
</script>
