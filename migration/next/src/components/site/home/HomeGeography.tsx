import { HOME_GEO_CUSTOMERS } from '@/lib/home-content';
import { HomeActionButton } from './HomeActionButton';

export function HomeGeography() {
  return (
    <section className="ref-geography ref-container" aria-labelledby="geography-title">
      <div className="ref-geography__copy">
        <p className="ref-label">География</p>
        <h2 id="geography-title" className="ref-title">
          КЭМЗ работает
          <br />
          там, где идёт добыча
        </h2>
        <p className="ref-body">
          Электрические машины для горнодобывающих предприятий России и зарубежных
          площадок.
        </p>
        <HomeActionButton href="/about">О заводе</HomeActionButton>
      </div>
      <div className="ref-geography__map">
        <picture>
          <source
            media="(max-width: 720px)"
            srcSet="/media/generated/supply-geography-map-v2-800.webp"
          />
          <img
            src="/media/generated/supply-geography-map-v2.webp"
            alt="Карта поставок КЭМЗ: Карпинск, Россия, Казахстан, Узбекистан, Индия"
            width={1600}
            height={800}
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
      <div className="ref-geography__trust">
        <h3>География эксплуатации</h3>
        <ul>
          {HOME_GEO_CUSTOMERS.map((customer) => (
            <li key={customer}>{customer}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
