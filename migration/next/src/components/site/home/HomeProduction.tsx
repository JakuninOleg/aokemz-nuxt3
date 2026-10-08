import { HOME_PRODUCTION_STAGES } from '@/lib/home-content';
import { HomeActionButton } from './HomeActionButton';
import { HomeEngineeringIcon } from './HomeEngineeringIcon';

export function HomeProduction() {
  return (
    <section className="ref-production ref-container" aria-labelledby="production-title">
      <div className="ref-production__copy">
        <p className="ref-label">Производство</p>
        <h2 id="production-title" className="ref-title">
          Инженерия
          <br />
          в реальном
          <br />
          масштабе
        </h2>
        <p className="ref-body">
          Полный цикл на одной площадке: от проектирования до испытаний.
          Конструкторский отдел, литьё, механообработка и сборка в Карпинске.
        </p>
        <HomeActionButton href="/production">О производстве</HomeActionButton>
      </div>
      <picture>
        <source
          media="(max-width: 900px)"
          srcSet="/media/generated/production-steel-rotor-v1-720.webp"
        />
        <img
          className="ref-production__image"
          src="/media/generated/production-steel-rotor-v1.webp"
          alt="Стальной ротор электрической машины в цехе, промышленная иллюстрация"
          width={1200}
          height={800}
          loading="lazy"
        />
      </picture>
      <ol className="ref-production__stages">
        {HOME_PRODUCTION_STAGES.map((stage) => (
          <li key={stage.icon}>
            <HomeEngineeringIcon name={stage.icon} />
            <span>{stage.title}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
