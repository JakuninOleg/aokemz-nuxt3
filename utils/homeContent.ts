export type HomeStat = {
  value: string
  label: string
  long: boolean
}

export type HomeProductSpec = {
  label: string
  value: string
}

export type HomeProduct = {
  name: string
  code: string
  title: string
  description: string
  specs: HomeProductSpec[]
  image: string
  imageSm: string
  alt: string
  caption: string
}

export type HomeProcessStep = {
  title: string
  text: string
}

export type HomeProcessPhoto = {
  src: string
  alt: string
  caption: string
}

export type HomeCapability = {
  tag: string
  title: string
  text: string
}

export type HomeGeoRegion = {
  name: string
  sites: string[]
}

export const HOME_STATS: HomeStat[] = [
  { value: '1960', label: 'год основания', long: false },
  { value: '54–560 кВт', label: 'двигатели ДПЭ и ДПВ', long: true },
  { value: 'до 1250 кВт', label: 'генераторы 4ГПЭ', long: true },
  { value: 'до 1000 кВт', label: 'буровые ДПБ', long: true },
  { value: '27,5 / 35 кВ', label: 'высоковольтная аппаратура', long: true },
]

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
]

export const HOME_PROCESS: HomeProcessStep[] = [
  { title: 'Проектирование', text: 'Конструкторская подготовка под опросный лист и параметры машины.' },
  { title: 'Заготовка', text: 'Литьё, раскрой и подготовка материалов для корпусных деталей.' },
  { title: 'Обработка', text: 'Токарные, фрезерные, зуборезные и шлицевые операции.' },
  { title: 'Сборка', text: 'Намотка, укладка обмоток и сборка электрической машины.' },
  { title: 'Испытания', text: 'Проверка параметров на заводских стендах перед отгрузкой.' },
]

export const HOME_PROCESS_PHOTOS: HomeProcessPhoto[] = [
  { src: '/media/plant-foundry.webp', alt: 'Литейный участок завода', caption: 'Литьё' },
  { src: '/media/plant-windings.webp', alt: 'Укладка медной обмотки статора', caption: 'Обмотка' },
  { src: '/media/plant-teststand.webp', alt: 'Электрическая машина на испытательном стенде', caption: 'Испытания' },
]

export const HOME_CAPABILITIES: HomeCapability[] = [
  { tag: 'Литьё', title: 'Сталь и чугун', text: 'Сталь в песок до 120 кг. Чугун в песок до 150 кг.' },
  { tag: 'Цветные сплавы', title: 'Алюминий и бронза', text: 'Литьё под давлением, в кокиль и песчаные формы.' },
  { tag: 'Гальваника', title: 'Линия 1000 × 600 × 600 мм', text: 'Цинк, кадмий, никель, олово, медь-олово и пассивация.' },
  { tag: 'Механообработка', title: 'Валы длиной до 5000 мм', text: 'Диаметр до 250 мм на HECKERT ZFWVG 250/4Fx5000.' },
]

export const HOME_GEO_REGIONS: HomeGeoRegion[] = [
  { name: 'Центральный регион', sites: ['Стойленский ГОК', 'Михайловский ГОК'] },
  { name: 'Северо-Запад', sites: ['Ковдорский ГОК', 'АО «Апатит»'] },
  { name: 'Сибирь', sites: ['Сибирский Антрацит', 'Кузбассразрезуголь', 'СДС-Уголь'] },
  { name: 'Экспорт', sites: ['Казахстан', 'Узбекистан', 'Индия'] },
]
