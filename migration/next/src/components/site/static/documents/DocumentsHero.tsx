import Link from '@/components/site/PublicLink';
import { DOCUMENTS_HERO } from '@/lib/static-content/documents';

export function DocumentsHero() {
  return (
    <section className="docs-hero" aria-labelledby="docs-title">
      <img
        className="docs-hero__schematic"
        src={DOCUMENTS_HERO.image}
        alt={DOCUMENTS_HERO.imageAlt}
        width={1600}
        height={900}
        fetchPriority="high"
        decoding="async"
      />
      <div className="ref-container docs-hero__content">
        <nav className="docs-hero__crumbs" aria-label="Хлебные крошки">
          <Link href="/">Главная</Link>
          <span aria-hidden="true">/</span>
          <span>Документы</span>
        </nav>
        <p className="docs-hero__label">{DOCUMENTS_HERO.label}</p>
        <h1 id="docs-title">{DOCUMENTS_HERO.title}</h1>
        <p className="docs-hero__lead">{DOCUMENTS_HERO.lead}</p>
        <p className="docs-hero__rail">
          <span aria-hidden="true" />
          <strong>
            Надёжные решения
            <br />
            для реальных задач
          </strong>
        </p>
      </div>
    </section>
  );
}
