import { HOME_HERO_FACTS } from '@/lib/home-content';
import { HomeActionButton } from './HomeActionButton';
import { HomeEngineeringIcon } from './HomeEngineeringIcon';

export function HomeHero() {
  return (
    <>
      <section className="ref-hero" aria-labelledby="home-title">
        <picture>
          <source
            media="(max-width: 600px)"
            type="image/avif"
            srcSet="/media/generated/hero-quarry-mobile-v2-640.avif 640w, /media/generated/hero-quarry-mobile-v2-832.avif 832w, /media/generated/hero-quarry-mobile-v2-1024.avif 1024w"
            sizes="100vw"
          />
          <source
            media="(max-width: 600px)"
            srcSet="/media/generated/hero-quarry-mobile-v1-640.webp 640w, /media/generated/hero-quarry-mobile-v1-832.webp 832w, /media/generated/hero-quarry-mobile-v1-1024.webp 1024w"
            sizes="100vw"
          />
          <img
            className="ref-hero__image"
            src="/media/generated/hero-quarry-dragline-wide-v11.webp"
            sizes="100vw"
            width={1600}
            height={533}
            alt="Карьерный экскаватор в открытой выработке"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="ref-container ref-hero__content">
          <p className="ref-hero__eyebrow">
            С 1960 года <span>|</span> Карпинск
          </p>
          <h1 id="home-title">
            Электрические
            <br />
            машины для
            <br />
            горнодобывающей
            <br />
            техники
          </h1>
          <p className="ref-hero__description">
            Проектируем, производим и испытываем двигатели и генераторы для
            экскаваторов, карьерных самосвалов и шахтной техники.
          </p>
          <div className="ref-hero__actions">
            <HomeActionButton href="/products" onDark>
              Перейти в каталог
            </HomeActionButton>
          </div>
        </div>
      </section>
      <section className="ref-facts" aria-label="Оборудование и поставки">
        <div className="ref-container ref-facts__grid">
          {HOME_HERO_FACTS.map((fact) => (
            <div key={fact.value} className="ref-fact">
              <HomeEngineeringIcon name={fact.icon} />
              <div>
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
