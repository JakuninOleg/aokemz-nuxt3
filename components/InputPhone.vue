<template>
  <input
    v-model="formattedPhone"
    type="tel"
    placeholder="Ваш телефон"
    required
    class="font-light border pl-2 py-2 border-gray-500"
    @focus="focusPhone"
    @blur="blurPhone"
    @input="formatPhone"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: string // Для v-model
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void // Для v-model
}>()

const phone = ref(props.modelValue || '') // Чистый номер (только цифры)
const formattedPhone = ref('') // Форматированный номер (+7 (123) 456-78-90)
const phoneRegex = /^\+7 \(\d{0,3}/ // Проверка начала номера

// Синхронизация с v-model
watch(phone, (newPhone) => {
  emit('update:modelValue', newPhone)
})

// При фокусе добавляем +7 (
const focusPhone = () => {
  if (!phone.value) {
    formattedPhone.value = '+7 ('
  }
}

// При потере фокуса очищаем, если номер слишком короткий
const blurPhone = () => {
  if (phone.value.length < 10) {
    phone.value = ''
    formattedPhone.value = ''
  }
}

// Форматирование номера
const formatPhone = (e: Event) => {
  const input = e.target as HTMLInputElement
  let phoneStr = input.value.replace(/\D/g, '') // Только цифры

  // Ограничиваем длину номера до 11 цифр
  if (phoneStr.length > 11) {
    phoneStr = phoneStr.slice(0, 11)
  }

  // Обновляем чистый номер
  phone.value = phoneStr.length > 1 ? phoneStr : ''

  // Форматируем отображаемый номер
  if (!input.value.match(phoneRegex) && input.selectionStart! > 4) {
    formattedPhone.value = '+7 (' + input.value.substring(4, 18)
  } else if (phoneStr.length > 9) {
    formattedPhone.value = `+7 (${phoneStr.substring(1, 4)}) ${phoneStr.substring(4, 7)}-${phoneStr.substring(7, 9)}-${phoneStr.substring(9, 11)}`
  } else if (phoneStr.length > 7) {
    formattedPhone.value = `+7 (${phoneStr.substring(1, 4)}) ${phoneStr.substring(4, 7)}-${phoneStr.substring(7, 9)}`
  } else if (phoneStr.length > 6) {
    formattedPhone.value = `+7 (${phoneStr.substring(1, 4)}) ${phoneStr.substring(4, 7)}-`
  } else if (phoneStr.length > 4) {
    formattedPhone.value = `+7 (${phoneStr.substring(1, 4)}) ${phoneStr.substring(4)}`
  } else if (phoneStr.length > 3) {
    formattedPhone.value = `+7 (${phoneStr.substring(1, 4)})`
  } else {
    formattedPhone.value = `+7 (${phoneStr.substring(1)}`
  }

  // Корректируем при удалении
  if (e.inputType === 'deleteContentBackward') {
    if (phoneStr.length === 9) {
      formattedPhone.value = `+7 (${phoneStr.substring(1, 4)}) ${phoneStr.substring(4, 7)}-${phoneStr.substring(7, 9)}`
    } else if (phoneStr.length === 7) {
      formattedPhone.value = `+7 (${phoneStr.substring(1, 4)}) ${phoneStr.substring(4, 7)}`
    } else if (phoneStr.length === 4) {
      formattedPhone.value = `+7 (${phoneStr.substring(1, 4)})`
    }
  }
}
</script>