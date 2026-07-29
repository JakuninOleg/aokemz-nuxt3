<template>
  <section id="contact" class="chapter contact">
    <div class="wrap contact-grid">
      <div>
        <span class="section-tag">05 · Связаться с заводом</span>
        <h2>Пришлите параметры машины</h2>
        <p class="contact-lead">
          Укажите тип ЭКГ, ЭШ или буровой, привод, мощность и требуемый срок.
          Ответ направит отдел продаж.
        </p>
        <address>
          <a href="tel:+73432783743">+7 (343) 278-37-43</a>
          <a href="mailto:sales@aokemz.ru">sales@aokemz.ru</a>
          <span>624930, Карпинск, ул. Карпинского, 1</span>
        </address>
        <NuxtLink to="/contacts" class="text-link contact-more">Страница контактов <span>→</span></NuxtLink>
      </div>

      <form novalidate @submit.prevent="submitForm">
        <input
          v-model="website"
          name="website"
          tabindex="-1"
          autocomplete="off"
          aria-hidden="true"
          class="honeypot"
        />
        <label>
          <span>Организация</span>
          <input
            v-model="form.name"
            name="organization"
            autocomplete="organization"
            placeholder="Ваше имя / название компании"
            :class="{ invalid: errors.name }"
          />
          <small v-if="errors.name">{{ errors.name }}</small>
        </label>
        <label>
          <span>Телефон</span>
          <InputPhone
            v-model="form.phone"
            :invalid="Boolean(errors.phone)"
            class="form-phone"
          />
          <small v-if="errors.phone">{{ errors.phone }}</small>
        </label>
        <label>
          <span>Email</span>
          <input
            v-model="form.email"
            type="email"
            name="email"
            autocomplete="email"
            placeholder="mail@company.ru"
            :class="{ invalid: errors.email }"
          />
          <small v-if="errors.email">{{ errors.email }}</small>
        </label>
        <label>
          <span>Сообщение</span>
          <textarea
            v-model="form.message"
            name="message"
            rows="4"
            placeholder="Тип машины, привод, мощность, сроки"
            :class="{ invalid: errors.message }"
          />
          <small v-if="errors.message">{{ errors.message }}</small>
        </label>
        <FormConsent v-model="form.consent" :invalid="Boolean(errors.consent)" />
        <small v-if="errors.consent" class="form-error">{{ errors.consent }}</small>
        <p v-if="sent" class="form-success">Заявка отправлена. Ответим в рабочий день.</p>
        <p v-if="submitError" class="form-error">{{ submitError }}</p>
        <button type="submit" class="button button-solid submit" :disabled="sending">
          {{ sending ? 'Отправка' : 'Отправить заявку' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { validateContactLead } from '~/utils/contactValidation'

const sent = ref(false)
const sending = ref(false)
const submitError = ref('')
const website = ref('')
const form = reactive({ name: '', phone: '', email: '', message: '', consent: false })
const errors = reactive<Record<string, string>>({})

function clearErrors() {
  Object.keys(errors).forEach((key) => delete errors[key])
}

async function submitForm() {
  clearErrors()
  submitError.value = ''

  if (website.value.trim()) {
    sent.value = true
    return
  }

  const parsed = validateContactLead(form)
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors[String(issue.path[0] || '')] = issue.message
    }
    return
  }

  sending.value = true
  try {
    await $fetch('/api/sendMail', {
      method: 'POST',
      body: { ...parsed.data, website: '', consent: true },
    })
    sent.value = true
    Object.assign(form, { name: '', phone: '', email: '', message: '', consent: false })
  } catch (error: any) {
    submitError.value = error?.data?.message || 'Не удалось отправить. Напишите на sales@aokemz.ru'
  } finally {
    sending.value = false
  }
}
</script>
