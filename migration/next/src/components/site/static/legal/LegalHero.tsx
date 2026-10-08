import Link from 'next/link';
import { LEGAL_HERO } from '@/lib/static-content/legal';

export function LegalHero() {
  return (
    <section
      className="legal-hero internal-hero internal-hero--mobile-surface"
      aria-labelledby="legal-title"
    >
      <img
        className="legal-hero__image internal-hero__image"
        src={LEGAL_HERO.image}
        alt={LEGAL_HERO.imageAlt}
        width={2048}
        height={900}
        fetchPriority="high"
        decoding="async"
      />
      <div className="ref-container legal-hero__content internal-hero__content">
        <nav className="legal-hero__crumbs internal-hero__crumbs" aria-label="Хлебные крошки">
          <Link href="/">Главная</Link>
          <span aria-hidden="true">/</span>
          <span>Обработка персональных данных</span>
        </nav>
        <h1 id="legal-title">{LEGAL_HERO.title}</h1>
        <p className="legal-hero__lead">{LEGAL_HERO.lead}</p>
        <p className="legal-hero__rail" aria-hidden="true">
          {LEGAL_HERO.rail}
        </p>
      </div>
    </section>
  );
}
