import type { Metadata } from 'next';
import { Breadcrumbs, JsonLd } from '@/components/site/Content';
import { LeadForm } from '@/components/site/LeadForm';
import { CONTACTS_HERO as hero, CONTACTS_DIRECTORY as directory, CONTACTS_ADDRESS as address, CONTACTS_FORM as form, CONTACTS_LIST } from '@/lib/contacts-content';
export const metadata: Metadata = { title:'Контакты и заявка в отдел продаж', description:directory.lead, alternates:{canonical:'https://aokemz.ru/contacts'} };
const paths = {
  reception:'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z',
  sales:'M4 7h16v12H4Zm2 2v8h12V9Zm3 2h2v2H9Zm4 0h2v2h-2ZM7 4h2v2H7Zm8 0h2v2h-2Z',
  supply:'M7 18a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm10 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2ZM3 4h2l2.4 9.2a2 2 0 0 0 2 1.5h7.4a2 2 0 0 0 1.9-1.4L21 7H7',
  otk:'M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6Zm0 4.2 4 1.8v3.5c0 3.2-2 6-4 6.7-2-.7-4-3.5-4-6.7V8Z',
  quality:'M12 2 3 6v6c0 5.2 3.5 9.7 9 11 5.5-1.3 9-5.8 9-11V6Zm-1.2 13-3.8-3.8 1.4-1.4 2.4 2.4 4.6-4.6 1.4 1.4Z',
  hr:'M9 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm6 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM3 19c0-2.5 2.7-4.5 6-4.5.7 0 1.4.1 2 .3A5.6 5.6 0 0 1 15 14.5c3.3 0 6 2 6 4.5v1H3Z',
};
export default function ContactsPage() {
  return <div className="kemz-home kemz-contacts">
    <section className="contacts-hero internal-hero internal-hero--mobile-surface" aria-labelledby="contacts-title"><img className="contacts-hero__image internal-hero__image" src={hero.image} alt={hero.imageAlt} width={1920} height={820} fetchPriority="high" /><div className="ref-container contacts-hero__content internal-hero__content"><Breadcrumbs items={ [['Главная','/'],['Контакты']] } /><h1 id="contacts-title">{hero.title}</h1><p className="contacts-hero__lead">{hero.lead}</p><p className="contacts-hero__rail" aria-hidden="true"><span className="contacts-hero__rail-line" /><span className="contacts-hero__rail-text">{hero.rail.map(line => <span key={line}>{line}</span>)}</span></p></div></section>
    <section className="contacts-dir" aria-labelledby="contacts-dir-title"><div className="ref-container contacts-dir__grid"><div className="contacts-dir__list"><header className="contacts-dir__head"><h2 id="contacts-dir-title">{directory.title}</h2><p>{directory.lead}</p></header><ul className="contacts-dir__rows">{CONTACTS_LIST.map(item => <li key={item.position} className="contacts-dir__row"><span className="contacts-dir__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor"><path d={paths[item.icon]} /></svg></span><div className="contacts-dir__meta"><h3>{item.position}</h3>{item.person && <p>{item.person}</p>}</div><div className="contacts-dir__links">{item.phones.map(phone => <a key={phone.href} href={phone.href}>{phone.label}</a>)}<a href={`mailto:${item.email}`}>{item.email}</a></div></li>)}</ul></div><aside className="contacts-dir__aside"><div className="contacts-dir__address"><span className="contacts-dir__pin" aria-hidden="true">⌖</span><h3>{address.title}</h3><p>{address.lines.map(line => <span key={line}>{line}<br /></span>)}</p><a className="contacts-dir__map" href={address.mapHref} target="_blank" rel="noopener noreferrer">{address.mapLabel} →</a></div><figure className="contacts-dir__entrance"><img src={address.entranceImage} alt={address.entranceAlt} width={960} height={720} loading="lazy" /><figcaption>{address.entranceCaption}</figcaption></figure></aside></div></section>
    <section className="contacts-form-band" id="sales-form" aria-labelledby="contacts-form-title"><div className="ref-container contacts-form-band__grid"><div className="contacts-form-band__copy"><h2 id="contacts-form-title">{form.title}</h2><p>{form.lead}</p><LeadForm /></div><figure className="contacts-form-band__media"><img src={form.image} alt={form.imageAlt} width={1200} height={1600} loading="lazy" /><figcaption aria-hidden="true">{form.aside.map(line => <span key={line}>{line}</span>)}</figcaption></figure></div></section>
    <JsonLd value={{ '@context':'https://schema.org','@type':'ContactPage',name:'Контакты ОАО «КЭМЗ»',url:'https://aokemz.ru/contacts' }} />
  </div>;
}
