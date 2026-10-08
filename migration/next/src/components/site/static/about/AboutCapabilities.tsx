import Link from 'next/link';
import { ABOUT_CAPABILITIES } from '@/lib/static-content/about';

export function AboutCapabilities() {
  return (
    <section className="abt-caps ref-container" aria-labelledby="about-caps-title">
      <div className="abt-caps__head">
        <p className="ref-label">Возможности</p>
        <h2 id="about-caps-title" className="ref-title">
          Производственные возможности
        </h2>
        <Link className="abt-text-link" href="/production">
          Все возможности <span aria-hidden="true">→</span>
        </Link>
      </div>
      <ul className="abt-caps__grid">
        {ABOUT_CAPABILITIES.map((item) => (
          <li key={item.value}>
            <img
              src={item.image}
              alt={item.alt}
              width={1200}
              height={800}
              loading="lazy"
              decoding="async"
            />
            <div className="abt-caps__meta">
              <strong>
                {item.value}
                {item.unit ? <small> {item.unit}</small> : null}
              </strong>
              <span className="abt-caps__description">{item.text}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
