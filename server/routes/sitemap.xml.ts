import { setHeader } from 'h3'
import { getPublicContentfulClient } from '~/server/utils/contentfulPublic'

type CmsEntry = {
  sys?: { id?: string; updatedAt?: string }
  fields?: {
    url?: string
    display?: boolean
    category?: { fields?: { url?: string } }
  }
}

type CmsResponse = { items: CmsEntry[]; total?: number }

type SitemapEntry = { path: string; lastmod?: string }

const STATIC_PATHS = [
  '/',
  '/about',
  '/products',
  '/production',
  '/news',
  '/documents',
  '/contacts',
  '/legal',
]

function xml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[character] || character)
}

function validLastmod(value?: string) {
  const timestamp = value ? Date.parse(value) : Number.NaN
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : undefined
}

async function getAllEntries(client: NonNullable<ReturnType<typeof getPublicContentfulClient>>, query: Record<string, unknown>) {
  const pageSize = 1000
  const all: CmsEntry[] = []
  let skip = 0
  let total = Number.POSITIVE_INFINITY

  while (skip < total) {
    const response = await client.getEntries({ ...query, limit: pageSize, skip }) as unknown as CmsResponse
    all.push(...response.items)
    total = response.total ?? response.items.length
    if (!response.items.length) break
    skip += response.items.length
  }

  return all
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl || 'https://aokemz.ru').replace(/\/$/, '')
  const entries = new Map<string, SitemapEntry>(STATIC_PATHS.map((path) => [path, { path }]))
  const client = getPublicContentfulClient()

  if (client) {
    try {
      const [categories, products, news] = await Promise.all([
        getAllEntries(client, { content_type: 'Category', select: ['fields.url', 'fields.display', 'sys.updatedAt'] }),
        getAllEntries(client, { content_type: 'subcategory', include: 2, select: ['fields.url', 'fields.category', 'sys.updatedAt'] }),
        getAllEntries(client, { content_type: 'news', select: ['sys.id', 'sys.updatedAt'] }),
      ])

      for (const category of categories) {
        const slug = category.fields?.url
        if (slug && category.fields?.display !== false) entries.set(`/products/${slug}`, { path: `/products/${slug}`, lastmod: validLastmod(category.sys?.updatedAt) })
      }

      for (const product of products) {
        const categorySlug = product.fields?.category?.fields?.url
        const slug = product.fields?.url
        if (categorySlug && slug) {
          const path = `/products/${categorySlug}/${slug}`
          entries.set(path, { path, lastmod: validLastmod(product.sys?.updatedAt) })
        }
      }

      for (const article of news) {
        const id = article.sys?.id
        if (id) entries.set(`/news/${id}`, { path: `/news/${id}`, lastmod: validLastmod(article.sys?.updatedAt) })
      }
    } catch (error) {
      // Sitemap remains valid and serves public static routes when CMS is temporarily unavailable.
      console.error('Contentful sitemap refresh failed')
    }
  }

  const body = [...entries.values()]
    .sort((a, b) => a.path.localeCompare(b.path, 'ru'))
    .map(({ path, lastmod }) => `  <url><loc>${xml(`${siteUrl}${path}`)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`)
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
})
