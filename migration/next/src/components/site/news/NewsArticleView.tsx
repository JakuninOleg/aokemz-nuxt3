import Link from 'next/link';
import { JsonLd, MediaImage, RichContent } from '@/components/site/Content';
import type { PublicMedia } from '@/lib/public-content';
import { newsPath } from '@/lib/public-content';
import { formatNewsDate, NEWS_ARTICLE_FIGURE } from '@/lib/news-content';
import type { News } from '@/payload-types';
import { NewsCta } from './NewsCta';

type Props = {
  record: Pick<News, 'id' | 'title' | 'slug' | 'legacyId' | 'publishedAt' | 'updatedAt' | 'body'>;
  media: PublicMedia | null;
  seoDescription?: string;
};

export async function NewsArticleView({ record, media, seoDescription }: Props) {
  const path = newsPath(record);
  const figureSrc = media?.url || NEWS_ARTICLE_FIGURE.image;
  const figureAlt = media
    ? media.alt && /[А-Яа-яЁё]/.test(media.alt)
      ? media.alt
      : record.title
    : NEWS_ARTICLE_FIGURE.imageAlt;
  const dateLabel = record.publishedAt ? formatNewsDate(record.publishedAt) : '';

  return (
    <div className="kemz-home kemz-news">
      <section
        className="news-hero news-hero--article internal-hero internal-hero--compact"
        aria-labelledby={`news-article-title-${record.id}`}
      >
        <div className="ref-container news-hero__content internal-hero__content">
          <nav className="news-hero__crumbs internal-hero__crumbs" aria-label="Хлебные крошки">
            <Link href="/">Главная</Link>
            <span aria-hidden="true">/</span>
            <Link href="/news">Новости</Link>
          </nav>
          <h1 id={`news-article-title-${record.id}`}>{record.title}</h1>
        </div>
      </section>

      <article className="news-article">
        <div className="ref-container news-article__main">
          {record.publishedAt ? (
            <time className="news-article__date" dateTime={record.publishedAt}>
              {dateLabel}
            </time>
          ) : null}
          <figure className="news-article__figure">
            {media ? (
              <MediaImage media={media} alt={figureAlt} priority sizes="(max-width: 720px) 100vw, 960px" />
            ) : (
              <img
                src={figureSrc}
                alt={figureAlt}
                width={1280}
                height={720}
                fetchPriority="high"
                decoding="async"
              />
            )}
          </figure>
          {record.body ? <RichContent data={record.body} className="news-article__body" /> : null}
          <Link href="/news" className="news-article__back-btn">
            <span className="news-article__back-arrow" aria-hidden="true">
              ←
            </span>
            Все новости
          </Link>
        </div>
      </article>

      <NewsCta />

      <JsonLd
        value={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://aokemz.ru/' },
            { '@type': 'ListItem', position: 2, name: 'Новости', item: 'https://aokemz.ru/news' },
            { '@type': 'ListItem', position: 3, name: record.title, item: `https://aokemz.ru${path}` },
          ],
        }}
      />
      {record.publishedAt ? (
        <JsonLd
          value={{
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: record.title,
            mainEntityOfPage: `https://aokemz.ru${path}`,
            datePublished: record.publishedAt,
            dateModified: record.updatedAt,
            ...(seoDescription ? { description: seoDescription } : {}),
            ...(media ? { image: media.url } : {}),
            publisher: {
              '@type': 'Organization',
              name: 'ОАО «Карпинский электромашиностроительный завод»',
              url: 'https://aokemz.ru',
            },
          }}
        />
      ) : null}
    </div>
  );
}
