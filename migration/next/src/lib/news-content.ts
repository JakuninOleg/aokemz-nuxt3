export const NEWS_HERO = {
  title: 'Новости',
  lead: 'Главные события, развитие производства и жизнь завода.',
  rail: ['Надёжные решения', 'для реальных задач'] as const,
  image: '/news/news-hero.webp',
  imageAlt: 'Каска КЭМЗ, чертежи и детали на верстаке в цехе, промышленная иллюстрация',
} as const;

export const NEWS_CTA = {
  title: 'Остались вопросы?',
  lead: 'Напишите в отдел продаж: подскажем по машинам, поставкам и документации.',
  button: 'Связаться',
  aside: ['Опыт', 'Качество', 'Сотрудничество'] as const,
  image: '/media/documents/docs-cta-motors.webp',
  imageAlt: 'Электродвигатели в цехе и чертёж на синем фоне, промышленная иллюстрация',
} as const;

export const NEWS_ARTICLE_FIGURE = {
  image: '/media/documents/docs-cta-machinery.webp',
  imageAlt: 'Статор электродвигателя с медными обмотками, промышленная фотография',
} as const;

export function formatNewsDate(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

/** Strip markdown emphasis markers from CMS summary for on-page display only. */
export function stripMarkdownSummary(value: string): string {
  return value.replace(/__|\*\*/g, '').replace(/\s+/g, ' ').trim();
}

export function newsSummaryLead(summary: string | null | undefined, fallback: string, maxLen = 180): string {
  const cleaned = stripMarkdownSummary(summary || fallback);
  if (cleaned.length <= maxLen) return cleaned;
  return `${cleaned.slice(0, maxLen - 1).replace(/\s+\S*$/, '')}…`;
}
