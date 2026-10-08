import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/site/Header';
import { navigation } from '@/lib/navigation';
import { siteIndexable, SITE_URL } from '@/lib/site-config';
import { CookieAnalytics, CookieSettings } from '@/components/site/CookieAnalytics';
import '@/styles/site.scss';
import { JsonLd } from '@/components/site/Content';
import { organizationJsonLd } from '@/lib/static-content/page-seo';
export const metadata: Metadata = { metadataBase: new URL(SITE_URL), robots: { index: siteIndexable, follow: siteIndexable }, title: { default: 'КЭМЗ', template: '%s — КЭМЗ' }, verification: { yandex: 'f18b57bd3f58d96e' }, openGraph:{siteName:'ОАО «КЭМЗ»',locale:'ru_RU',type:'website',images:[{url:'/media/hero-excavator-schematic.png',width:1536,height:1024,alt:'Электрические машины КЭМЗ'}]} };
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ru"><body><JsonLd value={organizationJsonLd()} /><a className="skip-link" href="#main-content">К содержанию</a><Header /><main id="main-content">{children}</main><footer className="site-footer"><div className="site-footer__top"><Link className="site-footer__brand" href="/"><img src="/media/kemz-logo.webp" width="44" height="50" alt="Логотип КЭМЗ" /><strong>КЭМЗ</strong><span>Карпинский<br />электромашиностроительный<br />завод</span></Link><nav aria-label="Навигация в подвале">{navigation.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</nav><address><a href="tel:+73432783743">+7 (343) 278-37-43</a><a href="mailto:sales@aokemz.ru">sales@aokemz.ru</a></address></div><div className="site-footer__bottom"><p>© {new Date().getUTCFullYear()} КЭМЗ. Все права защищены.</p><Link href="/legal">Правовая информация</Link><CookieSettings /></div></footer><CookieAnalytics /></body></html>;
}
