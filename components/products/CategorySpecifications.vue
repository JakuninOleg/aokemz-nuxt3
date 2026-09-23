<script setup lang="ts">
import { catalogItem, type CatalogEntry } from "~/utils/catalog";
import { renderContentfulHtml } from "~/utils/contentfulRichText";
const props = defineProps<{ products: CatalogEntry[] }>();
const selected = defineModel<string>({ required: true });
const available = computed(() =>
  props.products.filter((item: CatalogEntry) =>
    item.fields.params?.content?.some(
      (node: { nodeType?: string; content?: unknown[] }) =>
        node.nodeType === "table" || node.content?.length,
    ),
  ),
);
const entry = computed(
  () =>
    available.value.find((item: CatalogEntry) => item.sys.id === selected.value) ||
    available.value[0],
);
const item = computed(() => (entry.value ? catalogItem(entry.value) : null));
const paramsHtml = computed(() =>
  renderContentfulHtml(entry.value?.fields.params),
);
watch(
  available,
  (list: CatalogEntry[]) => {
    if (!list.some((item: CatalogEntry) => item.sys.id === selected.value))
      selected.value = list[0]?.sys.id || "";
  },
  { immediate: true },
);
</script>

<template>
  <section
    v-if="item"
    id="category-specifications"
    class="ref-container category-specifications"
    aria-labelledby="category-spec-title"
  >
    <div class="category-specifications__heading">
      <h2 id="category-spec-title">Технические характеристики</h2>
      <label v-if="available.length > 1" for="category-model"
        >Модель или комплект
        <select id="category-model" v-model="selected">
          <option
            v-for="product in available"
            :key="product.sys.id"
            :value="product.sys.id"
          >
            {{ product.fields.name }}
          </option>
        </select>
      </label>
    </div>
    <div class="category-specifications__layout">
      <div class="category-specifications__data">
        <h3>{{ item.name }}</h3>
        <div
          class="category-specifications__table product-rich"
          role="region"
          :aria-label="`Технические данные: ${item.name}`"
          tabindex="0"
          v-html="paramsHtml"
        />
        <NuxtLink :to="item.href" class="category-text-link"
          >Описание и применение <span aria-hidden="true">→</span></NuxtLink
        >
      </div>
      <div class="category-specifications__visual">
        <NuxtLink
          :to="item.href"
          class="category-specifications__image"
          :aria-label="`Открыть: ${item.name}`"
        >
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.name"
            width="640"
            height="480"
            loading="lazy"
          />
          <span v-else>{{ item.name }}</span>
        </NuxtLink>
        <aside class="category-selection-help">
          <HomeEngineeringIcon name="design" />
          <div>
            <h3>Подбор под вашу задачу</h3>
            <p>
              Укажите модель техники, назначение привода и условия эксплуатации.
              Специалисты помогут уточнить состав оборудования.
            </p>
            <NuxtLink to="/contacts" class="category-text-link"
              >Обсудить подбор <span aria-hidden="true">→</span></NuxtLink
            >
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>
