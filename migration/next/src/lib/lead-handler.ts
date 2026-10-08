import { validateContactLead, validateTechnicalLeadDetails } from './contact-validation';
import { buildLeadEmail } from './lead-email';
import { randomUUID } from 'node:crypto';
import type { LeadStore } from './lead-store';

type Delivery = (mail: { replyTo: string; subject: string; text: string; html: string }) => Promise<void>;
const buckets = new Map<string, { count: number; until: number }>();
const windowMs = 15 * 60 * 1000;
const perIpAttemptLimit = 5;
const sharedAttemptLimit = 50;
export function resetLeadLimitsForTest() { buckets.clear(); }
const reply = (status: number, message: string, extra: Record<string, unknown> = {}, headers = {}) => Response.json({ success: false, message, ...extra }, { status, headers });

// Injectable delivery keeps validation/security tests from sending real mail.
export async function handleLead(request: Request, delivery: Delivery, ip = 'unknown', store?: LeadStore) {
  const origin = request.headers.get('origin');
  const allowed = new Set(['https://aokemz.ru', 'https://www.aokemz.ru']);
  if (process.env.PUBLIC_SITE_URL) {
    try {
      allowed.add(new URL(process.env.PUBLIC_SITE_URL).origin);
    } catch {
      // Invalid PUBLIC_SITE_URL must not 500 the form endpoint.
    }
  }
  if (process.env.NODE_ENV !== 'production' || process.env.ALLOW_LOCAL_PREVIEW === 'true') {
    allowed.add('http://127.0.0.1:3100'); allowed.add('http://localhost:3100');
  }
  if (!origin || !allowed.has(origin)) return reply(403, 'Недопустимый источник запроса.');
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return reply(415, 'Ожидается JSON.');
  const reader = request.body?.getReader();
  if (!reader) return reply(400, 'Пустой запрос.');
  let size = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16_384) { await reader.cancel(); return reply(413, 'Слишком большой запрос.'); }
    chunks.push(value);
  }
  let body: Record<string, unknown>;
  try {
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return reply(400, 'Некорректный запрос.');
    body = parsed as Record<string, unknown>;
  } catch { return reply(400, 'Некорректный JSON.'); }
  if (body.website) return Response.json({ success: true });
  const now = Date.now();
  for (const [key, bucket] of buckets) if (bucket.until <= now) buckets.delete(key);
  const bucket = buckets.get(ip);
  // Without a verified proxy IP, this bucket serves the whole site.
  const attemptLimit = ip === 'unknown' ? sharedAttemptLimit : perIpAttemptLimit;
  if (bucket && bucket.count >= attemptLimit) {
    const retryAfter = Math.ceil((bucket.until - now) / 1000);
    return reply(429, 'Слишком много заявок. Попробуйте позже.', { retryAfterSec: retryAfter }, { 'Retry-After': String(retryAfter) });
  }
  if (!bucket && buckets.size >= 5000) return reply(503, 'Отправка временно недоступна.');
  buckets.set(ip, bucket ? { ...bucket, count: bucket.count + 1 } : { count: 1, until: now + windowMs });
  const lead = validateContactLead({ name: body.name, phone: body.phone, email: body.email, message: body.message, consent: body.consent });
  if (!lead.success) return reply(400, lead.error.issues[0]?.message || 'Проверьте поля формы.', { fields: lead.error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message })) });
  const technical = body.technical === undefined ? undefined : validateTechnicalLeadDetails(body.technical);
  if (technical && !technical.success) return reply(400, technical.error.issues[0]?.message || 'Проверьте параметры оборудования.');
  if (body.requestId !== undefined && (typeof body.requestId !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(body.requestId))) return reply(400, 'Некорректный идентификатор заявки.');
  const sourcePath = typeof body.sourcePath === 'string' && /^\/(?!\/)[^?#\s\\]{0,250}$/.test(body.sourcePath) ? body.sourcePath : '/';
  let stored: { id: number; created: boolean } | undefined;
  if (store) {
    try { stored = await store.reserve({ ...lead.data, technical: technical?.success ? technical.data : undefined, sourcePath, requestId: typeof body.requestId === 'string' ? body.requestId : randomUUID() }); }
    catch { return reply(503, 'Не удалось сохранить заявку. Попробуйте позже.'); }
    if (!stored.created) return Response.json({ success: true });
  }
  const email = buildLeadEmail(lead.data, { ip, technical: technical?.success ? technical.data : undefined });
  let mailStatus: 'sent' | 'failed' = 'sent';
  try { await delivery({ ...email, replyTo: lead.data.email }); }
  catch { mailStatus = 'failed'; }
  if (stored && store) {
    try { await store.finish(stored.id, mailStatus); }
    catch { console.error('lead_notification_status_update_failed', { leadId: stored.id }); }
    // Once accepted in the DB, do not invite another submission on SMTP failure.
    return Response.json({ success: true });
  }
  return mailStatus === 'sent' ? Response.json({ success: true }) : reply(502, 'Не удалось отправить заявку. Попробуйте позже.');
}
