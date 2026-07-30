<template>
  <section class="chapter about-story">
    <div class="wrap">
      <div class="section-head">
        <div>
          <span class="section-tag">{{ ABOUT_STORY.tag }}</span>
          <h2>{{ ABOUT_STORY.title }}</h2>
        </div>
        <p>{{ ABOUT_STORY.lead }}</p>
      </div>

      <div class="about-story__grid">
        <div class="about-story__body">
          <p v-for="(paragraph, index) in ABOUT_STORY.body" :key="index">
            {{ paragraph }}
          </p>
        </div>
        <figure class="about-story__media">
          <img
            :src="ABOUT_STORY.imageSm"
            :srcset="`${ABOUT_STORY.imageSm} 640w, ${ABOUT_STORY.image} 960w`"
            sizes="(max-width: 900px) 100vw, 45vw"
            :alt="ABOUT_STORY.imageAlt"
            width="960"
            height="720"
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ABOUT_STORY } from '~/utils/aboutContent'
</script>
