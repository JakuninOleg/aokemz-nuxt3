<script setup lang="ts">
import AboutHero from "./AboutHero.vue";
import AboutTimeline from "./AboutTimeline.vue";
import AboutToday from "./AboutToday.vue";
import AboutStory from "./AboutStory.vue";
import AboutPeople from "./AboutPeople.vue";
import AboutCycle from "./AboutCycle.vue";
import AboutCapabilities from "./AboutCapabilities.vue";
import AboutQuality from "./AboutQuality.vue";
import AboutGeography from "./AboutGeography.vue";
import AboutCta from "./AboutCta.vue";
</script>

<template>
  <div class="kemz-home kemz-about">
    <AboutHero />
    <AboutTimeline />
    <AboutToday />
    <AboutStory />
    <AboutPeople />
    <AboutCycle />
    <AboutCapabilities />
    <AboutQuality />
    <AboutGeography />
    <AboutCta />
  </div>
</template>

<style lang="scss" src="~/assets/css/home.scss"></style>
<style lang="scss" src="~/assets/css/about.scss"></style>
