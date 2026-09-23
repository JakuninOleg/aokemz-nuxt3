import { setHeader } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const indexable = config.public.indexableDeployment === true
  const siteUrl = String(config.public.siteUrl || 'https://aokemz.ru').replace(/\/$/, '')

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=0, s-maxage=300')

  if (!indexable) {
    return 'User-agent: *\nDisallow: /\n'
  }

  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
})
