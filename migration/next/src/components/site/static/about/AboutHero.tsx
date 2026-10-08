import Link from '@/components/site/PublicLink';
import { ABOUT_HERO } from '@/lib/static-content/about';
import { ActionButton } from '../ActionButton';
import { Multiline } from '../multiline';

export function AboutHero() {
  return (
    <section className="abt-hero" aria-labelledby="about-title">
      <picture>
      <source type="image/avif" srcSet="/media/about/about-hero-archive-delivery-v2.avif" />
      <img
        className="abt-hero__image"
        src={ABOUT_HERO.image}
        alt={ABOUT_HERO.imageAlt}
        width={2048}
        height={768}
        fetchPriority="high"
        decoding="async"
      />
      </picture>
      <div className="ref-container abt-hero__content">
        <nav className="abt-hero__crumbs" aria-label="Хлебные крошки">
          <Link href="/">Главная</Link>
          <span aria-hidden="true">/</span>
          <span>О заводе</span>
        </nav>
        <h1 id="about-title">
          <Multiline text={ABOUT_HERO.title} />
        </h1>
        <p className="abt-hero__lead">{ABOUT_HERO.lead}</p>
        <div className="abt-hero__actions">
          <ActionButton to="/products">Каталог</ActionButton>
        </div>
      </div>
      <p className="abt-hero__aside">
        Надёжное<br />оборудование<br />для ваших<br />задач
      </p>
    </section>
  );
}
