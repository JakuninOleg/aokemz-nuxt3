import { z } from 'zod'

const VOWELS = /[aeiouyаеёиоуыэюя]/i

/** Strip to digits only */
export function digitsOnly(value: string): string {
  return (value || '').replace(/\D/g, '')
}

/**
 * Normalize RU phone to 7XXXXXXXXXX (11 digits).
 * Accepts +7…, 8…, or 9XXXXXXXXX mobile without country code.
 * After country code 7, the next digit must be 3–9 (DEF/ABC codes).
 */
export function normalizeRuPhone(value: string): string | null {
  let digits = digitsOnly(value)
  if (!digits) return null

  if (digits.length === 11 && digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  } else if (digits.length === 10 && digits.startsWith('9')) {
    digits = `7${digits}`
  }

  if (!/^7[3-9]\d{9}$/.test(digits)) return null
  return digits
}

/** Explicit RU phone validation message for UI. */
export function ruPhoneError(value: string): string | null {
  const trimmed = (value || '').trim()
  if (!trimmed) return 'Укажите телефон'

  let digits = digitsOnly(trimmed)
  if (!digits || digits === '7') return 'Укажите телефон'

  if (digits.length === 11 && digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  } else if (digits.length === 10 && digits.startsWith('9')) {
    digits = `7${digits}`
  }

  if (digits.length < 11) {
    return `Не хватает цифр: нужно 11, сейчас ${digits.length} (код страны 7 + 10 цифр номера)`
  }

  if (digits.length > 11) {
    return 'Слишком много цифр: российский номер — +7 и ещё 10 цифр'
  }

  if (!digits.startsWith('7')) {
    return 'Номер должен начинаться с +7 (Россия)'
  }

  const codeDigit = digits[1]
  if (codeDigit && !/[3-9]/.test(codeDigit)) {
    return `После +7 первая цифра кода должна быть от 3 до 9, а не «${codeDigit}». Пример: +7 (912) 345-67-89 или +7 (343) 278-37-43`
  }

  if (!/^7[3-9]\d{9}$/.test(digits)) {
    return 'Проверьте номер: +7, затем код из 3 цифр (первая 3–9) и ещё 7 цифр'
  }

  return null
}

export function formatRuPhoneDisplay(digits: string): string {
  const d = digitsOnly(digits)
  if (d.length !== 11) return digits
  return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`
}

/** Heuristic: random bot mash (e.g. gvZWBnEfYvWAMDDJjKlCeccV) */
export function looksLikeGibberish(value: string): boolean {
  const s = (value || '').trim()
  if (s.length < 10) return false

  // Has Cyrillic letters → treat as human copy for RU site
  if (/[а-яёА-ЯЁ]/.test(s)) return false

  const compact = s.replace(/\s+/g, '')
  if (!/^[a-zA-Z0-9._+-]+$/.test(compact)) return false
  if (compact.length < 12) return false

  const letters = compact.replace(/[^a-zA-Z]/g, '')
  if (letters.length < 10) return false

  const vowelCount = (letters.match(new RegExp(VOWELS.source, 'gi')) || []).length
  const vowelRatio = vowelCount / letters.length
  if (vowelRatio < 0.22 && letters.length >= 14) return true

  // Long run of consonants
  if (/[bcdfghjklmnpqrstvwxz]{6,}/i.test(letters)) return true

  // Alternating case entropy typical of bots
  const shifts = letters
    .slice(1)
    .split('')
    .filter((ch, i) => {
      const prev = letters[i]
      return (
        (prev === prev.toLowerCase()) !== (ch === ch.toLowerCase()) &&
        prev.toLowerCase() !== prev.toUpperCase()
      )
    }).length
  if (letters.length >= 16 && shifts / (letters.length - 1) > 0.45) return true

  return false
}

export const contactLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Укажите имя или организацию')
    .max(120, 'Слишком длинное имя')
    .refine((v) => /[a-zA-Zа-яёА-ЯЁ]/.test(v), 'Укажите имя или организацию')
    .refine((v) => !looksLikeGibberish(v), 'Проверьте поле «Организация»'),
  phone: z
    .string()
    .trim()
    .min(1, 'Укажите телефон')
    .transform((v, ctx) => {
      const normalized = normalizeRuPhone(v)
      if (!normalized) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: ruPhoneError(v) || 'Укажите корректный российский телефон',
        })
        return z.NEVER
      }
      return normalized
    }),
  email: z
    .string()
    .trim()
    .max(160)
    .email('Некорректный email')
    .refine((v) => !looksLikeGibberish(v.split('@')[0] || ''), 'Проверьте email'),
  message: z
    .string()
    .trim()
    .min(10, 'Сообщение слишком короткое')
    .max(2000, 'Сообщение слишком длинное')
    .refine((v) => !looksLikeGibberish(v), 'Проверьте текст сообщения'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Необходимо согласие на обработку персональных данных' }),
  }),
})

export type ContactLeadInput = z.input<typeof contactLeadSchema>
export type ContactLead = z.output<typeof contactLeadSchema>
export type ContactLeadField = keyof ContactLeadInput

export function validateContactLead(data: unknown) {
  return contactLeadSchema.safeParse(data)
}

/** Validate a single field (for blur). Returns message or empty string. */
export function validateContactField(field: ContactLeadField, value: unknown): string {
  const fillers: ContactLeadInput = {
    name: 'ООО Пример',
    phone: '79991234567',
    email: 'sales@example.com',
    message: 'Текст сообщения для проверки поля',
    consent: true,
  }
  const result = contactLeadSchema.safeParse({
    ...fillers,
    [field]: value,
  })
  if (result.success) return ''
  const issue = result.error.issues.find((item) => item.path[0] === field)
  return issue?.message || 'Проверьте поле'
}
