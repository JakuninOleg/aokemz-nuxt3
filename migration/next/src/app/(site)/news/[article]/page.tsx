import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { news, newsBySlug, newsPath, publicMedia } from '@/lib/public-content';
import { newsSummaryLead } from '@/lib/news-content';
import { NewsArticleView } from '@/components/site/news/NewsArticleView';
import { pageMetadata } from '@/lib/static-content/page-seo';

type Props = { params: Promise<{ article: string }> };

export const revalidate = 3600;
export async function generateStaticParams() {
  return (await news()).map(record => ({ article: record.slug }));
}

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
  const base = pageMetadata({ title: `${record.title} | Новости ОАО «КЭМЗ»`, description, path,
    ...(media ? { ogImage: media.url } : {}) });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      ...(record.publishedAt ? { publishedTime: record.publishedAt } : {}),
      modifiedTime: record.updatedAt,
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
