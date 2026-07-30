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
        }),
      )
    }
    return clientPromise
  }

  return {
    provide: {
      contentful: {
        getEntries: async (query?: Record<string, unknown>) => {
          const client = await getClient()
          return client.getEntries(query)
        },
      },
    },
  }
})
