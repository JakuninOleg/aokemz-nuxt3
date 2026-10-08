import Link from 'next/link';
import { ABOUT_TODAY } from '@/lib/static-content/about';
import { OutlineIcon } from '../OutlineIcon';

export function AboutToday() {
  return (
    <section className="abt-today" aria-labelledby="about-today-title">
      <div className="abt-today__media">
        <img
          src={ABOUT_TODAY.image}
          alt={ABOUT_TODAY.imageAlt}
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="abt-today__copy">
        <p className="ref-label">{ABOUT_TODAY.tag}</p>
        <h2 id="about-today-title" className="ref-title">
          {ABOUT_TODAY.title}
        </h2>
        <p className="ref-body">{ABOUT_TODAY.lead}</p>
        <ul className="abt-today__points">
          {ABOUT_TODAY.points.map((point) => (
            <li key={point.title}>
              <OutlineIcon name={point.icon} />
              <div>
                <strong>{point.title}</strong>
                <span>{point.text}</span>
              </div>
            </li>
          ))}
        </ul>
        <Link className="abt-text-link" href="/production">
          Подробнее о заводе <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
