import Link from '@/components/site/PublicLink';
import { ABOUT_GEO_SITES } from '@/lib/static-content/about';

export function AboutGeography() {
  return (
    <section className="abt-geo ref-container" aria-labelledby="about-geo-title">
      <header className="abt-geo__copy">
        <h2 id="about-geo-title" className="ref-title">
          География и доверие
        </h2>
        <p className="ref-body">Электрические машины для горнодобывающих предприятий России и СНГ.</p>
      </header>
      <div className="abt-geo__map">
        <img
          src="/media/about/about-geography-map.webp"
          alt="Карта географии поставок КЭМЗ по России и странам СНГ"
          width={1918}
          height={820}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="abt-geo__trust">
        <h3>Площадки эксплуатации</h3>
        <ul>
          {ABOUT_GEO_SITES.map((site) => (
            <li key={site}>{site}</li>
          ))}
        </ul>
        <Link className="abt-text-link" href="/contacts">
          Стать партнёром <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
