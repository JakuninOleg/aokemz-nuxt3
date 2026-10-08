import { HOME_CAPABILITY_CARDS } from '@/lib/home-content';
import { HomeActionButton } from './HomeActionButton';

export function HomeCapabilities() {
  return (
    <section className="ref-capabilities" aria-labelledby="capabilities-title">
      <div className="ref-container ref-capabilities__grid">
        <div className="ref-capabilities__intro">
          <h2 id="capabilities-title">
            Производственные
            <br />
            возможности
          </h2>
          <p>
            Литьё, гальваника и механическая обработка деталей для электрических
            машин.
          </p>
          <HomeActionButton href="/production" compact onDark>
            Все возможности
          </HomeActionButton>
        </div>
        {HOME_CAPABILITY_CARDS.map((item, index) => (
          <article
            key={item.image}
            className={[
              'ref-capability',
              index === 3 ? 'ref-capability--materials' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <h3>
              {item.value} {item.unit ? <small>{item.unit}</small> : null}
            </h3>
            <p>{item.text}</p>
            <div className="ref-capability__media">
              <img
                src={`/media/generated/${item.image}-720.webp`}
                srcSet={`/media/generated/${item.image}-480.webp 480w, /media/generated/${item.image}-720.webp 720w`}
                sizes="(max-width: 720px) 50vw, (max-width: 1180px) 25vw, 300px"
                alt={item.alt}
                width={720}
                height={480}
                loading="lazy"
                decoding="async"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
