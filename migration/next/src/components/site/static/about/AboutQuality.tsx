import { ABOUT_QUALITY } from '@/lib/static-content/about';
import { ActionButton } from '../ActionButton';
import { EngineeringIcon } from '../EngineeringIcon';
import { Multiline } from '../multiline';

export function AboutQuality() {
  return (
    <section className="abt-quality" aria-labelledby="about-quality-title">
      <div className="ref-container abt-quality__inner">
        <div className="abt-quality__card">
          <p className="ref-label">{ABOUT_QUALITY.tag}</p>
          <h2 id="about-quality-title" className="ref-title">
            <Multiline text={ABOUT_QUALITY.title} />
          </h2>
          <p>{ABOUT_QUALITY.text}</p>
          <ActionButton to={ABOUT_QUALITY.cta.to}>{ABOUT_QUALITY.cta.label}</ActionButton>
        </div>
        <img
          className="abt-quality__image"
          src={ABOUT_QUALITY.image}
          alt={ABOUT_QUALITY.imageAlt}
          width={1918}
          height={820}
          loading="lazy"
          decoding="async"
        />
        <ul className="abt-quality__points">
          {ABOUT_QUALITY.points.map((point) => (
            <li key={point.title}>
              <EngineeringIcon name={point.icon} />
              <span>{point.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
