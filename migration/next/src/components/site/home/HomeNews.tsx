import Link from '@/components/site/PublicLink';
import { formatHomeNewsDate } from '@/lib/home-content';
import { news, newsPath, publicMedia } from '@/lib/public-content';

export async function HomeNews() {
  const records = (await news()).slice(0, 3);
  const articles = await Promise.all(
    records.map(async (article) => {
      const media = await publicMedia(article.image);
      return {
        id: article.id,
        href: newsPath(article),
        title: article.title,
        date: article.publishedAt,
        dateLabel: article.publishedAt
          ? formatHomeNewsDate(article.publishedAt)
          : null,
        image: media?.url ?? null,
      };
    }),
  );

  return (
    <section className="ref-news ref-container" aria-labelledby="news-title">
      <header>
        <h2 id="news-title" className="ref-title">
          Новости
        </h2>
        <Link href="/news" className="ref-link">
          Все новости <span aria-hidden="true">→</span>
        </Link>
      </header>
      {articles.length ? (
        <div className="ref-news__grid">
          {articles.map((article, index) => (
            <Link
              key={article.id}
              href={article.href}
              className={[
                'ref-news__item',
                index === 0 ? 'ref-news__item--featured' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {article.image ? (
                <img
                  src={article.image}
                  alt={article.title}
                  width={900}
                  height={600}
                  loading="lazy"
                />
              ) : null}
              <div className="ref-news__copy">
                {article.date && article.dateLabel ? (
                  <time dateTime={article.date}>{article.dateLabel}</time>
                ) : null}
                <h3>{article.title}</h3>
                <span className="ref-news__more">
                  Читать <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="ref-news__status">
          Новые публикации появятся в разделе новостей.
        </p>
      )}
    </section>
  );
}
