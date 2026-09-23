<script setup lang="ts">
import { CONTACTS_HERO } from "~/utils/contactsContent";
</script>

<template>
  <section class="contacts-hero internal-hero internal-hero--mobile-surface" aria-labelledby="contacts-title">
    <img
      class="contacts-hero__image internal-hero__image"
      :src="CONTACTS_HERO.image"
      :alt="CONTACTS_HERO.imageAlt"
      width="1920"
      height="820"
      fetchpriority="high"
      decoding="async"
    />
    <div class="ref-container contacts-hero__content internal-hero__content">
      <nav class="contacts-hero__crumbs internal-hero__crumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/">Главная</NuxtLink><span aria-hidden="true">/</span
        ><span>Контакты</span>
      </nav>

      <h1 id="contacts-title">{{ CONTACTS_HERO.title }}</h1>

      <p class="contacts-hero__lead">{{ CONTACTS_HERO.lead }}</p>

      <p class="contacts-hero__rail" aria-hidden="true">
        <span class="contacts-hero__rail-line" />
        <span class="contacts-hero__rail-text">
          <span v-for="line in CONTACTS_HERO.rail" :key="line">{{ line }}</span>
        </span>
      </p>
    </div>
  </section>
</template>
