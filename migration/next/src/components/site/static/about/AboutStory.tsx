import { ABOUT_STORY } from '@/lib/static-content/about';
import { Multiline } from '../multiline';

export function AboutStory() {
  const [mainImage] = ABOUT_STORY.images;

  return (
    <section id="history" className="abt-story ref-container" aria-labelledby="about-story-title">
      <div className="abt-story__copy">
        <p className="ref-label">{ABOUT_STORY.tag}</p>
        <h2 id="about-story-title" className="ref-title">
          <Multiline text={ABOUT_STORY.title} />
        </h2>
        <p className="ref-body">
          {ABOUT_STORY.lead} {ABOUT_STORY.body[0]}
        </p>
        {ABOUT_STORY.body.slice(1).map((paragraph) => (
          <p key={paragraph} className="abt-story__p">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="abt-story__media">
        <figure className="abt-story__main">
          <img
            src={mainImage.src}
            alt={mainImage.alt}
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
          />
          <figcaption>{mainImage.caption}</figcaption>
        </figure>
        <div className="abt-story__side">
          <div className="abt-story__archive">
            <figure>
              <img
                src="/media/about/about-history-1960.webp"
                alt="Историческая иллюстрация работы сборочного цеха"
                width={1206}
                height={1305}
                loading="lazy"
              />
              <figcaption>У истоков завода</figcaption>
            </figure>
            <div className="abt-story__lettering">
              Люди<br />Технологии<br />Развитие
              <em>
                Карпинск<br />КЭМЗ<br />1960
              </em>
            </div>
          </div>
          <figure>
            <img
              src="/media/about/about-history-aerial.webp"
              alt="Иллюстрация промышленной площадки в стилистике архивной фотографии"
              width={1536}
              height={1024}
              loading="lazy"
            />
            <figcaption>От мастерских к заводу</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
