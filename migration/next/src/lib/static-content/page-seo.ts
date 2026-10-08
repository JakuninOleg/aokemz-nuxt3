/** SEO defaults for owned static routes (ported from utils/siteSeo). */

export const SITE_NAME = 'ОАО «КЭМЗ»';
export const SITE_URL = 'https://aokemz.ru';
export const SITE_LOCALE = 'ru_RU';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/media/hero-excavator-schematic.png`;

export type BreadcrumbItem = { name: string; path: string };

/** Confirmed company facts, preserved from the Nuxt site's schema. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org', '@type': 'Organization',
    name: 'ОАО «Карпинский электромашиностроительный завод»',
    alternateName: 'ОАО КЭМЗ', url: SITE_URL,
    logo: `${SITE_URL}/media/kemz-logo.webp`, foundingDate: '1960-06-18',
    address: { '@type': 'PostalAddress', streetAddress: 'ул. Карпинского, 1',
      addressLocality: 'Карпинск', addressRegion: 'Свердловская область', postalCode: '624930', addressCountry: 'RU' },
    contactPoint: [{ '@type': 'ContactPoint', telephone: '+7-343-278-37-43',
      contactType: 'sales', email: 'sales@aokemz.ru', areaServed: 'RU', availableLanguage: ['Russian'] }],
  };
}

export function canonicalUrl(path = '/') {
  const normalized = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`;
  return `${SITE_URL}${normalized}`;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export type PageSeo = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
};

export const PAGE_SEO = {
  about: {
    title: 'О заводе — история и производство | ОАО «КЭМЗ»',
    description:
      'ОАО «Карпинский электромашиностроительный завод»: полный цикл от конструкции до стендовых испытаний. Приводы для карьерной техники, Карпинск.',
    path: '/about',
  },
  documents: {
    title: 'Документы и опросный лист | ОАО «КЭМЗ»',
    description:
      'Презентация завода, опросный лист на электрические машины и перечень запасных частей ОАО «КЭМЗ».',
    path: '/documents',
  },
  legal: {
    title: 'Правовая информация | ОАО «КЭМЗ»',
    description:
      'Политика персональных данных, согласие, cookie, пользовательское соглашение и сведения о владельце сайта aokemz.ru (ОАО «КЭМЗ»).',
    path: '/legal',
  },
  special: {
    title: 'Спецпредложения | ОАО «КЭМЗ»',
    description:
      'Актуальные спецпредложения ОАО «КЭМЗ» по электрическим машинам и комплектам приводов.',
    path: '/special',
  },
  production: {
    title: 'Производство электрических машин | ОАО «КЭМЗ»',
    description:
      'Производственная площадка ОАО «КЭМЗ» в Карпинске: конструкторская подготовка, литьё, механообработка, сборка и испытания электрических машин.',
    path: '/production',
  },
} as const satisfies Record<string, PageSeo>;

export function pageMetadata(seo: PageSeo, extras?: { robots?: { index: boolean; follow: boolean } }) {
  const image = seo.ogImage || DEFAULT_OG_IMAGE;
  const canonical = canonicalUrl(seo.path);
  return {
    title: { absolute: seo.title },
    description: seo.description,
    // Absolute aokemz.ru canonical — do not rely only on layout metadataBase.
    alternates: { canonical },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: 'website' as const,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: seo.title,
      description: seo.description,
      images: [image],
    },
    ...(extras?.robots ? { robots: extras.robots } : {}),
  };
}
