import Link from 'next/link';
import { news, newsPath, publicMedia } from '@/lib/public-content';
import { formatNewsDate } from '@/lib/news-content';
import { MediaImage } from '@/components/site/Content';

export async function NewsList() {
  const records = await news();
  if (!records.length) {
    return (
      <section className="news-feed" aria-labelledby="news-feed-title">
        <h2 id="news-feed-title" className="visually-hidden">
          Лента новостей
        </h2>
        <div className="news-feed__status ref-container">Новые публикации появятся в этом разделе.</div>
      </section>
    );
  }

  const [featured, ...rest] = records;
  const featuredMedia = await publicMedia(featured.image);
  const featuredHref = newsPath(featured);
  const featuredDate = featured.publishedAt || '';

  return (
    <section className="news-feed" aria-labelledby="news-feed-title">
      <h2 id="news-feed-title" className="visually-hidden">
        Лента новостей
      </h2>
      <Link href={featuredHref} className="news-feature ref-container">
        <div className="news-feature__media">
          {featuredMedia ? (
            <MediaImage
              media={featuredMedia}
              alt={featured.title}
              priority
              sizes="(max-width: 720px) 100vw, 60vw"
            />
          ) : (
            <div className="news-feature__placeholder" aria-hidden="true" />
          )}
        </div>
        <div className="news-feature__panel">
          {featuredDate ? <time dateTime={featuredDate}>{formatNewsDate(featuredDate)}</time> : null}
          <h3>{featured.title}</h3>
          <span className="news-feature__more">
            Читать новость <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
      {rest.length > 0 && (
        <div className="news-grid ref-container">
          {await Promise.all(
            rest.map(async (item) => {
              const media = await publicMedia(item.image);
              const date = item.publishedAt || '';
              return (
                <Link key={item.id} href={newsPath(item)} className="news-card">
                  {media ? (
                    <MediaImage media={media} alt={item.title} sizes="(max-width: 720px) 100vw, 33vw" />
                  ) : (
                    <div className="news-card__placeholder" aria-hidden="true" />
                  )}
                  <div className="news-card__copy">
                    {date ? <time dateTime={date}>{formatNewsDate(date)}</time> : null}
                    <h3>{item.title}</h3>
                    <span className="news-card__more">
                      Читать новость <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              );
            }),
          )}
        </div>
      )}
    </section>
  );
}
