'use client';
import { useEffect, useState } from 'react';
import type { AnalyticsResult } from '../../lib/metrika';

const number = (value: number) => new Intl.NumberFormat('ru-RU').format(value);
export default function OJAnalytics({ compact = false }: { compact?: boolean }) {
  const [days, setDays] = useState(30);
  const [report, setReport] = useState<AnalyticsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/analytics?days=${days}`, { signal: controller.signal, cache: 'no-store' })
      .then(async response => { if (!response.ok) throw new Error(); return response.json(); })
      .then(setReport).catch(() => { if (!controller.signal.aborted) setReport({ state: 'error', message: 'Не удалось загрузить статистику. Попробуйте ещё раз.' }); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [days, attempt]);
  const data = !loading && report?.state === 'ready' ? report : null;
  const points = data?.dailyVisits || [];
  const max = Math.max(1, ...points);
  const path = points.map((value, i) => `${i === 0 ? 'M' : 'L'}${20 + i * 660 / Math.max(1, points.length - 1)},${145 - value / max * 120}`).join(' ');
  const titleId = compact ? 'oj-analytics-summary-title' : 'oj-analytics-title';
  return <section className={`oj-analytics${compact ? ' oj-analytics--compact' : ''}`} aria-labelledby={titleId} aria-busy={loading}>
    <header><div><h2 id={titleId}>{compact ? 'Посещаемость сайта' : 'Статистика посещений'}</h2>{!compact && <p>Яндекс Метрика · aokemz.ru</p>}</div>
      <label><span className="oj-sr-only">Период статистики</span><select value={days} onChange={event => setDays(Number(event.target.value))}>
        <option value={7}>7 дней</option><option value={30}>30 дней</option><option value={90}>90 дней</option></select></label></header>
    {loading ? <p role="status" className="oj-analytics__message">Загружаем статистику…</p> : data ? <>
      {compact ? <div className="oj-analytics__summary"><strong>{number(data.users)}</strong><span>Уникальных посетителей</span><svg viewBox="0 0 700 165" role="img" aria-label={`Визиты за ${days} дней: ${number(data.visits)}`}><path d={path} stroke="var(--oj-blue)" strokeWidth="5" fill="none" /></svg></div> : <>
      <dl className="oj-analytics__totals"><div><dt>Посетители</dt><dd>{number(data.users)}</dd></div><div><dt>Визиты</dt><dd>{number(data.visits)}</dd></div><div><dt>Просмотры</dt><dd>{number(data.pageviews)}</dd></div></dl>
      {points.length ? <figure><svg viewBox="0 0 700 165" role="img" aria-label={`Визиты по дням: всего ${number(data.visits)} за период`}><path d="M20 25H680 M20 85H680 M20 145H680" stroke="var(--oj-line)" fill="none" /><path d={path} stroke="var(--oj-blue)" strokeWidth="3" fill="none" strokeLinejoin="round" /></svg>
        <figcaption><span>{data.from}</span><span>Визиты по дням</span><span>{data.to}</span></figcaption><details><summary>Данные графика</summary><ol>{points.map((value, i) => <li key={i}>День {i + 1}: {number(value)} визитов</li>)}</ol></details></figure> : <p>В этом периоде ещё нет визитов.</p>}
      <h3>Популярные страницы</h3>{data.pages.length ? <ol className="oj-analytics__pages">{data.pages.map((page, i) => <li key={`${page.path}-${i}`}><span>{page.path}</span><strong>{number(page.views)}</strong></li>)}</ol> : <p>Нет данных о просмотрах страниц.</p>}
      <p className="oj-analytics__note">Полные дни до вчера включительно. Обновлено: {new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow' }).format(new Date(data.updatedAt))} (МСК).{data.sampled ? ' Яндекс использовал выборку.' : ''}</p>
      </>}
    </> : <div className="oj-analytics__message" role="status"><p>{report && report.state !== 'ready' ? report.message : ''}</p>{report?.state === 'error' && <button type="button" onClick={() => setAttempt(value => value + 1)}>Повторить</button>}<a href="https://metrika.yandex.ru/dashboard?id=113528354" target="_blank" rel="noopener noreferrer">Открыть Яндекс Метрику</a></div>}
  </section>;
}
