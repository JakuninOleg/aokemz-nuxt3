<template>
  <section class="chapter about-gallery" aria-label="Производство">
    <div class="wrap">
      <div class="section-head">
        <div>
          <span class="section-tag">05 · Площадка в кадре</span>
          <h2>Цех, сборка,<br />испытания</h2>
        </div>
        <p>Фотографии площадки ОАО «КЭМЗ» в Карпинске.</p>
      </div>

      <div class="about-gallery__grid">
        <figure v-for="photo in ABOUT_GALLERY" :key="photo.src">
          <img
            :src="photo.srcSm"
            :srcset="`${photo.srcSm} 480w, ${photo.src} 800w`"
            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
            :alt="photo.alt"
            width="800"
            height="600"
            loading="lazy"
            decoding="async"
          />
          <figcaption>{{ photo.caption }}</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ABOUT_GALLERY } from '~/utils/aboutContent'
</script>
