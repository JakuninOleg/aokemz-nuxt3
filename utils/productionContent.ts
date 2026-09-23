/** Static copy and media for /production redesign. Capabilities from brand-facts. */

export const PRODUCTION_HERO = {
  image: "/media/production/production-hero-stator-v1.webp",
  mobileImage: "/media/production/production-hero-stator-v1-720.webp",
  imageAlt:
    "Инженер у статора электрической машины с медными обмотками в производственном цехе",
  title: "Производство",
  lead:
    "Полный цикл изготовления: проектирование, заготовительное и обрабатывающее производство, сборка и стендовые испытания.",
  rail: ["Надёжные электрические машины", "для реальных условий"] as const,
  points: [
    { icon: "gear", title: "Собственные компетенции" },
    { icon: "shield", title: "Контроль качества" },
    { icon: "chart", title: "Десятилетия опыта" },
  ],
} as const;

export const PRODUCTION_STAGES = [
  {
    number: "01",
    title: "Проектирование",
    text: "Конструкция под требования заказчика и условия эксплуатации машины.",
    image: "/media/production/production-stage-01-design-720.webp",
    alt: "Инженер за монитором с 3D-моделью электрической машины",
  },
  {
    number: "02",
    title: "Заготовительное производство",
    text: "Штамповка и литьё заготовок.",
    image: "/media/production/production-stage-02-foundry-720.webp",
    alt: "Литейщики заливают расплавленный металл в форму",
  },
  {
    number: "03",
    title: "Механическая обработка",
    text: "Обработка деталей на универсальном и специализированном оборудовании.",
    image: "/media/production/production-stage-03-machining-720.webp",
    alt: "Токарная обработка стального вала в цехе",
  },
  {
    number: "04",
    title: "Сборка",
    text: "Сборка узлов и машин, балансировка и настройка.",
    image: "/media/production/production-stage-04-assembly-720.webp",
    alt: "Сборка крупной электрической машины с медными обмотками",
  },
  {
    number: "05",
    title: "Испытания",
    text: "Проверка электрических и механических параметров на стендах завода.",
    image: "/media/production/production-stage-05-testing-720.webp",
    alt: "Пульт и стенд испытаний электрических машин",
  },
] as const;

export const PRODUCTION_CAPABILITIES = [
  {
    value: "до 150 кг",
    label: "Чугунное литьё в песчаные формы",
    icon: "cast",
  },
  {
    value: "до 5000 мм",
    label: "Обработка валов длиной до 5000 мм",
    icon: "shaft",
  },
  {
    value: "1000 × 600 × 600 мм",
    label: "Гальваническая линия (размер ванн)",
    icon: "bath",
  },
  {
    value: "Сталь, чугун, алюминий, бронза",
    label: "Обрабатываемые материалы",
    icon: "alloy",
  },
] as const;

export const PRODUCTION_GALLERY = [
  {
    title: "Механическая обработка",
    image: "/media/production/real/about_2-960.webp",
    alt: "Токарь у токарного станка в цехе ОАО «КЭМЗ»",
    featured: true,
  },
  {
    title: "Производственный цех",
    image: "/media/production/real/about_5-960.webp",
    alt: "Производственный зал ОАО «КЭМЗ» с оборудованием и мостовым краном",
    featured: false,
  },
  {
    title: "Обмотки статора",
    image: "/media/production/real/about_4-960.webp",
    alt: "Медные обмотки статора электрической машины в цехе КЭМЗ",
    featured: false,
  },
  {
    title: "Обработка крупных деталей",
    image: "/media/production/real/about_3-960.webp",
    alt: "Карусельный станок обрабатывает крупную деталь в цехе КЭМЗ",
    featured: false,
  },
  {
    title: "Главный вход завода",
    image: "/media/production/real/about_1-960.webp",
    alt: "Фасад ОАО «КЭМЗ» в Карпинске с вывеской «Электромашзавод»",
    featured: false,
  },
] as const;

export const PRODUCTION_QUALITY = [
  { icon: "clipboard", title: "Входной контроль материалов" },
  { icon: "gearCheck", title: "Контроль на всех этапах производства" },
  { icon: "chart", title: "Электрические и механические испытания" },
  { icon: "shield", title: "Соответствие ГОСТ и ТУ" },
] as const;

export const PRODUCTION_CTA = {
  title: "Нужна надёжная электромашина?",
  lead: "Отдел продаж подберёт машину под вашу технику и сроки.",
  button: "Связаться с инженером",
  aside: ["Надёжные", "электрические", "машины"] as const,
  image: "/media/documents/docs-cta-machinery.webp",
  imageAlt:
    "Электрическая машина и инженерный чертёж, промышленная иллюстрация",
} as const;
