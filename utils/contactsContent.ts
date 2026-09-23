/** Static copy and directory for /contacts redesign. Phones/emails from brand-facts + existing page. */

export type ContactPhone = { label: string; href: string };

export type ContactEntry = {
  position: string;
  person?: string;
  phones: ContactPhone[];
  email: string;
  /** Simple icon key for the directory row. */
  icon: "reception" | "sales" | "supply" | "otk" | "quality" | "hr";
};

export const CONTACTS_HERO = {
  title: "Контакты",
  lead: "Отделы завода и форма для отдела продаж.",
  rail: ["Надёжные решения", "для реальных задач"] as const,
  image: "/media/about/about-worker-rotor-brand.webp",
  imageAlt:
    "Сотрудник КЭМЗ у ротора с медными обмотками в цехе электромашиностроительного завода",
} as const;

export const CONTACTS_DIRECTORY = {
  title: "Контактная информация",
  lead: "Телефоны и почта отделов. Заявки по машинам направляйте в отдел продаж.",
} as const;

export const CONTACTS_ADDRESS = {
  title: "Адрес",
  lines: [
    "624930, Свердловская область,",
    "г. Карпинск, ул. Карпинского, 1",
  ] as const,
  mapHref:
    "https://yandex.ru/maps/?text=624930%2C%20Свердловская%20область%2C%20г.%20Карпинск%2C%20ул.%20Карпинского%2C%201",
  mapLabel: "Показать на карте",
  /** Real plant exterior from the pre-redesign about gallery. */
  entranceImage: "/media/about-plant.webp",
  entranceAlt:
    "Фасад ОАО «КЭМЗ» в Карпинске: главный вход с вывеской «Электромашзавод»",
  entranceCaption: "Главный вход ОАО «КЭМЗ»",
} as const;

export const CONTACTS_FORM = {
  title: "Написать в отдел продаж",
  lead: "Заявка уходит в отдел продаж. Ответ обычно в рабочие дни.",
  image: "/media/generated/news-quarry-excavator.webp",
  imageAlt:
    "Карьерный экскаватор на фоне открытого карьера на закате, промышленная иллюстрация",
  aside: ["Опыт", "Качество", "Сотрудничество"] as const,
} as const;

export const CONTACTS_LIST: ContactEntry[] = [
  {
    icon: "reception",
    position: "Приёмная генерального директора",
    phones: [{ label: "+7 (34383) 3-28-51", href: "tel:+73438332851" }],
    email: "info@aokemz.ru",
  },
  {
    icon: "sales",
    position: "Отдел продаж",
    phones: [{ label: "+7 (343) 278-37-43", href: "tel:+73432783743" }],
    email: "sales@aokemz.ru",
  },
  {
    icon: "supply",
    position: "Отдел материально-технического снабжения",
    phones: [
      { label: "+7 (34383) 3-35-22", href: "tel:+73438333522" },
      { label: "+7 (34383) 3-36-40", href: "tel:+73438333640" },
      { label: "+7 (34383) 3-28-96", href: "tel:+73438332896" },
    ],
    email: "omts@aokemz.ru",
  },
  {
    icon: "otk",
    position: "Отдел технического контроля",
    phones: [{ label: "+7 (34383) 3-36-30", href: "tel:+73438333630" }],
    email: "otk@aokemz.ru",
  },
  {
    icon: "quality",
    position: "Начальник службы качества",
    person: "Тягунов Антон Сергеевич",
    phones: [{ label: "+7 (34383) 3-36-30", href: "tel:+73438333630" }],
    email: "tas@aokemz.ru",
  },
  {
    icon: "hr",
    position: "Начальник отдела кадров",
    person: "Архиреева Любовь Алексеевна",
    phones: [{ label: "+7 (343) 833-36-89", href: "tel:+73438333689" }],
    email: "laa@aokemz.ru",
  },
];
