<template>
  <input
    ref="inputEl"
    :value="formattedPhone"
    type="tel"
    inputmode="tel"
    autocomplete="tel"
    name="phone"
    placeholder="+7 (___) ___-__-__"
    maxlength="18"
    required
    class="font-light border pl-2 py-2 border-gray-500 w-full"
    :class="{ 'border-red-500': invalid }"
    @focus="onFocus"
    @blur="onBlur"
    @keydown="onKeydown"
    @input="onInput"
  />
</template>

<script setup lang="ts">
/**
 * RU phone mask (+7 …).
 * Digits in v-model → 7XXXXXXXXXX. Backspace/Delete edit digits, not "( ) -".
 */
import { nextTick, ref, watch } from 'vue'
import {
  digitsOnly,
  formatRuPhoneDisplay,
  normalizeRuPhone,
} from '~/utils/contactValidation'

const props = defineProps<{
  modelValue: string
  invalid?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}>()

const inputEl = ref<HTMLInputElement | null>(null)
const phone = ref('')
const formattedPhone = ref('')

function toRuDigits(raw: string): string {
  let d = digitsOnly(raw)
  if (!d) return ''
  if (d.startsWith('8')) d = `7${d.slice(1)}`
  if (d.startsWith('9')) d = `7${d}`
  if (!d.startsWith('7')) d = `7${d}`
  return d.slice(0, 11)
}

function formatFromDigits(digits: string): string {
  if (!digits || digits === '7') return '+7 ('
  if (digits.length < 4) return `+7 (${digits.slice(1)}`
  if (digits.length === 4) return `+7 (${digits.slice(1, 4)}`
  if (digits.length < 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`
  if (digits.length < 9) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`
}

/** How many phone digits appear in `formatted` before `caret` */
function digitCountBefore(formatted: string, caret: number): number {
  let n = 0
  for (let i = 0; i < caret && i < formatted.length; i++) {
    if (/\d/.test(formatted[i]!)) n++
  }
  return n
}

function caretAfterDigitCount(formatted: string, digitCount: number): number {
  if (digitCount <= 0) {
    const open = formatted.indexOf('(')
    return open >= 0 ? open + 1 : formatted.length
  }
  let n = 0
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i]!)) {
      n++
      if (n >= digitCount) return i + 1
    }
  }
  return formatted.length
}

function apply(digits: string, caretDigits?: number) {
  phone.value = digits
  formattedPhone.value = digits ? formatFromDigits(digits) : ''
  emit('update:modelValue', digits)

  const el = inputEl.value
  if (!el) return

  // Vue skips a DOM patch when an extra digit is truncated back to the same
  // reactive value. Restore the controlled display explicitly so the browser
  // cannot leave that digit after the caret.
  if (el.value !== formattedPhone.value) {
    el.value = formattedPhone.value
  }

  if (caretDigits === undefined) return
  const pos = caretAfterDigitCount(formattedPhone.value, caretDigits)
  nextTick(() => el.setSelectionRange(pos, pos))
}

watch(
  () => props.modelValue,
  (value) => {
    const next = toRuDigits(value || '')
    phone.value = next
    formattedPhone.value = next ? formatFromDigits(next) : ''
  },
  { immediate: true }
)

function onFocus() {
  if (!phone.value) apply('7', 1)
}

function clearIncomplete() {
  emit('update:modelValue', '')
  phone.value = ''
  formattedPhone.value = ''
  if (inputEl.value) inputEl.value.value = ''
}

function onBlur() {
  const raw = phone.value || toRuDigits(inputEl.value?.value || '')
  const normalized = normalizeRuPhone(raw)
  if (!normalized) {
    // Incomplete entry: clear only empty/+7 stub so validation can show a clear error
    if (!raw || raw === '7') clearIncomplete()
    emit('blur')
    return
  }
  phone.value = normalized
  formattedPhone.value = formatRuPhoneDisplay(normalized)
  emit('update:modelValue', normalized)
  emit('blur')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Backspace' && e.key !== 'Delete') return

  const el = inputEl.value
  if (!el) return

  const start = el.selectionStart ?? 0
  const end = el.selectionEnd ?? 0
  const formatted = formattedPhone.value
  e.preventDefault()

  if (start !== end) {
    const from = digitCountBefore(formatted, start)
    const to = digitCountBefore(formatted, end)
    let digits = phone.value.slice(0, from) + phone.value.slice(to)
    digits = toRuDigits(digits) || '7'
    apply(digits, Math.max(1, from))
    return
  }

  if (e.key === 'Backspace') {
    const idx = digitCountBefore(formatted, start)
    if (idx <= 1) {
      apply('7', 1)
      return
    }
    const digits = phone.value.slice(0, idx - 1) + phone.value.slice(idx)
    apply(digits || '7', idx - 1)
    return
  }

  const idx = digitCountBefore(formatted, start)
  if (idx < 1 || idx >= phone.value.length) return
  const digits = phone.value.slice(0, idx) + phone.value.slice(idx + 1)
  apply(digits || '7', idx)
}

function onInput() {
  const el = inputEl.value
  if (!el) return

  // Count against the browser value after the insert (not previous Vue state).
  const caret = el.selectionStart ?? el.value.length
  const typingAtEnd = caret >= el.value.length
  const digitsBefore = digitCountBefore(el.value, caret)
  const digits = toRuDigits(el.value) || '7'
  const caretDigits = typingAtEnd
    ? digits.length
    : Math.max(1, Math.min(digits.length, digitsBefore))

  apply(digits, caretDigits)
}
</script>
