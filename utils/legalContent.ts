/** Operator details for 152-FZ / 149-FZ documents (see docs/brand-facts.md). */
export const legalOperator = {
  name: "ОАО «Карпинский электромашиностроительный завод»",
  shortName: "ОАО «КЭМЗ»",
  address: "624930, Свердловская область, г. Карпинск, ул. Карпинского, 1",
  inn: "6614001913",
  site: "https://www.aokemz.ru",
  emailPrivacy: "info@aokemz.ru",
  emailSales: "sales@aokemz.ru",
  /** Email for claims under Art. 15.7 of Federal Law No. 149-FZ. */
  emailLegal: "info@aokemz.ru",
  phoneSales: "+7 (343) 278-37-43",
} as const;

export const legalUpdatedAt = "19 сентября 2026 г.";

/** Short label for form checkbox (links to /legal#consent). */
export const formConsentLabel =
  "Я даю согласие на обработку персональных данных в соответствии с документом, размещённым на странице «Правовая информация».";

export const formConsentError =
  "Необходимо согласие на обработку персональных данных";

export const LEGAL_HERO = {
  title: "Обработка персональных данных",
  lead: "Мы ответственно относимся к защите вашей конфиденциальной информации.",
  rail: "Надёжные решения для реальных задач",
  image: "/media/legal/legal-hero-machinery.webp",
  imageAlt:
    "Крупный узел электрической машины в цехе, промышленная иллюстрация",
} as const;

export type LegalNavItem = {
  id: string;
  label: string;
  group?: string;
};

export const LEGAL_NAV: LegalNavItem[] = [
  { id: "policy-general", label: "Общие положения", group: "Политика ПДн" },
  { id: "policy-operator", label: "Оператор", group: "Политика ПДн" },
  { id: "policy-purposes", label: "Цели обработки данных", group: "Политика ПДн" },
  { id: "policy-grounds", label: "Правовые основания", group: "Политика ПДн" },
  { id: "policy-data", label: "Состав обрабатываемых данных", group: "Политика ПДн" },
  { id: "policy-actions", label: "Способы обработки", group: "Политика ПДн" },
  {
    id: "policy-transfer",
    label: "Передача третьим лицам",
    group: "Политика ПДн",
  },
  { id: "policy-terms", label: "Сроки хранения", group: "Политика ПДн" },
  { id: "policy-rights", label: "Права субъекта", group: "Политика ПДн" },
  { id: "policy-protection", label: "Меры защиты", group: "Политика ПДн" },
  { id: "policy-cookies", label: "Cookie и аналитика", group: "Политика ПДн" },
  { id: "policy-changes", label: "Изменение Политики", group: "Политика ПДн" },
  { id: "consent", label: "Согласие субъекта", group: "Согласие" },
  { id: "cookies", label: "Политика cookie", group: "Cookie" },
  { id: "terms", label: "Пользовательское соглашение", group: "Сайт" },
  { id: "owner", label: "Владелец сайта", group: "Сайт" },
];

/** Public PDF of the same legal package as /legal (policy, consent, cookies, terms, owner). */
export const LEGAL_DOWNLOAD = {
  href: "/docs/kemz-privacy-policy.pdf",
  title: "Скачать документ",
  subtitle: "Политика обработки персональных данных (PDF)",
  filename: "kemz-privacy-policy.pdf",
} as const;

export const LEGAL_CTA = {
  title: "Остались вопросы?",
  lead: "Напишите по обработке персональных данных: ответим и подскажем по документам на сайте.",
  image: "/media/legal/legal-cta-motor.webp",
  imageAlt:
    "Сборка электрической машины в цехе, промышленная иллюстрация",
  aside: ["Опыт", "Качество", "Сотрудничество"] as const,
} as const;

export const COOKIE_BANNER = {
  title: "Файлы cookie",
  text: "Сайт использует необходимые cookie для работы страниц и сохранения вашего выбора. Стороннюю веб-аналитику сейчас не подключаем. Подробнее:",
  linkLabel: "политика cookie",
  acceptAll: "Принять",
  necessaryOnly: "Только необходимые",
};
