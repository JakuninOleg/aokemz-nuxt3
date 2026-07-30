<template>
  <label class="form-consent" :class="{ invalid }">
    <input
      :checked="modelValue"
      type="checkbox"
      name="pd-consent"
      class="form-consent__input"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="form-consent__text">
      {{ formConsentLabel }}
      <NuxtLink to="/legal" class="form-consent__link">Правовая информация</NuxtLink>
    </span>
  </label>
</template>

<script setup lang="ts">
import { formConsentLabel } from '~/utils/legalContent'

defineProps<{
  modelValue: boolean
  invalid?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
.form-consent {
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 8px;
  align-items: start;
  cursor: pointer;
  margin-top: 0.25rem;
}

.form-consent__text {
  color: #6b7280;
  font-family: 'Source Sans 3', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.45;
  text-transform: none;
}

.form-consent.invalid .form-consent__text {
  color: #c0392b;
}

.form-consent__input {
  width: 15px;
  height: 15px;
  margin-top: 2px;
  accent-color: #2f78cd;
}

.form-consent__link {
  color: #2f78cd;
  font-size: inherit;
  font-weight: 500;
  letter-spacing: 0;
  text-decoration: underline;
  text-transform: none;
  white-space: nowrap;
}
</style>
