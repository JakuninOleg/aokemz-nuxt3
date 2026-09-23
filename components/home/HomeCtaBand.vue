<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    lead: string;
    image: string;
    imageAlt: string;
    buttonLabel: string;
    buttonTo?: string;
    /** Lines shown at the right with a blue accent stripe. */
    aside?: readonly string[];
    titleId?: string;
  }>(),
  {
    buttonTo: "/contacts",
    titleId: "ref-cta-title",
    aside: () => [],
  },
);
</script>

<template>
  <section class="ref-photo-cta" :aria-labelledby="titleId">
    <img
      class="ref-photo-cta__image"
      :src="image"
      :alt="imageAlt"
      width="2048"
      height="700"
      loading="lazy"
      decoding="async"
    />
    <div class="ref-container ref-photo-cta__inner">
      <div class="ref-photo-cta__copy">
        <h2 :id="titleId">{{ title }}</h2>
        <p>{{ lead }}</p>
        <div class="ref-photo-cta__actions">
          <HomeActionButton :to="buttonTo" on-dark>{{
            buttonLabel
          }}</HomeActionButton>
        </div>
      </div>
      <ul v-if="aside?.length" class="ref-photo-cta__aside" aria-hidden="true">
        <li v-for="item in aside" :key="item">{{ item }}</li>
      </ul>
    </div>
  </section>
</template>
