<template>
  <div class="lg:mt-6" :class="{ 'technical-form': variant === 'technical' }">
    <h3 class="text-2xl font-semibold mb-4">{{ header }}</h3>
    <div class="lead-form-state-surface">
      <Transition name="lead-form-state" mode="out-in">
        <form
          v-if="!loader && !sent"
          class="relative grid gap-4 xl:w-3/5 text-lg"
          novalidate
          @submit.prevent="submit"
        >
      <!-- Honeypot: hidden from users, bots often fill it -->
      <div
        class="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
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

      <template v-if="variant === 'technical'">
        <label class="label grid gap-2 technical-form__equipment"
          ><span class="font-medium">Тип оборудования</span
          ><select v-model="equipment">
            <option value="">Выберите тип</option>
            <option>Экскаваторное оборудование</option>
            <option>Буровые установки</option>
            <option>Шахтное оборудование</option>
            <option>Железнодорожный транспорт</option>
            <option>Высоковольтная аппаратура</option>
          </select></label
        >
        <label class="label grid gap-2 technical-form__model"
          ><span class="font-medium">Модель техники</span
          ><input
            v-model="machine"
            placeholder="Например, ЭКГ-10"
            maxlength="120"
        /></label>
        <label class="label grid gap-2 technical-form__power"
          ><span class="font-medium">Необходимая мощность, кВт</span
          ><input
            v-model="power"
            placeholder="Например, 560"
            inputmode="decimal"
            maxlength="30"
        /></label>
        <label class="label grid gap-2 technical-form__company"
          ><span class="font-medium">Компания</span
          ><input
            v-model="company"
            placeholder="Название компании"
            autocomplete="organization"
            maxlength="120"
        /></label>
      </template>

      <label class="label grid gap-2 technical-form__name">
        <span class="font-medium">{{
          variant === "technical" ? "Имя" : "Организация"
        }}</span>
        <input
          v-model="name"
          type="text"
          name="organization"
          :autocomplete="variant === 'technical' ? 'name' : 'organization'"
          :placeholder="
            variant === 'technical'
              ? 'Ваше имя'
              : 'Ваше имя / название компании'
          "
          class="font-light border pl-2 py-2 border-gray-500"
          :class="{ 'border-red-500': fieldErrors.name }"
          maxlength="120"
          required
          @blur="onBlur('name')"
          @input="onEdit('name')"
        />
        <span v-if="fieldErrors.name" class="text-sm text-red-600">{{
          fieldErrors.name
        }}</span>
      </label>

      <label class="label grid gap-2 technical-form__phone">
        <span class="font-medium">Телефон</span>
        <InputPhone
          v-model="phone"
          :invalid="Boolean(fieldErrors.phone)"
          @blur="onBlur('phone')"
          @update:model-value="onEdit('phone')"
        />
        <span v-if="fieldErrors.phone" class="text-sm text-red-600">{{
          fieldErrors.phone
        }}</span>
      </label>

      <label class="label grid gap-2 technical-form__email">
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
          @blur="onBlur('email')"
          @input="onEdit('email')"
        />
        <span v-if="fieldErrors.email" class="text-sm text-red-600">{{
          fieldErrors.email
        }}</span>
      </label>

      <label class="label grid gap-2 technical-form__message">
        <span class="font-medium">{{
          variant === "technical" ? "Задача" : "Сообщение"
        }}</span>
        <textarea
          v-model="message"
          name="message"
          :placeholder="
            variant === 'technical'
              ? 'Привод, условия работы, сроки'
              : 'Ваше сообщение'
          "
          class="font-light border pl-2 py-2 border-gray-500 min-h-[120px]"
          :class="{ 'border-red-500': fieldErrors.message }"
          maxlength="2000"
          required
          @blur="onBlur('message')"
          @input="onEdit('message')"
        />
        <span v-if="fieldErrors.message" class="text-sm text-red-600">{{
          fieldErrors.message
        }}</span>
      </label>

      <FormConsent
        v-model="consent"
        :invalid="Boolean(fieldErrors.consent)"
        @update:model-value="onConsentChange"
      />
      <span v-if="fieldErrors.consent" class="text-sm text-red-600">{{
        fieldErrors.consent
      }}</span>

      <p v-if="error" class="text-xl font-bold text-red-600 mt-2">
        {{ error }}
      </p>

      <HomeActionButton type="submit">
        {{
          variant === "technical"
            ? "Отправить в технический отдел"
            : "Отправить"
        }}
      </HomeActionButton>
        </form>
        <LeadSubmitState
          v-else
          :state="loader ? 'sending' : 'success'"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import InputPhone from "./InputPhone.vue";
import {
  type ContactLeadField,
  validateTechnicalLeadDetails,
  validateContactField,
  validateContactLead,
} from "~/utils/contactValidation";

const props = defineProps<{
  header?: string;
  variant?: "technical";
}>();

const equipment = ref("");
const machine = ref("");
const power = ref("");
const company = ref("");

const name = ref("");
const phone = ref("");
const email = ref("");
const message = ref("");
const website = ref("");
const consent = ref(false);
const sent = ref(false);
const loader = ref(false);
const error = ref("");
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

const technicalDetails = () => ({
  equipment: equipment.value,
  machine: machine.value,
  power: power.value,
  company: company.value,
});

function onBlur(field: ContactLeadField) {
  nextTick(() => {
    fieldErrors[field] = validateContactField(field, fieldValues()[field]);
  });
}

function onEdit(field: ContactLeadField) {
  if (!fieldErrors[field]) return;
  fieldErrors[field] = validateContactField(field, fieldValues()[field]);
}

function onConsentChange(value: boolean) {
  consent.value = value;
  fieldErrors.consent = value ? "" : validateContactField("consent", value);
}

function validateAllFields(): boolean {
  let ok = true;
  for (const field of Object.keys(fieldErrors) as ContactLeadField[]) {
    const message = validateContactField(field, fieldValues()[field]);
    fieldErrors[field] = message;
    if (message) ok = false;
  }
  return ok;
}

function clearFields() {
  name.value = "";
  phone.value = "";
  email.value = "";
  message.value = "";
  equipment.value = "";
  machine.value = "";
  power.value = "";
  company.value = "";
  website.value = "";
  consent.value = false;
  for (const field of Object.keys(fieldErrors) as ContactLeadField[]) {
    fieldErrors[field] = "";
  }
}

const submit = async () => {
  error.value = "";

  // Honeypot filled → fake success (do not tip off bots)
  if (website.value.trim()) {
    sent.value = true;
    clearFields();
    return;
  }

  // Show field errors without starting the submit loader
  if (!validateAllFields()) return;

  const parsed = validateContactLead({
    name: name.value,
    phone: phone.value,
    email: email.value,
    message: message.value,
    consent: consent.value,
  });

  if (!parsed.success) {
    error.value =
      "Проверьте параметры запроса. Общая длина сообщения не должна превышать 2000 символов.";
    return;
  }

  const technical =
    props.variant === "technical"
      ? validateTechnicalLeadDetails(technicalDetails())
      : undefined;

  if (technical && !technical.success) {
    error.value = "Проверьте дополнительные параметры оборудования.";
    return;
  }

  loader.value = true;

  try {
    const response = await $fetch<{ success: boolean }>("/api/sendMail", {
      method: "POST",
      body: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        message: parsed.data.message,
        consent: consent.value,
        ...(technical?.success ? { technical: technical.data } : {}),
      },
    });

    if (response.success) {
      sent.value = true;
      clearFields();
    } else {
      throw new Error("Неизвестная ошибка");
    }
  } catch (e: unknown) {
    const err = e as {
      data?: {
        message?: string;
        data?: { fields?: { path: string; message: string }[] };
      };
      statusMessage?: string;
      message?: string;
    };
    const fields = err?.data?.data?.fields;
    if (fields?.length) {
      for (const field of fields) {
        if (field.path in fieldErrors) {
          fieldErrors[field.path as ContactLeadField] = field.message;
        }
      }
    }
    error.value =
      err?.data?.message ||
      err?.statusMessage ||
      "Не удалось отправить заявку. Попробуйте позже.";
  } finally {
    loader.value = false;
  }
};
</script>

<style scoped>
.lead-form-state-surface {
  display: grid;
  min-height: 580px;
}

.lead-form-state-surface > :deep(.lead-submit-state) {
  height: 100%;
}

.lead-form-state-enter-active,
.lead-form-state-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.lead-form-state-enter-from,
.lead-form-state-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
