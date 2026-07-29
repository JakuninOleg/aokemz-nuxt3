import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-04-30',

  app: {
    head: {
      title: 'OAO KEMZ',
      htmlAttrs: { lang: 'ru' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'OAO Karpinskiy Electromagnetic Machine Plant: electric machines and drive kits for quarry excavators. Karpinsk, since 1960.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  css: ['~/assets/css/styles/main.scss'],

  modules: ['@nuxtjs/tailwindcss'],

  plugins: ['~/plugins/contentful'],

  runtimeConfig: {
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || '465',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    mailFrom: process.env.MAIL_FROM || '',
    mailTo: process.env.MAIL_TO || '',
    public: {
      CTF_SPACE_ID: process.env.CTF_SPACE_ID,
      CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN,
      API_BASE_URL: 'https://www.aokemz.ru',
    },
  },

  postcss: {
    plugins: {
      'postcss-nesting': {},
    },
  },
})
