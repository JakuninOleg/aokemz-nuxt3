import type { Contact } from '../payload-types';

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

/** Initial data for the editable contact directory. */
export const CONTACTS_LIST = [
  {
    icon: "reception",
    position: "Приёмная генерального директора",
    phones: [{ number: "+7 (34383) 3-28-51" }],
    email: "info@aokemz.ru",
  },
  {
    icon: "sales",
    position: "Отдел продаж",
    phones: [{ number: "+7 (343) 278-37-43" }],
    email: "sales@aokemz.ru",
  },
  {
    icon: "supply",
    position: "Отдел материально-технического снабжения",
    phones: [
      { number: "8 (34383) 3-36-25" },
      { number: "8 (34383) 3-31-19" },
    ],
    email: "omts@aokemz.ru",
  },
  {
    icon: "otk",
    position: "Отдел технического контроля",
    phones: [{ number: "+7 (34383) 3-36-30" }],
    email: "otk@aokemz.ru",
  },
  {
    icon: "quality",
    position: "Начальник службы качества",
    person: "Тягунов Антон Сергеевич",
    phones: [{ number: "+7 (34383) 3-36-30" }],
    email: "tas@aokemz.ru",
  },
  {
    icon: "hr",
    position: "Начальник отдела кадров",
    person: "Архиреева Любовь Алексеевна",
    phones: [{ number: "+7 (343) 833-36-89" }],
    email: "laa@aokemz.ru",
  },
] satisfies NonNullable<Contact['departments']>;
