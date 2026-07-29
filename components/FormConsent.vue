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
  grid-template-columns: 18px 1fr;
  gap: 10px;
  align-items: start;
  cursor: pointer;
  font-size: 13px;
  line-height: 1.55;
  color: #4b5563;
}

.form-consent.invalid .form-consent__text {
  color: #c0392b;
}

.form-consent__input {
  width: 16px;
  height: 16px;
  margin-top: 3px;
  accent-color: #2f78cd;
}

.form-consent__link {
  color: #2f78cd;
  text-decoration: underline;
  white-space: nowrap;
}
</style>
