import type { CollectionConfig, Field } from 'payload';
import { administrators, administratorsField, editors, publishedOrEditor } from './access';
import { ALLOWED_MEDIA_MIME_TYPES, validateMediaBeforeOperation, validateMediaUpload } from './hooks/media';
import { MAX_PHOTO_PIXELS, MEDIA_UPLOAD_HELP } from './lib/media-policy';
import { protectReferencedMedia } from './hooks/media-references';
import { automaticSlug, immutableProductCategory } from './hooks/slug';
import { isValidSlug } from './lib/slug.mjs';
import { publicContentChanged, publicContentDeleted } from './hooks/public-cache';

/** Import / migration metadata: editors see identity fields; sensitive payloads stay admin-only. */
const sourceFields = (): Field[] => [
  {
    name: 'legacyId',
    type: 'text',
    unique: true,
    index: true,
    label: 'Исходный ID',
    admin: {
      readOnly: true,
      description: 'Идентификатор из Contentful для сверки импорта. Не используется как адрес страницы.',
      position: 'sidebar',
    },
    access: { update: administratorsField },
  },
  {
    name: 'sourceCreatedAt',
    type: 'date',
    label: 'Дата в источнике',
    admin: { readOnly: true, position: 'sidebar' },
    access: { update: administratorsField },
  },
  {
    name: 'sourceUpdatedAt',
    type: 'date',
    label: 'Обновлено в источнике',
    admin: { readOnly: true, position: 'sidebar' },
    access: { update: administratorsField },
  },
  {
    name: 'sourceHash',
    type: 'text',
    admin: { hidden: true },
    access: { read: administrators, update: administratorsField },
  },
  {
    name: 'sourceRecord',
    type: 'json',
    admin: { hidden: true },
    access: { read: administrators, update: administratorsField },
  },
];

const slugField = (options?: { unique?: boolean; compoundHint?: boolean; editableNews?: boolean }): Field => ({
  name: 'slug',
  label: 'Адрес страницы',
  type: 'text',
  required: true,
  index: true,
  ...(options?.unique ? { unique: true as const } : {}),
  hooks: { beforeValidate: [automaticSlug] },
  validate: (value: unknown) =>
    isValidSlug(value) ? true : 'Только латинские буквы, цифры, дефис и подчёркивание',
  admin: {
    position: 'sidebar',
    description: options?.editableNews
      ? 'Читаемый адрес из заголовка. Можно изменить вручную; старый адрес перестанет работать, редирект не создаётся.'
      : options?.compoundHint
      ? 'Для новой записи заполняется из названия. Уникален в выбранной категории. Импортированные адреса не меняются.'
      : 'Для новой записи заполняется из названия. Импортированные и уже сохранённые адреса не меняются.',
  },
});

const contentAccess = {
  read: publishedOrEditor,
  create: editors,
  update: editors,
  delete: administrators,
};

const draftVersions = { drafts: true } as const;

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Пользователь', plural: 'Пользователи' },
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'updatedAt'],
    group: 'Система',
    description: 'Доступ в OJ CMS. Роль меняет только администратор.',
  },
  access: {
    create: administrators,
    delete: administrators,
    read: (args) =>
      administrators(args) ? true : args.req.user ? { id: { equals: args.req.user.id } } : false,
    update: (args) =>
      administrators(args) ? true : args.req.user ? { id: { equals: args.req.user.id } } : false,
    admin: editors,
  },
  fields: [
    { name: 'name', label: 'Имя', type: 'text', admin: { description: 'Как обращаться в панели.' } },
    {
      name: 'role',
      label: 'Роль',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Администратор', value: 'administrator' },
        { label: 'Редактор', value: 'editor' },
      ],
      access: { create: administratorsField, update: administratorsField },
      admin: { description: 'Редактор публикует контент; администратор управляет пользователями и удалением.' },
    },
  ],
};

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Файл', plural: 'Медиа' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['filename', 'title', 'mimeType', 'updatedAt'],
    group: 'Медиа',
    description: MEDIA_UPLOAD_HELP,
    components: { Description: '/components/cms/OJMediaDescription' },
  },
  access: {
    read: editors,
    create: editors,
    update: editors,
    delete: administrators,
  },
  hooks: {
    beforeOperation: [validateMediaBeforeOperation],
    beforeValidate: [validateMediaUpload],
    beforeDelete: [protectReferencedMedia],
    afterChange: [publicContentChanged],
    afterDelete: [publicContentDeleted],
  },
  upload: {
    staticDir: '.data/media',
    adminThumbnail: 'mobile',
    allowRestrictedFileTypes: false,
    pasteURL: false,
    mimeTypes: [...ALLOWED_MEDIA_MIME_TYPES],
    constructorOptions: { limitInputPixels: MAX_PHOTO_PIXELS, failOn: 'warning' },
    imageSizes: [
      {
        name: 'mobile',
        width: 480,
        fit: 'inside',
        withoutEnlargement: true,
        formatOptions: { format: 'webp', options: { quality: 85, effort: 4 } },
      },
      {
        name: 'content',
        width: 960,
        fit: 'inside',
        withoutEnlargement: true,
        formatOptions: { format: 'webp', options: { quality: 85, effort: 4 } },
      },
      {
        name: 'wide',
        width: 1600,
        fit: 'inside',
        withoutEnlargement: true,
        formatOptions: { format: 'webp', options: { quality: 85, effort: 4 } },
      },
    ],
  },
  fields: [
    ...sourceFields(),
    {
      name: 'title',
      type: 'text',
      label: 'Название',
      admin: { description: 'Подпись в списках и при вставке в текст.' },
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Описание изображения',
      admin: { description: 'Краткий русский alt для доступности и SEO. Для PDF/DOCX можно оставить пустым.' },
    },
    {
      name: 'sourceLocale',
      type: 'text',
      label: 'Locale источника',
      admin: { readOnly: true, position: 'sidebar' },
      access: { read: administrators, update: administratorsField },
    },
    {
      name: 'originalName',
      type: 'text',
      label: 'Исходное имя файла',
      admin: { readOnly: true, position: 'sidebar' },
      access: { update: administratorsField },
    },
    {
      name: 'originalSha256',
      type: 'text',
      label: 'SHA-256 оригинала',
      admin: { readOnly: true, hidden: true },
      access: { read: administrators, update: administratorsField },
    },
  ],
};

export const Documents: CollectionConfig = {
  hooks: { afterChange: [publicContentChanged], afterDelete: [publicContentDeleted] },
  slug: 'documents',
  labels: { singular: 'Документ', plural: 'Документы' },
  admin: {
    defaultColumns: ['names', '_status', 'updatedAt'],
    group: 'Материалы',
    description: 'Карточки документов с файлами из медиа. Публикуйте после проверки ссылок.',
  },
  access: contentAccess,
  versions: draftVersions,
  fields: [
    ...sourceFields(),
    {
      name: 'names',
      type: 'text',
      hasMany: true,
      label: 'Названия',
      admin: { description: 'Как документ показывается в списке на сайте.' },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      label: 'Файл',
      admin: { description: 'PDF или DOCX из раздела «Медиа».' },
    },
  ],
};

export const Categories: CollectionConfig = {
  hooks: { afterChange: [publicContentChanged], afterDelete: [publicContentDeleted] },
  slug: 'categories',
  labels: { singular: 'Категория', plural: 'Категории' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'visible', '_status', 'updatedAt'],
    group: 'Каталог',
    description: 'Разделы каталога /products/…. Сначала черновик, затем публикация.',
  },
  access: contentAccess,
  versions: draftVersions,
  fields: [
    ...sourceFields(),
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Название',
      admin: { description: 'Заголовок раздела в каталоге.' },
    },
    { ...slugField({ unique: true }) },
    {
      name: 'visible',
      type: 'checkbox',
      label: 'Показывать в каталоге',
      defaultValue: true,
      admin: { description: 'Снимите, чтобы скрыть раздел с витрины без удаления.' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      admin: { description: 'Краткий текст на странице категории.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Изображение',
    },
    {
      name: 'files',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Документы',
      admin: { description: 'Вложения раздела (паспорта, опросные листы).' },
    },
  ],
};

export const Products: CollectionConfig = {
  hooks: { afterChange: [publicContentChanged], afterDelete: [publicContentDeleted] },
  slug: 'products',
  labels: { singular: 'Товар', plural: 'Продукция' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'slug', '_status', 'updatedAt'],
    group: 'Каталог',
    description: 'Модели и позиции каталога. Адрес уникален в паре с категорией.',
  },
  access: contentAccess,
  versions: draftVersions,
  indexes: [{ fields: ['category', 'slug'], unique: true }],
  fields: [
    ...sourceFields(),
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Название',
      admin: { description: 'Из названия собирается адрес новой записи.' },
    },
    { ...slugField({ compoundHint: true }) },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Категория',
      hooks: { beforeValidate: [immutableProductCategory] },
      admin: { description: 'Раздел каталога. Для сохранённого товара смена категории закрыта до настройки 301-редиректа.' },
    },
    {
      name: 'equipmentType',
      type: 'text',
      label: 'Тип оборудования',
      admin: { description: 'Фильтр на витрине, если задан.' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Порядок',
      admin: { description: 'Меньше значение — выше в списке категории.' },
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Изображение' },
    {
      name: 'description',
      type: 'richText',
      label: 'Описание',
      admin: { description: 'Основной текст карточки товара.' },
    },
    {
      name: 'specifications',
      type: 'richText',
      label: 'Характеристики',
      admin: { description: 'Таблицы и параметры. Сохраняйте структуру из исходных данных.' },
    },
    {
      name: 'sourceDescription',
      type: 'json',
      admin: { hidden: true },
      access: { read: administrators, update: administratorsField },
    },
    {
      name: 'sourceSpecifications',
      type: 'json',
      admin: { hidden: true },
      access: { read: administrators, update: administratorsField },
    },
  ],
};

export const News: CollectionConfig = {
  hooks: { afterChange: [publicContentChanged], afterDelete: [publicContentDeleted] },
  slug: 'news',
  labels: { singular: 'Новость', plural: 'Новости' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'slug', '_status', 'updatedAt'],
    group: 'Материалы',
    description: 'Публикации /news/… с читаемыми адресами из заголовков.',
  },
  access: contentAccess,
  versions: draftVersions,
  fields: [
    ...sourceFields(),
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Заголовок',
      admin: { description: 'Для новой новости из заголовка собирается читаемый адрес.' },
    },
    { ...slugField({ unique: true, editableNews: true }) },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Дата публикации',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Дата в списке и на странице новости.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Краткий текст',
      admin: { description: 'Анонс в ленте новостей.' },
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Изображение' },
    {
      name: 'body',
      type: 'richText',
      label: 'Текст новости',
    },
    {
      name: 'sourceBody',
      type: 'json',
      admin: { hidden: true },
      access: { read: administrators, update: administratorsField },
    },
  ],
};
