import { AboutPage } from '@/components/site/static/about/AboutPage';
import { JsonLd } from '@/components/site/Content';
import { ABOUT_HERO } from '@/lib/static-content/about';
import { breadcrumbJsonLd, PAGE_SEO, pageMetadata } from '@/lib/static-content/page-seo';

export const metadata = pageMetadata({
  ...PAGE_SEO.about,
  ogImage: `https://aokemz.ru${ABOUT_HERO.image}`,
});

export default function AboutRoute() {
  return (
    <>
      <link rel="preload" as="image" href={ABOUT_HERO.image} type="image/webp" />
      <JsonLd
        value={breadcrumbJsonLd([
          { name: 'Главная', path: '/' },
          { name: 'О заводе', path: '/about' },
        ])}
      />
      <AboutPage />
    </>
  );
}
