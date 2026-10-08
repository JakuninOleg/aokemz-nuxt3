/** Search copy based on the published catalogue and docs/brand-facts.md.
 * This does not rename CMS records, change URLs or infer technical specifications.
 */
const CATEGORY_SEARCH_COPY: Record<string, { title: string; description: string }> = {
  excavator: {
    title: 'Электродвигатели и генераторы для экскаваторов ЭКГ и ЭШ',
    description: 'Электрические машины и комплекты приводов КЭМЗ для карьерных и шагающих экскаваторов ЭКГ и ЭШ. Модели, характеристики и опросные листы для подбора.',
  },
  mining: {
    title: 'Шахтные электродвигатели ДПТ, ДАТВ, ДАКВ и ДАРВ',
    description: 'Шахтные электродвигатели КЭМЗ: рудничный тяговый ДПТ 45 и асинхронные взрывобезопасные ДАТВ, ДАКВ, ДАРВ. Характеристики и подбор по условиям эксплуатации.',
  },
  'drilling-rigs': {
    title: 'Электродвигатели ДПБ и тормоза для буровых установок',
    description: 'Оборудование КЭМЗ для буровых установок: электродвигатели постоянного тока ДПБ, электромагнитные и индукционные тормоза. Технические данные и запрос подбора.',
  },
  belaz: {
    title: 'Тяговые электродвигатели для БЕЛАЗ',
    description: 'Тяговые электродвигатели КЭМЗ для карьерных самосвалов БЕЛАЗ. Модели и технические характеристики; подбор исполнения через отдел продаж завода.',
  },
  'railway-transport': {
    title: 'Тяговые электродвигатели и оборудование для железнодорожного транспорта',
    description: 'Оборудование КЭМЗ для железнодорожного транспорта: тяговые электродвигатели, реакторы, дроссели, разъединители и изоляторы. Каталог и технические характеристики.',
  },
  'urban-electric-transport': {
    title: 'Электрические машины для городского электротранспорта',
    description: 'Каталог электрических машин КЭМЗ для городского электротранспорта. Модели, технические характеристики и запрос подбора оборудования у завода.',
  },
  other: {
    title: 'Трансформаторные и конденсаторные вводы',
    description: 'Трансформаторные и конденсаторные вводы в каталоге КЭМЗ. Технические характеристики и подбор оборудования по требованиям заказчика.',
  },
  another: {
    title: 'Электродвигатели и генераторы: технические характеристики',
    description: 'Электродвигатели и генераторы в каталоге КЭМЗ: серии ДПЭ, ДПВ, 4ГПЭ и 4ГПЭМ, электромашинные агрегаты. Технические данные и подбор исполнения.',
  },
  'new-developments': {
    title: 'Новые разработки электрических машин КЭМЗ',
    description: 'Новые разработки электрических машин Карпинского электромашиностроительного завода. Каталог моделей, технические данные и обсуждение требований с отделом продаж.',
  },
};

/** No hard SEO character rule: keep copy readable, trim only excessive CMS text. */
export function seoSummary(text: string, maxLength = 240): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  const prefix = clean.slice(0, maxLength - 1);
  const boundary = prefix.lastIndexOf(' ');
  return `${prefix.slice(0, boundary > maxLength / 2 ? boundary : prefix.length).trimEnd()}…`;
}

export function categorySearchCopy(category: { slug: string; title: string; description?: string | null }) {
  const defaults = CATEGORY_SEARCH_COPY[category.slug];
  return {
    title: defaults?.title || `${category.title}: каталог`,
    // A maintained CMS description takes precedence over our import fallback.
    description: seoSummary(category.description?.trim() || defaults?.description ||
      `${category.title}: модели и технические характеристики. Подбор оборудования в ОАО «КЭМЗ», Карпинск.`),
  };
}

const comparable = (text: string) => text.toLocaleLowerCase('ru').replace(/[\s\-–—]/g, '');

export function productSearchCopy(product: { title: string }, description: string, specificationModels = '', categoryTitle = '') {
  const title = seoSummary(product.title, 180);
  // Models only come from the published specification; never decode them from URLs.
  const extraModels = [...new Set(specificationModels.split(',').map(model => model.trim()).filter(Boolean))]
    .filter(model => !comparable(title).includes(comparable(model)))
    .slice(0, 2);
  const suffix = extraModels.join(', ');
  const searchTitle = suffix && suffix.length <= 80 ? `${title} (${suffix})` :
    (categoryTitle ? `${title} | ${categoryTitle}` : title);
  return {
    title: searchTitle,
    // Identity first prevents generic imported leads from producing identical snippets.
    description: seoSummary(description
      ? (comparable(description).startsWith(comparable(searchTitle)) ? description : `${searchTitle}. ${description}`)
      : `${searchTitle}: технические характеристики и подбор исполнения. ОАО «Карпинский электромашиностроительный завод», Карпинск.`),
  };
}
