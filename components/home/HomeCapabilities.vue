<script setup lang="ts">
// Verified in docs/brand-facts.md from «Возможности КЭМЗ.docx».
const capabilities = [
  {
    value: "150",
    unit: "кг",
    text: "чугунное литьё\nв песчаные формы",
    image: "drive-gearboxes",
    alt: "Корпусные литые детали, промышленная иллюстрация",
  },
  {
    value: "5000",
    unit: "мм",
    text: "максимальная длина\nобрабатываемого вала",
    image: "machined-steel-shaft",
    alt: "Обработанный стальной вал, промышленная иллюстрация",
  },
  {
    value: "1000 × 600 × 600",
    unit: "мм",
    text: "габариты изделий\nдля гальванической линии",
    image: "electric-machinery-shop",
    alt: "Промышленное оборудование в цехе, иллюстрация",
  },
  {
    value: "Сталь, чугун,\nалюминий, бронза",
    unit: "",
    text: "литьё и механическая\nобработка металлов",
    image: "machined-metal-components",
    alt: "Металлические детали после механической обработки, иллюстрация",
  },
];
</script>

<template>
  <section class="ref-capabilities" aria-labelledby="capabilities-title">
    <div class="ref-container ref-capabilities__grid">
      <div class="ref-capabilities__intro">
        <h2 id="capabilities-title">Производственные<br />возможности</h2>
        <p>
          Литьё, гальваника и механическая обработка деталей для электрических
          машин.
        </p>
        <HomeActionButton to="/production" compact on-dark
          >Все возможности</HomeActionButton
        >
      </div>
      <article
        v-for="(item, index) in capabilities"
        :key="item.image"
        class="ref-capability"
        :class="{ 'ref-capability--materials': index === 3 }"
      >
        <h3>
          {{ item.value }} <small>{{ item.unit }}</small>
        </h3>
        <p>{{ item.text }}</p>
        <div class="ref-capability__media">
          <img
            :src="`/media/generated/${item.image}-720.webp`"
            :srcset="`/media/generated/${item.image}-480.webp 480w, /media/generated/${item.image}-720.webp 720w`"
            sizes="(max-width: 720px) 50vw, (max-width: 1180px) 25vw, 300px"
            :alt="item.alt"
            width="720"
            height="480"
            loading="lazy"
            decoding="async"
          />
        </div>
      </article>
    </div>
  </section>
</template>
