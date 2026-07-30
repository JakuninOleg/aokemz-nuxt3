import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-04-30',

  app: {
    head: {
      title: 'ОАО «КЭМЗ»',
      htmlAttrs: { lang: 'ru' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'ОАО «Карпинский электромашиностроительный завод»: электрические машины и комплекты приводов для карьерной техники. Карпинск, с 1960 года.',
        },
        { name: 'theme-color', content: '#2f78cd' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'preload',
          as: 'style',
          href: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&family=IBM+Plex+Mono:wght@400&family=Source+Sans+3:wght@400;600;700&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&family=IBM+Plex+Mono:wght@400&family=Source+Sans+3:wght@400;600;700&display=swap',
          media: 'print',
          onload: "this.media='all'",
        },
      ],
    },
  },

  css: ['~/assets/css/styles/main.scss'],

  modules: ['@nuxtjs/tailwindcss'],

  vite: {
    build: {
      cssCodeSplit: true,
    },
    optimizeDeps: {
      include: ['leaflet'],
    },
  },

  experimental: {
    payloadExtraction: true,
  },

  nitro: {
    compressPublicAssets: true,
  },

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
