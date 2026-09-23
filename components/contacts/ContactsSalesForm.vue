<script setup lang="ts">
import {
  type ContactLeadField,
  validateContactField,
  validateContactLead,
} from "~/utils/contactValidation";

const sent = ref(false);
const sending = ref(false);
const submitError = ref("");
const website = ref("");
const form = reactive({
  name: "",
  phone: "",
  email: "",
  message: "",
  consent: false,
});
const errors = reactive<Record<ContactLeadField, string>>({
  name: "",
  phone: "",
  email: "",
  message: "",
  consent: "",
});

function onBlur(field: ContactLeadField) {
  nextTick(() => {
    errors[field] = validateContactField(field, form[field]);
  });
}

function onEdit(field: ContactLeadField) {
  if (!errors[field]) return;
  errors[field] = validateContactField(field, form[field]);
}

function onConsentChange(value: boolean) {
  form.consent = value;
  errors.consent = value ? "" : validateContactField("consent", value);
}

function validateAllFields(): boolean {
  let ok = true;
  for (const field of Object.keys(errors) as ContactLeadField[]) {
    const message = validateContactField(field, form[field]);
    errors[field] = message;
    if (message) ok = false;
  }
  return ok;
}

function clearForm() {
  Object.assign(form, {
    name: "",
    phone: "",
    email: "",
    message: "",
    consent: false,
  });
  website.value = "";
  for (const field of Object.keys(errors) as ContactLeadField[]) {
    errors[field] = "";
  }
}

async function submitForm() {
  submitError.value = "";

  if (website.value.trim()) {
    sent.value = true;
    clearForm();
    return;
  }

  if (!validateAllFields()) return;

  const parsed = validateContactLead(form);
  if (!parsed.success) return;

  sending.value = true;
  try {
    await $fetch("/api/sendMail", {
      method: "POST",
      body: { ...parsed.data, website: "", consent: true },
    });
    sent.value = true;
    clearForm();
  } catch (error: any) {
    submitError.value =
      error?.data?.message ||
      "Не удалось отправить. Напишите на sales@aokemz.ru";
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div class="contacts-sales-form-surface">
    <Transition name="contacts-form-state" mode="out-in">
      <form
        v-if="!sending && !sent"
        class="contacts-sales-form"
        novalidate
        @submit.prevent="submitForm"
      >
    <input
      v-model="website"
      class="contacts-sales-form__honeypot"
      name="website"
      tabindex="-1"
      autocomplete="off"
      aria-hidden="true"
    />

    <div class="contacts-sales-form__row">
      <label class="contacts-sales-form__field">
        <span class="visually-hidden">Имя / организация</span>
        <input
          v-model="form.name"
          type="text"
          name="organization"
          autocomplete="organization"
          placeholder="Ваше имя / название компании"
          maxlength="120"
          :class="{ 'is-invalid': errors.name }"
          @blur="onBlur('name')"
          @input="onEdit('name')"
        />
        <small v-if="errors.name">{{ errors.name }}</small>
      </label>

      <label class="contacts-sales-form__field">
        <span class="visually-hidden">E-mail</span>
        <input
          v-model="form.email"
          type="email"
          name="email"
          autocomplete="email"
          placeholder="E-mail"
          maxlength="160"
          :class="{ 'is-invalid': errors.email }"
          @blur="onBlur('email')"
          @input="onEdit('email')"
        />
        <small v-if="errors.email">{{ errors.email }}</small>
      </label>
    </div>

    <label class="contacts-sales-form__field">
      <span class="visually-hidden">Телефон</span>
      <InputPhone
        v-model="form.phone"
        :invalid="Boolean(errors.phone)"
        @blur="onBlur('phone')"
        @update:model-value="onEdit('phone')"
      />
      <small v-if="errors.phone">{{ errors.phone }}</small>
    </label>

    <label class="contacts-sales-form__field">
      <span class="visually-hidden">Сообщение</span>
      <textarea
        v-model="form.message"
        name="message"
        rows="4"
        placeholder="Сообщение"
        maxlength="2000"
        :class="{ 'is-invalid': errors.message }"
        @blur="onBlur('message')"
        @input="onEdit('message')"
      />
      <small v-if="errors.message">{{ errors.message }}</small>
    </label>

    <p v-if="submitError" class="contacts-sales-form__err">{{ submitError }}</p>

    <HomeActionButton
      class="contacts-sales-form__submit"
      type="submit"
    >
      Отправить сообщение
    </HomeActionButton>

    <FormConsent
      v-model="form.consent"
      :invalid="Boolean(errors.consent)"
      @update:model-value="onConsentChange"
    />
    <small v-if="errors.consent" class="contacts-sales-form__err">{{
      errors.consent
    }}</small>
      </form>
      <LeadSubmitState
        v-else
        class="contacts-sales-form__state"
        :state="sending ? 'sending' : 'success'"
      />
    </Transition>
  </div>
</template>

<style scoped>
.contacts-form-state-enter-active,
.contacts-form-state-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.contacts-form-state-enter-from,
.contacts-form-state-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
