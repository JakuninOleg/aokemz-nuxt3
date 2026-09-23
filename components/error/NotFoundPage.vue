<script setup lang="ts">
import NotFoundLeadForm from "./NotFoundLeadForm.vue";
</script>

<template>
  <section class="not-found-page" aria-labelledby="not-found-title">
    <img
      class="not-found-page__image"
      src="/media/error/not-found-engineering.webp"
      alt=""
      aria-hidden="true"
    />
    <div class="not-found-page__shade" aria-hidden="true" />

    <div class="not-found-page__inner">
      <div class="not-found-page__copy">
        <p class="not-found-page__number" aria-hidden="true">404</p>
        <h1 id="not-found-title" class="not-found-page__title">Страница не найдена</h1>
        <p class="not-found-page__lead">
          Возможно, страницу перенесли, удалили или адрес введён с ошибкой.
        </p>

        <p class="not-found-page__signal">Надёжные решения<br />для реальных задач</p>

        <div class="not-found-page__actions">
          <HomeActionButton to="/">Перейти на главную</HomeActionButton>
          <NuxtLink to="/products" class="not-found-page__catalog-link">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="m12 2 8 4.5v9L12 20l-8-4.5v-9L12 2Z" />
              <path d="m4 6.5 8 4.5 8-4.5M12 11v9" />
            </svg>
            Каталог продукции
          </NuxtLink>
        </div>
      </div>

      <NotFoundLeadForm class="not-found-page__form" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.not-found-page {
  position: relative;
  isolation: isolate;
  min-height: clamp(680px, calc(100vh - 88px), 850px);
  overflow: hidden;
  background: #e7f0f8;
  color: var(--home-ink, #061638);
}

.not-found-page__image,
.not-found-page__shade { position: absolute; inset: 0; width: 100%; height: 100%; }
.not-found-page__image { z-index: -2; object-fit: cover; object-position: center; }
.not-found-page__shade {
  z-index: -1;
  background: linear-gradient(90deg, rgba(248, 252, 255, 0.96) 0%, rgba(248, 252, 255, 0.9) 30%, rgba(248, 252, 255, 0.58) 39%, rgba(248, 252, 255, 0.08) 50%, transparent 58%);
}

.not-found-page__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 430px);
  gap: clamp(48px, 8vw, 160px);
  align-items: center;
  width: min(calc(100% - 80px), var(--home-container, 1360px));
  min-height: inherit;
  margin-inline: auto;
  padding-block: clamp(52px, 6vw, 100px);
}

.not-found-page__copy { max-width: 620px; }
.not-found-page__number {
  margin: 0;
  color: var(--home-navy, #082f52);
  font: 800 clamp(144px, 18vw, 270px) / 0.72 var(--home-heading, sans-serif);
  letter-spacing: -0.08em;
}
.not-found-page__title {
  max-width: 620px;
  margin: 38px 0 0;
  color: var(--home-navy, #082f52);
  font: 700 clamp(42px, 4.8vw, 68px) / 0.98 var(--home-heading, sans-serif);
  letter-spacing: -0.025em;
}
.not-found-page__lead {
  max-width: 500px;
  margin: 20px 0 0;
  color: var(--home-ink, #061638);
  font: 400 clamp(18px, 1.55vw, 24px) / 1.35 var(--home-body, sans-serif);
}
.not-found-page__signal {
  position: relative;
  margin: 42px 0 0;
  padding-left: 110px;
  color: var(--home-navy, #082f52);
  font: 600 15px / 1.3 var(--home-body, sans-serif);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.not-found-page__signal::before {
  position: absolute;
  top: 10px;
  left: 0;
  width: 88px;
  height: 1px;
  background: currentColor;
  content: "";
}
.not-found-page__actions { display: grid; width: min(100%, 290px); gap: 12px; margin-top: 40px; }
.not-found-page__catalog-link {
  display: flex;
  min-height: 52px;
  align-items: center;
  justify-content: center;
  gap: 11px;
  border: 1px solid var(--home-navy, #082f52);
  border-radius: var(--home-radius, 4px);
  color: var(--home-navy, #082f52);
  font: 600 15px / 1.2 var(--home-body, sans-serif);
  text-decoration: none;
  transition:
    background-color var(--kemz-motion-duration, 300ms) var(--kemz-motion-ease, ease),
    border-color var(--kemz-motion-duration, 300ms) var(--kemz-motion-ease, ease),
    box-shadow var(--kemz-motion-duration, 300ms) var(--kemz-motion-ease, ease),
    transform var(--kemz-motion-duration, 300ms) var(--kemz-motion-ease, ease);
}
.not-found-page__catalog-link:hover,
.not-found-page__catalog-link:focus-visible {
  border-color: var(--home-blue, #0056b9);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 9px 18px rgba(6, 22, 56, 0.13);
  transform: translateY(-2px);
}
.not-found-page__catalog-link svg {
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
  transition: transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: center;
}
.not-found-page__catalog-link:hover svg,
.not-found-page__catalog-link:focus-visible svg { transform: rotate(360deg); }
.not-found-page__form { width: 100%; }

@media (max-width: 900px) {
  .not-found-page { min-height: auto; }
  .not-found-page__inner { grid-template-columns: minmax(0, 1fr) minmax(310px, 390px); gap: 32px; width: min(calc(100% - 48px), var(--home-container, 1360px)); }
  .not-found-page__number { font-size: clamp(126px, 17vw, 180px); }
  .not-found-page__title { margin-top: 28px; }
}

@media (max-width: 720px) {
  .not-found-page__image { object-position: 56% center; }
  .not-found-page__shade { background: linear-gradient(180deg, rgba(248, 252, 255, 0.94) 0%, rgba(248, 252, 255, 0.82) 42%, rgba(248, 252, 255, 0.26) 62%, transparent 76%); }
  .not-found-page__inner { grid-template-columns: 1fr; gap: 38px; width: calc(100% - 32px); padding-block: 52px; }
  .not-found-page__number { font-size: clamp(128px, 39vw, 176px); }
  .not-found-page__title { margin-top: 26px; font-size: clamp(42px, 12vw, 58px); }
  .not-found-page__lead { max-width: 32ch; font-size: 18px; }
  .not-found-page__signal { margin-top: 32px; }
  .not-found-page__actions { margin-top: 30px; }
}
</style>
