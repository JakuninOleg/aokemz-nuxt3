import nodemailer from "nodemailer";
import { createError, defineEventHandler, getRequestIP, readBody } from "h3";
import {
  validateContactLead,
  validateTechnicalLeadDetails,
} from "~/utils/contactValidation";
import { buildLeadEmail } from "../utils/leadEmail";
import { checkRateLimit } from "../utils/rateLimit";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown";

  // Honeypot: pretend success so bots do not retry smarter
  if (body?.website) {
    return { success: true };
  }

  const limited = checkRateLimit(`lead:${ip}`);
  if (!limited.ok) {
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      message: "Слишком много заявок. Попробуйте позже.",
      data: { retryAfterSec: limited.retryAfterSec },
    });
  }

  const parsed = validateContactLead({
    name: body?.name,
    phone: body?.phone,
    email: body?.email,
    message: body?.message,
    consent: body?.consent === true,
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || "Проверьте поля формы";
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message,
      data: {
        fields: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
  }

  const technical =
    body?.technical === undefined
      ? undefined
      : validateTechnicalLeadDetails(body.technical);

  if (technical && !technical.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message:
        technical.error.issues[0]?.message ||
        "Проверьте параметры оборудования",
    });
  }

  const config = useRuntimeConfig();
  const smtpUser = config.smtpUser;
  const smtpPass = config.smtpPass;
  const mailTo = config.mailTo;
  const mailFrom =
    config.mailFrom || (smtpUser ? `"ОАО «КЭМЗ»" <${smtpUser}>` : "");

  if (!smtpUser || !smtpPass || !mailTo || !mailFrom) {
    console.error("SMTP is not configured (smtpUser/smtpPass/mailTo/mailFrom)");
    throw createError({
      statusCode: 503,
      statusMessage: "Service Unavailable",
      message: "Отправка временно недоступна. Свяжитесь с нами по телефону.",
    });
  }

  const email = buildLeadEmail(parsed.data, {
    ip,
    technical: technical?.success ? technical.data : undefined,
  });
  const port = Number(config.smtpPort) || 465;

  const transporter = nodemailer.createTransport({
    host: config.smtpHost || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      replyTo: parsed.data.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
      // A lead never contains attachments or remotely fetched message content.
      // Keep these capabilities disabled so a future form field cannot make the
      // mailer read a local file or fetch an arbitrary URL.
      disableFileAccess: true,
      disableUrlAccess: true,
    });

    return { success: true };
  } catch (error) {
    console.error("Ошибка отправки письма");
    throw createError({
      statusCode: 502,
      statusMessage: "Bad Gateway",
      message: "Не удалось отправить заявку. Попробуйте позже.",
    });
  }
});
