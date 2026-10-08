import { LeadForm } from '@/components/site/LeadForm';
import { HomeEngineeringIcon } from './HomeEngineeringIcon';

export function HomeRequest() {
  return (
    <section
      id="technical-request"
      className="ref-request"
      aria-labelledby="request-title"
    >
      <img className="ref-request__background" src="/media/hero-excavator-schematic.webp" alt="" loading="lazy" fetchPriority="low" decoding="async" />
      <div className="ref-container ref-request__grid">
        <div className="ref-request__copy">
          <p className="ref-label">Запросить подбор</p>
          <h2 id="request-title" className="ref-title">
            Нужен привод
            <br />
            под вашу машину?
          </h2>
          <p>
            Поможем подобрать решение под ваши задачи.
            <br />
            Укажите модель техники и параметры привода.
            <br />
            Специалисты подготовят техническое предложение.
          </p>
          <ul className="ref-request__benefits">
            <li>
              <HomeEngineeringIcon name="shield" />
              <span>
                Техническая
                <br />
                консультация
              </span>
            </li>
            <li>
              <HomeEngineeringIcon name="design" />
              <span>
                Подбор
                <br />
                оборудования
              </span>
            </li>
            <li>
              <HomeEngineeringIcon name="document" />
              <span>
                Коммерческое
                <br />
                предложение
              </span>
            </li>
          </ul>
        </div>
        <LeadForm
          variant="technical"
          header="Запрос на подбор оборудования"
          className="technical-form"
        />
      </div>
    </section>
  );
}
