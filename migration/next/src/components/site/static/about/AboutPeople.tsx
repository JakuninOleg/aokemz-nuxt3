import Link from 'next/link';
import { ABOUT_PEOPLE } from '@/lib/static-content/about';
import { Multiline } from '../multiline';

export function AboutPeople() {
  return (
    <section className="abt-people" aria-labelledby="about-people-title">
      <div className="abt-people__media">
        <img
          className="abt-people__image"
          src={ABOUT_PEOPLE.image}
          alt={ABOUT_PEOPLE.imageAlt}
          width={1600}
          height={900}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="abt-people__panel">
        <p className="ref-label">{ABOUT_PEOPLE.tag}</p>
        <h2 id="about-people-title" className="ref-title">
          <Multiline text={ABOUT_PEOPLE.title} />
        </h2>
        <p className="ref-body">{ABOUT_PEOPLE.text}</p>
        <Link className="abt-text-link" href={ABOUT_PEOPLE.cta.to}>
          {ABOUT_PEOPLE.cta.label} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
