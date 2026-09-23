import { defineNuxtConfig } from 'nuxt/config'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://aokemz.ru'
const isIndexableDeployment = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === 'production'
  : process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  compatibilityDate: '2025-04-30',

  // Allow a verification build without overwriting a running dev server's files.
  buildDir: process.env.KEMZ_BUILD_DIR || '.nuxt',

  // Bind explicitly to IPv4 so localhost is reachable consistently from local browsers.
  devServer: {
    host: '127.0.0.1',
    port: 3000,
  },

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
        { rel: 'manifest', href: '/site.webmanifest' },
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
    routeRules: {
      '/_nuxt/**': {
        headers: { 'cache-control': 'public, max-age=31536000, immutable' },
      },
      '/media/**': {
        headers: { 'cache-control': 'public, max-age=31536000, immutable' },
      },
      '/fonts/**': {
        headers: { 'cache-control': 'public, max-age=31536000, immutable' },
      },
      '/news/**': {
        headers: { 'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400' },
      },
      '/products/**': {
        headers: { 'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400' },
      },
      '/**': {
        headers: {
          'content-security-policy': "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; object-src 'none'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; script-src 'self' 'unsafe-inline'; connect-src 'self' https://cdn.contentful.com https://images.ctfassets.net;",
          'permissions-policy': 'camera=(), geolocation=(), microphone=()',
          'referrer-policy': 'strict-origin-when-cross-origin',
          'x-content-type-options': 'nosniff',
        },
      },
    },
  },

  plugins: ['~/plugins/contentful'],

  runtimeConfig: {
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || '465',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    mailFrom: process.env.MAIL_FROM || '',
    mailTo: process.env.MAIL_TO || 'sales@aokemz.ru, oleg.kemz@gmail.com',
    public: {
      CTF_SPACE_ID: process.env.CTF_SPACE_ID,
      CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN,
      siteUrl,
      indexableDeployment: isIndexableDeployment,
    },
  },

  postcss: {
    plugins: {
      'postcss-nesting': {},
    },
  },
})
