import Link from '@/components/site/PublicLink';
import {
  PRODUCTION_CAPABILITIES,
  PRODUCTION_CTA,
  PRODUCTION_GALLERY,
  PRODUCTION_HERO,
  PRODUCTION_QUALITY,
  PRODUCTION_STAGES,
} from '@/lib/static-content/production';
import { CtaBand } from '../CtaBand';
import { ProductionLineIcon } from '../ProductionLineIcon';

export function ProductionPage() {
  return (
    <main className="kemz-home kemz-production">
      <section
        className="production-hero internal-hero internal-hero--mobile-surface internal-hero--mobile-about"
        aria-labelledby="production-title"
      >
        <picture>
          <source media="(max-width: 767px)" srcSet={PRODUCTION_HERO.mobileImage} />
          <img
            className="production-hero__image internal-hero__image"
            src={PRODUCTION_HERO.image}
            alt={PRODUCTION_HERO.imageAlt}
            width={1280}
            height={720}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="ref-container production-hero__content internal-hero__content">
          <nav className="production-hero__crumbs internal-hero__crumbs" aria-label="Хлебные крошки">
            <Link href="/">Главная</Link>
            <span aria-hidden="true">/</span>
            <span>Производство</span>
          </nav>

          <h1 id="production-title">{PRODUCTION_HERO.title}</h1>
          <p className="production-hero__lead">{PRODUCTION_HERO.lead}</p>

          <p className="production-hero__rail" aria-hidden="true">
            <span className="production-hero__rail-line" />
            <span className="production-hero__rail-text">
              {PRODUCTION_HERO.rail.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </p>

          <ul className="production-hero__points" aria-label="Ориентиры производства">
            {PRODUCTION_HERO.points.map((point) => (
              <li key={point.title}>
                <ProductionLineIcon name={point.icon} />
                <span>{point.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="production-section ref-container" aria-labelledby="production-stages-title">
        <div className="production-section__head">
          <div>
            <h2 id="production-stages-title">Этапы производства</h2>
            <p>От конструкции до стенда: ключевые процессы площадки в Карпинске.</p>
          </div>
          <Link href="/products" className="production-link">
            Подробнее <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ol className="production-stages">
          {PRODUCTION_STAGES.map((stage) => (
            <li key={stage.number}>
              <div className="production-stages__media">
                <img
                  src={stage.image}
                  alt={stage.alt}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                />
                <strong>{stage.number}</strong>
              </div>
              <h3>{stage.title}</h3>
              <p>{stage.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="production-section ref-container"
        aria-labelledby="production-capabilities-title"
      >
        <div className="production-inline-head">
          <h2 id="production-capabilities-title">Производственные возможности</h2>
          <Link href="/products" className="production-link">
            Подробнее <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ul className="production-capabilities">
          {PRODUCTION_CAPABILITIES.map((item) => (
            <li key={item.value}>
              <ProductionLineIcon name={item.icon} />
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="production-section ref-container" aria-labelledby="production-gallery-title">
        <h2 id="production-gallery-title">Наше производство</h2>
        <div className="production-gallery">
          {PRODUCTION_GALLERY.map((item) => (
            <figure key={item.title} className={item.featured ? 'is-featured' : undefined}>
              <img
                src={item.image}
                alt={item.alt}
                width={1200}
                height={800}
                loading="lazy"
                decoding="async"
              />
              <figcaption>{item.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="production-quality" aria-labelledby="quality-title">
        <div className="ref-container production-quality__grid">
          <div>
            <h2 id="quality-title">Контроль качества</h2>
            <p>
              Машины проходят электрические и механические испытания на стендах завода. Продукция
              соответствует требованиям ГОСТ и ТУ.
            </p>
          </div>
          <ul>
            {PRODUCTION_QUALITY.map((item) => (
              <li key={item.title}>
                <ProductionLineIcon name={item.icon} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title={PRODUCTION_CTA.title}
        lead={PRODUCTION_CTA.lead}
        image={PRODUCTION_CTA.image}
        imageAlt={PRODUCTION_CTA.imageAlt}
        buttonLabel={PRODUCTION_CTA.button}
        aside={PRODUCTION_CTA.aside}
        titleId="production-cta-title"
      />
    </main>
  );
}
