import type { CollectionConfig } from 'payload';
import { administrators, editors } from '../access';

const immutable = { create: () => false, update: () => false };
export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Заявка', plural: 'Заявки' },
  admin: {
    group: 'Обращения', useAsTitle: 'name', defaultColumns: ['name', 'status', 'email', 'mailStatus', 'createdAt'],
    description: 'Обращения со всех форм сайта. Заявка сохраняется до отправки почтового уведомления. Редактор может просматривать заявки; обработка и удаление доступны администратору.',
  },
  access: { read: editors, create: () => false, update: administrators, delete: administrators, admin: editors },
  fields: [
    { name: 'status', label: 'Статус обработки', type: 'select', required: true, defaultValue: 'new', index: true,
      options: [{ label: 'Новая', value: 'new' }, { label: 'В работе', value: 'in_progress' }, { label: 'Закрыта', value: 'closed' }, { label: 'Спам', value: 'spam' }] },
    { name: 'notes', label: 'Заметки отдела продаж', type: 'textarea', maxLength: 5000 },
    { name: 'name', label: 'Имя / организация', type: 'text', required: true, maxLength: 120, access: immutable, admin: { readOnly: true } },
    { name: 'email', label: 'Email', type: 'email', required: true, access: immutable, admin: { readOnly: true } },
    { name: 'phone', label: 'Телефон', type: 'text', required: true, access: immutable, admin: { readOnly: true } },
    { name: 'message', label: 'Сообщение', type: 'textarea', required: true, maxLength: 2000, access: immutable, admin: { readOnly: true } },
    { name: 'technical', label: 'Параметры оборудования', type: 'group', access: immutable, admin: { readOnly: true }, fields: [
      { name: 'equipment', label: 'Тип оборудования', type: 'text' }, { name: 'machine', label: 'Модель техники', type: 'text' },
      { name: 'power', label: 'Мощность, кВт', type: 'text' }, { name: 'company', label: 'Компания', type: 'text' },
    ] },
    { name: 'sourcePath', label: 'Страница обращения', type: 'text', access: immutable, admin: { readOnly: true } },
    { name: 'consentAt', label: 'Согласие получено', type: 'date', required: true, access: immutable, admin: { readOnly: true } },
    { name: 'consentVersion', label: 'Основание согласия', type: 'text', required: true, access: immutable, admin: { readOnly: true } },
    { name: 'mailStatus', label: 'Почтовое уведомление', type: 'select', required: true, defaultValue: 'pending', index: true, access: immutable,
      options: [{ label: 'Отправляется', value: 'pending' }, { label: 'Отправлено', value: 'sent' }, { label: 'Ошибка отправки', value: 'failed' }], admin: { readOnly: true, position: 'sidebar' } },
    { name: 'mailSentAt', label: 'Письмо отправлено', type: 'date', access: immutable, admin: { readOnly: true, position: 'sidebar' } },
    { name: 'requestId', type: 'text', required: true, unique: true, access: immutable, admin: { hidden: true } },
    { name: 'requestHash', type: 'text', required: true, access: immutable, admin: { hidden: true } },
  ],
};
