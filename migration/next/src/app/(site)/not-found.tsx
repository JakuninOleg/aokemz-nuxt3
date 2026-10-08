import type { Metadata } from 'next';
import Link from 'next/link';
import { LeadForm } from '@/components/site/LeadForm';

/** 404 must stay out of the index even when SITE_INDEXABLE unlocks the public site. */
export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <div className="kemz-home"><section className="not-found-page" aria-labelledby="not-found-title"><img className="not-found-page__image" src="/media/error/not-found-engineering.webp" alt="" loading="lazy" fetchPriority="low" /><div className="not-found-page__shade" aria-hidden="true" /><div className="not-found-page__inner"><div className="not-found-page__copy"><p className="not-found-page__number" aria-hidden="true">404</p><h1 id="not-found-title" className="not-found-page__title">Страница не найдена</h1><p className="not-found-page__lead">Возможно, страницу перенесли, удалили или адрес введён с ошибкой.</p><p className="not-found-page__signal">Надёжные решения<br />для реальных задач</p><div className="not-found-page__actions"><Link className="kemz-action" href="/">Перейти на главную →</Link><Link className="not-found-page__catalog-link" href="/products">Каталог продукции</Link></div></div><div className="not-found-page__form"><LeadForm header="Не нашли оборудование?" /></div></div></section></div>;
}
