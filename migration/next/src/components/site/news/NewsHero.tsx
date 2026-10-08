import Link from 'next/link';
import { NEWS_HERO } from '@/lib/news-content';

export function NewsHero() {
  return (
    <section className="news-hero internal-hero internal-hero--mobile-surface" aria-labelledby="news-title">
      <img
        className="news-hero__image internal-hero__image"
        src={NEWS_HERO.image}
        alt={NEWS_HERO.imageAlt}
        width={1915}
        height={821}
        fetchPriority="high"
        decoding="async"
      />
      <div className="ref-container news-hero__content internal-hero__content">
        <nav className="news-hero__crumbs internal-hero__crumbs" aria-label="Хлебные крошки">
          <Link href="/">Главная</Link>
          <span aria-hidden="true">/</span>
          <span>Новости</span>
        </nav>
        <h1 id="news-title">{NEWS_HERO.title}</h1>
        <p className="news-hero__lead">{NEWS_HERO.lead}</p>
        <p className="news-hero__rail" aria-hidden="true">
          <span className="news-hero__rail-line" />
          <span className="news-hero__rail-text">
            {NEWS_HERO.rail.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>
        </p>
      </div>
    </section>
  );
}
