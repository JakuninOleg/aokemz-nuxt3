<template>
  <section class="hero">
    <img
      src="/media/hero-excavator-schematic-640.webp"
      srcset="
        /media/hero-excavator-schematic-640.webp 640w,
        /media/hero-excavator-schematic.webp 960w
      "
      sizes="100vw"
      alt=""
      class="hero-schematic"
      width="960"
      height="640"
      decoding="async"
      fetchpriority="high"
      aria-hidden="true"
    />
    <div class="wrap hero-front">
      <div class="hero-copy">
        <p class="eyebrow">Карпинск · с 1960 года</p>
        <h1>
          Электрические машины<br />
          <em>для карьера</em><br />
          и шахты
        </h1>
        <p class="hero-lead">
          Двигатели, генераторы и комплектные приводы для ЭКГ, ЭШ, буровых установок
          и шахтного оборудования.
        </p>
        <div class="hero-actions">
          <NuxtLink to="/products" class="button button-solid">Перейти в каталог</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: '/media/hero-excavator-schematic-640.webp',
      type: 'image/webp',
      imagesrcset:
        '/media/hero-excavator-schematic-640.webp 640w, /media/hero-excavator-schematic.webp 960w',
      imagesizes: '100vw',
    },
  ],
})
</script>
