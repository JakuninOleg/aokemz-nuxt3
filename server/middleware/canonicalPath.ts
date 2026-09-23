import { getRequestURL, sendRedirect } from 'h3'

/** Keep one crawlable URL per page: Nuxt routes are defined without trailing slashes. */
export default defineEventHandler((event) => {
  if (event.method !== 'GET' && event.method !== 'HEAD') return

  const url = getRequestURL(event)
  if (url.pathname === '/' || !url.pathname.endsWith('/')) return

  const canonicalPath = url.pathname.replace(/\/+$/, '') || '/'
  return sendRedirect(event, `${canonicalPath}${url.search}`, 301)
})
