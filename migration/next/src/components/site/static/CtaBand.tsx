import { ActionButton } from './ActionButton';

type Props = {
  title: string;
  lead: string;
  image: string;
  imageAlt: string;
  buttonLabel: string;
  buttonTo?: string;
  aside?: readonly string[];
  titleId?: string;
};

export function CtaBand({
  title,
  lead,
  image,
  imageAlt,
  buttonLabel,
  buttonTo = '/contacts',
  aside = [],
  titleId = 'ref-cta-title',
}: Props) {
  return (
    <section className="ref-photo-cta" aria-labelledby={titleId}>
      <img
        className="ref-photo-cta__image"
        src={image}
        alt={imageAlt}
        width={2048}
        height={700}
        loading="lazy"
        decoding="async"
      />
      <div className="ref-container ref-photo-cta__inner">
        <div className="ref-photo-cta__copy">
          <h2 id={titleId}>{title}</h2>
          <p>{lead}</p>
          <div className="ref-photo-cta__actions">
            <ActionButton to={buttonTo} onDark>
              {buttonLabel}
            </ActionButton>
          </div>
        </div>
        {aside.length > 0 && (
          <ul className="ref-photo-cta__aside" aria-hidden="true">
            {aside.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
