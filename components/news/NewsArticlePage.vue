<script setup lang="ts">
import { setResponseStatus } from "h3";
import type { ContentfulEntries as EntryCollection } from "~/utils/contentfulTypes";
import { renderContentfulHtml } from "~/utils/contentfulRichText";
import {
  NEWS_ARTICLE_FIGURE,
  contentfulImageUrl,
  formatNewsDate,
  newsArticleLeadFromHtml,
  type NewsArticleEntry,
} from "~/utils/newsContent";
import NewsCta from "./NewsCta.vue";
import { absoluteSiteUrl, breadcrumbJsonLd, canonicalUrl, newsArticleJsonLd } from "~/utils/siteSeo";

const route = useRoute();
const id = computed(() => String(route.params.new));

const {
  data: article,
  pending,
  error,
} = await useAsyncData(
  `news-article-${id.value}`,
  async () => {
    const { $contentful } = useNuxtApp();
    const response: EntryCollection<NewsArticleEntry> =
      await $contentful.getEntries({
        content_type: "news",
        "sys.id[in]": [id.value],
        limit: 1,
      });
    if (!response.items.length) {
      throw createError({ statusCode: 404, message: "Новость не найдена" });
    }
    return response.items[0];
  },
  { default: () => null },
);

if (import.meta.server && error.value?.statusCode === 404) {
  const event = useRequestEvent();
  if (event) setResponseStatus(event, 404);
}

const richTextHtml = computed(() =>
  article.value?.fields.htmlText
    ? renderContentfulHtml(article.value.fields.htmlText)
    : "",
);

const cmsImageUrl = computed(() =>
  contentfulImageUrl(article.value?.fields.image?.fields?.file?.url),
);

const cmsImageAlt = computed(
  () =>
    article.value?.fields.image?.fields?.description ||
    article.value?.fields.image?.fields?.title ||
    article.value?.fields.header ||
    "",
);

const figureSrc = computed(
  () => cmsImageUrl.value || NEWS_ARTICLE_FIGURE.image,
);
const figureAlt = computed(() =>
  cmsImageUrl.value ? cmsImageAlt.value : NEWS_ARTICLE_FIGURE.imageAlt,
);

const seoLead = computed(() =>
  richTextHtml.value ? newsArticleLeadFromHtml(richTextHtml.value) : "",
);

const dateLabel = computed(() =>
  article.value?.fields.date
    ? formatNewsDate(article.value.fields.date)
    : "",
);

useSeoMeta({
  robots: () => error.value?.statusCode === 404 ? "noindex, nofollow" : undefined,
  title: () =>
    article.value?.fields.header
      ? `${article.value.fields.header} | Новости ОАО «КЭМЗ»`
      : "Новость | ОАО «КЭМЗ»",
  description: () =>
    seoLead.value ||
    (article.value?.fields.header
      ? `${article.value.fields.header}. Новости ОАО «Карпинский электромашиностроительный завод».`
      : "Новость ОАО «КЭМЗ»."),
  ogType: "article",
  ogUrl: () => canonicalUrl(`/news/${id.value}`),
  ogImage: () => absoluteSiteUrl(cmsImageUrl.value),
  articlePublishedTime: () => article.value?.fields.date || undefined,
  twitterCard: "summary_large_image",
  twitterTitle: () => article.value?.fields.header ? `${article.value.fields.header} | Новости ОАО «КЭМЗ»` : "Новость | ОАО «КЭМЗ»",
  twitterDescription: () => seoLead.value || undefined,
  twitterImage: () => absoluteSiteUrl(cmsImageUrl.value),
});

useHead(() => {
  const headline = article.value?.fields.header;
  const datePublished = article.value?.fields.date;
  if (!headline || !datePublished) return {};
  const path = `/news/${id.value}`;
  const description = seoLead.value || undefined;
  const image = absoluteSiteUrl(cmsImageUrl.value);
  return {
    link: [{ rel: "canonical", href: canonicalUrl(path) }],
    script: [
      {
        key: "news-breadcrumb-jsonld",
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd([
            { name: "Главная", path: "/" },
            { name: "Новости", path: "/news" },
            { name: headline, path },
          ]),
        ),
      },
      {
        key: "news-article-jsonld",
        type: "application/ld+json",
        children: JSON.stringify(newsArticleJsonLd({ headline, path, datePublished, description, image })),
      },
    ],
  };
});
</script>

<template>
  <div class="kemz-home kemz-news">
    <template v-if="pending">
      <div class="ref-container news-article__status" role="status">
        Загрузка новости…
      </div>
    </template>

    <template v-else-if="error || !article">
      <div class="ref-container news-article__status">
        <p>{{ error?.message || "Новость не найдена" }}</p>
        <NuxtLink to="/news" class="news-article__back-btn">
          <span class="news-article__back-arrow" aria-hidden="true">←</span>
          Все новости
        </NuxtLink>
      </div>
    </template>

    <template v-else>
      <section
        class="news-hero news-hero--article internal-hero internal-hero--compact"
        :aria-labelledby="`news-article-title-${article.sys.id}`"
      >
        <div class="ref-container news-hero__content internal-hero__content">
          <nav class="news-hero__crumbs internal-hero__crumbs" aria-label="Хлебные крошки">
            <NuxtLink to="/">Главная</NuxtLink
            ><span aria-hidden="true">/</span>
            <NuxtLink to="/news">Новости</NuxtLink>
          </nav>

          <h1 :id="`news-article-title-${article.sys.id}`">
            {{ article.fields.header }}
          </h1>
        </div>
      </section>

      <article class="news-article">
        <div class="ref-container news-article__main">
          <time
            v-if="article.fields.date"
            class="news-article__date"
            :datetime="article.fields.date"
            >{{ dateLabel }}</time
          >

          <figure v-if="figureSrc" class="news-article__figure">
            <img
              :src="figureSrc"
              :alt="figureAlt"
              width="1280"
              height="720"
              fetchpriority="high"
              decoding="async"
            />
          </figure>

          <div
            v-if="richTextHtml"
            class="news-article__body"
            v-html="richTextHtml"
          />

          <NuxtLink to="/news" class="news-article__back-btn">
            <span class="news-article__back-arrow" aria-hidden="true">←</span>
            Все новости
          </NuxtLink>
        </div>
      </article>
    </template>

    <NewsCta />
  </div>
</template>

<style lang="scss" src="~/assets/css/home.scss"></style>
<style lang="scss" src="~/assets/css/news.scss"></style>
