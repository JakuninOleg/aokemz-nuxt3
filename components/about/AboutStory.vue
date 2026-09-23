<script setup lang="ts">
import { ABOUT_STORY } from "~/utils/aboutContent";

const titleLines = ABOUT_STORY.title.split("\n");
const [mainImage] = ABOUT_STORY.images;
</script>

<template>
  <section
    id="history"
    class="abt-story ref-container"
    aria-labelledby="about-story-title"
  >
    <div class="abt-story__copy">
      <p class="ref-label">{{ ABOUT_STORY.tag }}</p>
      <h2 id="about-story-title" class="ref-title">
        <template v-for="(line, i) in titleLines" :key="i">
          {{ line }}<br v-if="i < titleLines.length - 1" />
        </template>
      </h2>
      <p class="ref-body">{{ ABOUT_STORY.lead }} {{ ABOUT_STORY.body[0] }}</p>
      <p
        v-for="(paragraph, index) in ABOUT_STORY.body.slice(1)"
        :key="index"
        class="abt-story__p"
      >
        {{ paragraph }}
      </p>
    </div>
    <div class="abt-story__media">
      <figure class="abt-story__main">
        <img
          :src="mainImage.src"
          :alt="mainImage.alt"
          width="1200"
          height="900"
          loading="lazy"
          decoding="async"
        />
        <figcaption>{{ mainImage.caption }}</figcaption>
      </figure>
      <div class="abt-story__side">
        <div class="abt-story__archive">
          <figure>
            <img
              src="/media/about/about-history-1960.webp"
              alt="Историческая иллюстрация работы сборочного цеха"
              width="1206"
              height="1305"
              loading="lazy"
            />
            <figcaption>У истоков завода</figcaption>
          </figure>
          <div class="abt-story__lettering">
            Люди<br />Технологии<br />Развитие<em
              >Карпинск<br />КЭМЗ<br />1960</em
            >
          </div>
        </div>
        <figure>
          <img
            :src="'/media/about/about-history-aerial.webp'"
            alt="Иллюстрация промышленной площадки в стилистике архивной фотографии"
            width="1536"
            height="1024"
            loading="lazy"
          />
          <figcaption>От мастерских к заводу</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
