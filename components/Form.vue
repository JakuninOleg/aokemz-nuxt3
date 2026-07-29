<template>
  <div class="lg:mt-6">
    <h3 class="text-2xl font-semibold mb-4">{{ header }}</h3>
    <form class="relative grid gap-4 xl:w-3/5 text-lg" novalidate @submit.prevent="submit">
      <!-- Honeypot: hidden from users, bots often fill it -->
      <div class="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
        <label>
          Сайт
          <input
            v-model="website"
            type="text"
            name="website"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
          />
        </label>
      </div>

      <label class="label grid gap-2">
        <span class="font-medium">Организация</span>
        <input
          v-model="name"
          type="text"
          name="organization"
          autocomplete="organization"
          placeholder="Ваше имя / название компании"
          class="font-light border pl-2 py-2 border-gray-500"
          :class="{ 'border-red-500': fieldErrors.name }"
          maxlength="120"
          required
        />
        <span v-if="fieldErrors.name" class="text-sm text-red-600">{{ fieldErrors.name }}</span>
      </label>

      <label class="label grid gap-2">
        <span class="font-medium">Телефон</span>
        <InputPhone v-model="phone" :invalid="Boolean(fieldErrors.phone)" />
        <span v-if="fieldErrors.phone" class="text-sm text-red-600">{{ fieldErrors.phone }}</span>
      </label>

      <label class="label grid gap-2">
        <span class="font-medium">Email</span>
        <input
          v-model="email"
          type="email"
          name="email"
          autocomplete="email"
          placeholder="Ваш почтовый адрес"
          class="font-light border pl-2 py-2 border-gray-500"
          :class="{ 'border-red-500': fieldErrors.email }"
          maxlength="160"
          required
        />
        <span v-if="fieldErrors.email" class="text-sm text-red-600">{{ fieldErrors.email }}</span>
      </label>

      <label class="label grid gap-2">
        <span class="font-medium">Сообщение</span>
        <textarea
          v-model="message"
          name="message"
          placeholder="Ваше сообщение"
          class="font-light border pl-2 py-2 border-gray-500 min-h-[120px]"
          :class="{ 'border-red-500': fieldErrors.message }"
          maxlength="2000"
          required
        />
        <span v-if="fieldErrors.message" class="text-sm text-red-600">{{
          fieldErrors.message
        }}</span>
      </label>

      <FormConsent v-model="consent" :invalid="Boolean(fieldErrors.consent)" />
      <span v-if="fieldErrors.consent" class="text-sm text-red-600">{{ fieldErrors.consent }}</span>

      <p v-if="sent" class="text-xl font-bold text-green-600 mt-2">
        Ваша заявка успешно отправлена
      </p>
      <p v-if="error" class="text-xl font-bold text-red-600 mt-2">
        {{ error }}
      </p>

      <svg
        v-if="loader"
        class="animate-spin -ml-1 mr-3 h-8 w-8 text-black mt-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>

      <button
        v-if="!loader && !sent"
        class="text-lg mt-4 bg-blue-500 py-2 w-44 text-white hover:bg-blue-600 transition duration-300 ease-in-out rounded transform hover:shadow-lg active:shadow-none active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="submit"
      >
        Отправить
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import InputPhone from './InputPhone.vue'
import { validateContactLead } from '~/utils/contactValidation'

defineProps<{
  header?: string
}>()

const name = ref('')
const phone = ref('')
const email = ref('')
const message = ref('')
const website = ref('')
const consent = ref(false)
const sent = ref(false)
const loader = ref(false)
const error = ref('')
const fieldErrors = reactive<Record<string, string>>({
  name: '',
  phone: '',
  email: '',
  message: '',
  consent: '',
})

function clearFieldErrors() {
  fieldErrors.name = ''
  fieldErrors.phone = ''
  fieldErrors.email = ''
  fieldErrors.message = ''
  fieldErrors.consent = ''
}

function applyFieldErrors(fields?: { path: string; message: string }[]) {
  clearFieldErrors()
  for (const field of fields || []) {
    if (field.path in fieldErrors) {
      fieldErrors[field.path] = field.message
    }
  }
}

const submit = async () => {
  loader.value = true
  error.value = ''
  clearFieldErrors()

  // Honeypot filled → fake success (do not tip off bots)
  if (website.value.trim()) {
    sent.value = true
    loader.value = false
    return
  }

  const parsed = validateContactLead({
    name: name.value,
    phone: phone.value,
    email: email.value,
    message: message.value,
    consent: consent.value,
  })

  if (!parsed.success) {
    applyFieldErrors(
      parsed.error.issues.map((issue) => ({
        path: String(issue.path[0] || ''),
        message: issue.message,
      }))
    )
    error.value = parsed.error.issues[0]?.message || 'Проверьте поля формы'
    loader.value = false
    return
  }

  try {
    const response = await $fetch<{ success: boolean }>('/api/sendMail', {
      method: 'POST',
      body: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        message: parsed.data.message,
        consent: consent.value,
      },
    })

    if (response.success) {
      sent.value = true
      name.value = ''
      phone.value = ''
      email.value = ''
      message.value = ''
      website.value = ''
      consent.value = false
    } else {
      throw new Error('Неизвестная ошибка')
    }
  } catch (e: unknown) {
    const err = e as {
      data?: { message?: string; data?: { fields?: { path: string; message: string }[] } }
      statusMessage?: string
      message?: string
    }
    const fields = err?.data?.data?.fields
    if (fields?.length) applyFieldErrors(fields)
    error.value =
      err?.data?.message ||
      err?.statusMessage ||
      'Не удалось отправить заявку. Попробуйте позже.'
  } finally {
    loader.value = false
  }
}
</script>
