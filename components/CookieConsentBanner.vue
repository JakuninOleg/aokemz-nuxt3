<script setup lang="ts">
import {
  COOKIE_BANNER,
  legalOperator,
} from "~/utils/legalContent";

const CONSENT_KEY = "kemz-cookie-consent";
const visible = ref(false);

onMounted(() => {
  if (!import.meta.client) return;
  const stored = window.localStorage.getItem(CONSENT_KEY);
  visible.value = !stored;
});

const save = (value: "necessary" | "all") => {
  if (!import.meta.client) return;
  window.localStorage.setItem(CONSENT_KEY, value);
  visible.value = false;
};
</script>

<template>
  <div
    v-if="visible"
    class="cookie-banner"
    role="dialog"
    aria-label="Уведомление об использовании cookie"
  >
    <div class="cookie-banner__inner">
      <div class="cookie-banner__copy">
        <p class="cookie-banner__title">{{ COOKIE_BANNER.title }}</p>
        <p>
          {{ COOKIE_BANNER.text }}
          <NuxtLink to="/legal#cookies">{{ COOKIE_BANNER.linkLabel }}</NuxtLink
          >.
        </p>
      </div>
      <div class="cookie-banner__actions">
        <button
          type="button"
          class="cookie-banner__ghost"
          @click="save('necessary')"
        >
          {{ COOKIE_BANNER.necessaryOnly }}
        </button>
        <button type="button" class="cookie-banner__primary" @click="save('all')">
          {{ COOKIE_BANNER.acceptAll }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cookie-banner {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 60;
  padding: 16px;
  pointer-events: none;
}

.cookie-banner__inner {
  pointer-events: auto;
  width: min(100%, 920px);
  margin-inline: auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 18px;
  align-items: center;
  padding: 18px 20px;
  border: 1px solid #dce7f2;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 12px 32px rgba(6, 22, 56, 0.16);
  color: #061638;
  font-family: var(--home-body, Arial, sans-serif);
}

.cookie-banner__title {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 700;
}

.cookie-banner__copy p {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: #416087;
}

.cookie-banner__copy a {
  color: #061638;
  font-weight: 600;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

.cookie-banner__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

.cookie-banner__primary,
.cookie-banner__ghost {
  min-height: 42px;
  padding: 10px 16px;
  border-radius: 4px;
  font: 600 14px/1.2 var(--home-body, Arial, sans-serif);
  cursor: pointer;
}

.cookie-banner__primary {
  border: 1px solid transparent;
  background: #0056b9;
  color: #fff;
}

.cookie-banner__primary:hover,
.cookie-banner__primary:focus-visible {
  background: #1a74d6;
}

.cookie-banner__ghost {
  border: 1px solid #dce7f2;
  background: #f4f9fd;
  color: #061638;
}

.cookie-banner__ghost:hover,
.cookie-banner__ghost:focus-visible {
  border-color: #0056b9;
  color: #0056b9;
}

@media (max-width: 720px) {
  .cookie-banner__inner {
    grid-template-columns: 1fr;
  }

  .cookie-banner__actions {
    justify-content: stretch;
  }

  .cookie-banner__primary,
  .cookie-banner__ghost {
    flex: 1;
  }
}
</style>
