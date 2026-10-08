export type AboutFact = {
  value: string;
  label: string;
};

export type AboutCycleStep = {
  title: string;
  text: string;
  icon: string;
};

export type AboutCapability = {
  value: string;
  unit: string;
  text: string;
  image: string;
  alt: string;
};

export type AboutLine = {
  code: string;
  title: string;
  text: string;
};

export type AboutTimelineItem = {
  year: string;
  text: string;
};

export const ABOUT_HERO = {
  eyebrow: "Карпинск · Свердловская область",
  brand: "ОАО «КЭМЗ»",
  title: "65+ лет\nинженерной\nшколы",
  lead: "Люди, технологии и опыт, которые двигают горнодобывающую промышленность вперёд.",
  image: "/media/about/about-hero-archive-clean.webp",
  imageSm: "/media/about/about-hero-archive-clean.webp",
  imageAlt:
    "Работники КЭМЗ у крупной электрической машины в цехе, архивная иллюстрация",
};

export const ABOUT_FACTS: AboutFact[] = [
  { value: "1960", label: "год основания" },
  { value: "Полный цикл", label: "конструкция → стенд" },
  { value: "−60…+40 °C", label: "климат агрегатов" },
  { value: "27,5 / 35 кВ", label: "высоковольтная аппаратура" },
];

export const ABOUT_TIMELINE: AboutTimelineItem[] = [
  { year: "1960", text: "Основание завода в Карпинске" },
  {
    year: "1960–90-е",
    text: "Расширение производства",
  },
  {
    year: "с 2015",
    text: "Освоение и запуск в серию машин переменного тока",
  },
  {
    year: "Сегодня",
    text: "Широкий спектр машин для карьерной и шахтной техники",
  },
];

export const ABOUT_TODAY = {
  tag: "Завод",
  title: "КЭМЗ сегодня",
  lead: "Производственный, исследовательский и проектный комплекс с замкнутым циклом в Карпинске.",
  points: [
    {
      icon: "team",
      title: "Команда профессионалов",
      text: "Расчёт и конструкторская подготовка под параметры вашей техники.",
    },
    {
      icon: "factory",
      title: "Современное производство",
      text: "Механообработка валов до 5000 мм, литьё и гальваническая линия.",
    },
    {
      icon: "cycle",
      title: "Полный цикл на одной площадке",
      text: "От опросного листа до испытаний на заводских стендах.",
    },
  ],
  image: "/media/about/about-plant-brand.webp",
  imageAlt: "Административно-производственный корпус ОАО КЭМЗ в Карпинске",
};

export const ABOUT_STORY = {
  tag: "История",
  title: "От ремонтных мастерских —\nк электромашиностроению",
  lead: "18 июня 1960 года на базе электроремонтных мастерских треста «Вахрушевуголь» в Карпинске открыт завод.",
  body: [
    "От нескольких видов машин постоянного тока предприятие выросло до многопрофильного электромашиностроительного завода с собственным конструкторским отделом и испытательными стендами.",
    "Сегодня КЭМЗ проектирует, производит и испытывает электрические машины для карьерной и шахтной техники на собственной площадке в Карпинске.",
  ],
  images: [
    {
      src: "/media/about/about-history-1960.webp",
      alt: "Цех КЭМЗ, архивный кадр около 1960 года",
      caption: "1960-е",
    },
    {
      src: "/media/about/about-machine-assembly-wide.webp",
      alt: "Сборка крупной электрической машины на КЭМЗ",
      caption: "Цех",
    },
    {
      src: "/media/about/about-plant-exterior-wide.webp",
      alt: "Производственная площадка КЭМЗ",
      caption: "Площадка",
    },
  ],
  // Compatibility fields for legacy section components; the reference layout uses `images` above.
  image: "/media/about/about-history-1960.webp",
  imageSm: "/media/about/about-history-1960.webp",
  imageAlt: "Цех КЭМЗ, архивный кадр около 1960 года",
};

/** Kept for legacy, currently unused route sections. Values are documented plant facts. */
export const ABOUT_PLANT = [
  {
    tag: "Литьё",
    title: "До 150 кг",
    text: "Чугунное литьё в песчаные формы.",
  },
  {
    tag: "Механообработка",
    title: "До 5000 мм",
    text: "Максимальная длина обрабатываемого вала.",
  },
  {
    tag: "Гальваника",
    title: "1000 × 600 × 600 мм",
    text: "Габариты линии для обработки изделий.",
  },
];

/** Legacy gallery data, retained so the former component remains type-safe. */
export const ABOUT_GALLERY = [
  {
    src: "/media/about/about-machine-assembly-wide.webp",
    srcSm: "/media/about/about-machine-assembly-wide.webp",
    alt: "Сборка электрической машины в цехе",
    caption: "Сборка",
  },
  {
    src: "/media/about/about-motor-shop-wide.webp",
    srcSm: "/media/about/about-motor-shop-wide.webp",
    alt: "Электрическая машина на площадке сборки",
    caption: "Испытания",
  },
  {
    src: "/media/about/about-castings-wide.webp",
    srcSm: "/media/about/about-castings-wide.webp",
    alt: "Литые корпусные детали",
    caption: "Литьё",
  },
  {
    src: "/media/about/about-machined-shaft-wide.webp",
    srcSm: "/media/about/about-machined-shaft-wide.webp",
    alt: "Обработанный вал в цехе",
    caption: "Механообработка",
  },
];

export const ABOUT_PEOPLE = {
  tag: "Коллектив",
  title: "Люди.\nТехнологии.\nРазвитие.",
  text: "На площадке совмещены конструкторская подготовка, механообработка и сборка. Задача завода: поставить машину или комплект под конкретный экскаватор, буровую или шахтное оборудование.",
  image: "/media/about/about-worker-rotor-brand.webp",
  imageAlt:
    "Специалист в спецодежде с логотипом КЭМЗ собирает ротор электрической машины",
  cta: { to: "/production", label: "О производстве" },
};

export const ABOUT_CYCLE_MEDIA = {
  image: "/media/about/about-cycle-panorama-v2.webp",
  imageAlt:
    "Иллюстрация полного цикла: чертёж, вал и электрическая машина на сборочной площадке",
  blueprint: "/media/about/about-blueprint-wide.png",
  blueprintAlt: "Чертёж узла электрической машины",
};

export const ABOUT_CYCLE: AboutCycleStep[] = [
  {
    icon: "design",
    title: "Проектирование",
    text: "Исполнение под опросный лист и параметры машины заказчика.",
  },
  {
    icon: "cast",
    title: "Заготовка",
    text: "Сталь, чугун и цветные сплавы на собственной площадке.",
  },
  {
    icon: "gear",
    title: "Обработка",
    text: "Валы до 5000 мм, зубо- и шлицефрезерование.",
  },
  {
    icon: "assembly",
    title: "Сборка",
    text: "Обмотка, укладка и сборка электрической машины.",
  },
  {
    icon: "test",
    title: "Испытания",
    text: "Проверка параметров на заводских стендах.",
  },
];

export const ABOUT_CAPABILITIES: AboutCapability[] = [
  {
    value: "150",
    unit: "кг",
    text: "чугунное литьё\nв песчаные формы",
    image: "/media/about/about-castings-wide.webp",
    alt: "Литые корпусные детали в цехе",
  },
  {
    value: "до 5000",
    unit: "мм",
    text: "максимальная длина\nобрабатываемого вала",
    image: "/media/about/about-machined-shaft-wide.webp",
    alt: "Обработанный стальной вал в цехе",
  },
  {
    value: "1000 × 600 × 600",
    unit: "мм",
    text: "габариты изделий\nдля гальванической линии",
    image: "/media/about/about-galvanic-line.webp",
    alt: "Промышленная гальваническая линия",
  },
  {
    value: "Сталь, чугун,\nалюминий, бронза",
    unit: "",
    text: "литьё и механическая\nобработка металлов",
    image: "/media/about/about-machined-parts-wide.webp",
    alt: "Обработанные металлические детали",
  },
];

export const ABOUT_QUALITY = {
  tag: "Контроль",
  title: "Качество, которое можно проверить",
  text: "Параметры машин проверяем на заводских стендах. Опросный лист на электрические машины доступен в разделе документов.",
  image: "/media/about/about-motor-shop-wide.webp",
  imageAlt: "Электрическая машина на площадке сборки и испытаний",
  points: [
    { icon: "test-bench", title: "Испытательные стенды" },
    { icon: "gauge", title: "Контроль параметров" },
    { icon: "shield", title: "ГОСТ / ТУ" },
  ],
  cta: { to: "/documents", label: "Документы" },
};

export const ABOUT_GEO_SITES = [
  "Стойленский ГОК",
  "Михайловский ГОК",
  "Ковдорский ГОК",
  "АО «Апатит»",
  "Сибирский Антрацит",
  "Кузбассразрезуголь",
];

export const ABOUT_LINES: AboutLine[] = [
  {
    code: "ДПЭ · ДПВ · 4ГПЭ",
    title: "Экскаваторные комплекты",
    text: "Генераторные группы и двигатели главных приводов ЭКГ и ЭШ.",
  },
  {
    code: "ДПБ · ТЭП",
    title: "Буровые установки",
    text: "Двигатели ДПБ до 1000 кВт, порошковые и индукционные тормоза.",
  },
  {
    code: "ДАТВ · ДАКВ · ДАРВ",
    title: "Шахтные двигатели",
    text: "Взрывобезопасные асинхронные машины габаритов 250–315.",
  },
  {
    code: "ДПТ 590 / 810",
    title: "БЕЛАЗ и ж/д",
    text: "Тяговый ДПТ 590-2 для мотор-колеса БЕЛАЗ 130 т и аппаратура для электровозов.",
  },
  {
    code: "С-35 · ВВУ · ВВС",
    title: "Высоковольтная аппаратура",
    text: "Выключатели и разъединители классов 27,5 и 35 кВ.",
  },
];
