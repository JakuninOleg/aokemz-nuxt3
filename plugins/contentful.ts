import type { ContentfulEntries } from '~/utils/contentfulTypes'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  type ContentfulClient = {
    getEntries: (query?: Record<string, unknown>) => Promise<unknown>
  }

  let clientPromise: Promise<ContentfulClient> | null = null

  const getClient = () => {
    if (!clientPromise) {
      clientPromise = import('contentful').then(({ createClient }) =>
        createClient({
          space: config.public.CTF_SPACE_ID as string,
          accessToken: config.public.CTF_CDA_ACCESS_TOKEN as string,
          // An unavailable CMS must not stall SSR through long retry chains.
          timeout: 8000,
          retryLimit: 0,
        }),
      )
    }
    return clientPromise
  }

  return {
    provide: {
      contentful: {
        getEntries: async <T = unknown>(query?: Record<string, unknown>): Promise<ContentfulEntries<T>> => {
          const client = await getClient()
          return await client.getEntries(query) as ContentfulEntries<T>
        },
      },
    },
  }
})
