import { ActionButton } from '../ActionButton';

export function AboutCta() {
  return (
    <section className="abt-cta" aria-labelledby="about-cta-title">
      <div className="ref-container abt-cta__inner">
        <div>
          <p className="abt-cta__label">Технический отдел</p>
          <h2 id="about-cta-title">
            Обсудить задачу
            <br />с техническим отделом
          </h2>
          <p className="abt-cta__lead">
            Подберём исполнение под параметры машины и подготовим опросный лист.
          </p>
        </div>
        <ActionButton className="abt-cta__action" to="/contacts" onDark>
          Связаться
        </ActionButton>
        <p className="abt-cta__aside">
          Электрические машины
          <br />
          для карьерной техники
        </p>
      </div>
    </section>
  );
}
