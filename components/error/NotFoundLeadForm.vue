<script setup lang="ts">
import { reactive, shallowRef } from "vue";
import InputPhone from "~/components/InputPhone.vue";
import FormConsent from "~/components/FormConsent.vue";
import {
  type ContactLeadField,
  validateContactField,
  validateContactLead,
} from "~/utils/contactValidation";

const name = shallowRef("");
const phone = shallowRef("");
const email = shallowRef("");
const message = shallowRef("");
const website = shallowRef("");
const consent = shallowRef(false);
const sent = shallowRef(false);
const pending = shallowRef(false);
const submitError = shallowRef("");

const fieldErrors = reactive<Record<ContactLeadField, string>>({
  name: "",
  phone: "",
  email: "",
  message: "",
  consent: "",
});

const fieldValues = (): Record<ContactLeadField, unknown> => ({
  name: name.value,
  phone: phone.value,
  email: email.value,
  message: message.value,
  consent: consent.value,
});

const validateField = (field: ContactLeadField) => {
  fieldErrors[field] = validateContactField(field, fieldValues()[field]);
};

const clearFieldError = (field: ContactLeadField) => {
  if (fieldErrors[field]) validateField(field);
};

const validateForm = () => {
  let valid = true;
  (Object.keys(fieldErrors) as ContactLeadField[]).forEach((field) => {
    validateField(field);
    if (fieldErrors[field]) valid = false;
  });
  return valid;
};

const clearForm = () => {
  name.value = "";
  phone.value = "";
  email.value = "";
  message.value = "";
  website.value = "";
  consent.value = false;
  for (const field of Object.keys(fieldErrors) as ContactLeadField[]) {
    fieldErrors[field] = "";
  }
};

const submit = async () => {
  submitError.value = "";

  if (website.value.trim()) {
    sent.value = true;
    clearForm();
    return;
  }

  if (!validateForm()) return;

  const parsed = validateContactLead(fieldValues());
  if (!parsed.success) return;

  pending.value = true;
  try {
    const result = await $fetch<{ success: boolean }>("/api/sendMail", {
      method: "POST",
      body: { ...parsed.data, website: website.value },
    });

    if (!result.success) throw new Error("Неизвестная ошибка");
    sent.value = true;
    clearForm();
  } catch (error: unknown) {
    const requestError = error as { data?: { message?: string } };
    submitError.value =
      requestError.data?.message ||
      "Не удалось отправить заявку. Попробуйте позже.";
  } finally {
    pending.value = false;
  }
};
</script>

<template>
  <div class="not-found-form-surface">
    <Transition name="not-found-form-state" mode="out-in">
      <LeadSubmitState
        v-if="sent || pending"
        class="not-found-form__state"
        :state="pending ? 'sending' : 'success'"
      />
      <form v-else class="not-found-form" novalidate @submit.prevent="submit">
      <h2 class="not-found-form__title">Не нашли нужную информацию?</h2>
      <p class="not-found-form__lead">
        Оставьте заявку. Специалисты отдела продаж помогут с подбором.
      </p>

      <label class="not-found-form__field not-found-form__honeypot" aria-hidden="true">
        <span>Сайт</span>
        <input v-model="website" tabindex="-1" autocomplete="off" />
      </label>

      <label class="not-found-form__field">
        <span>Ваше имя <b aria-hidden="true">*</b></span>
        <input
          v-model="name"
          name="name"
          autocomplete="name"
          placeholder="Иван Петров"
          maxlength="120"
          required
          :aria-invalid="Boolean(fieldErrors.name)"
          @blur="validateField('name')"
          @input="clearFieldError('name')"
        />
        <small v-if="fieldErrors.name">{{ fieldErrors.name }}</small>
      </label>

      <label class="not-found-form__field">
        <span>Телефон <b aria-hidden="true">*</b></span>
        <InputPhone
          v-model="phone"
          :invalid="Boolean(fieldErrors.phone)"
          @blur="validateField('phone')"
          @update:model-value="clearFieldError('phone')"
        />
        <small v-if="fieldErrors.phone">{{ fieldErrors.phone }}</small>
      </label>

      <label class="not-found-form__field">
        <span>Email <b aria-hidden="true">*</b></span>
        <input
          v-model="email"
          type="email"
          name="email"
          autocomplete="email"
          placeholder="name@company.ru"
          maxlength="160"
          required
          :aria-invalid="Boolean(fieldErrors.email)"
          @blur="validateField('email')"
          @input="clearFieldError('email')"
        />
        <small v-if="fieldErrors.email">{{ fieldErrors.email }}</small>
      </label>

      <label class="not-found-form__field">
        <span>Комментарий <b aria-hidden="true">*</b></span>
        <textarea
          v-model="message"
          name="message"
          placeholder="Напишите, что вы ищете"
          maxlength="2000"
          required
          :aria-invalid="Boolean(fieldErrors.message)"
          @blur="validateField('message')"
          @input="clearFieldError('message')"
        />
        <small v-if="fieldErrors.message">{{ fieldErrors.message }}</small>
      </label>

      <FormConsent
        v-model="consent"
        :invalid="Boolean(fieldErrors.consent)"
        @update:model-value="validateField('consent')"
      />
      <small v-if="fieldErrors.consent" class="not-found-form__error">
        {{ fieldErrors.consent }}
      </small>

      <HomeActionButton class="not-found-form__submit" type="submit" :disabled="pending">
        {{ pending ? "Отправляем" : "Отправить заявку" }}
      </HomeActionButton>
      <p v-if="submitError" class="not-found-form__error" role="alert">
        {{ submitError }}
      </p>
      </form>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.not-found-form {
  display: grid;
  gap: 14px;
  padding: clamp(24px, 2.4vw, 40px);
  border: 1px solid rgba(8, 47, 82, 0.12);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 44px rgba(6, 22, 56, 0.14);
}

.not-found-form__title {
  margin: 0;
  color: var(--home-navy, #082f52);
  font: 700 clamp(27px, 2.3vw, 36px) / 1.02 var(--home-heading, sans-serif);
  letter-spacing: -0.02em;
}

.not-found-form__lead {
  margin: -4px 0 4px;
  color: var(--home-muted, #416087);
  font: 400 16px / 1.4 var(--home-body, sans-serif);
}

.not-found-form__field {
  display: grid;
  gap: 6px;
  color: var(--home-ink, #061638);
  font: 600 14px / 1.2 var(--home-body, sans-serif);
}

.not-found-form__field b { color: #c82f3c; }

.not-found-form__field input,
.not-found-form__field textarea {
  width: 100%;
  border: 1px solid #c9d8e7;
  border-radius: 4px;
  background: #fff;
  color: var(--home-ink, #061638);
  font: 400 16px / 1.3 var(--home-body, sans-serif);
  outline: none;
  transition: border-color var(--kemz-motion-duration, 300ms) var(--kemz-motion-ease, ease), box-shadow var(--kemz-motion-duration, 300ms) var(--kemz-motion-ease, ease);
}

.not-found-form__field input { min-height: 48px; padding: 10px 13px; }
.not-found-form__field textarea { min-height: 76px; padding: 11px 13px; resize: vertical; }

.not-found-form__field input:focus-visible,
.not-found-form__field textarea:focus-visible {
  border-color: var(--home-blue, #0056b9);
  box-shadow: 0 0 0 3px rgba(0, 86, 185, 0.14);
}

.not-found-form__field small,
.not-found-form__error { color: #b62531; font: 400 12px / 1.3 var(--home-body, sans-serif); }
.not-found-form__error { margin: -7px 0 0; }
.not-found-form__submit { width: 100%; margin-top: 2px; }
.not-found-form__honeypot { position: absolute; left: -9999px; }

.not-found-form__state { min-height: 540px; }

.not-found-form-surface {
  display: grid;
  min-height: 540px;
}

.not-found-form-surface > :deep(.lead-submit-state) { height: 100%; }

.not-found-form-state-enter-active,
.not-found-form-state-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.not-found-form-state-enter-from,
.not-found-form-state-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 600px) {
  .not-found-form { padding: 22px 18px; gap: 13px; border-radius: 6px; }
  .not-found-form__title { font-size: 27px; }
  .not-found-form__lead { font-size: 15px; }
}
</style>
