import type { ContactLead } from '~/utils/contactValidation'
import { formatRuPhoneDisplay } from '~/utils/contactValidation'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatMoscowTime(date = new Date()): string {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date)
}

export function buildLeadEmail(lead: ContactLead, meta?: { ip?: string }) {
  const when = formatMoscowTime()
  const phone = formatRuPhoneDisplay(lead.phone)
  const rows = [
    ['Организация / имя', lead.name],
    ['Телефон', phone],
    ['Email', lead.email],
    ['Сообщение', lead.message],
    ['Получено', when],
  ] as const

  const text = [
    'Новая заявка с сайта aokemz.ru',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    meta?.ip ? `IP: ${meta.ip}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  const rowHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;width:160px;vertical-align:top;">
          ${escapeHtml(label)}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:15px;line-height:1.5;white-space:pre-wrap;">
          ${escapeHtml(value)}
        </td>
      </tr>`
    )
    .join('')

  const html = `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="background:#0b0d10;padding:24px 28px;">
              <div style="color:#2f78cd;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;font-weight:700;">ОАО «КЭМЗ»</div>
              <div style="color:#ffffff;font-size:22px;font-weight:700;margin-top:8px;">Новая заявка с сайта</div>
              <div style="color:#9ca3af;font-size:13px;margin-top:6px;">aokemz.ru · ${escapeHtml(when)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 12px 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rowHtml}</table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 24px;background:#f9fafb;color:#6b7280;font-size:12px;line-height:1.5;">
              Письмо сформировано автоматически. Ответьте клиенту на ${escapeHtml(lead.email)} или по телефону ${escapeHtml(phone)}.
              ${meta?.ip ? `<br>IP: ${escapeHtml(meta.ip)}` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return {
    subject: `Заявка с aokemz.ru — ${lead.name}`,
    text,
    html,
  }
}
