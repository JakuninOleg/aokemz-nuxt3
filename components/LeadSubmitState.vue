<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from "vue";

const props = defineProps<{
  state: "sending" | "success";
}>();

const heading = useTemplateRef<HTMLHeadingElement>("heading");

watch(
  () => props.state,
  async () => {
    await nextTick();
    heading.value?.focus();
  },
  { flush: "post", immediate: true },
);
</script>

<template>
  <section
    class="lead-submit-state"
    :class="`lead-submit-state--${state}`"
    :aria-busy="state === 'sending'"
    aria-live="polite"
    aria-atomic="true"
  >
    <template v-if="state === 'sending'">
      <div class="lead-submit-state__spinner" aria-hidden="true" />
      <h2 ref="heading" class="lead-submit-state__title" tabindex="-1">
        Отправляем вашу заявку…
      </h2>
      <p class="lead-submit-state__text">
        Пожалуйста, подождите. Это займёт несколько секунд.
      </p>
    </template>

    <template v-else>
      <div class="lead-submit-state__check" aria-hidden="true">
        <svg viewBox="0 0 64 64" focusable="false">
          <circle cx="32" cy="32" r="27" />
          <path d="m20 33 8 8 17-18" />
        </svg>
      </div>
      <h2 ref="heading" class="lead-submit-state__title" tabindex="-1">
        Заявка отправлена!
      </h2>
      <p class="lead-submit-state__text">
        Спасибо за обращение.<br />Наш специалист свяжется с вами в ближайшее
        рабочее время.
      </p>
      <div class="lead-submit-state__contact">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6.6 2.8 9.5 6l-1.8 3.2c1.1 2.3 2.9 4.1 5.2 5.2l3.2-1.8 3.2 2.9-1.1 3.6c-.3.9-1.2 1.5-2.2 1.4C8.7 19.8 4.2 15.3 3.5 8c-.1-1 .5-1.9 1.4-2.2l1.7-3Z" />
        </svg>
        <div>
          <a href="tel:+73432783743">+7 (343) 278-37-43</a>
          <span>Если вопрос срочный — позвоните нам.</span>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.lead-submit-state {
  display: grid;
  min-height: 500px;
  align-content: center;
  justify-items: center;
  gap: 20px;
  box-sizing: border-box;
  padding: clamp(40px, 5vw, 64px);
  border: 1px solid rgba(47, 120, 205, 0.22);
  border-radius: var(--home-radius, 6px);
  background: rgba(255, 255, 255, 0.98);
  color: var(--home-navy, #082f52);
  text-align: center;
  box-shadow: 0 14px 32px rgba(6, 22, 56, 0.12);
}

.lead-submit-state__spinner {
  width: 58px;
  height: 58px;
  box-sizing: border-box;
  border: 4px solid rgba(47, 120, 205, 0.2);
  border-top-color: var(--home-blue, #0056b9);
  border-radius: 50%;
  animation: lead-submit-spin 850ms linear infinite;
}

.lead-submit-state__check {
  display: grid;
  position: relative;
  width: 132px;
  height: 132px;
  place-items: center;
  border: 1px solid rgba(47, 120, 205, 0.22);
  border-radius: 50%;
  background: rgba(238, 247, 255, 0.45);
}

.lead-submit-state__check::before,
.lead-submit-state__check::after {
  position: absolute;
  border: 1px solid rgba(47, 120, 205, 0.18);
  border-radius: inherit;
  content: "";
}

.lead-submit-state__check::before { inset: -17px; }
.lead-submit-state__check::after { inset: 13px; }

.lead-submit-state__check svg {
  position: relative;
  z-index: 1;
}

.lead-submit-state__check svg {
  width: 94px;
  height: 94px;
}

.lead-submit-state__check svg circle {
  stroke: #87c0fb;
  stroke-width: 3;
}

.lead-submit-state__check svg path {
  stroke: #1074e6;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 5.5;
}

.lead-submit-state__title {
  margin: 10px 0 0;
  color: var(--home-navy, #082f52);
  font: 750 clamp(32px, 2.6vw, 46px) / 1.04 var(--home-heading, sans-serif);
  letter-spacing: -0.02em;
}

.lead-submit-state__title:focus-visible { outline: 2px solid var(--home-blue, #0056b9); outline-offset: 5px; }

.lead-submit-state__text {
  max-width: 32ch;
  margin: 0;
  color: var(--home-muted, #416087);
  font: 400 clamp(18px, 1.35vw, 23px) / 1.46 var(--home-body, Arial, sans-serif);
}

.lead-submit-state__contact {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  width: min(100%, 470px);
  gap: 16px;
  align-items: center;
  margin-top: 20px;
  padding-top: 26px;
  border-top: 1px solid var(--home-line, #dce7f2);
  text-align: left;
}

.lead-submit-state__contact > svg {
  width: 48px;
  height: 48px;
  box-sizing: border-box;
  padding: 13px;
  border-radius: 50%;
  background: #e8f2fe;
  fill: none;
  stroke: #1074e6;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.lead-submit-state__contact div { display: grid; gap: 5px; }
.lead-submit-state__contact a { color: var(--home-blue, #0056b9); font: 700 clamp(21px, 1.55vw, 27px) / 1.1 var(--home-body, Arial, sans-serif); text-decoration: none; }
.lead-submit-state__contact a:hover, .lead-submit-state__contact a:focus-visible { text-decoration: underline; }
.lead-submit-state__contact span { color: var(--home-muted, #416087); font: 400 clamp(15px, 1vw, 18px) / 1.35 var(--home-body, Arial, sans-serif); }

@keyframes lead-submit-spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .lead-submit-state__spinner { animation-duration: 2.4s; }
}

@media (max-width: 480px) {
  .lead-submit-state { min-height: 410px; gap: 16px; padding: 34px 20px; }
  .lead-submit-state__check { width: 102px; height: 102px; }
  .lead-submit-state__check::before { inset: -13px; }
  .lead-submit-state__check::after { inset: 10px; }
  .lead-submit-state__check svg { width: 72px; height: 72px; }
  .lead-submit-state__title { font-size: 27px; }
  .lead-submit-state__text { font-size: 16px; }
  .lead-submit-state__contact { grid-template-columns: 42px minmax(0, 1fr); gap: 11px; }
  .lead-submit-state__contact > svg { width: 42px; height: 42px; padding: 11px; }
  .lead-submit-state__contact a { font-size: 18px; }
  .lead-submit-state__contact span { font-size: 14px; }
}
</style>
