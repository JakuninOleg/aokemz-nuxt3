import type { GlobalConfig } from 'payload';
import { editors } from '../access';
import { contactsChanged } from '../hooks/public-cache';
import { CONTACTS_ADDRESS, CONTACTS_LIST } from '../lib/contacts-content';
import { normalizeRuPhone, ruPhoneError } from '../lib/contact-validation';

export const Contacts: GlobalConfig = {
  slug: 'contacts',
  label: 'Контакты',
  access: { read: () => true, update: editors },
  hooks: { afterChange: [contactsChanged] },
  fields: [
    {
      name: 'departments',
      label: 'Отделы и сотрудники',
      labels: { singular: 'Контакт', plural: 'Контакты' },
      type: 'array',
      defaultValue: CONTACTS_LIST,
      fields: [
        { name: 'position', label: 'Отдел или должность', type: 'text', required: true },
        { name: 'person', label: 'ФИО', type: 'text' },
        {
          name: 'phones',
          label: 'Телефоны',
          labels: { singular: 'Телефон', plural: 'Телефоны' },
          type: 'array',
          fields: [{
            name: 'number',
            label: 'Номер телефона',
            type: 'text',
            required: true,
            validate: (value: unknown) => {
              if (typeof value !== 'string' || !/^[+\d()\s-]+$/.test(value)) return 'Введите российский номер телефона';
              return normalizeRuPhone(value) ? true : ruPhoneError(value) || 'Проверьте номер';
            },
          }],
        },
        { name: 'email', label: 'Электронная почта', type: 'email' },
        {
          name: 'icon',
          label: 'Значок',
          type: 'select',
          required: true,
          defaultValue: 'reception',
          options: [
            { value: 'reception', label: 'Приёмная' },
            { value: 'sales', label: 'Продажи' },
            { value: 'supply', label: 'Снабжение' },
            { value: 'otk', label: 'Технический контроль' },
            { value: 'quality', label: 'Качество' },
            { value: 'hr', label: 'Кадры' },
          ],
        },
      ],
    },
    {
      name: 'address',
      label: 'Почтовый адрес завода',
      type: 'textarea',
      required: true,
      defaultValue: CONTACTS_ADDRESS.lines.join('\n'),
    },
  ],
};
