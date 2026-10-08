import { ABOUT_TIMELINE } from '@/lib/static-content/about';

export function AboutTimeline() {
  return (
    <section className="abt-timeline" aria-label="Хронология завода">
      <ol className="ref-container abt-timeline__list">
        {ABOUT_TIMELINE.map((item) => (
          <li key={item.year}>
            <strong>{item.year}</strong>
            <span>{item.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
