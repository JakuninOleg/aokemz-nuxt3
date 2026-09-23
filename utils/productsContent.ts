/** Static copy for products redesign. Category/product media stays on Contentful. */

export const PRODUCTS_HERO = {
  title: "Каталог продукции",
  lead: "Электрические машины главных приводов для карьерной техники, буровых установок и шахтного оборудования.",
  points: [
    "Собственное производство",
    "Комплекты под тип машины",
    "Поставка по России и СНГ",
  ] as const,
  rail: ["Технологии", "Надёжность", "Развитие"] as const,
  image: "/media/generated/hero-quarry-dragline-wide-v11.webp",
  mobileImage: "/media/generated/hero-quarry-dragline-wide-v11-960.webp",
  imageAlt:
    "Карьерный экскаватор на фоне карьера в сумерках, промышленная иллюстрация",
} as const;

export const PRODUCTS_CTA = {
  title: "Не нашли нужное оборудование?",
  lead: "Опишите тип машины и привод: отдел продаж подскажет по номенклатуре и срокам.",
  button: "Запросить подбор",
  aside: ["Опыт", "Качество", "Сотрудничество"] as const,
  image: "/media/documents/docs-cta-motors.webp",
  imageAlt:
    "Электродвигатели в цехе и чертёж на синем фоне, промышленная иллюстрация",
} as const;

export const CATEGORY_CTA = {
  title: "Нужна помощь в подборе оборудования?",
  lead: "Напишите в отдел продаж: укажите тип ЭКГ, ЭШ или буровой и нужный привод.",
  button: "Связаться с инженером",
  aside: ["Опыт", "Технологии", "Надёжность"] as const,
  image: "/media/about/about-engineer-blueprint.webp",
  imageAlt:
    "Инженер с чертежом у промышленного оборудования, иллюстрация",
} as const;

// Contentful keeps the category card image. These panoramic fallbacks are used
// only for the category hero, where portrait card assets crop poorly.
export const CATEGORY_HERO_OVERRIDES = {
  mining: {
  image: "/media/products/heroes/category-mining-hero-v1.webp",
    alt: "Горная машина в подземной выработке, иллюстрация",
  },
  belaz: {
  image: "/media/products/heroes/category-belaz-hero-v1.webp",
    alt: "Карьерный самосвал на технологической дороге, иллюстрация",
  },
  "drilling-rigs": {
  image: "/media/products/heroes/category-drilling-rigs-hero-v1.webp",
    alt: "Буровая установка на промышленной площадке, иллюстрация",
  },
  "railway-transport": {
  image: "/media/products/heroes/category-railway-transport-hero-v1.webp",
    alt: "Грузовой электровоз на промышленных путях, иллюстрация",
  },
  "urban-electric-transport": {
  image: "/media/products/heroes/category-urban-electric-transport-hero-v1.webp",
    alt: "Городской трамвай на путях, иллюстрация",
  },
  other: {
  image: "/media/products/heroes/category-other-hero-v1.webp",
    alt: "Высоковольтные изоляторы и компоненты в цехе, иллюстрация",
  },
  "new-developments": {
  image: "/media/products/heroes/category-new-developments-hero-v1.webp",
    alt: "Сборка электрической машины на испытательном участке, иллюстрация",
  },
} as const;

// CMS descriptions remain the source of truth. This compact introduction is
// used only in the hero of an exceptionally long category description, so the
// first screen stays readable on desktop and mobile.
export const CATEGORY_HERO_LEAD_OVERRIDES: Record<string, string> = {
  "new-developments":
    "Новые разработки КЭМЗ для задач заказчиков. Доступные варианты и сроки уточняйте у специалистов.",
};

export function contentfulAssetUrl(
  url?: string,
  options: { width?: number; quality?: number } = {},
): string | undefined {
  if (!url) return undefined;

  const absoluteUrl = url.startsWith("//")
    ? `https:${url}`
    : url.startsWith("http")
      ? url
      : `https:${url}`;
  const extension = absoluteUrl.split("?")[0].toLowerCase();

  // Contentful's Images API must never be applied to documents or arbitrary
  // attachments. Raster assets, however, can be delivered much lighter while
  // preserving the CMS source as the single content authority.
  if (!/\.(avif|jpe?g|png|webp)$/.test(extension)) return absoluteUrl;

  const parsed = new URL(absoluteUrl);
  parsed.searchParams.set("fm", "webp");
  parsed.searchParams.set("w", String(options.width ?? 1200));
  parsed.searchParams.set("q", String(options.quality ?? 82));
  return parsed.toString();
}
