/** Public technical library files (see public/docs and docs/brand-facts.md). */

export type DocumentItem = {
  title: string;
  href: string;
  ext: "PDF" | "DOCX";
  note: string;
};

export const DOCUMENTS_HERO = {
  label: "Материалы",
  title: "Документы",
  lead: "Презентация завода, производственные возможности и опросный лист на электрические машины.",
  image: "/media/documents/docs-hero-blueprint.webp",
  imageAlt:
    "Электродвигатель и чертёж: промышленная иллюстрация для раздела документов",
} as const;

export const DOCUMENTS_LIST: DocumentItem[] = [
  {
    title: "Презентация / каталог ОАО «КЭМЗ»",
    href: "/docs/kemz-catalog.pdf",
    ext: "PDF",
    note: "Номенклатура, комплекты, ТТХ",
  },
  {
    title: "Возможности завода",
    href: "/docs/kemz-capabilities.docx",
    ext: "DOCX",
    note: "Литьё, гальваника, механообработка",
  },
  {
    title: "Опросный лист на электрические машины",
    href: "/docs/kemz-questionnaire-machines.pdf",
    ext: "PDF",
    note: "Параметры привода и машины",
  },
  {
    title: "Перечень запасных частей",
    href: "/docs/kemz-spare-parts.pdf",
    ext: "PDF",
    note: "Сканы, удобнее смотреть на десктопе",
  },
];

export const DOCUMENTS_CTA = {
  title: "Не нашли нужный документ?",
  lead: "Свяжитесь с отделом продаж: поможем найти техническую информацию.",
  button: "Контакты отдела продаж",
  aside: ["Техническая", "информация", "всегда рядом"] as const,
  image: "/media/documents/docs-cta-motors.webp",
  imageAlt:
    "Электродвигатели в цехе и чертёж на синем фоне, промышленная иллюстрация",
} as const;
