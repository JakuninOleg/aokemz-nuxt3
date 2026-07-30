import {
  DEFAULT_OG_IMAGE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  type PageSeo,
} from '~/utils/siteSeo'

/** Apply title, description, canonical and Open Graph for a public page. */
export function usePageSeo(seo: PageSeo) {
  const title = seo.title
  const description = seo.description
  const url = seo.path ? `${SITE_URL}${seo.path}` : SITE_URL
  const image = seo.ogImage || DEFAULT_OG_IMAGE
  const type = seo.type || 'website'

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: type,
    ogUrl: url,
    ogImage: image,
    ogLocale: SITE_LOCALE,
    ogSiteName: SITE_NAME,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
  })

  useHead({
    link: [{ rel: 'canonical', href: url }],
  })
}
