import { AboutCapabilities } from './AboutCapabilities';
import { AboutCta } from './AboutCta';
import { AboutCycle } from './AboutCycle';
import { AboutGeography } from './AboutGeography';
import { AboutHero } from './AboutHero';
import { AboutPeople } from './AboutPeople';
import { AboutQuality } from './AboutQuality';
import { AboutStory } from './AboutStory';
import { AboutTimeline } from './AboutTimeline';
import { AboutToday } from './AboutToday';

export function AboutPage() {
  return (
    <div className="kemz-home kemz-about">
      <AboutHero />
      <AboutTimeline />
      <AboutToday />
      <AboutStory />
      <AboutPeople />
      <AboutCycle />
      <AboutCapabilities />
      <AboutQuality />
      <AboutGeography />
      <AboutCta />
    </div>
  );
}
