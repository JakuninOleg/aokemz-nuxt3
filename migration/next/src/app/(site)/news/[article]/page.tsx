import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { newsBySlug, newsPath, publicMedia } from '@/lib/public-content';
import { newsSummaryLead } from '@/lib/news-content';
import { NewsArticleView } from '@/components/site/news/NewsArticleView';

type Props = { params: Promise<{ article: string }> };

export const revalidate = 60;
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { article } = await params;
  const record = await newsBySlug(article);
  if (!record) notFound();
  const description = newsSummaryLead(
    record.summary,
    `${record.title}. Новости ОАО «Карпинский электромашиностроительный завод».`,
  );
  const media = await publicMedia(record.image);
  const path = newsPath(record);
  return {
    title: `${record.title} | Новости`,
    description,
    alternates: { canonical: `https://aokemz.ru${path}` },
    openGraph: {
      type: 'article',
      title: `${record.title} | Новости ОАО «КЭМЗ»`,
      description,
      url: `https://aokemz.ru${path}`,
      ...(record.publishedAt ? { publishedTime: record.publishedAt } : {}),
      ...(media ? { images: [{ url: media.url }] } : {}),
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { article } = await params;
  const record = await newsBySlug(article);
  if (!record) notFound();
  const media = await publicMedia(record.image);
  const seoDescription = newsSummaryLead(
    record.summary,
    `${record.title}. Новости ОАО «Карпинский электромашиностроительный завод».`,
  );
  return <NewsArticleView record={record} media={media} seoDescription={seoDescription} />;
}
