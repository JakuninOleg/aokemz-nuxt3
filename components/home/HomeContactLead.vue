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
            @blur="onBlur('name')"
            @input="onEdit('name')"
          />
          <small v-if="errors.name">{{ errors.name }}</small>
        </label>
        <label>
          <span>Телефон</span>
          <InputPhone
            v-model="form.phone"
            :invalid="Boolean(errors.phone)"
            class="form-phone"
            @blur="onBlur('phone')"
            @update:model-value="onEdit('phone')"
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
            @blur="onBlur('email')"
            @input="onEdit('email')"
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
            @blur="onBlur('message')"
            @input="onEdit('message')"
          />
          <small v-if="errors.message">{{ errors.message }}</small>
        </label>
        <FormConsent
          v-model="form.consent"
          :invalid="Boolean(errors.consent)"
          @update:model-value="onConsentChange"
        />
        <small v-if="errors.consent" class="form-error">{{ errors.consent }}</small>
        <p v-if="sent" class="form-success">Заявка отправлена. Ответим в рабочий день.</p>
        <p v-if="submitError" class="form-error">{{ submitError }}</p>

        <div v-if="sending" class="form-sending" role="status" aria-live="polite">
          <span class="form-sending__spinner" aria-hidden="true" />
          Отправляем заявку…
        </div>
        <button v-else-if="!sent" type="submit" class="button button-solid submit">
          Отправить заявку
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  type ContactLeadField,
  validateContactField,
  validateContactLead,
} from '~/utils/contactValidation'

const sent = ref(false)
const sending = ref(false)
const submitError = ref('')
const website = ref('')
const form = reactive({
  name: '',
  phone: '',
  email: '',
  message: '',
  consent: false,
})
const errors = reactive<Record<ContactLeadField, string>>({
  name: '',
  phone: '',
  email: '',
  message: '',
  consent: '',
})

function onBlur(field: ContactLeadField) {
  // Phone may clear asynchronously on blur — validate after sync
  nextTick(() => {
    errors[field] = validateContactField(field, form[field])
  })
}

function onEdit(field: ContactLeadField) {
  if (!errors[field]) return
  errors[field] = validateContactField(field, form[field])
}

function onConsentChange(value: boolean) {
  form.consent = value
  errors.consent = value ? '' : validateContactField('consent', value)
}

function validateAllFields(): boolean {
  let ok = true
  for (const field of Object.keys(errors) as ContactLeadField[]) {
    const message = validateContactField(field, form[field])
    errors[field] = message
    if (message) ok = false
  }
  return ok
}

async function submitForm() {
  submitError.value = ''

  if (website.value.trim()) {
    sent.value = true
    return
  }

  if (!validateAllFields()) return

  const parsed = validateContactLead(form)
  if (!parsed.success) return

  sending.value = true
  try {
    await $fetch('/api/sendMail', {
      method: 'POST',
      body: { ...parsed.data, website: '', consent: true },
    })
    sent.value = true
    Object.assign(form, { name: '', phone: '', email: '', message: '', consent: false })
    for (const field of Object.keys(errors) as ContactLeadField[]) {
      errors[field] = ''
    }
  } catch (error: any) {
    submitError.value = error?.data?.message || 'Не удалось отправить. Напишите на sales@aokemz.ru'
  } finally {
    sending.value = false
  }
}
</script>
