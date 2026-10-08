import { HomeCapabilities } from './HomeCapabilities';
import { HomeGeography } from './HomeGeography';
import { HomeHero } from './HomeHero';
import { HomeNews } from './HomeNews';
import { HomeProduction } from './HomeProduction';
import { HomeRequest } from './HomeRequest';
import { HomeShowcase } from './HomeShowcase';

export async function HomePage() {
  return (
    <div className="kemz-home">
      <HomeHero />
      <HomeShowcase />
      <HomeProduction />
      <HomeCapabilities />
      <HomeGeography />
      <HomeRequest />
      <HomeNews />
    </div>
  );
}
