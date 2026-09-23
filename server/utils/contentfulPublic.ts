import { createClient } from 'contentful'

/**
 * Server-only Contentful reader for crawler endpoints. The delivery token is
 * already required by the browser catalogue; this keeps sitemap generation
 * independent from client hydration and gives it a short, cacheable response.
 */
export function getPublicContentfulClient() {
  const config = useRuntimeConfig()
  const space = config.public.CTF_SPACE_ID as string | undefined
  const accessToken = config.public.CTF_CDA_ACCESS_TOKEN as string | undefined

  if (!space || !accessToken) return null

  return createClient({
    space,
    accessToken,
    timeout: 8000,
    retryLimit: 0,
  })
}
