<template>
  <section id="products" class="chapter">
    <div class="wrap">
      <div class="section-head">
        <div>
          <span class="section-tag">01 · Номенклатура</span>
          <h2>Пять направлений<br />одного завода</h2>
        </div>
        <p>
          Комплектуем главные и вспомогательные приводы. Подбираем исполнение под тип
          машины, мощность и условия эксплуатации.
        </p>
      </div>

      <div class="products-shell">
        <div class="product-tabs" role="tablist" aria-label="Направления продукции">
          <button
            v-for="(product, index) in HOME_PRODUCTS"
            :key="product.name"
            type="button"
            role="tab"
            class="product-tab"
            :class="{ active: activeProduct === index }"
            :aria-selected="activeProduct === index"
            @click="activeProduct = index"
          >
            <span>0{{ index + 1 }}</span>
            {{ product.name }}
          </button>
        </div>

        <div class="product-panel">
          <div class="product-copy">
            <span class="product-code">{{ currentProduct.code }}</span>
            <h3>{{ currentProduct.title }}</h3>
            <p>{{ currentProduct.description }}</p>
            <dl class="spec-list">
              <div v-for="spec in currentProduct.specs" :key="spec.label">
                <dt>{{ spec.label }}</dt>
                <dd>{{ spec.value }}</dd>
              </div>
            </dl>
            <NuxtLink to="/products" class="text-link">Открыть каталог <span>→</span></NuxtLink>
          </div>

          <div class="product-visual" aria-live="polite">
            <figure
              v-for="(product, index) in HOME_PRODUCTS"
              :key="product.image"
              class="product-slide"
              :class="{ active: activeProduct === index }"
              :aria-hidden="activeProduct !== index"
            >
              <img :src="product.image" :alt="product.alt" />
              <figcaption>{{ product.caption }}</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { HOME_PRODUCTS } from '~/utils/homeContent'

const activeProduct = ref(0)
const currentProduct = computed(() => HOME_PRODUCTS[activeProduct.value]!)
</script>
