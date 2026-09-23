<script setup lang="ts">
const visible = ref(false);
const SHOW_AFTER = 420;

const onScroll = () => {
  if (!import.meta.client) return;
  visible.value = window.scrollY > SHOW_AFTER;
};

const scrollTop = () => {
  if (!import.meta.client) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
};

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
  if (!import.meta.client) return;
  window.removeEventListener("scroll", onScroll);
});
</script>

<template>
  <Transition name="back-top">
    <button
      v-show="visible"
      type="button"
      class="back-to-top"
      aria-label="Наверх"
      title="Наверх"
      @click="scrollTop"
    >
      <span class="back-to-top__icon" aria-hidden="true" />
    </button>
  </Transition>
</template>

<style scoped lang="scss">
.back-to-top {
  position: fixed;
  right: max(16px, env(safe-area-inset-right, 0px));
  bottom: max(20px, env(safe-area-inset-bottom, 0px));
  z-index: 50;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin: 0;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 4px;
  background: #082f52;
  color: #fff;
  box-shadow: 0 10px 28px rgba(6, 22, 56, 0.28);
  cursor: pointer;
  transition:
    background-color 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.back-to-top:hover,
.back-to-top:focus-visible {
  background: #0056b9;
  outline: none;
}

.back-to-top:focus-visible {
  box-shadow:
    0 0 0 3px #fff,
    0 0 0 5px #0056b9,
    0 10px 28px rgba(6, 22, 56, 0.28);
}

.back-to-top:active {
  transform: translateY(1px);
}

.back-to-top__icon {
  display: block;
  width: 10px;
  height: 10px;
  border-left: 2px solid currentColor;
  border-top: 2px solid currentColor;
  transform: translateY(2px) rotate(45deg);
}

.back-top-enter-active,
.back-top-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}

.back-top-enter-from,
.back-top-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (min-width: 721px) {
  .back-to-top {
    right: max(24px, env(safe-area-inset-right, 0px));
    bottom: max(28px, env(safe-area-inset-bottom, 0px));
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-to-top,
  .back-top-enter-active,
  .back-top-leave-active {
    transition: none;
  }
}
</style>
