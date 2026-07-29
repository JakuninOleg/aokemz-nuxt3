export default defineNuxtConfig({
  compatibilityDate: '2025-04-30',

  app: {
    head: {
      title: 'ОАО "КЭМЗ"',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Placeholder description' },
        { name: 'title', content: 'ОАО "КЭМЗ"' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },

  css: [
    '~/assets/css/styles/main.scss'       // Подключаем стили Tailwind
  ],

  modules: [
    // '@vite-pwa/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  plugins: [
    '~/plugins/contentful',
    // '~/plugins/vue-yandex-maps.js'
  ],

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
      API_BASE_URL: 'https://www.aokemz.ru'
    }
  },

  // tailwindcss: {
  //   cssPath: '~/assets/css/tailwind.css',
  //   configPath: 'tailwind.config.ts',
  //   exposeConfig: false
  // },

  // pwa: {
  //   registerType: 'autoUpdate',
  //   manifest: {
  //     name: 'ОАО "КЭМЗ"',
  //     short_name: 'ОАО "КЭМЗ"',
  //     theme_color: '#2F78CD',
  //     background_color: '#2F78CD',
  //     display: 'standalone',
  //     scope: '/',
  //     start_url: '/',
  //     icons: [
  //       {
  //         src: '/pwa-192x192.png',
  //         sizes: '192x192',
  //         type: 'image/png'
  //       },
  //       {
  //         src: '/pwa-512x512.png',
  //         sizes: '512x512',
  //         type: 'image/png'
  //       }
  //     ]
  //   },
  //   devOptions: {
  //     enabled: true,
  //     type: 'module'
  //   }
  // },

  postcss: {
    plugins: {
      'postcss-nesting': {}
    }
  },
  
})
