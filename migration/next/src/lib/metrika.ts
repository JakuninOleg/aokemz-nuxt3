import { createHash } from 'node:crypto';
import { z } from 'zod';
import type { Endpoint } from 'payload';
import { editors } from '../access';

const summarySchema = z.object({ totals: z.array(z.number().finite().nonnegative()).min(3), sampled: z.boolean().optional() });
const timelineSchema = z.object({ totals: z.array(z.array(z.number().finite().nonnegative())).min(1) });
const pagesSchema = z.object({ data: z.array(z.object({ dimensions: z.array(z.object({ name: z.string() })), metrics: z.array(z.number().finite().nonnegative()) })) });
export type AnalyticsReport = { state: 'ready'; days: number; users: number; visits: number; pageviews: number;
  dailyVisits: number[]; pages: { path: string; views: number }[]; from: string; to: string; updatedAt: string; sampled: boolean };
export type AnalyticsResult = AnalyticsReport | { state: 'unconfigured' | 'error'; message: string };
const cache = new Map<string, { expires: number; result: Promise<AnalyticsResult> }>();

/** Server-only OAuth, fixed upstream and bounded timeout. Only aggregate statistics leave this module. */
export async function getMetrikaReport(days: 7 | 30 | 90 = 30): Promise<AnalyticsResult> {
  const token = process.env.YANDEX_METRIKA_TOKEN;
  const counter = process.env.YANDEX_METRIKA_COUNTER_ID || '113528354';
  if (!token || !/^\d+$/.test(counter)) return { state: 'unconfigured', message: 'Для подключения статистики нужен серверный токен Яндекс Метрики с правом чтения.' };
  const key = `${counter}:${createHash('sha256').update(token).digest('hex')}:${days}`;
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.result;
  const result = (async (): Promise<AnalyticsResult> => {
    async function report(path: string, params: Record<string, string>) {
      const url = new URL(`https://api-metrika.yandex.net/stat/v1/${path}`);
      url.search = new URLSearchParams({ ids: counter, date1: `${days}daysAgo`, date2: 'yesterday', accuracy: 'full', timezone: '+03:00', lang: 'ru', ...params }).toString();
      const response = await fetch(url, { headers: { Authorization: `OAuth ${token}` }, signal: AbortSignal.timeout(8000), cache: 'no-store' });
      if (!response.ok) throw new Error(`metrika_http_${response.status}`);
      return response.json();
    }
    try {
      const [summary, timeline, pages] = await Promise.all([
        report('data', { metrics: 'ym:s:users,ym:s:visits,ym:s:pageviews' }).then(data => summarySchema.parse(data)),
        report('data/bytime', { metrics: 'ym:s:visits', group: 'day' }).then(data => timelineSchema.parse(data)),
        report('data', { metrics: 'ym:pv:pageviews', dimensions: 'ym:pv:URLPath', sort: '-ym:pv:pageviews', limit: '5' }).then(data => pagesSchema.parse(data)),
      ]);
      const end = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
      const date = (offset: number) => { const d = new Date(end); d.setDate(d.getDate() - offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
      return { state: 'ready', days, users: summary.totals[0], visits: summary.totals[1], pageviews: summary.totals[2],
        dailyVisits: timeline.totals[0], pages: pages.data.map(row => ({ path: row.dimensions[0]?.name || '/', views: row.metrics[0] || 0 })),
        from: date(days), to: date(1), updatedAt: new Date().toISOString(), sampled: Boolean(summary.sampled) };
    } catch {
      return { state: 'error', message: 'Статистика временно недоступна. Проверьте токен, доступ к счётчику и соединение с Яндексом.' };
    }
  })();
  cache.set(key, { expires: Date.now() + 5 * 60_000, result });
  if (cache.size > 12) cache.delete(cache.keys().next().value!);
  return result;
}

export const analyticsEndpoint: Endpoint = { path: '/analytics', method: 'get', handler: async req => {
  if (!editors({ req })) return Response.json({ message: 'Доступ запрещён.' }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
  const days = Number(new URL(req.url || 'http://localhost').searchParams.get('days') || 30);
  if (days !== 7 && days !== 30 && days !== 90) return Response.json({ message: 'Допустимые периоды: 7, 30 и 90 дней.' }, { status: 400 });
  return Response.json(await getMetrikaReport(days), { headers: { 'Cache-Control': 'private, no-store' } });
} };
