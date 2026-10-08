import Link from 'next/link';
import { JsonLd } from '@/components/site/Content';
import { breadcrumbJsonLd, PAGE_SEO, pageMetadata } from '@/lib/static-content/page-seo';

export const metadata = {
  ...pageMetadata(PAGE_SEO.special),
  robots: { index: false, follow: false },
};

export default function SpecialRoute() {
  return (
    <>
      <JsonLd
        value={breadcrumbJsonLd([
          { name: 'Главная', path: '/' },
          { name: 'Спецпредложения', path: '/special' },
        ])}
      />
      <div className="kemz-light">
        <header className="cat-hero">
          <div className="wrap">
            <p className="section-tag cat-hero__tag">Поставки</p>
            <h1>Спецпредложения</h1>
            <p className="cat-hero__lead">
              Раздел в работе. Актуальные позиции и сроки уточняйте в отделе продаж.
            </p>
          </div>
        </header>

        <div className="cat-body">
          <div className="wrap">
            <div className="cat-contacts__links cat-special-links">
              <a href="tel:+73432783743">+7 (343) 278-37-43</a>
              <a href="mailto:sales@aokemz.ru">sales@aokemz.ru</a>
            </div>
            <Link href="/contacts" className="text-link cat-detail__back cat-detail__back--end">
              ← Все контакты
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
