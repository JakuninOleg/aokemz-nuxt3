<script setup lang="ts">
import { catalogItem, type CatalogEntry } from "~/utils/catalog";
const props = defineProps<{
  products: CatalogEntry[];
  hasDocuments: boolean;
}>();
const emit = defineEmits<{ inspect: [id: string] }>();
const selectedType = ref("");
const types = computed(() => [
  ...new Set(
    props.products
      .map((item) => item.fields.type?.trim())
      .filter((type): type is string => Boolean(type)),
  ),
]);
const items = computed(() =>
  props.products
    .map((entry) => ({
      ...catalogItem(entry),
      hasParams: Boolean(entry.fields.params?.content?.length),
    }))
    .filter((item) => !selectedType.value || item.type === selectedType.value),
);
watch(
  () => props.products,
  () => {
    selectedType.value = "";
  },
);
</script>

<template>
  <section
    id="equipment"
    class="category-equipment"
    aria-labelledby="equipment-title"
  >
    <div v-if="types.length > 1" class="category-types">
      <div
        class="ref-container category-types__inner"
        role="group"
        aria-label="Тип оборудования"
      >
        <span>Тип оборудования</span>
        <button
          type="button"
          :aria-pressed="!selectedType"
          @click="selectedType = ''"
        >
          Все
        </button>
        <button
          v-for="type in types"
          :key="type"
          type="button"
          :aria-pressed="selectedType === type"
          @click="selectedType = type"
        >
          {{ type }}
        </button>
      </div>
    </div>
    <div class="ref-container">
      <div class="category-equipment__head">
        <div>
          <h2 id="equipment-title">
            {{ selectedType || "Оборудование категории" }}
          </h2>
          <p>
            Выберите машину или комплект. Описание, состав и технические
            характеристики доступны в карточке оборудования.
          </p>
          <span class="category-equipment__count" aria-live="polite"
            >Позиций: {{ items.length }}</span
          >
        </div>
        <nav class="category-quicklinks" aria-label="Разделы категории">
          <a
            v-if="products.some((item) => item.fields.params?.content?.length)"
            href="#category-specifications"
            >Технические характеристики <span aria-hidden="true">→</span></a
          >
          <a v-if="hasDocuments" href="#category-documents"
            >Документация <span aria-hidden="true">→</span></a
          >
          <NuxtLink to="/contacts"
            >Запросить подбор <span aria-hidden="true">→</span></NuxtLink
          >
        </nav>
      </div>
      <ul v-if="items.length" class="category-equipment__grid">
        <li v-for="item in items" :key="item.id" class="category-machine">
          <NuxtLink :to="item.href" class="category-machine__link">
            <span v-if="item.type" class="category-machine__type">{{
              item.type
            }}</span>
            <h3>{{ item.name }}</h3>
            <div class="category-machine__image">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                width="480"
                height="360"
                loading="lazy"
              />
              <span v-else>Фото уточняется</span>
            </div>
            <span class="category-machine__more"
              >Подробнее <span aria-hidden="true">→</span></span
            >
          </NuxtLink>
          <a
            v-if="item.hasParams"
            class="category-machine__spec-link"
            href="#category-specifications"
            @click="emit('inspect', item.id)"
            >Характеристики</a
          >
        </li>
      </ul>
      <p v-else class="products-status">
        В этой категории пока нет опубликованных позиций.
      </p>
    </div>
  </section>
</template>
