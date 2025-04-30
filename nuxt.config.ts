// nuxt.config.ts — Nuxt 3 версия
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  app: {
    head: {
      title: 'ОАО "КЭМЗ"',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Placeholder description',
        },
        { name: 'title', content: 'ОАО "КЭМЗ"' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  css: [
    '@/assets/css/styles/main.scss',
    '@/assets/css/tailwind.css'
  ],

  modules: [
    '@vite-pwa/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  runtimeConfig: {
    public: {
      CTF_SPACE_ID: process.env.CTF_SPACE_ID,
      CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN,
      API_BASE_URL: 'https://www.aokemz.ru'
    }
  },

  tailwindcss: {
    cssPath: '@/assets/css/tailwind.css',
    configPath: 'tailwind.config.js'
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'ОАО "КЭМЗ"',
      short_name: 'ОАО "КЭМЗ"',
      theme_color: '#2F78CD',
      background_color: '#2F78CD'
    },
    meta: {
      name: 'ОАО "КЭМЗ"'
    }
  },

  postcss: {
    plugins: {
      'postcss-nesting': {}
    }
  }
})
