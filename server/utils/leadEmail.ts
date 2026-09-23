import type {
  ContactLead,
  TechnicalLeadDetails,
} from "~/utils/contactValidation";
import { formatRuPhoneDisplay } from "~/utils/contactValidation";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatMoscowTime(date = new Date()): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export function buildLeadEmail(
  lead: ContactLead,
  meta?: { ip?: string; technical?: TechnicalLeadDetails },
) {
  const when = formatMoscowTime();
  const phone = formatRuPhoneDisplay(lead.phone);
  const phoneHref = `+${lead.phone}`;
  const emailHref = encodeURIComponent(lead.email);
  const technicalRows = meta?.technical
    ? ([
        ["Тип оборудования", meta.technical.equipment],
        ["Модель техники", meta.technical.machine],
        ["Необходимая мощность, кВт", meta.technical.power],
        ["Компания", meta.technical.company],
      ].filter(([, value]) => Boolean(value)) as [string, string][])
    : [];
  const rows = [
    ["Организация / имя", lead.name],
    ["Телефон", phone],
    ["Email", lead.email],
    ...technicalRows,
    ["Сообщение", lead.message],
    ["Получено", when],
  ] as const;

  const text = [
    "Новая заявка с сайта aokemz.ru",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    meta?.ip ? `IP: ${meta.ip}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const rowHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td width="32%" style="padding:15px 20px;border-bottom:1px solid #dbe5f0;background:#f4f8fc;color:#54708c;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;vertical-align:top;text-align:left;">
          ${escapeHtml(label)}
        </td>
        <td width="68%" style="padding:15px 20px;border-bottom:1px solid #dbe5f0;color:#102b52;font-size:15px;font-weight:600;line-height:1.55;text-align:left;word-break:break-word;overflow-wrap:anywhere;">
          ${escapeHtml(value)}
        </td>
      </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#edf3f9;font-family:Arial,Helvetica,sans-serif;color:#102b52;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#edf3f9;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #c9d9e9;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="height:5px;background:#1476df;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="background:#082b57;padding:28px 30px 26px;text-align:left;">
              <div style="color:#8fc5ff;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">ОАО «КЭМЗ»</div>
              <div style="color:#ffffff;font-size:25px;font-weight:700;line-height:1.2;padding-top:9px;">Новая заявка с сайта</div>
              <div style="color:#c7dcf1;font-size:13px;line-height:1.5;padding-top:8px;">aokemz.ru&nbsp;&nbsp;•&nbsp;&nbsp;${escapeHtml(when)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 20px 20px;text-align:left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #dbe5f0;border-collapse:separate;border-spacing:0;border-radius:8px;overflow:hidden;">${rowHtml}</table>
            </td>
          </tr>
          <tr>
            <td style="padding:4px 30px 28px;background:#ffffff;color:#54708c;font-size:13px;line-height:1.6;text-align:left;">
              Связаться с заявителем:
              <a href="mailto:${emailHref}" style="color:#146dcc;font-weight:700;text-decoration:none;">${escapeHtml(lead.email)}</a>
              <span style="color:#9ab0c5;">&nbsp;|&nbsp;</span>
              <a href="tel:${phoneHref}" style="color:#146dcc;font-weight:700;text-decoration:none;">${escapeHtml(phone)}</a>.
              ${meta?.ip ? `<br><span style="font-size:11px;color:#7890a7;">IP: ${escapeHtml(meta.ip)}</span>` : ""}
            </td>
          </tr>
          <tr>
            <td style="padding:15px 30px;background:#f4f8fc;border-top:1px solid #dbe5f0;color:#7890a7;font-size:11px;line-height:1.5;text-align:left;">Письмо сформировано автоматически формой aokemz.ru.</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `Заявка с aokemz.ru: ${lead.name}`,
    text,
    html,
  };
}
