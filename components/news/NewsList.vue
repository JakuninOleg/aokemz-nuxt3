<script setup lang="ts">
import {
  mapNewsEntry,
  type NewsArticleEntry,
  type NewsListItem,
} from "~/utils/newsContent";

const { $contentful } = useNuxtApp();

const {
  data: articles,
  pending,
  error,
  refresh,
} = await useAsyncData(
  "news-articles",
  async () => {
    const response = (await $contentful.getEntries({
      content_type: "news",
      order: "-fields.date",
    })) as { items: NewsArticleEntry[] };
    return response.items.map(mapNewsEntry);
  },
  { default: () => [] as NewsListItem[] },
);

const featured = computed(() => articles.value[0] ?? null);
const rest = computed(() => articles.value.slice(1));
</script>

<template>
  <section class="news-feed" aria-labelledby="news-feed-title">
    <h2 id="news-feed-title" class="visually-hidden">Лента новостей</h2>

    <div v-if="pending" class="news-feed__status ref-container" role="status">
      Загрузка новостей…
    </div>
    <div v-else-if="error" class="news-feed__status ref-container">
      <p>Не удалось загрузить новости завода.</p>
      <button type="button" class="news-feed__retry" @click="refresh()">
        Попробовать ещё раз →
      </button>
    </div>
    <div
      v-else-if="!articles.length"
      class="news-feed__status ref-container"
    >
      Новые публикации появятся в этом разделе.
    </div>

    <template v-else>
      <NuxtLink
        v-if="featured"
        :to="`/news/${featured.id}`"
        class="news-feature ref-container"
      >
        <div class="news-feature__media">
          <img
            v-if="featured.image"
            :src="featured.image"
            :alt="featured.imageAlt"
            width="960"
            height="640"
            fetchpriority="high"
            decoding="async"
          />
          <div v-else class="news-feature__placeholder" aria-hidden="true" />
        </div>
        <div class="news-feature__panel">
          <time :datetime="featured.date">{{ featured.dateLabel }}</time>
          <h3>{{ featured.title }}</h3>
          <span class="news-feature__more"
            >Читать новость <span aria-hidden="true">→</span></span
          >
        </div>
      </NuxtLink>

      <div v-if="rest.length" class="news-grid ref-container">
        <NuxtLink
          v-for="item in rest"
          :key="item.id"
          :to="`/news/${item.id}`"
          class="news-card"
        >
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.imageAlt"
            width="640"
            height="400"
            loading="lazy"
            decoding="async"
          />
          <div v-else class="news-card__placeholder" aria-hidden="true" />
          <div class="news-card__copy">
            <time :datetime="item.date">{{ item.dateLabel }}</time>
            <h3>{{ item.title }}</h3>
            <span class="news-card__more"
              >Читать новость <span aria-hidden="true">→</span></span
            >
          </div>
        </NuxtLink>
      </div>
    </template>
  </section>
</template>
