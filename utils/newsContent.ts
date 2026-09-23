/** Static copy for /news redesign. Article media stays on Contentful. */

export const NEWS_HERO = {
  title: "Новости",
  lead: "Главные события, развитие производства и жизнь завода.",
  rail: ["Надёжные решения", "для реальных задач"] as const,
  image: "/news/news-hero.webp",
  imageAlt:
    "Каска КЭМЗ, чертежи и детали на верстаке в цехе, промышленная иллюстрация",
} as const;

export const NEWS_CTA = {
  title: "Остались вопросы?",
  lead: "Напишите в отдел продаж: подскажем по машинам, поставкам и документации.",
  button: "Связаться",
  aside: ["Опыт", "Качество", "Сотрудничество"] as const,
  /** Shared photo band with /documents CTA. */
  image: "/media/documents/docs-cta-motors.webp",
  imageAlt:
    "Электродвигатели в цехе и чертёж на синем фоне, промышленная иллюстрация",
} as const;

/** Fallback figure when CMS entry has no cover image. */
export const NEWS_ARTICLE_FIGURE = {
  image: "/media/documents/docs-cta-machinery.webp",
  imageAlt:
    "Статор электродвигателя с медными обмотками, промышленная фотография",
} as const;

export type NewsArticleFields = {
  header: string;
  date: string;
  htmlText?: unknown;
  image?: {
    fields?: {
      title?: string;
      description?: string;
      file?: { url?: string };
    };
  };
};

export type NewsArticleEntry = {
  sys: { id: string };
  fields: NewsArticleFields;
};

export type NewsListItem = {
  id: string;
  title: string;
  date: string;
  dateLabel: string;
  image?: string;
  imageAlt: string;
};

export function contentfulImageUrl(
  url?: string,
  options: { width?: number; quality?: number } = {},
): string | undefined {
  if (!url) return undefined;
  const absoluteUrl = url.startsWith("//") ? `https:${url}` : url;
  const extension = absoluteUrl.split("?")[0].toLowerCase();
  if (!/\.(avif|jpe?g|png|webp)$/.test(extension)) return absoluteUrl;

  const parsed = new URL(absoluteUrl);
  parsed.searchParams.set("fm", "webp");
  parsed.searchParams.set("w", String(options.width ?? 1200));
  parsed.searchParams.set("q", String(options.quality ?? 82));
  return parsed.toString();
}

export function formatNewsDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

/** First sentence from rich-text HTML for the article hero lead. */
export function newsArticleLeadFromHtml(html: string, maxLen = 140): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";

  const sentence = text.match(/^[\s\S]+?[.!?…](?=\s|$)/)?.[0]?.trim();
  const lead = sentence || text;
  if (lead.length <= maxLen) return lead;

  const cut = lead.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd();
}

export function mapNewsEntry(entry: NewsArticleEntry): NewsListItem {
  const url = contentfulImageUrl(entry.fields.image?.fields?.file?.url);
  const assetLabel =
    entry.fields.image?.fields?.description ||
    entry.fields.image?.fields?.title ||
    entry.fields.header;

  return {
    id: entry.sys.id,
    title: entry.fields.header,
    date: entry.fields.date,
    dateLabel: formatNewsDate(entry.fields.date),
    image: url,
    imageAlt: assetLabel,
  };
}
