<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="kemz-action"
    :class="{
      'kemz-action--compact': compact,
      'kemz-action--on-dark': onDark,
    }"
  >
    <span><slot /></span><span aria-hidden="true">→</span>
  </NuxtLink>
  <button
    v-else
    :type="type"
    class="kemz-action"
    :class="{
      'kemz-action--compact': compact,
      'kemz-action--on-dark': onDark,
    }"
    :disabled="disabled"
  >
    <span><slot /></span><span aria-hidden="true">→</span>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    to?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    compact?: boolean;
    onDark?: boolean;
  }>(),
  { type: "button", disabled: false, compact: false, onDark: false },
);
</script>
