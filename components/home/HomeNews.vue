<script setup lang="ts">
import { contentfulImageUrl } from "~/utils/newsContent";

type Article = {
  sys: { id: string };
  fields: {
    header: string;
    date: string;
    image?: { fields?: { file?: { url?: string } } };
  };
};
const { $contentful } = useNuxtApp();
const {
  data: articles,
  error,
  status,
  refresh,
} = await useAsyncData(
  "home-latest-news",
  async () => {
    const result = (await $contentful.getEntries({
      content_type: "news",
      order: "-fields.date",
      limit: 3,
    })) as { items: Article[] };
    return result.items.map((article) => {
      const url = contentfulImageUrl(article.fields.image?.fields?.file?.url, {
        width: 900,
      });
      return {
        id: article.sys.id,
        title: article.fields.header,
        date: article.fields.date,
        image: url,
        dateLabel: new Intl.DateTimeFormat("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(article.fields.date)),
      };
    });
  },
  { default: () => [] },
);
</script>

<template>
  <section class="ref-news ref-container" aria-labelledby="news-title">
    <header>
      <h2 id="news-title" class="ref-title">Новости</h2>
      <NuxtLink to="/news" class="ref-link"
        >Все новости <span aria-hidden="true">→</span></NuxtLink
      >
    </header>
    <p v-if="status === 'pending'" class="ref-news__status" role="status">
      Загрузка новостей…
    </p>
    <div v-else-if="error" class="ref-news__status">
      <p>Не удалось загрузить новости завода.</p>
      <button type="button" class="ref-link" @click="refresh()">
        Попробовать ещё раз →
      </button>
    </div>
    <div v-else-if="articles.length" class="ref-news__grid">
      <NuxtLink
        v-for="(article, index) in articles"
        :key="article.id"
        :to="`/news/${article.id}`"
        class="ref-news__item"
        :class="{ 'ref-news__item--featured': index === 0 }"
        ><img
          v-if="article.image"
          :src="article.image"
          :alt="article.title"
          width="900"
          height="600"
          loading="lazy"
        />
        <div class="ref-news__copy">
          <time :datetime="article.date">{{ article.dateLabel }}</time>
          <h3>{{ article.title }}</h3>
          <span class="ref-news__more"
            >Читать <span aria-hidden="true">→</span></span
          >
        </div></NuxtLink
      >
    </div>
    <p v-else class="ref-news__status">
      Новые публикации появятся в разделе новостей.
    </p>
  </section>
</template>
