import { ProductionPage } from '@/components/site/static/production/ProductionPage';
import { JsonLd } from '@/components/site/Content';
import { breadcrumbJsonLd, PAGE_SEO, pageMetadata } from '@/lib/static-content/page-seo';
import { PRODUCTION_HERO } from '@/lib/static-content/production';

export const metadata = pageMetadata({
  ...PAGE_SEO.production,
  ogImage: `https://aokemz.ru${PRODUCTION_HERO.image}`,
});

export default function ProductionRoute() {
  return (
    <>
      <link rel="preload" as="image" href={PRODUCTION_HERO.image} type="image/webp" />
      <JsonLd
        value={breadcrumbJsonLd([
          { name: 'Главная', path: '/' },
          { name: 'Производство', path: '/production' },
        ])}
      />
      <ProductionPage />
    </>
  );
}
import '@/styles/legacy/production.scss';
