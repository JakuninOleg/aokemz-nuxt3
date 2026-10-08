export type HomeStat = {
  value: string;
  label: string;
  long: boolean;
};

export type HomeProcessPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export type HomeGeoRegion = {
  name: string;
  sites: string[];
};

export type HomeShowcaseTile = {
  title: string;
  text: string;
  image: string;
  match: string;
  theme: 'dark' | 'light';
  alt: string;
};

export type HomeProductionStage = {
  icon: string;
  title: string;
};

export type HomeCapabilityCard = {
  value: string;
  unit: string;
  text: string;
  image: string;
  alt: string;
};

export type HomeHeroFact = {
  value: string;
  label: string;
  icon: string;
};

export const HOME_STATS: HomeStat[] = [
  { value: '1960', label: 'год основания', long: false },
  { value: '54–600 кВт', label: 'электродвигатели', long: true },
  { value: 'до 1250 кВт', label: 'генераторы 4ГПЭ', long: true },
  { value: 'до 1000 кВт', label: 'буровые ДПБ', long: true },
  { value: '15–1250 кВт', label: 'генераторы', long: true },
];

export const HOME_PROCESS_PHOTOS: HomeProcessPhoto[] = [
  { src: '/media/plant-foundry.webp', alt: 'Литейный участок завода', caption: 'Литьё' },
  { src: '/media/plant-windings.webp', alt: 'Укладка медной обмотки статора', caption: 'Обмотка' },
  { src: '/media/plant-teststand.webp', alt: 'Электрическая машина на испытательном стенде', caption: 'Испытания' },
];

export const HOME_GEO_REGIONS: HomeGeoRegion[] = [
  { name: 'Центральный регион', sites: ['Стойленский ГОК', 'Михайловский ГОК'] },
  { name: 'Северо-Запад', sites: ['Ковдорский ГОК', 'АО «Апатит»'] },
  { name: 'Сибирь', sites: ['Сибирский Антрацит', 'Кузбассразрезуголь', 'СДС-Уголь'] },
  { name: 'Экспорт', sites: ['Казахстан', 'Узбекистан', 'Индия'] },
];

export const HOME_HERO_FACTS: HomeHeroFact[] = [
  { value: HOME_STATS[1].value, label: HOME_STATS[1].label, icon: 'energy' },
  { value: HOME_STATS[4].value, label: HOME_STATS[4].label, icon: 'pulse' },
  { value: 'Россия и СНГ', label: 'география поставок', icon: 'globe' },
  {
    value: 'Полный цикл',
    label: 'Проектирование, производство, испытания',
    icon: 'document',
  },
];

export const HOME_SHOWCASE_TILES: HomeShowcaseTile[] = [
  {
    title: 'Экскаваторное\nоборудование',
    text: 'Машины постоянного/\nпеременного тока\nдля ЭКГ и ЭШ',
    image: 'hero-quarry-dragline',
    match: 'экскават',
    theme: 'dark',
    alt: 'Карьерный экскаватор, иллюстрация применения электрических машин',
  },
  {
    title: 'Буровые\nустановки',
    text: 'Двигатели и тормоза\nдля бурового оборудования',
    image: 'drilling-rig-quarry',
    match: 'буров',
    theme: 'light',
    alt: 'Буровая установка в карьере, промышленная иллюстрация',
  },
  {
    title: 'Шахтное\nоборудование',
    text: 'Электрические машины\nдля подземных условий',
    image: 'underground-mine-rail',
    match: 'шахт',
    theme: 'dark',
    alt: 'Подземная выработка с рельсовым транспортом, промышленная иллюстрация',
  },
  {
    title: 'Железнодорожный\nтранспорт',
    text: 'Тяговые машины\nи аппаратура',
    image: 'mine-locomotive',
    match: 'железнодорож',
    theme: 'light',
    alt: 'Промышленный локомотив, иллюстрация применения тяговых машин',
  },
  {
    title: 'Высоковольтная\nаппаратура',
    text: 'Оборудование\nна 27,5 и 35 кВ',
    image: 'high-voltage-switchgear',
    match: 'высоковольт',
    theme: 'light',
    alt: 'Высоковольтное распределительное оборудование, промышленная иллюстрация',
  },
];

export const HOME_PRODUCTION_STAGES: HomeProductionStage[] = [
  { icon: 'design', title: 'Проектирование\nи инженерные расчёты' },
  { icon: 'cast', title: 'Заготовка: штамповка, литьё, сварка' },
  { icon: 'gear', title: 'Механообработка, обмотка, пропитка' },
  { icon: 'assembly', title: 'Сборка' },
  { icon: 'test', title: 'Испытания и контроль качества' },
];

export const HOME_CAPABILITY_CARDS: HomeCapabilityCard[] = [
  {
    value: '150',
    unit: 'кг',
    text: 'чугунное литьё\nв песчаные формы',
    image: 'drive-gearboxes',
    alt: 'Корпусные литые детали, промышленная иллюстрация',
  },
  {
    value: '5000',
    unit: 'мм',
    text: 'максимальная длина\nобрабатываемого вала',
    image: 'machined-steel-shaft',
    alt: 'Обработанный стальной вал, промышленная иллюстрация',
  },
  {
    value: '1000 × 600 × 600',
    unit: 'мм',
    text: 'габариты изделий\nдля гальванической линии',
    image: 'electric-machinery-shop',
    alt: 'Промышленное оборудование в цехе, иллюстрация',
  },
  {
    value: 'Сталь, чугун,\nалюминий, бронза',
    unit: '',
    text: 'литьё и механическая\nобработка металлов',
    image: 'machined-metal-components',
    alt: 'Металлические детали после механической обработки, иллюстрация',
  },
];

export const HOME_GEO_CUSTOMERS = HOME_GEO_REGIONS.filter((region) => region.name !== 'Экспорт')
  .flatMap((region) => region.sites)
  .slice(0, 6);

export function matchShowcaseHref(
  tiles: HomeShowcaseTile[],
  categoryList: { title: string; slug: string }[],
) {
  return tiles.map((product) => {
    const category = categoryList.find((item) =>
      item.title?.toLowerCase().includes(product.match),
    );
    return {
      ...product,
      href: category ? `/products/${category.slug}` : '/products',
    };
  });
}

export function formatHomeNewsDate(date: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date));
}
