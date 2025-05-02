<template>
  <div class="lg:mt-6">
    <h3 class="text-2xl font-semibold mb-4">{{ header }}</h3>
    <form class="grid gap-4 xl:w-3/5 text-lg" @submit.prevent="submit">
      <label class="label grid gap-2">
        <span class="font-medium">Организация</span>
        <input
          v-model="name"
          type="text"
          placeholder="Ваше имя/название компании"
          class="font-light border pl-2 py-2 border-gray-500"
          required
        />
      </label>
      <label class="label grid gap-2">
        <span class="font-medium">Телефон</span>
        <InputPhone v-model="phone" />
      </label>
      <label class="label grid gap-2">
        <span class="font-medium">Email</span>
        <input
          v-model="email"
          type="email"
          placeholder="Ваш почтовый адрес"
          class="font-light border pl-2 py-2 border-gray-500"
          required
        />
      </label>
      <label class="label grid gap-2">
        <span class="font-medium">Сообщение</span>
        <textarea
          v-model="message"
          placeholder="Ваше сообщение"
          class="font-light border pl-2 py-2 border-gray-500"
          required
        />
      </label>
      <p v-if="sent" class="text-xl font-bold text-green-500 mt-6">
        Ваша заявка успешно отправлена
      </p>
      <p v-if="error" class="text-xl font-bold text-red-500 mt-6">
        Ошибка отправки: {{ error }}
      </p>
      <svg
        v-if="loader"
        class="animate-spin -ml-1 mr-3 h-8 w-8 text-black mt-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <button
        v-if="!loader && !sent"
        class="text-lg mt-6 bg-blue-500 py-2 w-44 text-white hover:bg-blue-600 transition duration-300 ease-in-out rounded transform hover:shadow-lg active:shadow-none active:bg-blue-700 active:scale-100 focus:outline-none"
        type="submit"
      >
        Отправить
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputPhone from './InputPhone.vue'

defineProps<{
  header?: string
}>()

// Состояния формы
const name = ref('')
const phone = ref('')
const email = ref('')
const message = ref('')
const sent = ref(false)
const loader = ref(false)
const error = ref('')

// Отправка формы
const submit = async () => {
  loader.value = true
  error.value = ''

  const text = `
    Заявка от ${name.value}
    Номер телефона: ${phone.value || 'Не указан'}
    Почтовый адрес: ${email.value}
    Текст сообщения:
    ${message.value}
  `

  try {
    const response = await $fetch('/api/sendMail', {
      method: 'POST',
      body: {
        subject: 'Заявка с сайта aokemz.ru',
        text,
        html: `<p>${text.replace(/\n/g, '<br>')}</p>`,
      },
    })

    if (response.success) {
      sent.value = true
      // Сбрасываем форму
      name.value = ''
      phone.value = ''
      email.value = ''
      message.value = ''
    } else {
      throw new Error(response.error || 'Неизвестная ошибка')
    }
  } catch (e) {
    console.error('Ошибка отправки:', e)
    error.value = 'Не удалось отправить заявку. Попробуйте позже.'
  } finally {
    loader.value = false
  }
}
</script>