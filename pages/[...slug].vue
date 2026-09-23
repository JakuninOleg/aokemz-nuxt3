<script setup lang="ts">
import { setResponseStatus } from "h3";
import NotFoundPage from "~/components/error/NotFoundPage.vue";

if (import.meta.server) {
  const event = useRequestEvent();
  if (event) setResponseStatus(event, 404);
}

useSeoMeta({
  title: "Страница не найдена | ОАО «КЭМЗ»",
  robots: "noindex, nofollow",
});
</script>

<template>
  <NotFoundPage />
</template>
