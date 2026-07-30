/** SEO defaults and per-route copy for aokemz.ru (corporate B2B). */

export const SITE_NAME = 'ОАО «КЭМЗ»'
export const SITE_URL = 'https://aokemz.ru'
export const SITE_LOCALE = 'ru_RU'

export const DEFAULT_OG_IMAGE = `${SITE_URL}/media/hero-excavator-schematic.png`

export type PageSeo = {
  title: string
  description: string
  path?: string
  ogImage?: string
  type?: 'website' | 'article'
}

export const PAGE_SEO = {
  home: {
    title: 'Электрические машины для карьера и шахты | ОАО «КЭМЗ»',
    description:
      'Карпинский электромашиностроительный завод: двигатели и генераторы для ЭКГ, ЭШ, буровых установок и шахтного оборудования. Карпинск, с 1960 года.',
    path: '/',
  },
  about: {
    title: 'О заводе — история и производство | ОАО «КЭМЗ»',
    description:
      'ОАО «Карпинский электромашиностроительный завод»: полный цикл от конструкции до стендовых испытаний. Приводы для карьерной техники, Карпинск.',
    path: '/about',
  },
  products: {
    title: 'Каталог продукции — электродвигатели и приводы | ОАО «КЭМЗ»',
    description:
      'Каталог электрических машин КЭМЗ: экскаваторные комплекты, буровые двигатели, шахтные, тяговые машины и высоковольтная аппаратура.',
    path: '/products',
  },
  news: {
    title: 'Новости завода | ОАО «КЭМЗ»',
    description:
      'Новости ОАО «КЭМЗ»: поставки, испытания, модернизация производства и работа с карьерной техникой.',
    path: '/news',
  },
  documents: {
    title: 'Документы и опросные листы | ОАО «КЭМЗ»',
    description:
      'Презентация завода, опросные листы на электрические машины и высоковольтную аппаратуру, перечень запасных частей ОАО «КЭМЗ».',
    path: '/documents',
  },
  contacts: {
    title: 'Контакты и заявка в отдел продаж | ОАО «КЭМЗ»',
    description:
      'Контакты ОАО «КЭМЗ» в Карпинске: телефоны отдела продаж, email sales@aokemz.ru, адрес ул. Карпинского, 1. Заявка на подбор привода.',
    path: '/contacts',
  },
  legal: {
    title: 'Правовая информация — персональные данные | ОАО «КЭМЗ»',
    description:
      'Политика обработки персональных данных ОАО «Карпинский электромашиностроительный завод» (aokemz.ru).',
    path: '/legal',
  },
  special: {
    title: 'Спецпредложения | ОАО «КЭМЗ»',
    description:
      'Актуальные спецпредложения ОАО «КЭМЗ» по электрическим машинам и комплектам приводов.',
    path: '/special',
  },
} as const satisfies Record<string, PageSeo>

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ОАО «Карпинский электромашиностроительный завод»',
    alternateName: 'ОАО КЭМЗ',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    foundingDate: '1960-06-18',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Карпинского, 1',
      addressLocality: 'Карпинск',
      addressRegion: 'Свердловская область',
      postalCode: '624930',
      addressCountry: 'RU',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+7-343-278-37-43',
        contactType: 'sales',
        email: 'sales@aokemz.ru',
        areaServed: 'RU',
        availableLanguage: ['Russian'],
      },
    ],
  }
}
