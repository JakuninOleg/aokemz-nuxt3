// import { defineStore } from 'pinia'
// import type { Entry, EntryCollection } from 'contentful'

// interface ContentfulEntry {
//   sys: { contentType: { sys: { id: string } }; createdAt: string }
//   fields: { [key: string]: any }
// }

// export const useContentStore = defineStore('content', {
//   state: () => ({
//     products: null as ContentfulEntry[] | null,
//     categories: null as ContentfulEntry[] | null,
//     news: null as ContentfulEntry[] | null,
//     phone: '',
//     currentLink: '',
//   }),

//   getters: {
//     getPhone: (state) => state.phone,
//     getCurrentLink: (state) => state.currentLink,
//   },

//   actions: {
//     async fetchContent() {
//       const { $contentful } = useNuxtApp() // Получаем клиент из контекста

//       try {
//         const data: EntryCollection<ContentfulEntry> = await $contentful.getEntries({
//           order: '-sys.createdAt',
//         })

//         this.news = data.items.filter(
//           (item) => item.sys.contentType.sys.id === 'news'
//         )
//         this.categories = data.items.filter(
//           (item) => item.sys.contentType.sys.id === 'Category'
//         )
//         this.products = data.items.filter(
//           (item) => item.sys.contentType.sys.id === 'subcategory'
//         )
//       } catch (error) {
//         console.error('Ошибка при загрузке данных из Contentful:', error)
//         throw createError({
//           statusCode: 500,
//           message: 'Не удалось загрузить контент',
//         })
//       }
//     },

//     setPhone(payload: string) {
//       this.phone = payload
//     },

//     setCurrentLink(payload: string) {
//       this.currentLink = payload
//     },
//   },
// })