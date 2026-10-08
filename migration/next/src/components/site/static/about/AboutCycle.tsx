import Link from '@/components/site/PublicLink';
import { ABOUT_CYCLE, ABOUT_CYCLE_MEDIA } from '@/lib/static-content/about';

export function AboutCycle() {
  return (
    <section className="abt-cycle" aria-labelledby="about-cycle-title">
      <div className="abt-cycle__inner">
        <div className="ref-container abt-cycle__head">
          <p className="ref-label">Производство</p>
          <h2 id="about-cycle-title" className="ref-title">
            Полный цикл на одной площадке
          </h2>
          <p className="ref-body">
            Все ключевые этапы, от разработки до испытаний, выполняются на территории завода.
            <br />
            Контролируем качество на каждом шаге и отвечаем за результат перед заказчиком.
          </p>
          <Link className="abt-text-link" href="/production">
            Как мы работаем <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="abt-cycle__visual">
          <img
            className="abt-cycle__shaft"
            src={ABOUT_CYCLE_MEDIA.image}
            alt={ABOUT_CYCLE_MEDIA.imageAlt}
            width={2172}
            height={724}
            loading="lazy"
            decoding="async"
          />
        </div>
        <ol className="ref-container abt-cycle__steps" aria-label="Этапы производства">
          {ABOUT_CYCLE.map((step) => (
            <li key={step.icon}>
              <strong>{step.title}</strong>
              <span>{step.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
