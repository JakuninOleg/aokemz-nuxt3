import { getRequestURL, sendRedirect } from 'h3'

/** Keep one crawlable URL per page: Nuxt routes are defined without trailing slashes. */
export default defineEventHandler((event) => {
  if (event.method !== 'GET' && event.method !== 'HEAD') return

  const url = getRequestURL(event)
  // Only the retired public mirror, never branch previews or POST requests.
  if (
    url.hostname === 'aokemz-nuxt3.vercel.app' ||
    url.hostname === 'www.aokemz.ru'
  ) {
    return sendRedirect(
      event,
      `https://aokemz.ru${url.pathname.replace(/\/+$/, '') || '/'}${url.search}`,
      301,
    )
  }
  if (url.pathname === '/' || !url.pathname.endsWith('/')) return

  const canonicalPath = url.pathname.replace(/\/+$/, '') || '/'
  return sendRedirect(event, `${canonicalPath}${url.search}`, 301)
})
