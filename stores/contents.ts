import { defineStore } from 'pinia'
import { createClient } from '~/plugins/contentful'

const client = createClient()

export const useContentStore = defineStore('content', {
  state: () => ({
    products: null as any[] | null,
    categories: null as any[] | null,
    news: null as any[] | null,
    phone: '',
    currentLink: ''
  }),

  getters: {
    getPhone: (state) => state.phone,
    getCurrentLink: (state) => state.currentLink
  },

  actions: {
    async fetchContent() {
      const data = await client.getEntries({
        order: '-sys.createdAt'
      })

      this.news = data.items.filter(
        (item) => item.sys.contentType.sys.id === 'news'
      )
      this.categories = data.items.filter(
        (item) => item.sys.contentType.sys.id === 'Category'
      )
      this.products = data.items.filter(
        (item) => item.sys.contentType.sys.id === 'subcategory'
      )
    },

    setPhone(payload: string) {
      this.phone = payload
    },

    setCurrentLink(payload: string) {
      this.currentLink = payload
    }
  }
})
