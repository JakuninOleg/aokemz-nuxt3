import { LegalPage } from '@/components/site/static/legal/LegalPage';
import { JsonLd } from '@/components/site/Content';
import { LEGAL_HERO } from '@/lib/static-content/legal';
import { breadcrumbJsonLd, PAGE_SEO, pageMetadata } from '@/lib/static-content/page-seo';

export const metadata = pageMetadata({
  ...PAGE_SEO.legal,
  ogImage: `https://aokemz.ru${LEGAL_HERO.image}`,
});

export default function LegalRoute() {
  return (
    <>
      <link rel="preload" as="image" href={LEGAL_HERO.image} type="image/webp" />
      <JsonLd
        value={breadcrumbJsonLd([
          { name: 'Главная', path: '/' },
          { name: 'Правовая информация', path: '/legal' },
        ])}
      />
      <LegalPage />
    </>
  );
}
import '@/styles/legacy/legal.scss';
