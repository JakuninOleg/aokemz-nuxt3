<script setup lang="ts">
const stages = [
  { icon: "design", title: "Проектирование\nи инженерные расчёты" },
  { icon: "cast", title: "Заготовка: штамповка, литьё, сварка" },
  { icon: "gear", title: "Механообработка, обмотка, пропитка" },
  { icon: "assembly", title: "Сборка" },
  { icon: "test", title: "Испытания и контроль качества" },
];
</script>

<template>
  <section
    class="ref-production ref-container"
    aria-labelledby="production-title"
  >
    <div class="ref-production__copy">
      <p class="ref-label">Производство</p>
      <h2 id="production-title" class="ref-title">
        Инженерия<br />в реальном<br />масштабе
      </h2>
      <p class="ref-body">
        Полный цикл на одной площадке: от проектирования до испытаний.
        Конструкторский отдел, литьё, механообработка и сборка в Карпинске.
      </p>
      <HomeActionButton to="/production">О производстве</HomeActionButton>
    </div>
    <picture>
      <source
        media="(max-width: 900px)"
        srcset="/media/generated/production-steel-rotor-v1-720.webp"
      />
      <img
        class="ref-production__image"
        src="/media/generated/production-steel-rotor-v1.webp"
        alt="Стальной ротор электрической машины в цехе, промышленная иллюстрация"
        width="1200"
        height="800"
        loading="lazy"
      />
    </picture>
    <ol class="ref-production__stages">
      <li v-for="stage in stages" :key="stage.icon">
        <HomeEngineeringIcon :name="stage.icon" /><span>{{ stage.title }}</span>
      </li>
    </ol>
  </section>
</template>
