<script setup lang="ts">
import type { NuxtError } from "#app";
import NotFoundPage from "~/components/error/NotFoundPage.vue";

const props = defineProps<{ error: NuxtError }>();
const isNotFound = computed(() => props.error.statusCode === 404);

useSeoMeta({
  title: isNotFound.value ? "Страница не найдена | ОАО «КЭМЗ»" : "Ошибка | ОАО «КЭМЗ»",
  robots: "noindex, nofollow",
});
</script>

<template>
  <NuxtLayout name="default">
    <NotFoundPage v-if="isNotFound" />
    <section v-else class="generic-error" aria-labelledby="generic-error-title">
      <div class="generic-error__inner">
        <p class="generic-error__code">{{ error.statusCode || 500 }}</p>
        <h1 id="generic-error-title">Ошибка загрузки страницы</h1>
        <p>Попробуйте открыть раздел ещё раз или перейдите в каталог продукции.</p>
        <HomeActionButton to="/products">Перейти в каталог</HomeActionButton>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.generic-error { display: grid; min-height: 60vh; place-items: center; padding: 64px 24px; background: #f4f9fd; color: #061638; }
.generic-error__inner { display: grid; max-width: 560px; gap: 20px; }
.generic-error__code { margin: 0; font: 700 clamp(72px, 14vw, 160px) / 0.8 "KEMZ Condensed", sans-serif; color: #082f52; }
.generic-error h1 { margin: 0; font: 700 clamp(34px, 5vw, 54px) / 1 "KEMZ Condensed", sans-serif; }
.generic-error p { margin: 0; font: 400 18px / 1.45 ProximaNova, sans-serif; }
</style>
