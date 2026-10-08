export type HomeStat = {
  value: string;
  label: string;
  long: boolean;
};

export type HomeProductSpec = {
  label: string;
  value: string;
};

export type HomeProduct = {
  name: string;
  code: string;
  title: string;
  description: string;
  specs: HomeProductSpec[];
  image: string;
  imageSm: string;
  alt: string;
  caption: string;
};

export type HomeProcessStep = {
  title: string;
  text: string;
};

export type HomeProcessPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export type HomeCapability = {
  tag: string;
  title: string;
  text: string;
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

export const HOME_PRODUCTS: HomeProduct[] = [
  {
    name: 'Экскаваторные комплекты',
    code: 'ДПЭ · ДПВ · 4ГПЭ',
    title: 'Машины главных приводов ЭКГ и ЭШ',
    description: 'Генераторные группы и двигатели подъёма, поворота, напора, хода и шагания.',
    specs: [
      { label: 'Экскаваторы', value: 'ЭКГ-5А…ЭКГ-20К' },
      { label: 'Шагающие', value: 'ЭШ-6/45…ЭШ-11/70' },
      { label: 'Мощность', value: 'до 1250 кВт' },
    ],
    image: '/media/dir-excavator-drive.webp',
    imageSm: '/media/dir-excavator-drive-480.webp',
    alt: 'Карьерный экскаватор ЭКГ с электрическим приводом в работе',
    caption: 'Привод карьерного экскаватора',
  },
  {
    name: 'Буровые установки',
    code: 'ДПБ · ТЭП 45',
    title: 'Приводы и тормоза бурового оборудования',
    description: 'Двигатели серии ДПБ, порошковые и индукционные тормоза для буровых установок.',
    specs: [
      { label: 'Серия', value: 'ДПБ' },
      { label: 'Мощность', value: 'до 1000 кВт' },
      { label: 'Бурение', value: 'до 8000 м' },
    ],
    image: '/media/dir-drilling-rig.webp',
    imageSm: '/media/dir-drilling-rig-480.webp',
    alt: 'Буровая установка с электрическим приводом на промышленной площадке',
    caption: 'Привод буровой установки',
  },
  {
    name: 'Железнодорожный транспорт',
    code: 'ДПТ 810-2',
    title: 'Тяговые машины и аппаратура',
    description: 'Тяговый двигатель, реакторы, дроссели, разъединители и изоляторы для железнодорожного транспорта.',
    specs: [
      { label: 'Двигатель', value: 'ДПТ 810-2' },
      { label: 'Реактор', value: 'Р-1,5/1000' },
      { label: 'Дроссель', value: 'ДР-150' },
    ],
    image: '/media/dir-traction-motor.webp',
    imageSm: '/media/dir-traction-motor-480.webp',
    alt: 'Тяговый электродвигатель для железнодорожного транспорта',
    caption: 'Тяговый двигатель ДПТ',
  },
  {
    name: 'Высоковольтная аппаратура',
    code: 'С-35 · ВВУ · ВВС',
    title: 'Аппаратура классов 27,5 и 35 кВ',
    description: 'Высоковольтные выключатели, разъединители и вводы для промышленных электрических сетей.',
    specs: [
      { label: 'Классы', value: '27,5 / 35 кВ' },
      { label: 'Марки', value: 'ВВУ / ВВС / ВВУС' },
      { label: 'Разъединитель', value: 'С-35' },
    ],
    image: '/media/dir-hv-switchgear.webp',
    imageSm: '/media/dir-hv-switchgear-480.webp',
    alt: 'Высоковольтный разъединитель и выключатели классов 27,5 и 35 кВ',
    caption: 'Высоковольтная аппаратура 35 кВ',
  },
  {
    name: 'Шахтные двигатели',
    code: 'ДАТВ · ДАКВ · ДАРВ',
    title: 'Взрывобезопасные асинхронные двигатели',
    description: 'Электрические машины габаритов 250–315 для привода оборудования подземных выработок.',
    specs: [
      { label: 'Габариты', value: '250 / 280 / 315' },
      { label: 'Исполнение', value: 'взрывобезопасное' },
      { label: 'Применение', value: 'шахтное оборудование' },
    ],
    image: '/media/dir-mine-motor.webp',
    imageSm: '/media/dir-mine-motor-480.webp',
    alt: 'Взрывобезопасный шахтный асинхронный электродвигатель',
    caption: 'Шахтный двигатель',
  },
];

export const HOME_PROCESS: HomeProcessStep[] = [
  { title: 'Проектирование', text: 'Конструкторская подготовка под опросный лист и параметры машины.' },
  { title: 'Заготовка', text: 'Литьё, раскрой и подготовка материалов для корпусных деталей.' },
  { title: 'Обработка', text: 'Токарные, фрезерные, зуборезные и шлицевые операции.' },
  { title: 'Сборка', text: 'Намотка, укладка обмоток и сборка электрической машины.' },
  { title: 'Испытания', text: 'Проверка параметров на заводских стендах перед отгрузкой.' },
];

export const HOME_PROCESS_PHOTOS: HomeProcessPhoto[] = [
  { src: '/media/plant-foundry.webp', alt: 'Литейный участок завода', caption: 'Литьё' },
  { src: '/media/plant-windings.webp', alt: 'Укладка медной обмотки статора', caption: 'Обмотка' },
  { src: '/media/plant-teststand.webp', alt: 'Электрическая машина на испытательном стенде', caption: 'Испытания' },
];

export const HOME_CAPABILITIES: HomeCapability[] = [
  { tag: 'Литьё', title: 'Сталь и чугун', text: 'Сталь в песок до 120 кг. Чугун в песок до 150 кг.' },
  { tag: 'Цветные сплавы', title: 'Алюминий и бронза', text: 'Литьё под давлением, в кокиль и песчаные формы.' },
  { tag: 'Гальваника', title: 'Линия 1000 × 600 × 600 мм', text: 'Цинк, кадмий, никель, олово, медь-олово и пассивация.' },
  { tag: 'Механообработка', title: 'Валы длиной до 5000 мм', text: 'Диаметр до 250 мм на HECKERT ZFWVG 250/4Fx5000.' },
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
