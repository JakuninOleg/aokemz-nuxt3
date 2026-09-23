<script setup lang="ts">
type Category = {
  sys: { id: string };
  fields: { url: string; Name: string; display: boolean };
};
const { $contentful } = useNuxtApp();
const { data: categories } = await useAsyncData(
  "home-reference-categories",
  async () => {
    const result = (await $contentful.getEntries({
      content_type: "Category",
    })) as { items: Category[] };
    return result.items
      .filter((item) => item.fields.display)
      .map((item) => ({ name: item.fields.Name, url: item.fields.url }));
  },
  { default: () => [] },
);
const products = [
  {
    title: "Экскаваторное\nоборудование",
    text: "Машины постоянного/\nпеременного тока\nдля ЭКГ и ЭШ",
    image: "hero-quarry-dragline",
    match: "экскават",
    theme: "dark",
    alt: "Карьерный экскаватор, иллюстрация применения электрических машин",
  },
  {
    title: "Буровые\nустановки",
    text: "Двигатели и тормоза\nдля бурового оборудования",
    image: "drilling-rig-quarry",
    match: "буров",
    theme: "light",
    alt: "Буровая установка в карьере, промышленная иллюстрация",
  },
  {
    title: "Шахтное\nоборудование",
    text: "Электрические машины\nдля подземных условий",
    image: "underground-mine-rail",
    match: "шахт",
    theme: "dark",
    alt: "Подземная выработка с рельсовым транспортом, промышленная иллюстрация",
  },
  {
    title: "Железнодорожный\nтранспорт",
    text: "Тяговые машины\nи аппаратура",
    image: "mine-locomotive",
    match: "железнодорож",
    theme: "light",
    alt: "Промышленный локомотив, иллюстрация применения тяговых машин",
  },
  {
    title: "Высоковольтная\nаппаратура",
    text: "Оборудование\nна 27,5 и 35 кВ",
    image: "high-voltage-switchgear",
    match: "высоковольт",
    theme: "light",
    alt: "Высоковольтное распределительное оборудование, промышленная иллюстрация",
  },
];
const tiles = computed(() =>
  products.map((product) => {
    const category = categories.value.find((item) =>
      item.name?.toLowerCase().includes(product.match),
    );
    return {
      ...product,
      href: category ? `/products/${category.url}` : "/products",
    };
  }),
);
</script>

<template>
  <section class="ref-showcase" aria-labelledby="products-title">
    <header class="ref-container ref-showcase__heading">
      <div>
        <p class="ref-label">Направления деятельности</p>
        <h2 id="products-title" class="ref-title">
          Оборудование<br />для ключевых задач
        </h2>
      </div>
      <p class="ref-showcase__intro">
        Электрические машины и комплектующие<br />для горнодобывающей
        промышленности и транспортной отрасли.
      </p>
      <NuxtLink to="/products" class="ref-link"
        >Смотреть всю продукцию <span aria-hidden="true">→</span></NuxtLink
      >
    </header>
    <div class="ref-wide ref-showcase__grid">
      <NuxtLink
        v-for="(product, index) in tiles"
        :key="product.image"
        :to="product.href"
        class="ref-product"
        :class="[
          `ref-product--${product.theme}`,
          { 'ref-product--featured': index === 0 },
        ]"
      >
        <img
          :src="`/media/generated/${product.image}-720.webp`"
          :srcset="`/media/generated/${product.image}-480.webp 480w, /media/generated/${product.image}-720.webp 720w`"
          sizes="(max-width: 720px) 100vw, (max-width: 1180px) 50vw, 720px"
          :alt="product.alt"
          width="720"
          height="480"
          loading="lazy"
          decoding="async"
        />
        <div class="ref-product__copy">
          <h3>{{ product.title }}</h3>
          <p>{{ product.text }}</p>
        </div>
        <span class="ref-product__more"
          >Подробнее <span aria-hidden="true">→</span></span
        >
      </NuxtLink>
    </div>
  </section>
</template>
